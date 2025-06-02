
import { useState, useCallback } from 'react';

export const useCurioData = (curioId?: string, profileId?: string) => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [hasMoreBlocks] = useState(false);
  const [loadingMoreBlocks, setLoadingMoreBlocks] = useState(false);
  const [totalBlocksLoaded, setTotalBlocksLoaded] = useState(0);
  const [isFirstLoad] = useState(true);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const loadMoreBlocks = useCallback(() => {
    setLoadingMoreBlocks(true);
    // Simulate loading
    setTimeout(() => {
      setLoadingMoreBlocks(false);
    }, 1000);
  }, []);

  const handleToggleLike = useCallback((blockId: string) => {
    console.log('Toggle like for block:', blockId);
  }, []);

  const handleToggleBookmark = useCallback((blockId: string) => {
    console.log('Toggle bookmark for block:', blockId);
  }, []);

  const handleSearch = useCallback((query: string) => {
    console.log('Search:', query);
  }, []);

  const clearSearch = useCallback(() => {
    console.log('Clear search');
  }, []);

  const triggerContentGeneration = useCallback(() => {
    if (!curioId) return;
    
    setIsGeneratingContent(true);
    
    // Simulate content generation
    setTimeout(() => {
      const mockBlocks = [
        {
          id: 'block-1',
          type: 'fact',
          content: {
            fact: 'This is a fascinating fact about your topic!',
            details: 'Here are some additional details that make this topic even more interesting.'
          },
          specialist_id: 'nova'
        },
        {
          id: 'block-2',
          type: 'quiz',
          content: {
            question: 'What did you learn from the previous fact?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correct_answer: 0
          },
          specialist_id: 'spark'
        }
      ];
      
      setBlocks(mockBlocks);
      setTotalBlocksLoaded(mockBlocks.length);
      setIsGeneratingContent(false);
      setGenerationError(null);
    }, 2000);
  }, [curioId]);

  return {
    blocks,
    isLoading,
    isGeneratingContent,
    hasMoreBlocks,
    loadingMoreBlocks,
    loadMoreBlocks,
    totalBlocksLoaded,
    handleToggleLike,
    handleToggleBookmark,
    handleSearch,
    clearSearch,
    isFirstLoad,
    generationError,
    triggerContentGeneration
  };
};
