
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  sparks_balance: number;
}

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

export const useCurioCreation = (
  profileId?: string,
  childProfile?: ChildProfile | null,
  setPastCurios?: (curios: any) => void,
  setChildProfile?: (profile: any) => void,
  setCurrentCurio?: (curio: Curio | null) => void
) => {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmitQuery = useCallback(async () => {
    if (!query.trim() || !profileId) return;

    setIsGenerating(true);
    
    try {
      // Create a new curio
      const newCurio: Curio = {
        id: `curio-${Date.now()}`,
        title: query.charAt(0).toUpperCase() + query.slice(1),
        query: query,
        created_at: new Date().toISOString()
      };

      // Add to past curios if setPastCurios is available
      if (setPastCurios) {
        setPastCurios((prev: Curio[]) => [newCurio, ...prev]);
      }

      // Set as current curio if setCurrentCurio is available
      if (setCurrentCurio) {
        setCurrentCurio(newCurio);
      }

      // Award sparks for asking a question
      if (setChildProfile && childProfile) {
        setChildProfile({
          ...childProfile,
          sparks_balance: childProfile.sparks_balance + 5
        });
      }

      setQuery('');
      
      toast.success("Great question! Let's explore this together! ✨", {
        position: 'top-center',
        duration: 3000,
      });

    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error("Something went wrong. Please try again!");
    } finally {
      setIsGenerating(false);
    }
  }, [query, profileId, setPastCurios, setCurrentCurio, setChildProfile, childProfile]);

  const handleFollowRabbitHole = useCallback(async (newQuery: string) => {
    if (!newQuery.trim() || !profileId) return;

    setQuery(newQuery);
    
    // Automatically submit the new query
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
  }, [profileId, handleSubmitQuery]);

  const handleCurioSuggestionClick = useCallback(async (suggestion: string) => {
    setQuery(suggestion);
    
    // Automatically submit the suggestion
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
  }, [handleSubmitQuery]);

  return {
    query,
    setQuery,
    isGenerating,
    handleSubmitQuery,
    handleFollowRabbitHole,
    handleCurioSuggestionClick
  };
};
