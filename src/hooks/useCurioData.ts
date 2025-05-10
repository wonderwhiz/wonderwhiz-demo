
import { useState, useEffect, useCallback } from 'react';
import { useCurioBlocks } from '@/hooks/use-curio-blocks';
import { supabase } from '@/integrations/supabase/client';

export function useCurioData(curioId?: string, profileId?: string) {
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalBlocksLoaded, setTotalBlocksLoaded] = useState(0);

  const {
    blocks,
    isLoading,
    error,
    hasMore,
    loadMore,
    isFirstLoad,
    generationError,
    triggerContentGeneration
  } = useCurioBlocks(profileId, curioId, searchTerm);

  useEffect(() => {
    setTotalBlocksLoaded(blocks.length);
  }, [blocks]);

  const handleToggleLike = useCallback(async (blockId: string) => {
    try {
      const { data } = await supabase
        .from('content_blocks')
        .select('liked')
        .eq('id', blockId)
        .single();

      const newLikedState = !(data?.liked || false);

      await supabase
        .from('content_blocks')
        .update({ liked: newLikedState })
        .eq('id', blockId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, []);

  const handleToggleBookmark = useCallback(async (blockId: string) => {
    try {
      const { data } = await supabase
        .from('content_blocks')
        .select('bookmarked')
        .eq('id', blockId)
        .single();

      const newBookmarkState = !(data?.bookmarked || false);

      await supabase
        .from('content_blocks')
        .update({ bookmarked: newBookmarkState })
        .eq('id', blockId);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }, []);

  const handleSearch = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    // Search logic if needed
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleTriggerGeneration = useCallback(async () => {
    if (!curioId || !profileId || !triggerContentGeneration) {
      return;
    }
    
    setIsGeneratingContent(true);
    
    try {
      await triggerContentGeneration();
      toast.success("Content generation started!");
    } catch (error) {
      console.error("Error triggering content generation:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGeneratingContent(false);
    }
  }, [curioId, profileId, triggerContentGeneration]);

  const loadingMoreBlocks = isLoading && blocks.length > 0;

  return {
    blocks,
    isLoading,
    error,
    isGeneratingContent,
    hasMoreBlocks: hasMore,
    loadingMoreBlocks,
    loadMoreBlocks: loadMore,
    totalBlocksLoaded,
    handleToggleLike,
    handleToggleBookmark,
    handleSearch,
    clearSearch,
    isFirstLoad,
    generationError,
    triggerContentGeneration: handleTriggerGeneration
  };
}
