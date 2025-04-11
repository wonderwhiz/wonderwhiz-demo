
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSaveContentBlock() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveBlock = useCallback(async (block: {
    type: string;
    specialist_id: string;
    content: any;
    curio_id?: string;
    liked?: boolean;
    bookmarked?: boolean;
    id?: string;
  }) => {
    setIsSaving(true);
    setError(null);
    
    try {
      console.log('Saving content block using edge function:', block);
      
      const { data, error } = await supabase.functions.invoke('save-content-block', {
        body: { block }
      });
      
      if (error) {
        console.error('Error calling save-content-block function:', error);
        setError(error.message);
        toast.error('Error saving content block');
        return null;
      }
      
      console.log('Content block saved successfully:', data);
      return data?.block;
    } catch (err: any) {
      console.error('Error in saveBlock:', err);
      setError(err.message || 'Unknown error saving block');
      toast.error('Error saving content');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    saveBlock,
    isSaving,
    error
  };
}
