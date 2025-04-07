
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useChildProfile(childId?: string) {
  const [childProfile, setChildProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!childId) {
      setIsLoading(false);
      return;
    }

    const fetchChildProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('id', childId)
          .single();

        if (error) throw error;
        
        setChildProfile(data);
      } catch (err) {
        console.error('Error fetching child profile:', err);
        setError(err as Error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildProfile();
  }, [childId]);

  return { childProfile, isLoading, error };
}
