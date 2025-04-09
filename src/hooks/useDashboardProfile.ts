
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
  streak_days: number;
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
  const [curioSuggestions, setCurioSuggestions] = useState<string[]>([]);

  // Smart suggestions based on time of day and age
  const getDefaultSuggestions = () => {
    const hour = new Date().getHours();
    const defaultSuggestions = {
      morning: [
        "How do our brains wake up in the morning?",
        "Why is the sky blue?",
        "What makes rainbows appear?",
        "How do birds know which way to fly?"
      ],
      afternoon: [
        "How do volcanoes work?",
        "What are the coolest dinosaurs ever discovered?",
        "How do computers think?",
        "What's inside a black hole?"
      ],
      evening: [
        "Why can we see the stars at night?",
        "How do dreams work?",
        "What animals can see in the dark?",
        "How do fireflies make light?"
      ]
    };

    // Return time-appropriate suggestions
    if (hour < 12) return defaultSuggestions.morning;
    if (hour < 18) return defaultSuggestions.afternoon;
    return defaultSuggestions.evening;
  };

  useEffect(() => {
    // Set initial default suggestions based on time of day
    setCurioSuggestions(getDefaultSuggestions());
    
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
      // First quickly set some default suggestions based on time of day
      // this helps with perceived performance since the real API call might take time
      setCurioSuggestions(getDefaultSuggestions());
      
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
      // If API fails, generate smart fallback suggestions
      generateFallbackSuggestions(profile, curios);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Generate smart fallback suggestions based on profile and past curios
  const generateFallbackSuggestions = (profile: any, curios: any[]) => {
    const interests = profile?.interests || [];
    const age = profile?.age || 10;
    
    // Age-appropriate suggestion templates
    const suggestionsByAge = {
      young: [
        "Why is the sky blue?",
        "How do butterflies fly?",
        "Why do we need to sleep?",
        "How do plants grow?"
      ],
      middle: [
        "How do volcanos work?",
        "What are black holes?",
        "How do computers work?",
        "Why do some animals hibernate?"
      ],
      older: [
        "How does the internet work?",
        "What causes climate change?",
        "How do rockets fly to space?",
        "How does the human brain work?"
      ]
    };
    
    // Get age-appropriate suggestions
    let ageSuggestions = suggestionsByAge.middle;
    if (age <= 7) {
      ageSuggestions = suggestionsByAge.young;
    } else if (age >= 12) {
      ageSuggestions = suggestionsByAge.older;
    }
    
    // Get interest-based suggestions
    const interestSuggestions: string[] = [];
    
    if (interests.includes('space')) {
      interestSuggestions.push("What is the biggest planet?");
      interestSuggestions.push("How many stars are in the universe?");
    }
    
    if (interests.includes('animals')) {
      interestSuggestions.push("What's the fastest animal on Earth?");
      interestSuggestions.push("How do chameleons change color?");
    }
    
    if (interests.includes('science')) {
      interestSuggestions.push("How do magnets work?");
      interestSuggestions.push("What are atoms made of?");
    }
    
    if (interests.includes('history')) {
      interestSuggestions.push("Who built the pyramids?");
      interestSuggestions.push("What was life like for dinosaurs?");
    }
    
    // Combine and randomize suggestions
    const allSuggestions = [...ageSuggestions, ...interestSuggestions];
    
    // Shuffle array using Fisher-Yates algorithm
    for (let i = allSuggestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSuggestions[i], allSuggestions[j]] = [allSuggestions[j], allSuggestions[i]];
    }
    
    // Return a subset of suggestions
    setCurioSuggestions(allSuggestions.slice(0, 6));
  };

  const handleRefreshSuggestions = () => {
    if (childProfile && pastCurios) {
      // Show toast to indicate refreshing
      toast.info("Finding new wonders for you...");
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
