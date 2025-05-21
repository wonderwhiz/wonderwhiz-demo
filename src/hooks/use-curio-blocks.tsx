import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentBlock } from '@/types/curio';
import { useConsoleLogger } from '@/hooks/useConsoleLogger';

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
  
  // Store the previous curioId to detect changes
  const previousCurioIdRef = useRef<string | undefined>(undefined);
  const blockGenerationInProgress = useRef<boolean>(false);
  const generationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blockLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fetchInProgressRef = useRef<boolean>(false);
  const lastFetchTimeRef = useRef<number>(0);
  const callCountRef = useRef<number>(0);
  const contentGenerationAttempted = useRef<boolean>(false);

  // Debug logging
  useConsoleLogger(curioId, 'Current Curio ID');
  useConsoleLogger(generationError, 'Generation Error');
  useConsoleLogger(blocks.length, 'Block Count');

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
        previousCurioIdRef.current = curioId;
        lastFetchTimeRef.current = 0;
        fetchInProgressRef.current = false;
        callCountRef.current = 0;
        blockGenerationInProgress.current = false; // Reset generation flag
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
      
      // Add a cancellation for any pending timers when triggering new generation
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
      if (blockLoadingTimerRef.current) {
        clearTimeout(blockLoadingTimerRef.current);
      }
      
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
      
      // Create placeholder blocks while waiting, just one of each type to reduce clutter
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
      ]);
      
      // Fetch the newly generated blocks after a delay, with retries
      const maxRetries = 3;
      let retryCount = 0;
      
      const tryFetchBlocks = () => {
        if (retryCount >= maxRetries) {
          console.log('Max retries reached, giving up on fetching blocks');
          blockGenerationInProgress.current = false;
          return;
        }
        
        retryCount++;
        console.log(`Trying to fetch blocks, attempt ${retryCount}`);
        
        // First check if there are actual blocks
        supabase
          .from('content_blocks')
          .select('*', { count: 'exact', head: true })
          .eq('curio_id', curioId)
          .then(({ count }) => {
            if (count && count > 0) {
              fetchBlocks();
              blockGenerationInProgress.current = false;
            } else if (retryCount < maxRetries) {
              // Try again after a delay
              generationTimeoutRef.current = setTimeout(tryFetchBlocks, 5000 * retryCount);
            } else {
              blockGenerationInProgress.current = false;
            }
          });
      };
      
      // Start the fetch cycle after initial delay
      generationTimeoutRef.current = setTimeout(tryFetchBlocks, 5000);
      
    } catch (err) {
      console.error("Error in content generation process:", err);
      setGenerationError("An unexpected error occurred during content generation.");
      blockGenerationInProgress.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [curioId, childId, fetchBlocks]);

  const fetchBlocks = useCallback(async () => {
    if (!curioId || fetchInProgressRef.current) return;
    
    // Prevent too many calls in a short period
    callCountRef.current += 1;
    if (callCountRef.current > 5) {
      console.log("Too many fetch attempts, stopping to prevent infinite loop");
      return;
    }
    
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
            
            if (!isDuplicate) {
              newBlocks.push(block);
            }
          });
          
          return newBlocks;
        });
        
        setHasMore(data.length === 10);
        setIsFirstLoad(false);
        
        // Reset the call count since we got a successful response
        callCountRef.current = 0;
      } 
      else if (count === 0 && blocks.length === 0 && !blockGenerationInProgress.current) {
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
        
        // Try to trigger content generation if we don't have blocks
        if (childId && !blockGenerationInProgress.current) {
          triggerContentGeneration();
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
  }, [curioId, searchQuery, page, blocks, childId, triggerContentGeneration]);

  useEffect(() => {
    if (curioId) {
      fetchBlocks();
    }
  }, [curioId, searchQuery, page, fetchBlocks]);

  const loadMore = useCallback(async () => {
    if (!curioId || isLoading) return;
    setPage(prevPage => prevPage + 1);
  }, [curioId, isLoading]);

  // Ensure we only have one attempt at content generation
  useEffect(() => {
    if (curioId && childId && blocks.length === 0 && !isLoading && !contentGenerationAttempted.current) {
      contentGenerationAttempted.current = true;
      console.log("Triggering content generation for empty curio");
      triggerContentGeneration();
    }
    
    // Check if we only have placeholder blocks
    const onlyPlaceholders = blocks.length > 0 && blocks.every(block => block.id.startsWith('placeholder-'));
    if (onlyPlaceholders && !isLoading && !contentGenerationAttempted.current) {
      contentGenerationAttempted.current = true;
      console.log("Triggering content generation for placeholder blocks");
      triggerContentGeneration();
    }
  }, [blocks, curioId, childId, isLoading, triggerContentGeneration]);

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
