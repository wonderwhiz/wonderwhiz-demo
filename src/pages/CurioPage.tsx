
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContentBlock from '@/components/ContentBlock';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const BATCH_SIZE = 2;
const INITIAL_BLOCKS_TO_LOAD = 2;

const CurioPage: React.FC = () => {
  const { profileId, curioId } = useParams<{ profileId: string; curioId: string }>();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [title, setTitle] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMoreBlocks, setHasMoreBlocks] = useState<boolean>(true);
  const [loadingMoreBlocks, setLoadingMoreBlocks] = useState<boolean>(false);
  const [totalBlocksLoaded, setTotalBlocksLoaded] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [loadTriggerRef, isLoadTriggerVisible] = useIntersectionObserver(
    { rootMargin: '200px' },
    false
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [animateBlocks, setAnimateBlocks] = useState(false);

  // Fetch curio data
  useEffect(() => {
    const fetchCurio = async () => {
      if (!curioId) return;
      
      try {
        setIsLoading(true);
        
        const { data: curioData, error: curioError } = await supabase
          .from('curios')
          .select('*')
          .eq('id', curioId)
          .single();
        
        if (curioError) {
          throw curioError;
        }
        
        if (curioData) {
          setTitle(curioData.title);
          setQuery(curioData.query);
        }
        
        // Fetch initial batch of blocks or generate them if they don't exist
        await fetchInitialBlocks(curioId);
        
      } catch (error) {
        console.error('Error fetching curio:', error);
        toast({
          title: "Error",
          description: "Could not load curio data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurio();
  }, [curioId]);
  
  // Auto-scroll to top after initial blocks load
  useEffect(() => {
    if (blocks.length > 0 && !isLoading && !initialLoadComplete) {
      setInitialLoadComplete(true);
      
      // Ensure blocks animate in sequence before scrolling
      setAnimateBlocks(true);
      
      // Scroll to top with a slight delay to allow animation to start
      if (scrollAreaRef.current) {
        console.log('Auto-scrolling to top');
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = 0;
          }
        }, 100);
      }
    }
  }, [blocks.length, isLoading, initialLoadComplete]);

  // Fetch initial blocks
  const fetchInitialBlocks = async (curioId: string) => {
    try {
      console.log('Fetching initial blocks...');
      
      // First check if we already have blocks for this curio
      const { data: existingBlocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .limit(INITIAL_BLOCKS_TO_LOAD);
      
      if (blocksError) {
        throw blocksError;
      }
      
      if (existingBlocks && existingBlocks.length > 0) {
        // We have existing blocks, use them
        console.log(`Found ${existingBlocks.length} existing blocks`);
        
        const mappedBlocks = existingBlocks.map(block => ({
          ...block,
          type: block.type as ContentBlockType
        }));
        
        setBlocks(mappedBlocks);
        setTotalBlocksLoaded(mappedBlocks.length);
        
        // Check if there are potentially more blocks to load
        const { count, error: countError } = await supabase
          .from('content_blocks')
          .select('*', { count: 'exact', head: true })
          .eq('curio_id', curioId);
          
        if (!countError && count !== null) {
          console.log(`Total blocks available: ${count}`);
          setHasMoreBlocks(count > INITIAL_BLOCKS_TO_LOAD);
        }
      } else {
        // No existing blocks, generate new ones
        console.log('No existing blocks found, generating new ones');
        await generateNewBlocks(curioId, query);
      }
    } catch (error) {
      console.error('Error fetching initial blocks:', error);
      toast({
        title: "Error",
        description: "Could not load content blocks",
        variant: "destructive"
      });
    }
  };

  // Generate new blocks from Claude
  const generateNewBlocks = async (curioId: string, query: string) => {
    if (!query || !profileId) return;
    
    try {
      console.log('Generating new blocks from Claude API');
      
      // Get child profile data for generation
      const { data: profileData, error: profileError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', profileId)
        .single();
        
      if (profileError) throw profileError;
      
      // Call Claude to generate content blocks
      const response = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: {
          query,
          childProfile: {
            age: profileData?.age || 8,
            interests: profileData?.interests || ['science', 'art', 'space'],
            language: profileData?.language || 'English'
          }
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Error generating content blocks');
      }
      
      const generatedBlocks = response.data || [];
      console.log('Generated blocks:', generatedBlocks);
      
      if (!generatedBlocks.length) {
        throw new Error('No content blocks were generated');
      }
      
      // Take only the first batch
      const initialBlocks = generatedBlocks.slice(0, INITIAL_BLOCKS_TO_LOAD);
      
      // Add curio_id to each block
      const blocksWithCurioId = initialBlocks.map(block => ({
        ...block,
        curio_id: curioId
      }));
      
      // Save all generated blocks to the database
      for (const block of generatedBlocks) {
        await supabase.from('content_blocks').insert({
          ...block,
          curio_id: curioId
        });
      }
      
      // Set the blocks in state
      setBlocks(blocksWithCurioId);
      setTotalBlocksLoaded(INITIAL_BLOCKS_TO_LOAD);
      setHasMoreBlocks(generatedBlocks.length > INITIAL_BLOCKS_TO_LOAD);
    } catch (error) {
      console.error('Error generating content blocks:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not generate content blocks",
        variant: "destructive"
      });
    }
  };

  // Load more blocks when the trigger element is visible
  useEffect(() => {
    if (isLoadTriggerVisible && hasMoreBlocks && !loadingMoreBlocks && !isLoading) {
      console.log('Load trigger visible, loading more blocks');
      loadMoreBlocks();
    }
  }, [isLoadTriggerVisible, hasMoreBlocks, loadingMoreBlocks, isLoading]);

  const loadMoreBlocks = useCallback(async () => {
    if (!hasMoreBlocks || loadingMoreBlocks || !curioId) return;
    
    console.log('Loading more blocks...');
    setLoadingMoreBlocks(true);
    
    try {
      // First try to fetch more existing blocks
      const { data: nextBlocks, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .range(totalBlocksLoaded, totalBlocksLoaded + BATCH_SIZE - 1);
        
      if (error) throw error;
      
      if (nextBlocks && nextBlocks.length > 0) {
        // We got more existing blocks
        console.log(`Loaded ${nextBlocks.length} more blocks`);
        
        const mappedBlocks = nextBlocks.map(block => ({
          ...block,
          type: block.type as ContentBlockType
        }));
        
        setBlocks(prev => [...prev, ...mappedBlocks]);
        setTotalBlocksLoaded(prev => prev + mappedBlocks.length);
        
        // Check if there are more blocks to load
        const { count, error: countError } = await supabase
          .from('content_blocks')
          .select('*', { count: 'exact', head: true })
          .eq('curio_id', curioId);
          
        if (!countError && count !== null) {
          setHasMoreBlocks(count > totalBlocksLoaded + mappedBlocks.length);
        }
      } else {
        // No more blocks in the database
        console.log('No more blocks available');
        setHasMoreBlocks(false);
      }
    } catch (error) {
      console.error('Error loading more blocks:', error);
      toast({
        title: "Error",
        description: "Could not load more content",
        variant: "destructive"
      });
    } finally {
      setLoadingMoreBlocks(false);
    }
  }, [hasMoreBlocks, loadingMoreBlocks, totalBlocksLoaded, curioId]);

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

  // Animation variants for sequential loading
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Animation variants for blocks
  const blockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

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
            <AnimatePresence>
              <motion.div 
                className="space-y-4 px-1"
                variants={containerVariants}
                initial="hidden"
                animate={animateBlocks ? "visible" : "hidden"}
              >
                {blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    variants={blockVariants}
                  >
                    <ContentBlock
                      block={block}
                      onToggleLike={handleToggleLike}
                      onToggleBookmark={handleToggleBookmark}
                      onReply={handleReply}
                      colorVariant={parseInt(block.id.charAt(0), 16) % 3}
                      userId={profileId}
                      childProfileId={profileId}
                      onQuizCorrect={handleQuizCorrect}
                      onNewsRead={handleNewsRead}
                      onCreativeUpload={handleCreativeUpload}
                    />
                  </motion.div>
                ))}
                
                {/* Intersection observer trigger element */}
                {hasMoreBlocks && (
                  <div 
                    ref={loadTriggerRef} 
                    className="h-10 flex items-center justify-center my-8"
                  >
                    {loadingMoreBlocks && (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-wonderwhiz-purple" />
                        <p className="text-white/70 text-xs mt-2">Loading more...</p>
                      </div>
                    )}
                  </div>
                )}
                
                {!hasMoreBlocks && blocks.length > 0 && (
                  <p className="text-center text-white/50 text-xs py-4">
                    You've reached the end of this curio!
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default CurioPage;
