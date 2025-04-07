
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContentBlock, ContentBlockType, isValidContentBlockType } from '@/types/curio';

export function useCurioBlocks(childId?: string, curioId?: string, searchQuery?: string) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!childId || !curioId) {
      setIsLoading(false);
      return;
    }

    const fetchBlocks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from('content_blocks')
          .select('*')
          .eq('curio_id', curioId)
          .order('created_at', { ascending: true });

        if (searchQuery) {
          // Add search functionality if needed
          query = query.ilike('content', `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        // Ensure the blocks have valid types
        const validBlocks = data ? data.map(block => ({
          ...block,
          type: isValidContentBlockType(block.type) ? block.type : 'fact'
        } as ContentBlock)) : [];
        
        setBlocks(validBlocks);
        setHasMore(data && data.length > 10); // Example condition for hasMore
        setIsFirstLoad(false);
      } catch (err) {
        console.error('Error fetching curio blocks:', err);
        setError(err as Error);
        toast.error('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlocks();
  }, [childId, curioId, searchQuery]);

  const loadMore = async () => {
    // Implement load more functionality if needed
    console.log("Loading more blocks...");
    return Promise.resolve(); // Return a promise to support .finally()
  };

  return { blocks, isLoading, error, hasMore, loadMore, isFirstLoad };
}
