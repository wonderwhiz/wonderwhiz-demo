
// Note: This file is assumed to exist based on the code we've seen
// If it doesn't exist, we'll need to create it

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
    triggerContentGeneration
  };
}
