
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  interests: string[];
  age: number;
  sparks_balance: number;
}

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

export const useDashboardProfile = (profileId?: string) => {
  const navigate = useNavigate();
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pastCurios, setPastCurios] = useState<Curio[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [curioSuggestions, setCurioSuggestions] = useState<string[]>([
    'How do volcanoes work?', 
    'What are black holes?', 
    'Tell me about penguins', 
    'Show me cool dinosaurs'
  ]);

  useEffect(() => {
    const loadProfileAndCurios = async () => {
      if (!profileId) {
        navigate('/profiles');
        return;
      }
      
      try {
        setIsLoading(true);
        
        const [profileResponse, curiosResponse] = await Promise.all([
          supabase
            .from('child_profiles')
            .select('*')
            .eq('id', profileId)
            .single(),
          
          supabase
            .from('curios')
            .select('*')
            .eq('child_id', profileId)
            .order('created_at', { ascending: false })
        ]);
        
        const { data: profileData, error: profileError } = profileResponse;
        const { data: curiosData, error: curiosError } = curiosResponse;
        
        if (profileError) throw profileError;
        if (curiosError) throw curiosError;
        
        setChildProfile(profileData);
        setPastCurios(curiosData || []);
        
        if (profileData) {
          fetchCurioSuggestions(profileData, curiosData || []);
        }
      } catch (error) {
        console.error('Error loading profile or curios:', error);
        toast.error("Failed to load your profile");
        navigate('/profiles');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileAndCurios();
  }, [profileId, navigate]);

  const fetchCurioSuggestions = async (profile: any, curios: any[]) => {
    setIsLoadingSuggestions(true);
    try {
      const response = await supabase.functions.invoke('generate-curio-suggestions', {
        body: JSON.stringify({
          childProfile: profile,
          pastCurios: curios
        })
      });
      
      if (response.error) {
        console.error('Error fetching curio suggestions:', response.error);
        if (response.data?.fallbackSuggestions) {
          setCurioSuggestions(response.data.fallbackSuggestions);
        }
        return;
      }
      
      const suggestions = response.data;
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        setCurioSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error fetching curio suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleRefreshSuggestions = () => {
    if (childProfile && pastCurios) {
      fetchCurioSuggestions(childProfile, pastCurios);
    }
  };

  return {
    childProfile,
    setChildProfile,
    isLoading,
    pastCurios,
    setPastCurios,
    isLoadingSuggestions,
    curioSuggestions,
    handleRefreshSuggestions
  };
};
