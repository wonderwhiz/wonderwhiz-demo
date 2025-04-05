
import { supabase } from '@/integrations/supabase/client';

export const getContextualImage = async (
  block: any,
  isFirstBlock: boolean, 
  requestId: string,
  imageRetryCountRef: React.MutableRefObject<number>
) => {
  // Don't attempt image generation if this is not the first block or we've hit the retry limit
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
    
    // Set loading state
    const result = {
      imageLoading: true,
      imageRequestInProgress: true,
      contextualImage: null,
      imageError: null,
      imageDescription: "A magical picture is being created just for you!"
    };
    
    console.log(`[${requestId}][${block.id}] Calling generate-contextual-image function`);
    
    // Call the Supabase function for image generation
    const { data, error } = await supabase.functions.invoke('generate-contextual-image', {
      body: {
        blockContent: block.content,
        blockType: block.type,
        requestId: requestId,
        timestamp: new Date().toISOString()
      }
    });
    
    // Log response time
    const duration = Date.now() / 1000;
    console.log(`[${requestId}][${block.id}] Image generation response received after ${duration}s`);
    
    // Handle Supabase function error
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
    
    // Handle missing data
    if (!data) {
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: "No data returned from image generation function",
        imageDescription: "A magical picture about this exciting topic!" 
      };
    }
    
    // Handle error from the data
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
    
    // Handle successful image generation
    if (data && data.image) {
      console.log(`[${requestId}][${block.id}] Image generated successfully`);
      
      // Try to cache the image in localStorage for future use
      try {
        const cacheKey = `image-cache-${block.id}`;
        localStorage.setItem(cacheKey, data.image);
        console.log(`[${requestId}][${block.id}] Image cached successfully`);
      } catch (e) {
        console.error('Error caching image in localStorage:', e);
      }
      
      // Return the image and related data
      return { 
        imageLoading: false, 
        imageRequestInProgress: false, 
        contextualImage: data.image, 
        imageError: null,
        imageDescription: data.imageDescription || "A wonderful picture about learning!" 
      };
    } else {
      // Handle missing image in response
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: "No image data in response",
        imageDescription: data.imageDescription || "A wonderful picture about learning!" 
      };
    }
  } catch (err) {
    // Handle any other errors
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
