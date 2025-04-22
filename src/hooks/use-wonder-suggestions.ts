
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
      
      if (error) {
        console.error('Error invoking groq-wonder-suggestions:', error);
        throw new Error(error.message);
      }
      
      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      } else if (data && data.fallback) {
        console.log('Using fallback suggestions from API');
        setSuggestions(data.suggestions || getFallbackSuggestions());
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching wonder suggestions:', err);
      setError(err as Error);
      
      // Use fallback suggestions
      const fallbacks = getFallbackSuggestions();
      setSuggestions(fallbacks);
      
      // Only show toast for actual errors, not when using fallbacks by design
      if (!(err as Error).message.includes('fallback')) {
        toast.error('Could not load wonder suggestions. Using defaults.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackSuggestions = () => {
    // Age-appropriate fallback suggestions
    if (childAge < 8) {
      return [
        "Why do leaves change color in autumn?",
        "How do bees make honey?",
        "What makes rainbows appear in the sky?",
        "Why do we see lightning before we hear thunder?",
        "How do plants grow from tiny seeds?",
        "Why do we need to sleep every night?"
      ];
    } else if (childAge < 13) {
      return [
        "Why do leaves change color in autumn?",
        "How do bees make honey?",
        "What makes the ocean salty?",
        "Why do we see lightning before we hear thunder?",
        "How do airplanes stay in the sky?",
        "What happens when volcanoes erupt?"
      ];
    } else {
      return [
        "How do black holes work?",
        "What causes the northern lights?",
        "How do computers think and learn?",
        "How does the human brain form memories?",
        "What causes climate change?",
        "How did ancient civilizations build massive structures without modern technology?"
      ];
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
