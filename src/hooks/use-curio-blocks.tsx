
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentBlock } from '@/types/curio';
import { toast } from 'sonner';

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
  const [generationAttempted, setGenerationAttempted] = useState(false);

  const fetchBlocks = useCallback(async () => {
    if (!curioId) return;

    setIsLoading(true);
    setError(null);

    console.log('Fetching blocks for curioId:', curioId, 'page:', page, 'searchQuery:', searchQuery);
    
    const start = page * 10;
    const end = start + 9;

    try {
      let query = supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.textSearch('content', searchQuery);
      }
      
      // Add range after all other conditions
      query = query.range(start, end);

      const { data, error: queryError } = await query;

      if (queryError) {
        console.error('Supabase query error:', queryError);
        throw queryError;
      }

      console.log('Fetched blocks:', data?.length || 0, data);

      if (data && data.length > 0) {
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
        console.log('No blocks found for this curio');
        
        // Auto-trigger content generation if no blocks are found and generation hasn't been attempted
        if (page === 0 && childId && curioId && !generationAttempted) {
          console.log('No blocks found, will attempt to trigger content generation');
          setGenerationAttempted(true);
          await triggerContentGeneration(curioId);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Error fetching blocks:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch blocks'));
    } finally {
      setIsLoading(false);
    }
  }, [curioId, searchQuery, page, childId, generationAttempted]);

  // Function to trigger content generation
  const triggerContentGeneration = async (curioId: string) => {
    try {
      console.log('Triggering content generation for curioId:', curioId);
      toast.loading("Generating content for your exploration...");
      
      // Get the curio details
      const { data: curioData, error: curioError } = await supabase
        .from('curios')
        .select('*')
        .eq('id', curioId)
        .single();
      
      if (curioError) {
        console.error('Error fetching curio details:', curioError);
        toast.error("Failed to generate content. Please try again.");
        return;
      }
      
      if (!curioData) {
        console.error('No curio found with id:', curioId);
        toast.error("Failed to find exploration details.");
        return;
      }
      
      // Directly insert a placeholder block to show something to the user
      const placeholderId = crypto.randomUUID();
      const placeholderBlock = {
        id: placeholderId,
        curio_id: curioId,
        specialist_id: 'nova',
        type: 'fact',
        content: { 
          fact: `Generating fascinating content about "${curioData.title || curioData.query}"...`,
          rabbitHoles: []
        },
        liked: false,
        bookmarked: false,
        created_at: new Date().toISOString()
      };
      
      // Add placeholder to UI temporarily
      setBlocks([placeholderBlock as ContentBlock]);
      
      // Call the edge function to generate content
      const { data: response, error: fnError } = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: {
          query: curioData.query || curioData.title,
          childProfile: {
            // Get user details from the profile if needed
            age: 10, // Default
            interests: ['science', 'animals', 'space'] // Default
          },
          curioId: curioId,
          blockCount: 5
        }
      });
      
      if (fnError) {
        console.error('Error generating content:', fnError);
        toast.error("Failed to generate content. Please try refreshing.");
        return;
      }
      
      console.log('Content generation triggered successfully:', response);
      toast.success("Content generation started! Refreshing...");
      
      // Directly insert the generated blocks
      if (response && Array.isArray(response) && response.length > 0) {
        // Save blocks to database
        for (const blockData of response) {
          try {
            await supabase.from('content_blocks').insert({
              curio_id: curioId,
              specialist_id: blockData.specialist_id || 'nova',
              type: blockData.type || 'fact',
              content: blockData.content
            });
          } catch (insertError) {
            console.error('Error inserting block:', insertError);
          }
        }
        
        // Reset state to force a refetch
        setPage(0);
        setBlocks([]);
        
        // Fetch blocks after a short delay to allow for database insert propagation
        setTimeout(() => {
          fetchBlocks();
        }, 1500);
      } else {
        // If no response, revert to empty state but mark as not first load
        setIsFirstLoad(false);
        setGenerationError("No content was generated. Please try again.");
        toast.error("No content was generated. Please try again.");
      }
    } catch (err) {
      console.error('Error in content generation process:', err);
      toast.error("Error generating content. Please try again.");
      setGenerationError("Error generating content. Please try again.");
    }
  };

  useEffect(() => {
    if (curioId) {
      setBlocks([]);
      setPage(0);
      setIsFirstLoad(true);
      setGenerationAttempted(false);
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
