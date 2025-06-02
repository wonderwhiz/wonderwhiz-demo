
import { useState, useEffect, useCallback } from 'react';

interface ContentBlock {
  id: string;
  type: string;
  content: any;
  specialist_id: string;
  liked: boolean;
  bookmarked: boolean;
  created_at: string;
}

export const useCurioData = (curioId?: string, profileId?: string) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [hasMoreBlocks, setHasMoreBlocks] = useState(true);
  const [loadingMoreBlocks, setLoadingMoreBlocks] = useState(false);
  const [totalBlocksLoaded, setTotalBlocksLoaded] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Load initial content when curio changes
  useEffect(() => {
    if (!curioId) {
      setBlocks([]);
      setTotalBlocksLoaded(0);
      setIsFirstLoad(true);
      return;
    }

    const loadInitialContent = async () => {
      setIsLoading(true);
      setIsGeneratingContent(true);
      setGenerationError(null);
      
      try {
        // Simulate loading content
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockBlocks: ContentBlock[] = [
          {
            id: `block-1-${curioId}`,
            type: 'fact',
            content: {
              fact: "This is a fascinating topic! Let me explain it in a way that's perfect for your age.",
              explanation: "We'll explore this step by step with fun examples and cool facts.",
              fun_fact: "Did you know that asking questions like this makes your brain grow stronger?"
            },
            specialist_id: 'whizzy',
            liked: false,
            bookmarked: false,
            created_at: new Date().toISOString()
          },
          {
            id: `block-2-${curioId}`,
            type: 'activity',
            content: {
              title: "Let's Explore Together!",
              description: "Here's a fun way to think about your question",
              activity_type: "exploration"
            },
            specialist_id: 'nova',
            liked: false,
            bookmarked: false,
            created_at: new Date().toISOString()
          }
        ];

        setBlocks(mockBlocks);
        setTotalBlocksLoaded(mockBlocks.length);
        setHasMoreBlocks(true);
        setIsFirstLoad(false);
      } catch (error) {
        console.error('Error loading content:', error);
        setGenerationError('Failed to load content. Please try again.');
      } finally {
        setIsLoading(false);
        setIsGeneratingContent(false);
      }
    };

    loadInitialContent();
  }, [curioId]);

  const loadMoreBlocks = useCallback(async () => {
    if (!curioId || loadingMoreBlocks || !hasMoreBlocks) return;

    setLoadingMoreBlocks(true);
    
    try {
      // Simulate loading more content
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newBlock: ContentBlock = {
        id: `block-${totalBlocksLoaded + 1}-${curioId}`,
        type: 'fun_fact',
        content: {
          fact: `Here's another interesting aspect of your question!`,
          explanation: "The more we explore, the more amazing things we discover."
        },
        specialist_id: 'spark',
        liked: false,
        bookmarked: false,
        created_at: new Date().toISOString()
      };

      setBlocks(prev => [...prev, newBlock]);
      setTotalBlocksLoaded(prev => prev + 1);
      
      // Simulate reaching the end after a few blocks
      if (totalBlocksLoaded >= 4) {
        setHasMoreBlocks(false);
      }
    } catch (error) {
      console.error('Error loading more blocks:', error);
    } finally {
      setLoadingMoreBlocks(false);
    }
  }, [curioId, loadingMoreBlocks, hasMoreBlocks, totalBlocksLoaded]);

  const handleToggleLike = useCallback((blockId: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, liked: !block.liked }
        : block
    ));
  }, []);

  const handleToggleBookmark = useCallback((blockId: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, bookmarked: !block.bookmarked }
        : block
    ));
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    // Implement search functionality
    console.log('Searching for:', searchTerm);
  }, []);

  const clearSearch = useCallback(() => {
    // Clear search results
    console.log('Clearing search');
  }, []);

  const triggerContentGeneration = useCallback(() => {
    // Trigger new content generation
    loadMoreBlocks();
  }, [loadMoreBlocks]);

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
