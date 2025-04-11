
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
  const [retryCount, setRetryCount] = useState(0);

  const generateImage = useCallback(async (prompt: string, style?: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    setFallbackSource(null);
    
    try {
      const adaptedPrompt = adaptPromptForChildAge(prompt, childAge);
      const imageStyle = style || getDefaultStyleForAge(childAge);
      
      console.log(`Calling generate-gemini-image with prompt: "${adaptedPrompt}" and style: ${imageStyle}`);
      
      // Try with the dedicated edge function first
      const { data, error } = await supabase.functions.invoke('generate-gemini-image', {
        body: { 
          prompt: adaptedPrompt,
          style: imageStyle,
          childAge: childAge,
          retryOnFail: true
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }
      
      if (!data) {
        console.error('No data returned from image generation function');
        
        // If first function failed, try the contextual image function as backup
        if (retryCount === 0) {
          setRetryCount(prev => prev + 1);
          console.log('Trying alternate image generation endpoint...');
          
          const contextualResponse = await supabase.functions.invoke('generate-contextual-image', {
            body: { 
              topic: adaptedPrompt,
              style: imageStyle,
              childAge: childAge
            }
          });
          
          if (contextualResponse.error || !contextualResponse.data) {
            throw new Error(contextualResponse.error?.message || 'Both image generation functions failed');
          }
          
          const contextualData = contextualResponse.data;
          
          if (contextualData.imageUrl) {
            setImageUrl(contextualData.imageUrl);
            setFallbackSource(contextualData.source || 'alternate');
            return contextualData.imageUrl;
          } else {
            throw new Error('No image URL returned from either function');
          }
        } else {
          throw new Error('Image generation failed on multiple attempts');
        }
      }
      
      console.log('Image generation response:', data);
      
      if (data.success && data.imageUrl) {
        console.log('Setting image URL from response:', data.imageUrl.substring(0, 50) + '...');
        setImageUrl(data.imageUrl);
        
        if (data.fallback) {
          setFallbackSource(data.fallbackSource || 'fallback');
          
          if (data.fallbackSource === 'dalle') {
            toast.info("Using DALL-E image generation", {
              duration: 3000,
              position: "bottom-right"
            });
          }
        } else if (data.source === 'gemini') {
          setFallbackSource('gemini');
          toast.success("Image created with Gemini AI", {
            duration: 3000,
            position: "bottom-right"
          });
        }
        
        return data.imageUrl;
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        console.error('No image URL or unsuccessful generation:', data);
        throw new Error('No image URL returned');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setGenerationError(err instanceof Error ? err.message : 'Unknown error generating image');
      
      // Only show toast for final error (not during retry attempts)
      if (retryCount > 0) {
        toast.error("Couldn't generate image", {
          description: "Image generation failed. Please try again later.",
          duration: 3000
        });
      }
      
      return null;
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
      setRetryCount(0);
    }
  };
}
