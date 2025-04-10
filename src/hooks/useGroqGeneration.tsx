
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GenerationOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  childAge?: number;
}

export function useGroqGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuickAnswer = async (query: string, childAge: number = 10): Promise<string> => {
    if (!query) return '';
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-quick-answer', {
        body: { 
          query,
          childAge
        }
      });
      
      if (error) throw new Error(error.message);
      
      return data?.answer || `Here's a quick answer about "${query}". This would typically be generated using the Groq API.`;
    } catch (err) {
      console.error('Error generating quick answer:', err);
      setError('Failed to generate quick answer');
      toast.error('Could not generate quick answer');
      return `Here's what we know about "${query}". Let's explore this fascinating topic together!`;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContextualImage = async (topic: string, childAge: number = 10): Promise<string> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-contextual-image', {
        body: { 
          topic,
          style: "Pixar-style educational illustration",
          childAge
        }
      });
      
      if (error) throw new Error(error.message);
      
      return data?.imageUrl || '';
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image');
      toast.error('Could not generate image');
      return '';
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateQuickAnswer,
    generateContextualImage,
    isGenerating,
    error
  };
}
