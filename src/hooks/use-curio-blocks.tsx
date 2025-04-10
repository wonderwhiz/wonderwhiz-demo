
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentBlock, isValidContentBlockType, ContentBlockType } from '@/types/curio';

interface UseCurioBlocksResult {
  blocks: ContentBlock[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  isFirstLoad: boolean;
  generationError: string | null;
}

export const useCurioBlocks = (childId?: string, curioId?: string, searchQuery = ''): UseCurioBlocksResult => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [page, setPage] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

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
        // Make sure we're properly typing our ContentBlock before setting state
        const typedBlocks = data.map(block => ({
          id: block.id,
          curio_id: block.curio_id,
          type: isValidContentBlockType(block.type) ? block.type as ContentBlockType : 'fact',
          specialist_id: block.specialist_id,
          content: block.content,
          liked: block.liked || false,
          bookmarked: block.bookmarked || false,
          created_at: block.created_at
        })) as ContentBlock[];
        
        setBlocks(prevBlocks => [...prevBlocks, ...typedBlocks]);
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

  // Fetch generation error from curios table
  useEffect(() => {
    // This is where you'd catch any errors coming from content generation
    const fetchGenerationStatus = async () => {
      if (!curioId) return;
      
      try {
        const { data, error } = await supabase
          .from('curios')
          .select('generation_error')
          .eq('id', curioId)
          .single();
          
        if (error) {
          console.error("Error fetching generation status:", error);
          return;
        }
        
        // Handle the data safely to avoid type errors
        if (data) {
          // Check if generation_error exists in the returned data
          if ('generation_error' in data) {
            setGenerationError(data.generation_error);
          } else {
            setGenerationError(null);
          }
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
    generationError,
  };
};
