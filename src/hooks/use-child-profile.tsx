
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChildProfile {
  id: string;
  name: string;
  age: number | null;
  interests: string[] | null;
  parent_user_id: string; // Changed from parent_id to parent_user_id
  avatar_url?: string | null;
  created_at: string;
  sparks_balance?: number | null;
  streak_days?: number | null;
  grade?: string | null;
  language?: string | null;
  last_active?: string | null;
  pin?: string;
  streak_last_updated?: string | null;
}

export function useChildProfile(childId?: string) {
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
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
