
import { supabase } from '@/integrations/supabase/client';

export const getContextualImage = async (
  block: any,
  isFirstBlock: boolean, 
  requestId: string,
  imageRetryCountRef: React.MutableRefObject<number>
) => {
  if (!isFirstBlock || imageRetryCountRef.current > 2) {
    return { 
      imageLoading: false, 
      imageRequestInProgress: false, 
      contextualImage: null, 
      imageError: null,
      imageDescription: "A wonderful picture about learning!"
    };
  }

  try {
    console.log(`[${requestId}][${block.id}] Starting image generation`);
    
    console.log(`[${requestId}][${block.id}] Calling generate-contextual-image function`);
    
    const { data, error } = await supabase.functions.invoke('generate-contextual-image', {
      body: {
        blockContent: block.content,
        blockType: block.type,
        requestId: requestId,
        timestamp: new Date().toISOString()
      }
    });
    
    const duration = Date.now() / 1000;
    console.log(`[${requestId}][${block.id}] Image generation response received after ${duration}s`);
    
    if (error) {
      console.error(`[${requestId}][${block.id}] Supabase function error:`, error);
      return { 
        imageLoading: false, 
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: `Edge function error: ${error.message}`,
        imageDescription: data?.imageDescription || "A wonderful picture about learning!" 
      };
    }
    
    if (!data) {
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: "No data returned from image generation function",
        imageDescription: "A wonderful picture about learning!" 
      };
    }
    
    if (data.error) {
      console.error(`[${requestId}][${block.id}] Image generation error:`, data.error);
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: data.error,
        imageDescription: data.imageDescription || "A wonderful picture about learning!" 
      };
    }
    
    if (data && data.image) {
      console.log(`[${requestId}][${block.id}] Image generated successfully`);
      
      try {
        const cacheKey = `image-cache-${block.id}`;
        localStorage.setItem(cacheKey, data.image);
        console.log(`[${requestId}][${block.id}] Image cached successfully`);
      } catch (e) {
        console.error('Error caching image in localStorage:', e);
      }
      
      return { 
        imageLoading: false, 
        imageRequestInProgress: false, 
        contextualImage: data.image, 
        imageError: null,
        imageDescription: data.imageDescription || "A wonderful picture about learning!" 
      };
    } else {
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: "No image data in response",
        imageDescription: data.imageDescription || "A wonderful picture about learning!" 
      };
    }
  } catch (err) {
    console.error(`[${block.id}] Error generating contextual image:`, err);
    return { 
      imageLoading: false, 
      imageRequestInProgress: false, 
      contextualImage: null, 
      imageError: err instanceof Error ? err.message : "Unknown error occurred",
      imageDescription: "A wonderful picture about learning!" 
    };
  }
};

export const checkImageCache = (blockId: string) => {
  try {
    const cacheKey = `image-cache-${blockId}`;
    return localStorage.getItem(cacheKey);
  } catch (e) {
    console.error(`Error checking image cache for block ${blockId}:`, e);
    return null;
  }
};
