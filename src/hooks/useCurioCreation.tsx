
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

    // Validate that profileId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(profileId)) {
      toast.error("Invalid profile ID. Please check your profile setup.");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create a new curio in the database
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          title: query.charAt(0).toUpperCase() + query.slice(1),
          query: query,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error creating curio:', error);
        toast.error("Failed to create learning session. Please try again.");
        return;
      }

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
        try {
          const { data, error: sparksError } = await supabase
            .from('child_profiles')
            .update({ 
              sparks_balance: (childProfile.sparks_balance || 0) + 5 
            })
            .eq('id', profileId)
            .select('sparks_balance')
            .single();

          if (!sparksError && data) {
            setChildProfile({
              ...childProfile,
              sparks_balance: data.sparks_balance
            });
          }
        } catch (sparksError) {
          console.error('Error updating sparks:', sparksError);
        }
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
