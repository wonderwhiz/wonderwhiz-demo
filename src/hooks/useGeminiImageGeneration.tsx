
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseGeminiImageGenerationProps {
  childAge?: number;
  maxRetries?: number;
}

export function useGeminiImageGeneration({ childAge = 10, maxRetries = 3 }: UseGeminiImageGenerationProps = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [fallbackSource, setFallbackSource] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const generateImage = useCallback(async (prompt: string, style?: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    setFallbackSource(null);
    
    try {
      const adaptedPrompt = adaptPromptForChildAge(prompt, childAge);
      const imageStyle = style || getDefaultStyleForAge(childAge);
      
      console.log(`Calling OpenAI image generation with prompt: "${adaptedPrompt}" and style: ${imageStyle}`);
      
      // Primary method - OpenAI via edge function
      const { data, error } = await supabase.functions.invoke('generate-openai-image', {
        body: { 
          prompt: adaptedPrompt,
          style: imageStyle === 'cartoon' ? 'vivid' : 'natural',
          childAge: childAge
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to call image generation service');
      }
      
      console.log('Image generation response:', data);
      
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        setFallbackSource(data.source || 'openai');
        
        if (data.source === 'openai') {
          toast.success("Image created successfully", {
            duration: 3000,
            position: "bottom-right"
          });
        } else if (data.source.includes('fallback')) {
          toast.info("Using alternative image source", {
            duration: 3000,
            position: "bottom-right"
          });
        }
        
        return data.imageUrl;
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No image URL returned');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setGenerationError(err instanceof Error ? err.message : 'Unknown error generating image');
      
      // Get a fallback image based on topic
      const fallbackUrl = getFallbackImage(prompt);
      setImageUrl(fallbackUrl);
      setFallbackSource('error-fallback');
      
      toast.error("Using alternative image", {
        description: "Could not generate custom image. Using a stock photo instead.",
        duration: 3000
      });
      
      return fallbackUrl;
    } finally {
      setIsGenerating(false);
      // Reset retry count after complete attempt (success or final failure)
      if (retryCount > 0) {
        setRetryCount(0);
      }
    }
  }, [childAge, retryCount]);

  const adaptPromptForChildAge = (prompt: string, age: number): string => {
    let adaptedPrompt = prompt;
    
    // Adapt prompt based on child's age
    if (age < 8) {
      adaptedPrompt += ', kid-friendly, colorful, cartoonish, simple shapes, cheerful, educational illustration, cute characters';
    } else if (age < 12) {
      adaptedPrompt += ', educational, vibrant colors, stylized, age-appropriate, learning material, engaging illustration';
    } else {
      adaptedPrompt += ', educational, detailed, engaging, teenage-appropriate illustration, modern style';
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

  // Fallback images by topic
  const getFallbackImage = (topic: string): string => {
    const topicLower = topic.toLowerCase();
    
    // Educational stock images by topic
    const fallbackImages = {
      space: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1024&auto=format&fit=crop",
      planet: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1024&auto=format&fit=crop",
      galaxy: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1024&auto=format&fit=crop",
      ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1024&auto=format&fit=crop",
      sea: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1024&auto=format&fit=crop",
      animal: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1024&auto=format&fit=crop",
      dinosaur: "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1024&auto=format&fit=crop",
      robot: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1024&auto=format&fit=crop",
      technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1024&auto=format&fit=crop",
      plant: "https://images.unsplash.com/photo-1502331538081-041522531548?q=80&w=1024&auto=format&fit=crop",
      volcano: "https://images.unsplash.com/photo-1554232682-b9ef9c92f8de?q=80&w=1024&auto=format&fit=crop",
      mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1024&auto=format&fit=crop",
      history: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1024&auto=format&fit=crop",
      art: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1024&auto=format&fit=crop",
      music: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1024&auto=format&fit=crop",
      science: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1024&auto=format&fit=crop"
    };
    
    // Find a matching topic
    for (const [key, url] of Object.entries(fallbackImages)) {
      if (topicLower.includes(key)) {
        return url;
      }
    }
    
    // Default generic educational image
    return "https://images.unsplash.com/photo-1492539161849-b2b8f6a5fd00?q=80&w=1024&auto=format&fit=crop";
  };

  return {
    generateImage,
    isGenerating,
    imageUrl,
    setImageUrl,
    generationError,
    fallbackSource,
    setFallbackSource,
    resetImage: () => {
      setImageUrl(null);
      setGenerationError(null);
      setFallbackSource(null);
      setRetryCount(0);
    }
  };
}
