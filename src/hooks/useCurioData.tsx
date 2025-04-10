
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentBlock, isValidContentBlockType, ContentBlockType } from '@/types/curio';

export const useCurioData = (curioId?: string, childProfile?: any) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [generatingBlocks, setGeneratingBlocks] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Additional properties needed by DashboardContainer
  const [hasMoreBlocks, setHasMoreBlocks] = useState(true);
  const [loadingMoreBlocks, setLoadingMoreBlocks] = useState(false);
  const [totalBlocksLoaded, setTotalBlocksLoaded] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Fetch the curio blocks
  const fetchBlocks = useCallback(async () => {
    if (!curioId) return;
    
    setIsLoading(true);
    console.info(`Fetching curio data for ID: ${curioId}`);
    
    try {
      // First get the basic curio info
      const { data: curioData, error: curioError } = await supabase
        .from('curios')
        .select('*')
        .eq('id', curioId)
        .single();
        
      if (curioError) throw curioError;
      
      if (curioData) {
        console.info(`Curio basic info loaded: ${curioData.title}`);
      }
      
      // Now fetch the content blocks for this curio
      const { data: blockData, error: blockError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .limit(2); // Start with just a couple of blocks for quick rendering
        
      if (blockError) throw blockError;
      
      console.info(`Fetching initial 2 blocks for curio: ${curioId}`);
      
      if (blockData && blockData.length > 0) {
        // Process the block data before setting it
        const processedBlocks = blockData.map((block: any) => ({
          id: block.id,
          curio_id: block.curio_id,
          type: isValidContentBlockType(block.type) ? block.type as ContentBlockType : 'fact',
          specialist_id: block.specialist_id,
          content: block.content,
          liked: block.liked || false,
          bookmarked: block.bookmarked || false,
          created_at: block.created_at
        }));
        
        setBlocks(processedBlocks);
        setTotalBlocksLoaded(processedBlocks.length);
        setIsFirstLoad(false);
      } else {
        console.info('No existing blocks found, generating new ones');
        // Generate blocks if there are none yet
        if (childProfile) {
          generateInitialBlocks(curioData.query, childProfile);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch curio data'));
      console.error('Error fetching curio:', err);
    } finally {
      setIsLoading(false);
    }
  }, [curioId]);

  // Generate initial blocks with AI
  const generateInitialBlocks = async (query: string, profile: any) => {
    setGeneratingBlocks(true);
    
    try {
      console.info('Generating new blocks from Groq API');
      const startTime = new Date();
      console.info(`Initial API call started at ${startTime.toISOString()}`);
      
      // Generate the initial blocks
      const { data: initialBlocks, error: genError } = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: {
          query,
          childProfile: {
            age: profile.age,
            interests: profile.interests,
            language: profile.language
          },
          blockCount: 2,
          quickGeneration: true
        }
      });
      
      if (genError) throw genError;
      
      const initialDuration = (new Date().getTime() - startTime.getTime()) / 1000;
      console.info(`Generated initial ${initialBlocks.length} blocks in ${initialDuration} seconds`);
      
      // Process and save the generated blocks
      if (initialBlocks && initialBlocks.length > 0) {
        await saveBlocksInSequence(initialBlocks, curioId);
        
        // Generate more blocks in the background
        generateRemainingBlocks(query, profile);
      }
    } catch (err) {
      console.error('Error generating blocks:', err);
      setGenerationError('Failed to generate content. Please try again later.');
      
      // Update the curio with the error
      try {
        await supabase
          .from('curios')
          .update({ 
            generation_error: 'Failed to generate content. Please try again later.' 
          })
          .eq('id', curioId);
      } catch (updateErr) {
        console.error('Error updating curio with error status:', updateErr);
      }
    }
  };
  
  // Generate additional blocks
  const generateRemainingBlocks = async (query: string, profile: any) => {
    try {
      const startTime = new Date();
      console.info(`Remaining blocks API call started at ${startTime.toISOString()}`);
      
      // Generate additional blocks
      const { data: remainingBlocks, error: genError } = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: {
          query,
          childProfile: {
            age: profile.age,
            interests: profile.interests,
            language: profile.language
          },
          blockCount: 8,
          skipInitial: 2,
          quickGeneration: false
        }
      });
      
      if (genError) throw genError;
      
      const remainingDuration = (new Date().getTime() - startTime.getTime()) / 1000;
      console.info(`Generated remaining ${remainingBlocks.length} blocks in ${remainingDuration} seconds`);
      
      // Process and save the additional blocks
      if (remainingBlocks && remainingBlocks.length > 0) {
        await saveBlocksInSequence(remainingBlocks, curioId);
      }
    } catch (err) {
      console.error('Error generating additional blocks:', err);
    } finally {
      setGeneratingBlocks(false);
    }
  };
  
  // Save blocks sequentially to maintain order
  const saveBlocksInSequence = async (blocks: any[], curioId: string) => {
    if (!blocks || blocks.length === 0) return;
    
    const savedBlocks: ContentBlock[] = [];
    
    for (let i = 0; i < blocks.length; i++) {
      try {
        // Create a new block with proper structure
        const newBlock = {
          // Don't include an ID - let Supabase generate it
          type: isValidContentBlockType(blocks[i].type) ? blocks[i].type : 'fact',
          specialist_id: blocks[i].specialist_id,
          content: blocks[i].content,
          curio_id: curioId,
          liked: false,
          bookmarked: false
        };
        
        const { data, error } = await supabase
          .from('content_blocks')
          .insert(newBlock)
          .select()
          .single();
          
        if (error) {
          console.error(`Error saving block ${i+1}:`, error);
          continue;
        }
        
        if (data) {
          // Process the returned block to ensure it matches ContentBlock type
          const processedBlock: ContentBlock = {
            id: data.id,
            curio_id: data.curio_id,
            type: isValidContentBlockType(data.type) ? data.type as ContentBlockType : 'fact',
            specialist_id: data.specialist_id,
            content: data.content,
            liked: data.liked || false,
            bookmarked: data.bookmarked || false,
            created_at: data.created_at
          };
          
          savedBlocks.push(processedBlock);
          setTotalBlocksLoaded(prev => prev + 1);
          
          // Update the local state with new blocks as they're saved
          setBlocks(prev => {
            // Make sure we don't add duplicates
            const exists = prev.some(b => b.id === processedBlock.id);
            if (exists) return prev;
            return [...prev, processedBlock];
          });
        }
      } catch (err) {
        console.error(`Error saving block ${i+1}:`, err);
      }
    }
    
    return savedBlocks;
  };

  // Implementation of additional methods needed by DashboardContainer
  const handleToggleLike = async (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    try {
      const newLikedState = !block.liked;
      
      // Update local state
      setBlocks(prev => 
        prev.map(b => b.id === blockId ? { ...b, liked: newLikedState } : b)
      );
      
      // Update in the database
      await supabase
        .from('content_blocks')
        .update({ liked: newLikedState })
        .eq('id', blockId);
        
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };
  
  const handleToggleBookmark = async (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    try {
      const newBookmarkedState = !block.bookmarked;
      
      // Update local state
      setBlocks(prev => 
        prev.map(b => b.id === blockId ? { ...b, bookmarked: newBookmarkedState } : b)
      );
      
      // Update in the database
      await supabase
        .from('content_blocks')
        .update({ bookmarked: newBookmarkedState })
        .eq('id', blockId);
        
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };
  
  const loadMoreBlocks = async () => {
    if (!curioId || loadingMoreBlocks) return;
    
    setLoadingMoreBlocks(true);
    
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .range(blocks.length, blocks.length + 5);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const processedBlocks = data.map((block: any) => ({
          id: block.id,
          curio_id: block.curio_id,
          type: isValidContentBlockType(block.type) ? block.type as ContentBlockType : 'fact',
          specialist_id: block.specialist_id,
          content: block.content,
          liked: block.liked || false,
          bookmarked: block.bookmarked || false,
          created_at: block.created_at
        }));
        
        setBlocks(prev => [...prev, ...processedBlocks]);
        setTotalBlocksLoaded(prev => prev + processedBlocks.length);
        setHasMoreBlocks(data.length === 6); // If we got less than requested, we're at the end
      } else {
        setHasMoreBlocks(false);
      }
    } catch (err) {
      console.error('Error loading more blocks:', err);
    } finally {
      setLoadingMoreBlocks(false);
    }
  };
  
  const handleSearch = async (searchTerm: string) => {
    // Would implement search functionality here
    console.log("Search not implemented yet");
  };
  
  const clearSearch = () => {
    // Would clear search results here
    console.log("Clear search not implemented yet");
  };

  // Initial fetch
  useEffect(() => {
    if (curioId) {
      fetchBlocks();
    }
  }, [curioId, fetchBlocks]);

  return {
    blocks,
    isLoading,
    error,
    generatingBlocks,
    generationError,
    isGeneratingContent: generatingBlocks, // Alias for backward compatibility
    hasMoreBlocks,
    loadingMoreBlocks,
    loadMoreBlocks,
    totalBlocksLoaded,
    handleToggleLike,
    handleToggleBookmark,
    handleSearch,
    clearSearch,
    isFirstLoad,
    refreshBlocks: fetchBlocks
  };
};
