
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseHuggingFaceImageGenerationProps {
  childAge?: number;
  maxRetries?: number;
}

export function useHuggingFaceImageGeneration({ childAge = 10, maxRetries = 2 }: UseHuggingFaceImageGenerationProps = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [fallbackSource, setFallbackSource] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const generateImage = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    setFallbackSource(null);
    
    try {
      toast.loading("Generating image...");
      
      console.log(`Calling generate-huggingface-image with prompt: "${prompt.substring(0, 50)}..."`);
      
      // Call the HuggingFace edge function
      const { data, error: functionError } = await supabase.functions.invoke('generate-huggingface-image', {
        body: {
          prompt,
          childAge,
          retryOnFail: true
        }
      });
      
      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(`Failed to generate image: ${functionError.message || functionError}`);
      }
      
      if (!data) {
        console.error('No data returned from edge function');
        throw new Error('No response from image generation service');
      }
      
      if (data.error) {
        console.error('API Error:', data.error);
        throw new Error(`Failed to generate image: ${data.error}`);
      }
      
      // Handle missing image URL
      if (!data.imageUrl && !data.fallbackImageUrl) {
        console.error('No image URL in response:', data);
        throw new Error('No image URL returned');
      }
      
      // Use fallback URL if main URL is missing
      const finalImageUrl = data.imageUrl || data.fallbackImageUrl;
      
      // If we got a fallback image from Unsplash
      if (data.source === 'unsplash' || data.fallbackImageUrl) {
        console.log('Using fallback image source:', data.source || 'unsplash');
        setFallbackSource('unsplash');
        toast.success("Generated an alternative image");
      } else if (data.source === 'huggingface') {
        toast.success("Image generated with AI!");
        setFallbackSource('huggingface');
      }
      
      setImageUrl(finalImageUrl);
      return finalImageUrl;
      
    } catch (err: any) {
      console.error('Error generating image:', err);
      setGenerationError(err instanceof Error ? err.message : 'Unknown error generating image');
      
      toast.error("Couldn't generate image", {
        description: "Image generation failed. Please try again later.",
        duration: 3000
      });
      
      // Try DALL-E as fallback if we're not already in a retry loop
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        try {
          console.log('Trying DALL-E as fallback...');
          // Try fallback to DALL-E
          const { data: dalleData } = await supabase.functions.invoke('generate-dalle-image', {
            body: {
              prompt,
              childAge,
              retryOnFail: true
            }
          });
          
          if (dalleData?.imageUrl) {
            setImageUrl(dalleData.imageUrl);
            setFallbackSource('dalle');
            toast.success("Used DALL-E as fallback");
            return dalleData.imageUrl;
          }
        } catch (fallbackErr) {
          console.error('DALL-E fallback also failed:', fallbackErr);
        }
      }
      
      // Set a placeholder image as final fallback
      const placeholderUrl = `https://placehold.co/600x400/252238/FFFFFF?text=${encodeURIComponent('Image Generation Failed')}`;
      setImageUrl(placeholderUrl);
      setFallbackSource('error');
      return placeholderUrl;
    } finally {
      setIsGenerating(false);
      toast.dismiss();
      // Reset retry count after complete attempt
      if (retryCount > 0) {
        setRetryCount(0);
      }
    }
  }, [childAge, retryCount, maxRetries]);

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
