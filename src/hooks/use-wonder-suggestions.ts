
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseWonderSuggestionsProps {
  childId?: string;
  childAge?: number;
  childInterests?: string[];
  count?: number;
  retryCount?: number; // Added retryCount to force refresh
}

export const useWonderSuggestions = ({
  childId,
  childAge = 10,
  childInterests = [],
  count = 6,
  retryCount = 0
}: UseWonderSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [source, setSource] = useState<string>('loading');
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  
  // Cache key based on child properties and retry count
  const cacheKey = `wonder-suggestions-${childId}-${childAge}-${childInterests.join(',')}-${retryCount}`;

  const fetchSuggestions = useCallback(async () => {
    if (!childId) return;
    
    // Implement a minimum fetch interval to prevent spamming the API
    const now = Date.now();
    const minFetchInterval = 2000; // 2 seconds
    if (now - lastFetchTime < minFetchInterval && lastFetchTime > 0 && suggestions.length > 0) {
      console.log('Throttling wonder suggestion fetches');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setLastFetchTime(now);
    
    try {
      console.log(`Fetching wonder suggestions for child age ${childAge} with interests: ${childInterests.join(', ')}`);
      
      // Add a timeout to the fetch to prevent hanging requests
      const fetchPromise = supabase.functions.invoke('groq-wonder-suggestions', {
        body: {
          childAge,
          interests: childInterests,
          count
        }
      });
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out after 15 seconds'));
        }, 15000);
      });
      
      // Race the fetch against the timeout
      const result = await Promise.race([fetchPromise, timeoutPromise]) as {
        data?: {
          suggestions: string[];
          source: string;
        };
        error?: {
          message: string;
        };
      };
      
      const { data, error } = result;
      
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
      
      // Use local fallback suggestions when everything else fails
      const fallbacks = getFallbackSuggestions(childAge, childInterests);
      setSuggestions(fallbacks);
      setSource('client-fallback');
      
      // Only show toast for network errors, not for expected fallbacks
      if ((err as Error).message.includes('network') || 
          (err as Error).message.includes('fetch') ||
          (err as Error).message.includes('timeout')) {
        toast.error("Couldn't connect to wonder generator. Using local suggestions instead.", {
          id: "wonder-fetch-error",
          duration: 3000
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [childId, childAge, childInterests, count, lastFetchTime, suggestions.length, retryCount]);

  const getFallbackSuggestions = (age: number, interests: string[] = []): string[] => {
    // Enhanced fallback suggestions with more variety and based on interests if available
    const interestBasedSuggestions: Record<string, string[]> = {
      science: [
        "How do scientists discover new elements?",
        "Why do chemical reactions sometimes create heat?",
        "What makes some materials conduct electricity?",
        "How do scientists measure things too small to see?"
      ],
      nature: [
        "How do trees communicate with each other?",
        "Why do some animals hibernate in winter?",
        "What causes the different phases of the moon?",
        "How do bees know where to find flowers?"
      ],
      space: [
        "What would happen if you fell into a black hole?",
        "How do astronauts sleep in space?",
        "Why does Mars look red from Earth?",
        "How do scientists find new planets around other stars?"
      ],
      history: [
        "How did ancient people build the pyramids?",
        "What games did children play 1000 years ago?",
        "How did people communicate before phones existed?",
        "What ancient civilizations existed that we know very little about?"
      ],
      art: [
        "How do artists mix colors to create new ones?",
        "Why do some paintings become so famous?",
        "What makes music sound happy or sad?",
        "How do animators make characters move so smoothly?"
      ],
      technology: [
        "How do computers understand our commands?",
        "What happens inside a robot when it moves?",
        "How do touchscreens know where our fingers are?",
        "What makes some internet connections faster than others?"
      ]
    };
    
    // Start with age-appropriate general suggestions
    let fallbacks: string[] = [];
    
    // Add age-appropriate general questions
    if (age < 8) {
      fallbacks = [
        "Why do leaves change color in autumn?",
        "How do bees make honey?",
        "What makes rainbows appear in the sky?",
        "Why do we see lightning before we hear thunder?",
        "How do plants grow from tiny seeds?",
        "Why do we need to sleep every night?"
      ];
    } else if (age < 13) {
      fallbacks = [
        "How do earthquakes happen?",
        "What makes the ocean salty?",
        "How do airplanes stay in the sky?",
        "What happens when volcanoes erupt?",
        "How do our eyes see colors?",
        "Why do we have different seasons?"
      ];
    } else {
      fallbacks = [
        "How do black holes work?",
        "What causes the northern lights?",
        "How do computers think and learn?",
        "How does the human brain form memories?",
        "What causes climate change?",
        "How did ancient civilizations build massive structures without modern technology?"
      ];
    }
    
    // If child has interests, replace some general questions with interest-specific ones
    const validInterests = interests.filter(interest => interestBasedSuggestions[interest]);
    if (validInterests.length > 0) {
      let replacementCount = Math.min(3, validInterests.length * 2); // Replace up to 3 questions
      
      for (let i = 0; i < replacementCount; i++) {
        const interestIndex = i % validInterests.length;
        const interest = validInterests[interestIndex];
        const interestSuggestions = interestBasedSuggestions[interest];
        
        if (interestSuggestions && interestSuggestions.length > 0) {
          const suggestionIndex = Math.floor(Math.random() * interestSuggestions.length);
          fallbacks[i] = interestSuggestions[suggestionIndex];
        }
      }
    }
    
    return fallbacks;
  };

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    isLoading,
    error,
    source,
    refresh: fetchSuggestions,
    lastFetchTime
  };
};
