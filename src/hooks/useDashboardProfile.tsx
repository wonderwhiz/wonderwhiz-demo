
import { useState, useEffect } from 'react';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar_url: string;
  sparks_balance: number;
  pin: string;
  interests?: string[];
  grade?: string;
}

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

export const useDashboardProfile = (profileId?: string) => {
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pastCurios, setPastCurios] = useState<Curio[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [curioSuggestions, setCurioSuggestions] = useState<string[]>([
    "How do butterflies change colors?",
    "Why do we dream when we sleep?",
    "How do robots learn to walk?",
    "What makes the ocean blue?",
    "How do plants eat sunlight?"
  ]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) {
        setIsLoading(false);
        return;
      }

      try {
        // Mock profile data - in real implementation, this would come from Supabase
        const mockProfile: ChildProfile = {
          id: profileId,
          name: profileId === 'demo-1' ? 'Emma' : 'Alex',
          age: profileId === 'demo-1' ? 8 : 10,
          avatar_url: profileId === 'demo-1' ? 'nova' : 'spark',
          sparks_balance: profileId === 'demo-1' ? 150 : 89,
          pin: profileId === 'demo-1' ? '1234' : '5678',
          interests: ['science', 'nature', 'space'],
          grade: profileId === 'demo-1' ? '3rd Grade' : '5th Grade'
        };

        // Mock past curios
        const mockCurios: Curio[] = [
          {
            id: 'curio-1',
            title: 'How Do Birds Fly?',
            query: 'How do birds fly in the sky?',
            created_at: new Date().toISOString()
          },
          {
            id: 'curio-2',
            title: 'Why Is The Sky Blue?',
            query: 'Why is the sky blue during the day?',
            created_at: new Date().toISOString()
          }
        ];

        setChildProfile(mockProfile);
        setPastCurios(mockCurios);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [profileId]);

  const handleRefreshSuggestions = async () => {
    setIsLoadingSuggestions(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSuggestions = [
        "How do volcanoes make new islands?",
        "Why do cats always land on their feet?",
        "How do computers remember things?",
        "What makes rainbows appear?",
        "How do fish breathe underwater?"
      ];
      
      setCurioSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error refreshing suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
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
