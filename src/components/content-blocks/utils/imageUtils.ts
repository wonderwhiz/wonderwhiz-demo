
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
      imageDescription: "A magical adventure awaits!"
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
      imageDescription: "Creating a magical picture just for you!"
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
      
      // Special handling for billing limit error to make it less alarming
      const errorMessage = error.message || "Error generating image";
      const isBillingError = errorMessage.includes("Billing") || errorMessage.includes("quota");
      
      return { 
        imageLoading: false, 
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: isBillingError ? "Our magical artists are taking a break right now!" : `Error: ${errorMessage}`,
        imageDescription: data?.imageDescription || "Imagine a colorful world of discovery!" 
      };
    }
    
    // Handle missing data
    if (!data) {
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: "No data returned from image generation function",
        imageDescription: "A magical journey awaits you!" 
      };
    }
    
    // Handle error from the data
    if (data.error) {
      console.error(`[${requestId}][${block.id}] Image generation error:`, data.error);
      
      // Friendly error message for billing issues
      const isBillingError = data.error.includes("Billing") || data.error.includes("quota");
      
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: isBillingError ? "Our magical artists are taking a little break!" : data.error,
        imageDescription: data.imageDescription || "Picture a world full of wonders!" 
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
        imageDescription: data.imageDescription || "A magical adventure in learning!" 
      };
    } else {
      // Handle missing image in response but with a nice description
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: null,
        imageError: "Our magical artists are still working on your picture!",
        imageDescription: data.imageDescription || "A wonderful adventure through knowledge!" 
      };
    }
  } catch (err) {
    // Handle any other errors with a child-friendly message
    console.error(`[${block.id}] Error generating contextual image:`, err);
    return { 
      imageLoading: false, 
      imageRequestInProgress: false, 
      contextualImage: null, 
      imageError: "Our magical picture machine needs a rest!",
      imageDescription: "Imagine a colorful world of discovery!" 
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
