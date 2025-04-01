import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ContentBlock, isValidContentBlockType } from '@/types/curio';
import { debounce } from 'lodash';

const BATCH_SIZE = 3;
const INITIAL_BLOCKS_TO_LOAD = 2;

export const useCurioData = (curioId?: string, profileId?: string) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [title, setTitle] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingBasicInfo, setIsLoadingBasicInfo] = useState<boolean>(true);
  const [isGeneratingContent, setIsGeneratingContent] = useState<boolean>(false);
  const [hasMoreBlocks, setHasMoreBlocks] = useState<boolean>(true);
  const [loadingMoreBlocks, setLoadingMoreBlocks] = useState<boolean>(false);
  const [totalBlocksLoaded, setTotalBlocksLoaded] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);
  
  const claudeResponseRef = useRef<any>(null);
  const blockLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const convertToContentBlocks = (dbBlocks: any[]): ContentBlock[] => {
    return dbBlocks.map(block => {
      if (!isValidContentBlockType(block.type)) {
        console.warn(`Invalid content block type: ${block.type}`);
        block.type = "fact";
      }
      
      return {
        id: block.id,
        curio_id: block.curio_id,
        specialist_id: block.specialist_id,
        type: block.type as ContentBlock['type'],
        content: block.content,
        liked: block.liked,
        bookmarked: block.bookmarked,
        created_at: block.created_at
      };
    });
  };

  const fetchInitialBlocks = useCallback(async (curioId: string) => {
    if (!curioId) return;
    
    try {
      setIsLoading(true);
      console.log(`Fetching initial ${INITIAL_BLOCKS_TO_LOAD} blocks for curio: ${curioId}`);
      
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
        console.log(`Found ${existingBlocks.length} existing blocks`);
        
        const mappedBlocks = convertToContentBlocks(existingBlocks);
        
        setBlocks(mappedBlocks);
        setTotalBlocksLoaded(mappedBlocks.length);
        
        const { count, error: countError } = await supabase
          .from('content_blocks')
          .select('*', { count: 'exact', head: true })
          .eq('curio_id', curioId);
          
        if (!countError && count !== null) {
          console.log(`Total blocks available: ${count}`);
          setHasMoreBlocks(count > INITIAL_BLOCKS_TO_LOAD);
        }
        
        setIsFirstLoad(false);
      } else {
        console.log('No existing blocks found, generating new ones');
        setIsGeneratingContent(true);
        setGenerationStartTime(Date.now());
        
        setBlocks([
          {
            id: `generating-${Date.now()}-1`,
            curio_id: curioId,
            specialist_id: 'nova',
            type: 'fact',
            content: { fact: "Generating interesting content for you...", rabbitHoles: [] },
            liked: false,
            bookmarked: false,
            created_at: new Date().toISOString()
          } as ContentBlock
        ]);
        
        setInitialLoadComplete(true);
        
        generateNewBlocks(curioId, query);
      }
    } catch (error) {
      console.error('Error fetching initial blocks:', error);
      toast({
        title: "Error",
        description: "Could not load content blocks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const fetchCurioBasicInfo = async () => {
      if (!curioId) return;
      
      try {
        setIsLoadingBasicInfo(true);
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
          console.log('Curio basic info loaded:', curioData.title);
        }
      } catch (error) {
        console.error('Error fetching curio:', error);
        toast({
          title: "Error",
          description: "Could not load curio data",
          variant: "destructive"
        });
      } finally {
        setIsLoadingBasicInfo(false);
      }
    };
    
    fetchCurioBasicInfo();
  }, [curioId]);

  useEffect(() => {
    if (!isLoadingBasicInfo && curioId && query) {
      fetchInitialBlocks(curioId);
    }
  }, [curioId, query, isLoadingBasicInfo, fetchInitialBlocks]);

  useEffect(() => {
    return () => {
      if (blockLoadingTimerRef.current) {
        clearTimeout(blockLoadingTimerRef.current);
      }
    };
  }, []);

  const generateNewBlocks = async (curioId: string, query: string) => {
    if (!query || !profileId) return;
    
    try {
      console.log('Generating new blocks from Claude API');
      
      const { data: profileData, error: profileError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', profileId)
        .single();
        
      if (profileError) throw profileError;
      
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
      console.log('Generated blocks from Claude:', generatedBlocks.length);
      
      if (!generatedBlocks.length) {
        throw new Error('No content blocks were generated');
      }
      
      claudeResponseRef.current = generatedBlocks;
      
      const initialBlock = generatedBlocks[0];
      
      const blockWithCurioId = {
        ...initialBlock,
        curio_id: curioId
      };
      
      setBlocks([convertToContentBlocks([blockWithCurioId])[0]]);
      setTotalBlocksLoaded(1);
      setHasMoreBlocks(generatedBlocks.length > 1);
      
      try {
        await supabase.from('content_blocks').insert({
          ...initialBlock,
          curio_id: curioId
        });
      } catch (saveError) {
        console.error('Error saving first block:', saveError);
      }
      
      loadRemainingBlocksProgressively(curioId, generatedBlocks);
      
      if (generationStartTime) {
        const generationTime = Math.round((Date.now() - generationStartTime) / 1000);
        console.log(`Initial content generation completed in ${generationTime} seconds`);
      }
      
      setIsFirstLoad(false);
      setIsGeneratingContent(false);
    } catch (error) {
      console.error('Error generating content blocks:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not generate content blocks",
        variant: "destructive"
      });
      setIsGeneratingContent(false);
      
      setBlocks([{
        id: `error-${Date.now()}`,
        curio_id: curioId,
        specialist_id: 'nova',
        type: 'fact',
        content: { fact: "Sorry, I couldn't generate content at the moment. Please try again.", rabbitHoles: [] },
        liked: false,
        bookmarked: false,
        created_at: new Date().toISOString()
      } as ContentBlock]);
    }
  };

  const loadRemainingBlocksProgressively = (curioId: string, generatedBlocks: any[]) => {
    if (generatedBlocks.length <= 1) return;
    
    let currentIndex = 1;
    
    const loadNextBlock = async () => {
      if (currentIndex >= generatedBlocks.length) {
        blockLoadingTimerRef.current = null;
        return;
      }
      
      try {
        const nextBlock = generatedBlocks[currentIndex];
        
        setBlocks(prevBlocks => [...prevBlocks, {
          ...nextBlock,
          curio_id: curioId
        } as ContentBlock]);
        
        setTotalBlocksLoaded(prev => prev + 1);
        
        setHasMoreBlocks(currentIndex < generatedBlocks.length - 1);
        
        supabase.from('content_blocks').insert({
          ...nextBlock,
          curio_id: curioId
        }).then(() => {
          console.log(`Successfully saved block ${currentIndex + 1}/${generatedBlocks.length}`);
        }).catch(error => {
          console.error(`Error saving block ${currentIndex + 1}:`, error);
        });
        
        currentIndex++;
        
        const nextDelay = 1000 + (currentIndex * 500);
        blockLoadingTimerRef.current = setTimeout(loadNextBlock, nextDelay);
      } catch (error) {
        console.error('Error during progressive block loading:', error);
        blockLoadingTimerRef.current = null;
      }
    };
    
    blockLoadingTimerRef.current = setTimeout(loadNextBlock, 1000);
  };

  const loadMoreBlocks = useCallback(async () => {
    if (!hasMoreBlocks || loadingMoreBlocks || !curioId) return;
    
    if (claudeResponseRef.current && Array.isArray(claudeResponseRef.current)) {
      const remainingBlocks = claudeResponseRef.current.slice(totalBlocksLoaded);
      if (remainingBlocks.length > 0) {
        console.log(`Loading more blocks from Claude's response: ${totalBlocksLoaded + 1} to ${totalBlocksLoaded + Math.min(BATCH_SIZE, remainingBlocks.length)}`);
        setLoadingMoreBlocks(true);
        
        try {
          const nextBatch = remainingBlocks.slice(0, BATCH_SIZE);
          
          const blocksWithCurioId = nextBatch.map((block: any) => ({
            ...block,
            curio_id: curioId
          }));
          
          setBlocks(prev => [...prev, ...convertToContentBlocks(blocksWithCurioId)]);
          setTotalBlocksLoaded(prev => prev + nextBatch.length);
          
          setHasMoreBlocks(totalBlocksLoaded + nextBatch.length < claudeResponseRef.current.length);
          
          for (const block of nextBatch) {
            supabase.from('content_blocks').insert({
              ...block,
              curio_id: curioId
            }).catch(error => {
              console.error('Error saving block to database:', error);
            });
          }
        } catch (error) {
          console.error('Error loading more blocks from Claude response:', error);
          toast({
            title: "Error",
            description: "Could not load more content",
            variant: "destructive"
          });
        } finally {
          setLoadingMoreBlocks(false);
        }
        
        return;
      }
    }
    
    console.log('Loading more blocks from database...');
    setLoadingMoreBlocks(true);
    
    try {
      const { data: nextBlocks, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .range(totalBlocksLoaded, totalBlocksLoaded + BATCH_SIZE - 1);
        
      if (error) throw error;
      
      if (nextBlocks && nextBlocks.length > 0) {
        console.log(`Loaded ${nextBlocks.length} more blocks from database`);
        
        const mappedBlocks = convertToContentBlocks(nextBlocks);
        
        setBlocks(prev => [...prev, ...mappedBlocks]);
        setTotalBlocksLoaded(prev => prev + mappedBlocks.length);
        
        const { count, error: countError } = await supabase
          .from('content_blocks')
          .select('*', { count: 'exact', head: true })
          .eq('curio_id', curioId);
          
        if (!countError && count !== null) {
          setHasMoreBlocks(count > totalBlocksLoaded + mappedBlocks.length);
        }
      } else {
        console.log('No more blocks available in database');
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

  const handleToggleLike = useCallback(async (blockId: string) => {
    if (blockId.startsWith('generating-') || blockId.startsWith('error-')) return;
    
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, liked: !block.liked }
          : block
      )
    );

    try {
      const currentBlock = blocks.find(b => b.id === blockId);
      const newLikedStatus = currentBlock ? !currentBlock.liked : true;
      
      const { error } = await supabase
        .from('content_blocks')
        .update({ liked: newLikedStatus })
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

  const handleToggleBookmark = useCallback(async (blockId: string) => {
    if (blockId.startsWith('generating-') || blockId.startsWith('error-')) return;
    
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, bookmarked: !block.bookmarked }
          : block
      )
    );

    try {
      const currentBlock = blocks.find(b => b.id === blockId);
      const newBookmarkedStatus = currentBlock ? !currentBlock.bookmarked : true;
      
      const { error } = await supabase
        .from('content_blocks')
        .update({ bookmarked: newBookmarkedStatus })
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

  const handleSearch = debounce(async (value: string) => {
    claudeResponseRef.current = null;
    
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
        const mappedBlocks = convertToContentBlocks(searchResults);
        
        setBlocks(mappedBlocks);
        setTotalBlocksLoaded(mappedBlocks.length);
        setHasMoreBlocks(false);
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
    claudeResponseRef.current = null;
    
    setSearchQuery('');
    fetchInitialBlocks(curioId || '');
  };

  return {
    blocks,
    title,
    query,
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
    clearSearch,
    isFirstLoad
  };
};
