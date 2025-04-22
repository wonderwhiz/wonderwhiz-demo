
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseWonderSuggestionsProps {
  childId?: string;
  childAge?: number;
  childInterests?: string[];
  count?: number;
}

export const useWonderSuggestions = ({
  childId,
  childAge = 10,
  childInterests = [],
  count = 6
}: UseWonderSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSuggestions = async () => {
    if (!childId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('groq-wonder-suggestions', {
        body: JSON.stringify({
          childAge,
          interests: childInterests,
          count
        })
      });
      
      if (error) throw new Error(error.message);
      
      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching wonder suggestions:', err);
      setError(err as Error);
      toast.error('Could not load wonder suggestions. Using defaults.');
      
      // Fallback suggestions
      setSuggestions([
        "Why do leaves change color in autumn?",
        "How do bees make honey?",
        "What makes the ocean salty?",
        "Why do we see lightning before we hear thunder?",
        "How do airplanes stay in the sky?",
        "What happens when volcanoes erupt?"
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [childId, childAge, JSON.stringify(childInterests)]);

  return {
    suggestions,
    isLoading,
    error,
    refresh: fetchSuggestions
  };
};
