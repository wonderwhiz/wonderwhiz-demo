import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCurioData(curioId?: string, profileId?: string) {
  // Debug log to trace parameter values
  console.log('useCurioData hook called with:', { curioId, profileId });

  const [blocks, setBlocks] = useState<any[]>([]);
  const [title, setTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeneratingContent, setIsGeneratingContent] = useState<boolean>(false);
  const [hasMoreBlocks, setHasMoreBlocks] = useState<boolean>(true);
  const [loadingMoreBlocks, setLoadingMoreBlocks] = useState<boolean>(false);
  const [totalBlocksLoaded, setTotalBlocksLoaded] = useState<number>(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // If we're missing required parameters, return empty data
  if (!curioId || !profileId) {
    console.error('Missing required parameters in useCurioData:', { curioId, profileId });
    return {
      blocks: [],
      title: null,
      isLoading: false,
      isGeneratingContent: false,
      hasMoreBlocks: false,
      loadingMoreBlocks: false,
      totalBlocksLoaded: 0,
      initialLoadComplete: true,
      setInitialLoadComplete: () => {},
      searchQuery: '',
      setSearchQuery: () => {},
      loadMoreBlocks: () => {},
      handleToggleLike: () => {},
      handleToggleBookmark: () => {},
      handleSearch: () => {},
      clearSearch: () => {}
    };
  }

  // Implement or mock the rest of the hook functionality here as needed
  const loadMoreBlocks = useCallback(() => {
    console.log('loadMoreBlocks called');
    // Mock implementation
  }, []);
  
  const handleToggleLike = useCallback((blockId: string) => {
    console.log('handleToggleLike called with blockId:', blockId);
    // Mock implementation
  }, []);
  
  const handleToggleBookmark = useCallback((blockId: string) => {
    console.log('handleToggleBookmark called with blockId:', blockId);
    // Mock implementation
  }, []);
  
  const handleSearch = useCallback((query: string) => {
    console.log('handleSearch called with query:', query);
    setSearchQuery(query);
    // Mock implementation
  }, []);
  
  const clearSearch = useCallback(() => {
    console.log('clearSearch called');
    setSearchQuery('');
    // Mock implementation
  }, []);

  // Actually load data or create test data for development
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('Loading data for:', { curioId, profileId });
        
        // Check if these are valid UUIDs before making the request
        if (!curioId || !profileId) {
          throw new Error('Invalid or missing parameters');
        }

        // For development, create mock data
        if (curioId.startsWith('test-')) {
          setTimeout(() => {
            setTitle("Test Curiosity Page");
            setBlocks([
              {
                id: "test-block-1",
                type: "fact",
                content: { fact: "This is a test fact block" },
                specialist_id: "nova",
                liked: false,
                bookmarked: false
              },
              {
                id: "test-block-2",
                type: "quiz",
                content: { 
                  question: "Is this a test?",
                  options: ["Yes", "No", "Maybe", "All of the above"],
                  correctIndex: 0
                },
                specialist_id: "spark",
                liked: false,
                bookmarked: false
              }
            ]);
            setTotalBlocksLoaded(2);
            setIsLoading(false);
            setHasMoreBlocks(false);
            console.log('Mock data loaded successfully');
          }, 1000);
          return;
        }

        // Implement the actual data loading logic here
        // For now, we'll just set some test data
        
      } catch (error) {
        console.error('Error loading profile or curios:', error);
        toast.error('Failed to load curiosity content');
        setIsLoading(false);
      }
    };

    loadData();
  }, [curioId, profileId]);

  return {
    blocks,
    title,
    isLoading,
    isGeneratingContent,
    hasMoreBlocks,
    loadingMoreBlocks,
    totalBlocksLoaded,
    initialLoadComplete,
    setInitialLoadComplete,
    searchQuery,
    setSearchQuery,
    loadMoreBlocks,
    handleToggleLike,
    handleToggleBookmark,
    handleSearch,
    clearSearch
  };
}
