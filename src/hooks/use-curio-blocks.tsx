
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentBlock } from '@/types/curio';
import { useConsoleLogger } from '@/hooks/useConsoleLogger';
import { isContentDuplicate, hasValidContent, isPlaceholderContent } from '@/utils/contentValidation';

interface UseCurioBlocksResult {
  blocks: ContentBlock[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  isFirstLoad: boolean;
  generationError: string | null;
  triggerContentGeneration?: () => Promise<void>;
}

export const useCurioBlocks = (childId?: string, curioId?: string, searchQuery = ''): UseCurioBlocksResult => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [page, setPage] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Store the previous curioId to detect changes
  const previousCurioIdRef = useRef<string | undefined>(undefined);
  const blockGenerationInProgress = useRef<boolean>(false);
  const generationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blockLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fetchInProgressRef = useRef<boolean>(false);
  const lastFetchTimeRef = useRef<number>(0);
  const checkStatusInProgressRef = useRef<boolean>(false);

  // Debug logging
  useConsoleLogger(curioId, 'Current Curio ID');
  useConsoleLogger(generationError, 'Generation Error');
  useConsoleLogger(blocks.length, 'Block Count');
  useConsoleLogger(isCheckingStatus, 'Is Checking Status');

  // Track when curio ID changes
  useEffect(() => {
    const previousCurioId = previousCurioIdRef.current;
    
    if (curioId !== previousCurioId) {
      console.log(`Curio ID changed from ${previousCurioId} to ${curioId}`);
      if (curioId) {
        // Reset states when switching to a new curio
        setBlocks([]);
        setPage(0);
        setIsFirstLoad(true);
        setGenerationError(null);
        setAttemptCount(0);
        previousCurioIdRef.current = curioId;
        lastFetchTimeRef.current = 0;
        fetchInProgressRef.current = false;
      }
    }
  }, [curioId]);

  const triggerContentGeneration = useCallback(async () => {
    if (!curioId || !childId || blockGenerationInProgress.current) return;
    
    try {
      console.log(`Attempting to trigger content generation for curio: ${curioId}`);
      
      setIsLoading(true);
      setGenerationError(null);
      blockGenerationInProgress.current = true;
      
      const { data, error } = await supabase.functions.invoke('trigger-content-generation', {
        body: { curioId, childId }
      });
      
      if (error) {
        console.error("Error triggering content generation:", error);
        setGenerationError("Failed to generate content. Please try again.");
        blockGenerationInProgress.current = false;
        return;
      }
      
      console.log("Content generation triggered successfully:", data);
      
      // Create placeholder blocks while waiting
      setBlocks([
        {
          id: `placeholder-${Date.now()}-1`,
          curio_id: curioId,
          specialist_id: 'nova',
          type: 'fact',
          content: { 
            fact: "I'm discovering fascinating information about this topic...",
            rabbitHoles: []
          },
          liked: false,
          bookmarked: false,
          created_at: new Date().toISOString()
        } as ContentBlock,
        {
          id: `placeholder-${Date.now()}-2`,
          curio_id: curioId,
          specialist_id: 'prism',
          type: 'funFact',
          content: { 
            text: "Gathering interesting details for you...",
            rabbitHoles: []
          },
          liked: false,
          bookmarked: false,
          created_at: new Date().toISOString()
        } as ContentBlock
      ]);
      
      // Fetch the newly generated blocks after a delay
      setTimeout(() => {
        fetchBlocks();
        blockGenerationInProgress.current = false;
      }, 5000);
      
    } catch (err) {
      console.error("Error in content generation process:", err);
      setGenerationError("An unexpected error occurred during content generation.");
      blockGenerationInProgress.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [curioId, childId]);

  const fetchBlocks = useCallback(async () => {
    if (!curioId || fetchInProgressRef.current) return;
    
    // Prevent fetching too frequently
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) {
      console.log("Throttling fetch requests, last fetch was too recent");
      return;
    }
    
    fetchInProgressRef.current = true;
    lastFetchTimeRef.current = now;
    
    setIsLoading(true);
    setError(null);

    const start = page * 10;
    const end = start + 9;

    try {
      console.log(`Fetching blocks for curioId: ${curioId}, page: ${page}`);
      
      // First check if there are any blocks
      const { count, error: countError } = await supabase
        .from('content_blocks')
        .select('*', { count: 'exact', head: true })
        .eq('curio_id', curioId);

      if (countError) {
        throw countError;
      }

      console.log(`Total blocks available: ${count}`);
      
      // If no blocks are found, check if there's a generation error in the curio
      if (count === 0) {
        const { data: curioData, error: curioError } = await supabase
          .from('curios')
          .select('generation_error')
          .eq('id', curioId)
          .single();
          
        if (curioError) {
          console.error("Error fetching curio status:", curioError);
        } else if (curioData && curioData.generation_error) {
          setGenerationError(curioData.generation_error);
          
          // Create placeholder blocks while waiting
          if (blocks.length === 0) {
            setBlocks([
              {
                id: `placeholder-${Date.now()}-1`,
                curio_id: curioId,
                specialist_id: 'nova',
                type: 'fact',
                content: { 
                  fact: "I'm discovering fascinating information about this topic...",
                  rabbitHoles: []
                },
                liked: false,
                bookmarked: false,
                created_at: new Date().toISOString()
              } as ContentBlock,
              {
                id: `placeholder-${Date.now()}-2`,
                curio_id: curioId,
                specialist_id: 'prism',
                type: 'funFact',
                content: { 
                  text: "Gathering interesting details for you...",
                  rabbitHoles: []
                },
                liked: false,
                bookmarked: false,
                created_at: new Date().toISOString()
              } as ContentBlock
            ]);
          }
        }
      }

      let query = supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .range(start, end);

      if (searchQuery) {
        query = query.textSearch('content', searchQuery);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        console.log(`Fetched ${data.length} blocks`);
        // Make sure we're properly typing our ContentBlock before setting state
        const typedBlocks = data.map(block => ({
          id: block.id,
          curio_id: block.curio_id,
          type: block.type,
          specialist_id: block.specialist_id,
          content: block.content,
          liked: block.liked || false,
          bookmarked: block.bookmarked || false,
          created_at: block.created_at
        })) as ContentBlock[];
        
        setBlocks(prevBlocks => {
          // Filter out placeholder blocks when real blocks arrive
          const newBlocks = prevBlocks.filter(b => !b.id.startsWith('placeholder-'));
          
          // Add new blocks, avoiding duplicates
          typedBlocks.forEach(block => {
            // Check if this block is already in our list
            const isDuplicate = newBlocks.some(existingBlock => 
              existingBlock.id === block.id
            );
            
            if (!isDuplicate && hasValidContent(block)) {
              newBlocks.push(block);
            }
          });
          
          return newBlocks;
        });
        
        setHasMore(data.length === 10);
        setIsFirstLoad(false);
        
        // Stop checking status if we have blocks now
        checkStatusInProgressRef.current = false;
        setAttemptCount(0);
      } 
      else if (count === 0 && blocks.length === 0) {
        // If we still don't have blocks, maybe we need to create some...
        console.log("No content blocks found for this curio");
        
        // Only create placeholders if we don't already have them
        if (blocks.every(b => !b.id.startsWith('placeholder-'))) {
          setBlocks([
            {
              id: `placeholder-${Date.now()}-1`,
              curio_id: curioId,
              specialist_id: 'nova',
              type: 'fact',
              content: { 
                fact: "I'm discovering fascinating information about this topic...",
                rabbitHoles: []
              },
              liked: false,
              bookmarked: false,
              created_at: new Date().toISOString()
            } as ContentBlock,
            {
              id: `placeholder-${Date.now()}-2`,
              curio_id: curioId,
              specialist_id: 'prism',
              type: 'funFact',
              content: { 
                text: "Gathering interesting details for you...",
                rabbitHoles: []
              },
              liked: false,
              bookmarked: false,
              created_at: new Date().toISOString()
            } as ContentBlock
          ]);
        }
        
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching blocks:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch blocks'));
    } finally {
      setIsLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [curioId, searchQuery, page, blocks]);

  useEffect(() => {
    if (curioId) {
      fetchBlocks();
    }
  }, [curioId, searchQuery, page, fetchBlocks]);

  // Check and initiate content generation if needed
  const checkContentStatus = useCallback(async () => {
    if (!curioId || !childId || checkStatusInProgressRef.current || blockGenerationInProgress.current) return;
    
    checkStatusInProgressRef.current = true;
    setIsCheckingStatus(true);
    
    try {
      // First check if there are already blocks
      const { count, error: countError } = await supabase
        .from('content_blocks')
        .select('*', { count: 'exact', head: true })
        .eq('curio_id', curioId);
        
      if (countError) {
        console.error("Error checking block count:", countError);
        checkStatusInProgressRef.current = false;
        setIsCheckingStatus(false);
        return;
      }
      
      // If there are no blocks, check the curio status
      if (count === 0) {
        const { data: curioData, error: curioError } = await supabase
          .from('curios')
          .select('generation_error')
          .eq('id', curioId)
          .single();
          
        if (curioError) {
          console.error("Error fetching curio status:", curioError);
        } else if (curioData && curioData.generation_error) {
          setGenerationError(curioData.generation_error);
        }
        
        // Check if we need to trigger generation
        if (attemptCount >= 3 && attemptCount < 6) {
          console.log("Multiple attempts with no content, trying to generate content");
          if (!blockGenerationInProgress.current) {
            await triggerContentGeneration();
          }
        }
        
        // Continue checking periodically if needed
        if (attemptCount < 12) {
          setAttemptCount(prev => prev + 1);
          
          // Use exponential backoff for retries (2, 4, 6, 8, 10, 12 seconds)
          const backoffTime = Math.min(2000 + (attemptCount * 1000), 12000);
          
          setTimeout(() => {
            checkStatusInProgressRef.current = false;
            setIsCheckingStatus(false);
            checkContentStatus();
          }, backoffTime);
        } else {
          console.log("Max attempts reached, stopping automatic checks");
          setGenerationError("Content generation is taking longer than expected. Please try refreshing.");
          checkStatusInProgressRef.current = false;
          setIsCheckingStatus(false);
        }
      } else {
        checkStatusInProgressRef.current = false;
        setIsCheckingStatus(false);
      }
    } catch (err) {
      console.error("Error checking content status:", err);
      checkStatusInProgressRef.current = false;
      setIsCheckingStatus(false);
    }
  }, [curioId, childId, attemptCount, triggerContentGeneration]);

  // Run content status check once on initial load
  useEffect(() => {
    if (curioId && childId && blocks.length === 0 && !blockGenerationInProgress.current) {
      checkContentStatus();
    }
    
    return () => {
      if (blockLoadingTimerRef.current) {
        clearTimeout(blockLoadingTimerRef.current);
      }
      
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
    };
  }, [curioId, childId, blocks.length, checkContentStatus]);

  const loadMore = useCallback(async () => {
    if (!curioId || isLoading) return;
    setPage(prevPage => prevPage + 1);
  }, [curioId, isLoading]);

  return {
    blocks,
    isLoading,
    error,
    hasMore,
    loadMore,
    isFirstLoad,
    generationError,
    triggerContentGeneration
  };
};

// Helper function to extract main content from a block
function getBlockMainContent(block: ContentBlock): string | null {
  if (!block?.content) return null;

  // Extract content based on block type
  switch (block.type) {
    case 'fact':
    case 'funFact':
      return block.content.fact || block.content.text || null;
    case 'quiz':
      return block.content.question || null;
    case 'flashcard':
      return `${block.content.front} ${block.content.back}` || null;
    case 'creative':
      return block.content.prompt || block.content.description || null;
    case 'task':
      return block.content.task || null;
    case 'riddle':
      return block.content.riddle || null;
    case 'activity':
      return block.content.activity || block.content.instructions || null;
    case 'mindfulness':
      return block.content.exercise || block.content.instruction || null;
    case 'news':
      return block.content.headline || block.content.body || block.content.summary || null;
    default:
      // For other types, try to find any text content
      const content = block.content;
      return (
        content.text ||
        content.fact ||
        content.description ||
        content.question ||
        content.body ||
        content.headline ||
        content.prompt ||
        content.task ||
        content.instruction ||
        null
      );
  }
}
