import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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

const BATCH_SIZE = 2;
const INITIAL_BLOCKS_TO_LOAD = 2;

const CurioPage: React.FC = () => {
  const { profileId, curioId } = useParams<{ profileId: string; curioId: string }>();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [allBlocks, setAllBlocks] = useState<ContentBlock[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMoreBlocks, setHasMoreBlocks] = useState<boolean>(true);
  const [loadingMoreBlocks, setLoadingMoreBlocks] = useState<boolean>(false);
  const [loadTriggerRef, isLoadTriggerVisible] = useIntersectionObserver(
    { rootMargin: '200px' },
    false
  );

  // Fetch curio data
  useEffect(() => {
    const fetchCurio = async () => {
      if (!curioId) return;
      
      try {
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
        }
        
        // Fetch all blocks but only display the initial batch
        const { data: blocksData, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('curio_id', curioId)
          .order('created_at', { ascending: true });
          
        if (blocksError) {
          throw blocksError;
        }
        
        if (blocksData) {
          // Store all blocks but only show the initial batch
          const mappedBlocks = blocksData.map(block => ({
            ...block,
            type: block.type as ContentBlockType
          }));
          
          setAllBlocks(mappedBlocks);
          setBlocks(mappedBlocks.slice(0, INITIAL_BLOCKS_TO_LOAD));
          setHasMoreBlocks(mappedBlocks.length > INITIAL_BLOCKS_TO_LOAD);
        }
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

  // Load more blocks when the trigger element is visible
  useEffect(() => {
    if (isLoadTriggerVisible && hasMoreBlocks && !loadingMoreBlocks) {
      loadMoreBlocks();
    }
  }, [isLoadTriggerVisible, hasMoreBlocks, loadingMoreBlocks]);

  const loadMoreBlocks = useCallback(() => {
    if (!hasMoreBlocks || loadingMoreBlocks) return;
    
    setLoadingMoreBlocks(true);
    
    // Simulate a small delay for a smoother loading experience
    setTimeout(() => {
      const currentBlocksCount = blocks.length;
      const nextBatch = allBlocks.slice(
        currentBlocksCount,
        currentBlocksCount + BATCH_SIZE
      );
      
      setBlocks(prev => [...prev, ...nextBatch]);
      setHasMoreBlocks(currentBlocksCount + nextBatch.length < allBlocks.length);
      setLoadingMoreBlocks(false);
    }, 300);
  }, [blocks.length, allBlocks, hasMoreBlocks, loadingMoreBlocks]);

  // Handle like toggle
  const handleToggleLike = useCallback(async (blockId: string) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, liked: !block.liked }
          : block
      )
    );
    
    setAllBlocks(prev => 
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
    
    setAllBlocks(prev => 
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
          <ScrollArea className="h-[calc(100vh-180px)]">
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
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default CurioPage;
