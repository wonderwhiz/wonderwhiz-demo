
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ContentBlock } from '@/types/curio';
import { debounce } from 'lodash';

const BATCH_SIZE = 2;
const INITIAL_BLOCKS_TO_LOAD = 2;

export const useCurioData = (curioId?: string, profileId?: string) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [title, setTitle] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMoreBlocks, setHasMoreBlocks] = useState<boolean>(true);
  const [loadingMoreBlocks, setLoadingMoreBlocks] = useState<boolean>(false);
  const [totalBlocksLoaded, setTotalBlocksLoaded] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch curio data
  useEffect(() => {
    const fetchCurio = async () => {
      if (!curioId) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching curio data for ID:', curioId);
        
        const { data: curioData, error: curioError } = await supabase
          .from('curios')
          .select('*')
          .eq('id', curioId)
          .single();
        
        if (curioError) {
          throw curioError;
        }
        
        if (curioData) {
          setTitle(curioData.title);
          setQuery(curioData.query);
          console.log('Curio data loaded:', curioData.title);
        }
        
        // Fetch initial batch of blocks or generate them if they don't exist
        await fetchInitialBlocks(curioId);
        
      } catch (error) {
        console.error('Error fetching curio:', error);
        toast({
          title: "Error",
          description: "Could not load curio data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurio();
  }, [curioId]);

  // Fetch initial blocks
  const fetchInitialBlocks = async (curioId: string) => {
    try {
      console.log(`Fetching initial ${INITIAL_BLOCKS_TO_LOAD} blocks...`);
      
      // First check if we already have blocks for this curio
      const { data: existingBlocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .limit(INITIAL_BLOCKS_TO_LOAD);
      
      if (blocksError) {
        throw blocksError;
      }
      
      if (existingBlocks && existingBlocks.length > 0) {
        // We have existing blocks, use them
        console.log(`Found ${existingBlocks.length} existing blocks`);
        
        const mappedBlocks = existingBlocks.map(block => ({
          ...block,
          type: block.type
        }));
        
        setBlocks(mappedBlocks);
        setTotalBlocksLoaded(mappedBlocks.length);
        
        // Check if there are potentially more blocks to load
        const { count, error: countError } = await supabase
          .from('content_blocks')
          .select('*', { count: 'exact', head: true })
          .eq('curio_id', curioId);
          
        if (!countError && count !== null) {
          console.log(`Total blocks available: ${count}`);
          setHasMoreBlocks(count > INITIAL_BLOCKS_TO_LOAD);
        }
      } else {
        // No existing blocks, generate new ones
        console.log('No existing blocks found, generating new ones');
        await generateNewBlocks(curioId, query);
      }
    } catch (error) {
      console.error('Error fetching initial blocks:', error);
      toast({
        title: "Error",
        description: "Could not load content blocks",
        variant: "destructive"
      });
    }
  };

  // Generate new blocks from Claude
  const generateNewBlocks = async (curioId: string, query: string) => {
    if (!query || !profileId) return;
    
    try {
      console.log('Generating new blocks from Claude API');
      
      // Get child profile data for generation
      const { data: profileData, error: profileError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', profileId)
        .single();
        
      if (profileError) throw profileError;
      
      // Call Claude to generate content blocks
      const response = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: {
          query,
          childProfile: {
            age: profileData?.age || 8,
            interests: profileData?.interests || ['science', 'art', 'space'],
            language: profileData?.language || 'English'
          }
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Error generating content blocks');
      }
      
      const generatedBlocks = response.data || [];
      console.log('Generated blocks:', generatedBlocks);
      
      if (!generatedBlocks.length) {
        throw new Error('No content blocks were generated');
      }
      
      // Take only the first batch
      const initialBlocks = generatedBlocks.slice(0, INITIAL_BLOCKS_TO_LOAD);
      
      // Add curio_id to each block
      const blocksWithCurioId = initialBlocks.map(block => ({
        ...block,
        curio_id: curioId
      }));
      
      // Save all generated blocks to the database
      for (const block of generatedBlocks) {
        await supabase.from('content_blocks').insert({
          ...block,
          curio_id: curioId
        });
      }
      
      // Set the blocks in state
      setBlocks(blocksWithCurioId);
      setTotalBlocksLoaded(INITIAL_BLOCKS_TO_LOAD);
      setHasMoreBlocks(generatedBlocks.length > INITIAL_BLOCKS_TO_LOAD);
    } catch (error) {
      console.error('Error generating content blocks:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not generate content blocks",
        variant: "destructive"
      });
    }
  };

  const loadMoreBlocks = useCallback(async () => {
    if (!hasMoreBlocks || loadingMoreBlocks || !curioId) return;
    
    console.log('Loading more blocks...');
    setLoadingMoreBlocks(true);
    
    try {
      // First try to fetch more existing blocks
      const { data: nextBlocks, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .range(totalBlocksLoaded, totalBlocksLoaded + BATCH_SIZE - 1);
        
      if (error) throw error;
      
      if (nextBlocks && nextBlocks.length > 0) {
        // We got more existing blocks
        console.log(`Loaded ${nextBlocks.length} more blocks`);
        
        const mappedBlocks = nextBlocks.map(block => ({
          ...block,
          type: block.type
        }));
        
        setBlocks(prev => [...prev, ...mappedBlocks]);
        setTotalBlocksLoaded(prev => prev + mappedBlocks.length);
        
        // Check if there are more blocks to load
        const { count, error: countError } = await supabase
          .from('content_blocks')
          .select('*', { count: 'exact', head: true })
          .eq('curio_id', curioId);
          
        if (!countError && count !== null) {
          setHasMoreBlocks(count > totalBlocksLoaded + mappedBlocks.length);
        }
      } else {
        // No more blocks in the database
        console.log('No more blocks available');
        setHasMoreBlocks(false);
      }
    } catch (error) {
      console.error('Error loading more blocks:', error);
      toast({
        title: "Error",
        description: "Could not load more content",
        variant: "destructive"
      });
    } finally {
      setLoadingMoreBlocks(false);
    }
  }, [hasMoreBlocks, loadingMoreBlocks, totalBlocksLoaded, curioId]);

  // Handle like toggle
  const handleToggleLike = useCallback(async (blockId: string) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, liked: !block.liked }
          : block
      )
    );

    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({ liked: blocks.find(b => b.id === blockId)?.liked ? false : true })
        .eq('id', blockId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating like status:', error);
      toast({
        title: "Error",
        description: "Could not update like status",
        variant: "destructive"
      });
    }
  }, [blocks]);

  // Handle bookmark toggle
  const handleToggleBookmark = useCallback(async (blockId: string) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, bookmarked: !block.bookmarked }
          : block
      )
    );

    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({ bookmarked: blocks.find(b => b.id === blockId)?.bookmarked ? false : true })
        .eq('id', blockId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating bookmark status:', error);
      toast({
        title: "Error",
        description: "Could not update bookmark status",
        variant: "destructive"
      });
    }
  }, [blocks]);

  // Search function with debounce for performance
  const handleSearch = debounce(async (value: string) => {
    if (!curioId || value.trim() === '') return;
    
    console.log('Searching for:', value);
    setIsLoading(true);
    
    try {
      const { data: searchResults, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .textSearch('content', value, {
          type: 'websearch',
          config: 'english'
        })
        .limit(INITIAL_BLOCKS_TO_LOAD);
        
      if (error) throw error;
      
      if (searchResults && searchResults.length > 0) {
        const mappedBlocks = searchResults.map(block => ({
          ...block,
          type: block.type
        }));
        
        setBlocks(mappedBlocks);
        setTotalBlocksLoaded(mappedBlocks.length);
        setHasMoreBlocks(false); // Disable infinite scroll in search mode
      } else {
        setBlocks([]);
        toast({
          title: "No results",
          description: `No content found for "${value}"`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error searching blocks:', error);
      toast({
        title: "Search error",
        description: "Could not search content blocks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const clearSearch = () => {
    setSearchQuery('');
    fetchInitialBlocks(curioId || '');
  };

  return {
    blocks,
    title,
    query,
    isLoading,
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
};
