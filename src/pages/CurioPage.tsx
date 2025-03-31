
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContentBlock from '@/components/ContentBlock';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Define the ContentBlock type
type ContentBlockType = "fact" | "quiz" | "flashcard" | "creative" | "task" | "riddle" | "funFact" | "activity" | "news" | "mindfulness";

interface ContentBlock {
  id: string;
  curio_id: string;
  specialist_id: string;
  type: ContentBlockType;
  content: any;
  liked: boolean;
  bookmarked: boolean;
  created_at?: string;
}

const INITIAL_BLOCKS_TO_FETCH = 2;
const ADDITIONAL_BLOCKS_TO_FETCH = 2;
const MAX_BLOCKS_TOTAL = 10;

const CurioPage: React.FC = () => {
  const { profileId, curioId } = useParams<{ profileId: string; curioId: string }>();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMoreBlocksToGenerate, setHasMoreBlocksToGenerate] = useState<boolean>(true);
  const [totalBlocksGenerated, setTotalBlocksGenerated] = useState<number>(0);
  const [childProfile, setChildProfile] = useState<any>(null);
  const [loadTriggerRef, isLoadTriggerVisible] = useIntersectionObserver(
    { rootMargin: '200px' },
    false
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch curio data and child profile
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!curioId || !profileId) {
        navigate(`/dashboard/${profileId}`);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Fetch the curio data
        const { data: curioData, error: curioError } = await supabase
          .from('curios')
          .select('*')
          .eq('id', curioId)
          .single();
        
        if (curioError) throw curioError;
        
        if (curioData) {
          setTitle(curioData.title);
        }
        
        // Fetch child profile for Claude API
        const { data: profileData, error: profileError } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('id', profileId)
          .single();
          
        if (profileError) throw profileError;
        setChildProfile(profileData);
        
        // Check if we already have blocks for this curio
        const { data: existingBlocks, error: blocksCheckError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('curio_id', curioId)
          .order('created_at', { ascending: true });
          
        if (blocksCheckError) throw blocksCheckError;
        
        if (existingBlocks && existingBlocks.length > 0) {
          // We already have some blocks, fetch the initial ones
          const initialBlocks = existingBlocks.slice(0, INITIAL_BLOCKS_TO_FETCH).map(block => ({
            ...block,
            type: block.type as ContentBlockType
          }));
          
          setBlocks(initialBlocks);
          setTotalBlocksGenerated(existingBlocks.length);
          
          // We still may have more blocks to load, but not generate
          setHasMoreBlocksToGenerate(existingBlocks.length < MAX_BLOCKS_TOTAL);
        } else {
          // No blocks yet, generate the initial ones
          await generateBlocks(curioData.query, profileData, INITIAL_BLOCKS_TO_FETCH);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: "Error",
          description: "Could not load curio data",
          variant: "destructive"
        });
        navigate(`/dashboard/${profileId}`);
      } finally {
        setIsLoading(false);
        
        // Scroll to top after initial load
        setTimeout(() => {
          scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
      }
    };
    
    fetchInitialData();
  }, [curioId, profileId, navigate]);

  // Generate blocks function
  const generateBlocks = async (query: string, profile: any, count: number, startIndex: number = 0) => {
    if (!curioId || !profile) return [];
    
    try {
      console.log(`Generating ${count} blocks starting at index ${startIndex}`);
      
      const claudeResponse = await supabase.functions.invoke('generate-curiosity-blocks-partial', {
        body: JSON.stringify({
          query: query,
          childProfile: profile,
          count: count,
          startIndex: startIndex
        })
      });
      
      if (claudeResponse.error) {
        throw new Error(`Failed to generate content: ${claudeResponse.error.message}`);
      }
      
      const generatedBlocks = claudeResponse.data;
      if (!Array.isArray(generatedBlocks)) {
        throw new Error("Invalid response format from generate-curiosity-blocks-partial");
      }
      
      console.log(`Generated ${generatedBlocks.length} blocks starting at index ${startIndex}`);
      
      // Save blocks to database
      for (const block of generatedBlocks) {
        await supabase.from('content_blocks').insert({
          curio_id: curioId,
          type: block.type,
          specialist_id: block.specialist_id,
          content: block.content
        });
      }
      
      // Update state
      const typedBlocks = generatedBlocks.map(block => ({
        ...block,
        type: block.type as ContentBlockType,
        curio_id: curioId
      }));
      
      setBlocks(prev => [...prev, ...typedBlocks]);
      setTotalBlocksGenerated(prev => prev + generatedBlocks.length);
      
      // Check if we should stop generating (MAX_BLOCKS_TOTAL total blocks maximum)
      if (startIndex + count >= MAX_BLOCKS_TOTAL) {
        setHasMoreBlocksToGenerate(false);
      }
      
      return typedBlocks;
    } catch (error) {
      console.error('Error generating blocks:', error);
      toast({
        title: "Error",
        description: "Could not generate content blocks",
        variant: "destructive"
      });
      setHasMoreBlocksToGenerate(false);
      return [];
    }
  };

  // Load more blocks when the trigger element is visible
  useEffect(() => {
    const loadMoreBlocks = async () => {
      if (isLoadingMore || !hasMoreBlocksToGenerate || !childProfile || !curioId) return;
      
      setIsLoadingMore(true);
      
      try {
        // First try to fetch existing blocks
        const existingCount = blocks.length;
        const { data: existingBlocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('curio_id', curioId)
          .order('created_at', { ascending: true })
          .range(existingCount, existingCount + ADDITIONAL_BLOCKS_TO_FETCH - 1);
          
        if (blocksError) throw blocksError;
        
        if (existingBlocks && existingBlocks.length > 0) {
          // We have more existing blocks to display
          const typedBlocks = existingBlocks.map(block => ({
            ...block,
            type: block.type as ContentBlockType
          }));
          
          setBlocks(prev => [...prev, ...typedBlocks]);
          
          // Check if we might have more blocks
          if (existingBlocks.length < ADDITIONAL_BLOCKS_TO_FETCH) {
            const { data: curioData } = await supabase
              .from('curios')
              .select('query')
              .eq('id', curioId)
              .single();
              
            if (curioData && totalBlocksGenerated < MAX_BLOCKS_TOTAL) {
              // Generate more blocks if needed
              await generateBlocks(
                curioData.query, 
                childProfile, 
                ADDITIONAL_BLOCKS_TO_FETCH - existingBlocks.length,
                totalBlocksGenerated
              );
            } else {
              setHasMoreBlocksToGenerate(false);
            }
          }
        } else {
          // No more existing blocks, generate new ones
          const { data: curioData } = await supabase
            .from('curios')
            .select('query')
            .eq('id', curioId)
            .single();
            
          if (curioData) {
            await generateBlocks(
              curioData.query, 
              childProfile, 
              ADDITIONAL_BLOCKS_TO_FETCH,
              totalBlocksGenerated
            );
          }
        }
      } catch (error) {
        console.error('Error loading more blocks:', error);
        toast({
          title: "Error",
          description: "Could not load more content blocks",
          variant: "destructive"
        });
        setHasMoreBlocksToGenerate(false);
      } finally {
        setIsLoadingMore(false);
      }
    };
    
    if (isLoadTriggerVisible) {
      loadMoreBlocks();
    }
  }, [isLoadTriggerVisible, blocks.length, hasMoreBlocksToGenerate, totalBlocksGenerated, curioId, childProfile, isLoadingMore]);

  // Handle like toggle
  const handleToggleLike = useCallback(async (blockId: string) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, liked: !block.liked }
          : block
      )
    );

    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({ liked: blocks.find(b => b.id === blockId)?.liked ? false : true })
        .eq('id', blockId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating like status:', error);
      toast({
        title: "Error",
        description: "Could not update like status",
        variant: "destructive"
      });
    }
  }, [blocks]);

  // Handle bookmark toggle
  const handleToggleBookmark = useCallback(async (blockId: string) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, bookmarked: !block.bookmarked }
          : block
      )
    );

    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({ bookmarked: blocks.find(b => b.id === blockId)?.bookmarked ? false : true })
        .eq('id', blockId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating bookmark status:', error);
      toast({
        title: "Error",
        description: "Could not update bookmark status",
        variant: "destructive"
      });
    }
  }, [blocks]);

  // Handle reply to block
  const handleReply = useCallback((blockId: string, message: string) => {
    console.log(`Reply to block ${blockId}: ${message}`);
    // In a real app, you would send this to your backend
    // For now, we'll just log it
    
    // You could also update local state to show the reply immediately
    // before it's confirmed by the backend
    
    // Example of how you might update points for the child profile
    if (profileId) {
      // Award points for engagement
      console.log(`Awarding points to profile ${profileId} for engagement`);
    }
  }, [profileId]);
  
  // Handle quiz correct
  const handleQuizCorrect = useCallback(() => {
    if (profileId) {
      console.log(`Quiz answered correctly by profile ${profileId}`);
      // Award points for correct quiz answer
      toast({
        title: "Great job!",
        description: "You earned 5 sparks for answering correctly!",
        variant: "default",
      });
    }
  }, [profileId]);
  
  // Handle news read
  const handleNewsRead = useCallback(() => {
    if (profileId) {
      console.log(`News read by profile ${profileId}`);
      // Award points for reading news
      toast({
        title: "Thanks for reading!",
        description: "You earned 3 sparks for staying informed!",
        variant: "default",
      });
    }
  }, [profileId]);
  
  // Handle creative upload
  const handleCreativeUpload = useCallback(() => {
    if (profileId) {
      console.log(`Creative content uploaded by profile ${profileId}`);
      // Award points for creative upload
      toast({
        title: "Amazing creativity!",
        description: "You earned 10 sparks for your creative work!",
        variant: "default",
      });
    }
  }, [profileId]);

  // Animation variants for blocks
  const blockVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  }), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-wonderwhiz-purple" />
          <p className="text-white text-sm">Loading your curio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-20">
      <div className="container px-4 py-3 sm:py-5">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 text-center">{title}</h1>
        
        <Card className="bg-black/40 border-white/10 p-2 sm:p-4 md:p-6">
          <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-180px)]">
            <div className="space-y-4 px-1">
              {blocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={blockVariants}
                >
                  <ContentBlock
                    block={block}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                    onReply={handleReply}
                    colorVariant={index % 3}
                    userId={profileId}
                    childProfileId={profileId}
                    onQuizCorrect={handleQuizCorrect}
                    onNewsRead={handleNewsRead}
                    onCreativeUpload={handleCreativeUpload}
                  />
                </motion.div>
              ))}
              
              {/* Intersection observer trigger element */}
              {hasMoreBlocksToGenerate && (
                <div 
                  ref={loadTriggerRef} 
                  className="h-10 flex items-center justify-center my-8"
                >
                  {isLoadingMore && (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-wonderwhiz-purple" />
                      <p className="text-white/70 text-xs mt-2">Loading more content...</p>
                    </div>
                  )}
                </div>
              )}
              
              {!hasMoreBlocksToGenerate && blocks.length > 0 && !isLoadingMore && (
                <p className="text-center text-white/50 text-xs py-4">
                  You've reached the end of this curio!
                </p>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default CurioPage;
