
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCurioBlocks(childId?: string, curioId?: string, searchQuery: string = '') {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastFetchedIndex, setLastFetchedIndex] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Use refs to track state for preventing duplicate fetches and race conditions
  const isFetchingRef = useRef(false);
  const fetchTimerRef = useRef<number | null>(null);
  const fetchTriesRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  
  // Fixed blockSize to avoid issues
  const BLOCK_SIZE = 10;

  // Ensure maximum of 5 retry attempts with increasing delay
  const MAX_RETRIES = 5;
  const getRetryDelay = (attempt: number) => Math.min(2000 * Math.pow(1.5, attempt), 20000);

  // Cleanup aborted requests on component unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }
    };
  }, []);

  // Reset state when curioId changes
  useEffect(() => {
    if (!curioId) return;
    
    setBlocks([]);
    setLastFetchedIndex(0);
    setHasMore(true);
    setIsFirstLoad(true);
    setError(null);
    setGenerationError(null);
    fetchTriesRef.current = 0;
    
    // Clear any pending fetches
    if (fetchTimerRef.current) {
      clearTimeout(fetchTimerRef.current);
    }
    
    // Immediately fetch blocks for the new curioId
    fetchBlocks(0);
  }, [curioId]);

  // Fetch blocks from Supabase
  const fetchBlocks = useCallback(async (startIndex: number = 0) => {
    if (!curioId || !childId || isFetchingRef.current) return;
    
    // Set loading state for initial load
    if (startIndex === 0) {
      setIsLoading(true);
    }
    
    isFetchingRef.current = true;
    
    try {
      // Create a new abort controller for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      // Fetch blocks with search filter if provided
      let query = supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .range(startIndex, startIndex + BLOCK_SIZE - 1);
        
      if (searchQuery) {
        query = query.textSearch('content', searchQuery, {
          type: 'websearch',
          config: 'english'
        });
      }
      
      const { data, error } = await query;
      
      // Handle response
      if (!mountedRef.current) return;
      
      if (error) throw error;
      
      const newBlocks = data || [];
      
      // Check if we've reached the end
      if (newBlocks.length < BLOCK_SIZE) {
        setHasMore(false);
        
        // If first load and no blocks, check if content generation is needed
        if (startIndex === 0 && newBlocks.length === 0 && isFirstLoad) {
          await checkAndTriggerContentGeneration();
        }
      }
      
      // Update blocks with new data
      if (startIndex === 0) {
        setBlocks(newBlocks);
      } else {
        setBlocks(prevBlocks => [...prevBlocks, ...newBlocks]);
      }
      
      // Update fetch index for pagination
      setLastFetchedIndex(startIndex + newBlocks.length);
      
      // First load complete
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
      
      // Reset retry counter on success
      fetchTriesRef.current = 0;
      setError(null);
    } catch (err: any) {
      console.error('Error fetching blocks:', err);
      
      // Only set error if mounted
      if (mountedRef.current) {
        setError(err.message || 'Failed to load content blocks');
        
        // Handle retry logic for failed requests
        if (fetchTriesRef.current < MAX_RETRIES) {
          fetchTriesRef.current++;
          
          if (fetchTimerRef.current) {
            clearTimeout(fetchTimerRef.current);
          }
          
          const delay = getRetryDelay(fetchTriesRef.current);
          console.log(`Retry ${fetchTriesRef.current}/${MAX_RETRIES} in ${delay}ms...`);
          
          // Schedule retry with exponential backoff
          fetchTimerRef.current = setTimeout(() => {
            if (mountedRef.current) {
              fetchBlocks(startIndex);
            }
          }, delay);
        } else {
          console.error('Max retries reached for fetching blocks');
          
          // If we've hit max retries on first load, check if we need to trigger generation
          if (startIndex === 0 && isFirstLoad) {
            checkAndTriggerContentGeneration();
          }
        }
      }
    } finally {
      // Reset loading state
      if (mountedRef.current) {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    }
  }, [curioId, childId, searchQuery, isFirstLoad]);

  // Load more blocks for pagination
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && !isFetchingRef.current) {
      fetchBlocks(lastFetchedIndex);
    }
  }, [isLoading, hasMore, lastFetchedIndex, fetchBlocks]);
  
  // Handle content generation if no blocks exist
  const checkAndTriggerContentGeneration = useCallback(async () => {
    if (!curioId || !childId) return;
    
    try {
      // Check if there's a generation error on the curio
      const { data: curioData, error: curioError } = await supabase
        .from('curios')
        .select('generation_error')
        .eq('id', curioId)
        .single();
      
      if (curioError) throw curioError;
      
      // If there's already a known generation error, show it
      if (curioData?.generation_error) {
        setGenerationError(curioData.generation_error);
        return;
      }
      
      console.log('Triggering content generation...');
      
      const { data, error } = await supabase.functions.invoke('trigger-content-generation', {
        body: { curioId, childId }
      });
      
      if (error) throw error;
      
      console.log('Content generation response:', data);
      
      // Wait a moment and then fetch blocks again
      setTimeout(() => {
        if (mountedRef.current) {
          fetchBlocks(0);
        }
      }, 2000);
    } catch (err: any) {
      console.error('Error triggering content generation:', err);
      
      if (mountedRef.current) {
        setGenerationError(err.message || 'Failed to generate content');
        toast.error('Could not generate content. Please try again.');
      }
    }
  }, [curioId, childId]);

  // Public function to manually trigger content generation
  const triggerContentGeneration = useCallback(async () => {
    if (!curioId || !childId) {
      throw new Error('Missing curioId or childId');
    }
    
    setGenerationError(null);
    
    try {
      await checkAndTriggerContentGeneration();
      return true;
    } catch (err) {
      console.error('Error in triggerContentGeneration:', err);
      return false;
    }
  }, [curioId, childId, checkAndTriggerContentGeneration]);

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
}
