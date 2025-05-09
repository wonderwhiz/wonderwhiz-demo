
import { useState, useEffect, useCallback } from 'react';
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
}

export const useCurioBlocks = (childId?: string, curioId?: string, searchQuery = ''): UseCurioBlocksResult => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [page, setPage] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Debug logging
  useConsoleLogger(curioId, 'Current Curio ID');
  useConsoleLogger(generationError, 'Generation Error');

  const fetchBlocks = useCallback(async () => {
    if (!curioId) return;

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
            } as ContentBlock
          ]);
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
        
        setBlocks(prevBlocks => [...prevBlocks, ...typedBlocks]);
        setHasMore(data.length === 10);
        setIsFirstLoad(false);
      } else {
        // If no blocks were found, check to see if we need to create some placeholder content
        console.log("No content blocks found for this curio");
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching blocks:', err);
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
    // This is where we fetch any errors coming from content generation
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
        
        // Handle the data safely
        if (data) {
          if (data.generation_error) {
            console.log("Found generation error:", data.generation_error);
            setGenerationError(data.generation_error);
          } else {
            setGenerationError(null);
          }
          
          // If we have no blocks, we might need to check again
          if (blocks.length === 0) {
            console.log("No blocks yet, will check again in 5 seconds");
            setTimeout(() => fetchGenerationStatus(), 5000);
          }
        }
      } catch (err) {
        console.error("Error fetching generation status:", err);
      }
    };
    
    fetchGenerationStatus();
  }, [curioId, blocks.length]);

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
