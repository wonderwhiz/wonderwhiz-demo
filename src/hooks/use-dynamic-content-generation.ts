
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DynamicContentOptions {
  query: string;
  childAge?: number;
  blockCount?: number;
  specialistTypes?: string[];
}

export function useDynamicContentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedBlocks, setGeneratedBlocks] = useState<any[]>([]);

  const generateContent = useCallback(async (options: DynamicContentOptions): Promise<any[]> => {
    const { query, childAge = 10, blockCount = 5, specialistTypes = ['nova', 'spark', 'prism'] } = options;
    
    if (!query) {
      setError('A query is required to generate content');
      return [];
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log(`Generating ${blockCount} blocks for query: ${query}, age: ${childAge}`);
      
      // Call Supabase function to generate content blocks
      const { data, error } = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: {
          query,
          childProfile: {
            age: childAge,
            interests: ['science', 'technology', 'creativity', 'nature'],
            language: 'English'
          },
          blockCount: blockCount,
          specialistTypes: specialistTypes,
          quickGeneration: true
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Error generating content blocks');
      }
      
      if (!data || !Array.isArray(data)) {
        // If no data returned, use fallback content
        const fallbackContent = generateFallbackContent(query, blockCount, specialistTypes);
        setGeneratedBlocks(fallbackContent);
        return fallbackContent;
      }
      
      setGeneratedBlocks(data);
      return data;
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content');
      
      // Generate fallback content
      const fallbackContent = generateFallbackContent(query, blockCount, specialistTypes);
      setGeneratedBlocks(fallbackContent);
      return fallbackContent;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Generate fallback content in case API fails
  const generateFallbackContent = (query: string, blockCount: number, specialistTypes: string[]) => {
    // Simplify the query to use in templates
    const simplifiedQuery = query.toLowerCase().replace(/[?.,!]/g, '').trim();
    
    // Create blocks based on templates
    const blocks: any[] = [];
    
    // Add a fact block
    blocks.push({
      type: 'fact',
      specialist_id: specialistTypes[0] || 'nova',
      content: {
        fact: `${simplifiedQuery} is fascinating because it connects to many areas of knowledge. Scientists are constantly discovering new aspects about this topic!`,
        title: `Fascinating Discovery`,
        rabbitHoles: [
          `Why is ${simplifiedQuery} important?`,
          `How does ${simplifiedQuery} work?`
        ]
      },
      liked: false,
      bookmarked: false
    });
    
    // Add a fun fact
    blocks.push({
      type: 'funFact',
      specialist_id: specialistTypes[1] || 'spark',
      content: {
        text: `Did you know? ${simplifiedQuery} has connections to creativity and imagination that might surprise you!`,
        rabbitHoles: [
          `${simplifiedQuery} in art`,
          `Creative uses of ${simplifiedQuery}`
        ]
      },
      liked: false,
      bookmarked: false
    });
    
    // Add a quiz
    blocks.push({
      type: 'quiz',
      specialist_id: specialistTypes[0] || 'prism',
      content: {
        question: `What's one thing that makes ${simplifiedQuery} so interesting to explore?`,
        options: [
          `It connects to many everyday experiences`,
          `Scientists are still making discoveries about it`,
          `It helps us understand the world better`,
          `All of the above`
        ],
        correctIndex: 3,
        explanation: `${simplifiedQuery} is fascinating for all these reasons! It connects to our daily lives, continues to be researched, and helps us make sense of the world around us.`
      },
      liked: false,
      bookmarked: false
    });
    
    // Add more blocks if needed
    if (blockCount > 3) {
      // Add a creative block
      blocks.push({
        type: 'creative',
        specialist_id: specialistTypes[1] || 'spark',
        content: {
          prompt: `Draw or describe how you imagine ${simplifiedQuery} might look or work!`,
          description: `Use your imagination to explore ${simplifiedQuery} in a creative way. There are no wrong answers!`,
          examples: [`You could draw a picture`, `Write a short story`, `Create a diagram`]
        },
        liked: false,
        bookmarked: false
      });
    }
    
    if (blockCount > 4) {
      // Add a mindfulness block
      blocks.push({
        type: 'mindfulness',
        specialist_id: 'lotus',
        content: {
          title: `Reflect on ${simplifiedQuery}`,
          instruction: `Take a moment to think about how ${simplifiedQuery} might connect to your own experiences. What does it remind you of?`,
          duration: "2 minutes"
        },
        liked: false,
        bookmarked: false
      });
    }
    
    return blocks;
  };

  // Generate related questions for a topic
  const generateRelatedQuestions = useCallback(async (topic: string, count: number = 4): Promise<string[]> => {
    if (!topic) return [];
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-curio-suggestions', {
        body: { 
          topic,
          count
        }
      });
      
      if (error) throw error;
      
      if (data && Array.isArray(data.suggestions)) {
        return data.suggestions.map(suggestion => suggestion.question);
      }
      
      return generateFallbackQuestions(topic, count);
    } catch (err) {
      console.error('Error generating related questions:', err);
      return generateFallbackQuestions(topic, count);
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  // Generate fallback questions if API fails
  const generateFallbackQuestions = (topic: string, count: number): string[] => {
    const simpleTopic = topic.toLowerCase().replace(/[?.,!]/g, '').trim();
    
    const templates = [
      `What's the most surprising fact about ${simpleTopic}?`,
      `Why is ${simpleTopic} important to understand?`,
      `How does ${simpleTopic} connect to other subjects?`,
      `What might be the future of ${simpleTopic}?`,
      `How has ${simpleTopic} changed over time?`,
      `What are real-world examples of ${simpleTopic}?`,
      `How can learning about ${simpleTopic} help us?`,
      `What would happen if ${simpleTopic} didn't exist?`
    ];
    
    // Shuffle and take requested count
    return templates
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  };

  return {
    generateContent,
    generateRelatedQuestions,
    isGenerating,
    error,
    generatedBlocks
  };
}
