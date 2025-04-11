
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
      
      if (!data.success) {
        throw new Error(data.error || 'Image generation failed');
      }
      
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
      
      toast.error("Couldn't generate image", {
        description: "Image generation failed. Please try again later.",
        duration: 3000
      });
      
      return null;
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
