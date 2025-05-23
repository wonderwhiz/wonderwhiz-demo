import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContentBlock, isValidContentBlockType } from '@/types/curio';
import { debounce } from 'lodash';

const BATCH_SIZE = 3;
const INITIAL_BLOCKS_TO_LOAD = 2;
const PROGRESSIVE_LOADING_DELAY = 500; // ms between loading blocks

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
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const generatedBlocksRef = useRef<any>(null);
  const blockLoadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const generationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blockGenerationInProgress = useRef<boolean>(false);
  const searchResponseRef = useRef<any>(null);
  const retryCountRef = useRef<number>(0);

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

  const addBlock = useCallback(async (newBlock: any) => {
    if (!curioId) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke('save-content-block', {
        body: {
          block: {
            ...newBlock,
            curio_id: curioId,
          }
        }
      });
        
      if (error) throw error;
      
      if (data && data.block) {
        const mappedBlock = convertToContentBlocks([data.block])[0];
        setBlocks(prevBlocks => [mappedBlock, ...prevBlocks]);
        setTotalBlocksLoaded(prev => prev + 1);
        return mappedBlock;
      }
      
      return null;
    } catch (error) {
      console.error('Error adding new block:', error);
      toast.error('Failed to add content block');
      return null;
    }
  }, [curioId]);

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
        setInitialLoadComplete(true);
      } else {
        console.log('No existing blocks found, generating new ones');
        setIsGeneratingContent(true);
        setGenerationStartTime(Date.now());
        setGenerationError(null);
        
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
        
        if (generationTimeoutRef.current) {
          clearTimeout(generationTimeoutRef.current);
        }
        
        generationTimeoutRef.current = setTimeout(() => {
          if (isGeneratingContent) {
            setIsGeneratingContent(false);
            setGenerationError("Content generation taking longer than expected. Please try refreshing the page if content doesn't appear soon.");
            toast.error("Content generation taking longer than expected. Please try refreshing the page.");
          }
        }, 20000);
        
        generateNewBlocks(curioId, query);
      }
    } catch (error) {
      console.error('Error fetching initial blocks:', error);
      setGenerationError("Could not load content blocks. Please try refreshing the page.");
      toast.error("Could not load content blocks");
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
        toast.error("Could not load curio data");
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
    
    return () => {
      if (blockLoadingTimerRef.current) {
        clearTimeout(blockLoadingTimerRef.current);
      }
      
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
    };
  }, [curioId, query, isLoadingBasicInfo, fetchInitialBlocks]);

  const generateNewBlocks = async (curioId: string, query: string) => {
    if (!query || !profileId || blockGenerationInProgress.current) return;
    
    blockGenerationInProgress.current = true;
    retryCountRef.current = 0;
    
    try {
      console.log('Generating new blocks from Groq API');
      setGenerationError(null);
      
      const { data: profileData, error: profileError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', profileId)
        .single();
        
      if (profileError) throw profileError;
      
      const initialApiStartTime = Date.now();
      console.log(`Initial API call started at ${new Date().toISOString()}`);
      
      const tryGenerateBlocks = async (retryAttempt = 0) => {
        try {
          const { data: initialData, error: initialError } = await supabase.functions.invoke('generate-curiosity-blocks', {
            body: {
              query,
              childProfile: {
                age: profileData?.age || 8,
                interests: profileData?.interests || ['science', 'art', 'space'],
                language: profileData?.language || 'English'
              },
              blockCount: 2,
              quickGeneration: true
            }
          });
          
          if (initialError) {
            throw new Error(initialError.message || 'Error generating initial content blocks');
          }
          
          return initialData || [];
        } catch (err) {
          console.error(`Error in block generation attempt ${retryAttempt}:`, err);
          
          if (retryAttempt < 2) {
            console.log(`Retrying block generation, attempt ${retryAttempt + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return tryGenerateBlocks(retryAttempt + 1);
          }
          
          return [
            {
              id: crypto.randomUUID(),
              type: 'fact',
              specialist_id: 'whizzy',
              content: {
                fact: `Here's information about "${query}". This is a fallback response since we couldn't generate custom content right now.`,
                rabbitHoles: [`Tell me more about ${query}`, `What's interesting about ${query}?`]
              },
              liked: false,
              bookmarked: false,
              created_at: new Date().toISOString()
            },
            {
              id: crypto.randomUUID(),
              type: 'fact',
              specialist_id: 'nova',
              content: {
                fact: `Would you like to learn more about ${query}? Try asking a more specific question!`,
                rabbitHoles: [`What are the key facts about ${query}?`, `Why is ${query} important?`]
              },
              liked: false,
              bookmarked: false,
              created_at: new Date().toISOString()
            }
          ];
        }
      };
      
      const initialBlocks = await tryGenerateBlocks();
      
      console.log(`Generated initial ${initialBlocks.length} blocks in ${(Date.now() - initialApiStartTime) / 1000} seconds`);
      
      if (initialBlocks.length > 0) {
        const initialBlocksWithCurioId = initialBlocks.map((block: any) => ({
          ...block,
          curio_id: curioId
        }));
        
        setBlocks(convertToContentBlocks(initialBlocksWithCurioId));
        setTotalBlocksLoaded(initialBlocksWithCurioId.length);
        
        const savePromises = initialBlocksWithCurioId.map(async (block: any) => {
          try {
            await supabase.functions.invoke('save-content-block', {
              body: {
                block: {
                  ...block,
                  curio_id: curioId
                }
              }
            });
          } catch (insertError) {
            console.error('Error saving block to database:', insertError);
          }
        });
        
        await Promise.all(savePromises);
      }
      
      setTimeout(async () => {
        try {
          const remainingApiStartTime = Date.now();
          console.log(`Remaining blocks API call started at ${new Date().toISOString()}`);
          
          const tryGenerateRemainingBlocks = async (retryAttempt = 0) => {
            try {
              const { data: remainingData, error: remainingError } = await supabase.functions.invoke('generate-curiosity-blocks', {
                body: {
                  query,
                  childProfile: {
                    age: profileData?.age || 8,
                    interests: profileData?.interests || ['science', 'art', 'space'],
                    language: profileData?.language || 'English'
                  },
                  blockCount: 8,
                  skipInitial: 2,
                  quickGeneration: false
                }
              });
              
              if (remainingError) {
                throw new Error(remainingError.message || 'Error generating remaining content blocks');
              }
              
              return remainingData || [];
            } catch (err) {
              console.error(`Error in remaining block generation attempt ${retryAttempt}:`, err);
              
              if (retryAttempt < 2) {
                console.log(`Retrying remaining block generation, attempt ${retryAttempt + 1}...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return tryGenerateRemainingBlocks(retryAttempt + 1);
              }
              
              return Array(3).fill(0).map(() => ({
                id: crypto.randomUUID(),
                type: Math.random() > 0.5 ? 'fact' : 'funFact',
                specialist_id: ['prism', 'spark', 'atlas'][Math.floor(Math.random() * 3)],
                content: {
                  fact: `Here's another interesting aspect of ${query}. We're providing some fallback content.`,
                  rabbitHoles: [`How does ${query} work?`, `What are examples of ${query}?`]
                },
                liked: false,
                bookmarked: false,
                created_at: new Date().toISOString()
              }));
            }
          };
          
          const remainingBlocks = await tryGenerateRemainingBlocks();
          
          console.log(`Generated remaining ${remainingBlocks.length} blocks in ${(Date.now() - remainingApiStartTime) / 1000} seconds`);
          
          generatedBlocksRef.current = remainingBlocks;
          
          if (remainingBlocks.length > 0) {
            setHasMoreBlocks(true);
            loadRemainingBlocksProgressively(curioId, remainingBlocks);
          } else {
            setIsGeneratingContent(false);
          }
        } catch (error) {
          console.error('Error generating remaining blocks:', error);
          setIsGeneratingContent(false);
          setGenerationError("Could not generate all content blocks. Please try refreshing the page.");
        }
      }, 100);
      
      if (generationStartTime) {
        const generationTime = Math.round((Date.now() - generationStartTime) / 1000);
        console.log(`Initial content generation completed in ${generationTime} seconds`);
      }
      
      setIsFirstLoad(false);
      
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
        generationTimeoutRef.current = null;
      }
    } catch (error) {
      console.error('Error generating content blocks:', error);
      setGenerationError("Could not generate content blocks. Please try refreshing the page.");
      toast.error(error instanceof Error ? error.message : "Could not generate content blocks");
      
      setBlocks([{
        id: crypto.randomUUID(),
        curio_id: curioId,
        specialist_id: 'nova',
        type: 'fact',
        content: { fact: "Sorry, I couldn't generate content at the moment. Please try again.", rabbitHoles: [] },
        liked: false,
        bookmarked: false,
        created_at: new Date().toISOString()
      } as ContentBlock]);
      
      setIsGeneratingContent(false);
    } finally {
      blockGenerationInProgress.current = false;
    }
  };

  const loadRemainingBlocksProgressively = (curioId: string, generatedBlocks: any[]) => {
    if (!generatedBlocks || generatedBlocks.length === 0) {
      setIsGeneratingContent(false);
      return;
    }
    
    let currentIndex = 0;
    
    const loadNextBlock = async () => {
      if (currentIndex >= generatedBlocks.length) {
        blockLoadingTimerRef.current = null;
        setIsGeneratingContent(false);
        return;
      }
      
      try {
        const nextBlock = generatedBlocks[currentIndex];
        
        if (!nextBlock || !nextBlock.type || !nextBlock.specialist_id) {
          console.error(`Invalid block data at index ${currentIndex}`, nextBlock);
          currentIndex++;
          blockLoadingTimerRef.current = setTimeout(loadNextBlock, 300);
          return;
        }
        
        setBlocks(prevBlocks => [...prevBlocks, {
          ...nextBlock,
          curio_id: curioId
        } as ContentBlock]);
        
        setTotalBlocksLoaded(prev => prev + 1);
        
        setHasMoreBlocks(currentIndex < generatedBlocks.length - 1);
        
        await supabase.functions.invoke('save-content-block', {
          body: {
            block: {
              ...nextBlock,
              curio_id: curioId
            }
          }
        });
      } catch (error) {
        console.error(`Error loading block ${currentIndex + 1}:`, error);
      }
      
      currentIndex++;
      blockLoadingTimerRef.current = setTimeout(loadNextBlock, PROGRESSIVE_LOADING_DELAY);
    };
    
    loadNextBlock();
  };

  const loadMoreBlocks = useCallback(async () => {
    if (!hasMoreBlocks || loadingMoreBlocks || !curioId) return;
    
    if (generatedBlocksRef.current && Array.isArray(generatedBlocksRef.current)) {
      const remainingBlocks = generatedBlocksRef.current.slice(totalBlocksLoaded - INITIAL_BLOCKS_TO_LOAD);
      if (remainingBlocks.length > 0) {
        console.log(`Loading more blocks from generated response: ${totalBlocksLoaded + 1} to ${totalBlocksLoaded + Math.min(BATCH_SIZE, remainingBlocks.length)}`);
        setLoadingMoreBlocks(true);
        
        try {
          const nextBatch = remainingBlocks.slice(0, BATCH_SIZE);
          
          const blocksWithCurioId = nextBatch.map((block: any) => ({
            ...block,
            curio_id: curioId
          }));
          
          setBlocks(prev => [...prev, ...convertToContentBlocks(blocksWithCurioId)]);
          setTotalBlocksLoaded(prev => prev + nextBatch.length);
          
          setHasMoreBlocks(totalBlocksLoaded + nextBatch.length - INITIAL_BLOCKS_TO_LOAD < generatedBlocksRef.current.length);
          
          const savePromises = nextBatch.map(block => 
            supabase.from('content_blocks').insert({
              ...block,
              curio_id: curioId
            })
          );
          
          await Promise.all(savePromises);
        } catch (error) {
          console.error('Error loading more blocks from generated response:', error);
          toast("Could not load more content");
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
      toast("Could not load more content");
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
      toast("Could not update like status");
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
      toast("Could not update bookmark status");
    }
  }, [blocks]);

  const handleSearch = debounce(async (value: string) => {
    searchResponseRef.current = null;
    
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
        });
        
      if (error) throw error;
      
      if (searchResults && searchResults.length > 0) {
        const mappedBlocks = convertToContentBlocks(searchResults);
        
        setBlocks(mappedBlocks);
        setTotalBlocksLoaded(mappedBlocks.length);
        setHasMoreBlocks(false);
      } else {
        setBlocks([]);
        toast(`No content found for "${value}"`);
      }
    } catch (error) {
      console.error('Error searching blocks:', error);
      toast("Could not search content blocks");
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const clearSearch = () => {
    searchResponseRef.current = null;
    
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
    loadMoreBlocks,
    totalBlocksLoaded,
    initialLoadComplete,
    setInitialLoadComplete,
    searchQuery,
    setSearchQuery,
    handleToggleLike,
    handleToggleBookmark,
    handleSearch,
    clearSearch,
    isFirstLoad,
    addBlock,
    generationError
  };
};
