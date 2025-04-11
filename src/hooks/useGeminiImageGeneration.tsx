
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
  const [fallbackSource, setFallbackSource] = useState<string | null>(null);

  const generateImage = useCallback(async (prompt: string, style?: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    setFallbackSource(null);
    
    try {
      const adaptedPrompt = adaptPromptForChildAge(prompt, childAge);
      const imageStyle = style || getDefaultStyleForAge(childAge);
      
      console.log(`Calling generate-gemini-image with prompt: "${adaptedPrompt}" and style: ${imageStyle}`);
      
      const { data, error } = await supabase.functions.invoke('generate-gemini-image', {
        body: { 
          prompt: adaptedPrompt,
          style: imageStyle
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }
      
      if (!data) {
        console.error('No data returned from image generation function');
        throw new Error('No data returned from image generation');
      }
      
      console.log('Image generation response:', data);
      
      if (data.success && data.imageUrl) {
        console.log('Setting image URL from response');
        setImageUrl(data.imageUrl);
        
        if (data.fallback) {
          setFallbackSource(data.fallbackSource || 'unknown');
          
          if (data.fallbackSource === 'dalle') {
            toast.info("Using DALL-E image generation", {
              duration: 3000,
              position: "bottom-right"
            });
          } else if (data.fallbackSource === 'unsplash') {
            toast.info("Using a reference image - AI image generation unavailable", {
              duration: 3000,
              position: "bottom-right"
            });
          }
        } else if (data.source === 'gemini') {
          setFallbackSource('gemini');
        }
        
        return data.imageUrl;
      } else {
        console.error('No image URL or unsuccessful generation:', data);
        throw new Error(data.error || 'No image URL returned');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setGenerationError(err instanceof Error ? err.message : 'Unknown error generating image');
      
      const fallbackUrl = getFallbackImage(prompt);
      setImageUrl(fallbackUrl);
      setFallbackSource('unsplash');
      
      toast.error("Couldn't generate a custom image", {
        description: "Using a reference image instead",
        duration: 3000
      });
      
      return fallbackUrl;
    } finally {
      setIsGenerating(false);
    }
  }, [childAge]);

  const adaptPromptForChildAge = (prompt: string, age: number): string => {
    let adaptedPrompt = prompt;
    
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

  const getFallbackImage = (topic: string): string => {
    const fallbackImages = {
      ocean: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop',
      volcano: 'https://images.unsplash.com/photo-1562117532-14a6c72858c9?q=80&w=1000&auto=format&fit=crop',
      space: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop',
      dinosaur: 'https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1000&auto=format&fit=crop',
      robot: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop',
      animal: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1000&auto=format&fit=crop',
      plant: 'https://images.unsplash.com/photo-1502331538081-041522531548?q=80&w=1000&auto=format&fit=crop',
      earth: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop',
      brain: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop',
      light: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000&auto=format&fit=crop',
      science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop',
      morning: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000&auto=format&fit=crop',
      night: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1000&auto=format&fit=crop',
      firefly: 'https://images.unsplash.com/photo-1562155955-1cb2d73488d7?q=80&w=1000&auto=format&fit=crop',
      sleep: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?q=80&w=1000&auto=format&fit=crop',
      sleepy: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?q=80&w=1000&auto=format&fit=crop',
      water: 'https://images.unsplash.com/photo-1586856822992-40c6c266f044?q=80&w=1000&auto=format&fit=crop',
      music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop',
      history: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1000&auto=format&fit=crop',
      art: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
      math: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
      coding: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
      stars: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop',
      planets: 'https://images.unsplash.com/photo-1614314169000-4ef4aebc2573?q=80&w=1000&auto=format&fit=crop',
    };
    
    const topicLower = topic.toLowerCase();
    const relevantTopic = Object.keys(fallbackImages).find(key => 
      topicLower.includes(key)
    );
    
    const image = relevantTopic ? fallbackImages[relevantTopic as keyof typeof fallbackImages] : fallbackImages.science;
    return image;
  };

  return {
    generateImage,
    isGenerating,
    imageUrl,
    generationError,
    fallbackSource,
    resetImage: () => {
      setImageUrl(null);
      setGenerationError(null);
      setFallbackSource(null);
    }
  };
}
