import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentBlock } from '@/types/curio';

interface UseCurioBlocksResult {
  blocks: ContentBlock[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  isFirstLoad: boolean;
  generationError: string | null; // Added this property
}

export const useCurioBlocks = (childId?: string, curioId?: string, searchQuery = ''): UseCurioBlocksResult => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [page, setPage] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null); // Added this state

  const fetchBlocks = useCallback(async () => {
    if (!curioId) return;

    setIsLoading(true);
    setError(null);

    const start = page * 10;
    const end = start + 9;

    let query = supabase
      .from('content_blocks')
      .select('*')
      .eq('curio_id', curioId)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (searchQuery) {
      query = query.textSearch('content', searchQuery);
    }

    try {
      const { data, error } = await query;

      if (error) {
        setError(error);
        return;
      }

      if (data) {
        setBlocks(prevBlocks => [...prevBlocks, ...data]);
        setHasMore(data.length === 10);
        setIsFirstLoad(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch blocks'));
    } finally {
      setIsLoading(false);
    }
  }, [curioId, searchQuery, page]);

  useEffect(() => {
    if (curioId) {
      setBlocks([]);
      setPage(0);
      setIsFirstLoad(true);
      fetchBlocks();
    }
  }, [curioId, searchQuery, fetchBlocks]);

  // Make sure to catch errors from content generation and set the generationError state
  useEffect(() => {
    // This is where you'd catch any errors coming from content generation
    // and set the generationError state
    const fetchGenerationStatus = async () => {
      if (!curioId) return;
      
      try {
        const { data, error } = await supabase
          .from('curios')
          .select('generation_error')
          .eq('id', curioId)
          .single();
          
        if (error) throw error;
        
        if (data && data.generation_error) {
          setGenerationError(data.generation_error);
        } else {
          setGenerationError(null);
        }
      } catch (err) {
        console.error("Error fetching generation status:", err);
        // Don't set generationError here as it might be a fetch error, not a generation error
      }
    };
    
    fetchGenerationStatus();
  }, [curioId]);

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
    generationError, // Return the generationError in the result
  };
};
