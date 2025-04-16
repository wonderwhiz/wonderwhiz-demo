
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
      
      // First try OpenAI via edge function (DALL-E 3)
      try {
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
          setFallbackSource('openai');
          
          toast.success("Image created with DALL-E 3", {
            duration: 3000,
            position: "bottom-right"
          });
          
          return data.imageUrl;
        } else if (data?.error) {
          throw new Error(data.error);
        } else {
          throw new Error('No image URL returned');
        }
      } catch (primaryError) {
        // If primary method fails, try the alternate method
        console.log('Primary image generation failed, trying alternate method:', primaryError);
        
        // Try the alternate method - contextual-image function
        try {
          // Only proceed with alternate if retry count is less than max
          if (retryCount < 2) {
            setRetryCount(retryCount + 1);
            
            const { data: contextualData, error: contextualError } = await supabase.functions.invoke('generate-contextual-image', {
              body: { 
                topic: adaptedPrompt,
                style: imageStyle,
                childAge: childAge
              }
            });
            
            if (contextualError) {
              console.error('Alternate function error:', contextualError);
              throw new Error(contextualError.message || 'Failed to call alternate image service');
            }
            
            if (contextualData?.imageUrl) {
              setImageUrl(contextualData.imageUrl);
              setFallbackSource(contextualData.source || 'alternate');
              
              toast.info(`Using alternate image service (${contextualData.source || 'fallback'})`, {
                duration: 3000,
                position: "bottom-right"
              });
              
              return contextualData.imageUrl;
            }
          }
          
          throw new Error('Alternate image generation also failed');
        } catch (alternateError) {
          console.error('Alternate image generation failed:', alternateError);
          throw new Error('All image generation methods failed');
        }
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setGenerationError(err instanceof Error ? err.message : 'Unknown error generating image');
      
      toast.error("Couldn't generate image", {
        description: "Image generation failed. Please try again later.",
        duration: 3000
      });
      
      // Set a placeholder image as fallback
      const placeholderUrl = `https://placehold.co/600x400/252238/FFFFFF?text=${encodeURIComponent('Image Generation Failed')}`;
      setImageUrl(placeholderUrl);
      setFallbackSource('error');
      return placeholderUrl;
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
