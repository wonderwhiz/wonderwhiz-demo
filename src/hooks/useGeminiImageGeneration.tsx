
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseGeminiImageGenerationProps {
  childAge?: number;
}

export function useGeminiImageGeneration({ childAge = 10 }: UseGeminiImageGenerationProps = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const generateImage = useCallback(async (prompt: string, style?: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      const adaptedPrompt = adaptPromptForChildAge(prompt, childAge);
      const imageStyle = style || getDefaultStyleForAge(childAge);
      
      const { data, error } = await supabase.functions.invoke('generate-gemini-image', {
        body: { 
          prompt: adaptedPrompt,
          style: imageStyle
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        return data.imageUrl;
      } else {
        throw new Error('No image URL returned');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setGenerationError(err instanceof Error ? err.message : 'Unknown error generating image');
      
      // Return fallback image based on topic
      return getFallbackImage(prompt);
    } finally {
      setIsGenerating(false);
    }
  }, [childAge]);

  const adaptPromptForChildAge = (prompt: string, age: number): string => {
    let adaptedPrompt = prompt;
    
    if (age < 8) {
      adaptedPrompt += ', kid-friendly, colorful, cartoonish, simple shapes, cheerful, educational illustration';
    } else if (age < 12) {
      adaptedPrompt += ', educational, vibrant colors, stylized, age-appropriate, learning material';
    } else {
      adaptedPrompt += ', educational, detailed, engaging, teenage-appropriate illustration';
    }
    
    return adaptedPrompt;
  };

  const getDefaultStyleForAge = (age: number): string => {
    if (age < 8) {
      return 'cartoon';
    } else if (age < 12) {
      return 'colorful illustration';
    } else {
      return 'detailed illustration';
    }
  };

  const getFallbackImage = (topic: string): string => {
    const fallbackImages = {
      ocean: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop',
      volcano: 'https://images.unsplash.com/photo-1562117532-14a6c72858c9?q=80&w=1000&auto=format&fit=crop',
      space: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop',
      dinosaur: 'https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1000&auto=format&fit=crop',
      robot: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop',
      animal: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1000&auto=format&fit=crop',
      plant: 'https://images.unsplash.com/photo-1502331538081-041522531548?q=80&w=1000&auto=format&fit=crop',
      earth: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop'
    };
    
    const topicLower = topic.toLowerCase();
    const relevantTopic = Object.keys(fallbackImages).find(key => 
      topicLower.includes(key)
    );
    
    return relevantTopic ? fallbackImages[relevantTopic as keyof typeof fallbackImages] : fallbackImages.earth;
  };

  return {
    generateImage,
    isGenerating,
    imageUrl,
    generationError,
    resetImage: () => setImageUrl(null)
  };
}
