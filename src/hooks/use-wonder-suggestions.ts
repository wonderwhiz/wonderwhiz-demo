
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
  const [source, setSource] = useState<string>('loading');

  const fetchSuggestions = async () => {
    if (!childId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching wonder suggestions for child age ${childAge} with interests: ${childInterests.join(', ')}`);
      
      const { data, error } = await supabase.functions.invoke('groq-wonder-suggestions', {
        body: {
          childAge,
          interests: childInterests,
          count
        }
      });
      
      if (error) {
        console.error('Error invoking groq-wonder-suggestions:', error);
        throw new Error(error.message);
      }
      
      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setSource(data.source || 'api');
        
        if (data.source === 'fallback' || data.source === 'error-fallback') {
          console.log('Using fallback suggestions, API failed or not available');
        }
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching wonder suggestions:', err);
      setError(err as Error);
      
      // Use fallback suggestions
      const fallbacks = getFallbackSuggestions(childAge);
      setSuggestions(fallbacks);
      setSource('client-fallback');
      
      // Only show toast for actual errors, not when using fallbacks by design
      if (!(err as Error).message.includes('fallback')) {
        // Silent failure to avoid interrupting user experience
        console.warn('Using fallback wonder suggestions due to API error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackSuggestions = (age: number): string[] => {
    // Age-appropriate fallback suggestions
    if (age < 8) {
      return [
        "Why do leaves change color in autumn?",
        "How do bees make honey?",
        "What makes rainbows appear in the sky?",
        "Why do we see lightning before we hear thunder?",
        "How do plants grow from tiny seeds?",
        "Why do we need to sleep every night?"
      ];
    } else if (age < 13) {
      return [
        "How do earthquakes happen?",
        "What makes the ocean salty?",
        "How do airplanes stay in the sky?",
        "What happens when volcanoes erupt?",
        "How do our eyes see colors?",
        "Why do we have different seasons?"
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
    source,
    refresh: fetchSuggestions
  };
};
