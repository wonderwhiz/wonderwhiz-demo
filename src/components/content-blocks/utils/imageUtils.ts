
import { supabase } from '@/integrations/supabase/client';

// Cute character images as placeholders
const PLACEHOLDER_IMAGES = [
  "https://storage.googleapis.com/wonderwhiz-assets/characters/nova-placeholder-1.png",
  "https://storage.googleapis.com/wonderwhiz-assets/characters/spark-placeholder-1.png",
  "https://storage.googleapis.com/wonderwhiz-assets/characters/prism-placeholder-1.png",
  "https://storage.googleapis.com/wonderwhiz-assets/characters/pixel-placeholder-1.png",
  "https://storage.googleapis.com/wonderwhiz-assets/characters/atlas-placeholder-1.png",
  "https://storage.googleapis.com/wonderwhiz-assets/characters/lotus-placeholder-1.png"
];

export const getContextualImage = async (
  block: any,
  isFirstBlock: boolean, 
  requestId: string,
  imageRetryCountRef: React.MutableRefObject<number>
) => {
  // Don't attempt image generation if this is not the first block or we've hit the retry limit
  if (!isFirstBlock || imageRetryCountRef.current > 2) {
    const randomPlaceholder = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
    return { 
      imageLoading: false, 
      imageRequestInProgress: false, 
      contextualImage: randomPlaceholder, 
      imageError: null,
      imageDescription: getDescriptiveImageText(block) || "A magical adventure awaits!"
    };
  }

  try {
    console.log(`[${requestId}][${block.id}] Starting image generation`);
    
    // Check for cached image first
    const cachedImage = checkImageCache(block.id);
    if (cachedImage) {
      return {
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: cachedImage,
        imageError: null,
        imageDescription: getDescriptiveImageText(block) || "A magical picture just for you!"
      };
    }
    
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
        timestamp: new Date().toISOString(),
        style: "cute disney pixar style, child-friendly, colorful, vibrant, magical"
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
      
      // Return a placeholder image instead of an error
      const randomPlaceholder = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
      
      return { 
        imageLoading: false, 
        imageRequestInProgress: false,
        contextualImage: randomPlaceholder,
        imageError: null,
        imageDescription: getDescriptiveImageText(block) || "Imagine a colorful world of discovery!" 
      };
    }
    
    // Handle missing data
    if (!data) {
      const randomPlaceholder = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: randomPlaceholder,
        imageError: null,
        imageDescription: getDescriptiveImageText(block) || "A magical journey awaits you!" 
      };
    }
    
    // Handle error from the data
    if (data.error) {
      console.error(`[${requestId}][${block.id}] Image generation error:`, data.error);
      
      // Return a placeholder image instead of an error message
      const randomPlaceholder = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
      
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: randomPlaceholder,
        imageError: null,
        imageDescription: data.imageDescription || getDescriptiveImageText(block) || "Picture a world full of wonders!" 
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
        imageDescription: data.imageDescription || getDescriptiveImageText(block) || "A magical adventure in learning!" 
      };
    } else {
      // If no image, use a placeholder
      const randomPlaceholder = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
      return { 
        imageLoading: false,
        imageRequestInProgress: false,
        contextualImage: randomPlaceholder,
        imageError: null,
        imageDescription: data.imageDescription || getDescriptiveImageText(block) || "A wonderful adventure through knowledge!" 
      };
    }
  } catch (err) {
    // Handle any other errors with a placeholder image
    console.error(`[${block.id}] Error generating contextual image:`, err);
    const randomPlaceholder = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
    return { 
      imageLoading: false, 
      imageRequestInProgress: false, 
      contextualImage: randomPlaceholder, 
      imageError: null,
      imageDescription: getDescriptiveImageText(block) || "Imagine a colorful world of discovery!" 
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

// Helper function to create more descriptive image text based on block content
const getDescriptiveImageText = (block: any): string => {
  if (!block || !block.content) return "";
  
  try {
    switch (block.type) {
      case 'fact':
      case 'funFact':
        return `A colorful Pixar-style illustration about "${block.content.fact?.substring(0, 50)}..."`;
      case 'quiz':
        return `A fun Disney-style picture illustrating "${block.content.question?.substring(0, 50)}..."`;
      case 'flashcard':
        return `A charming Pixar-inspired illustration of ${block.content.front?.substring(0, 50)}...`;
      case 'creative':
        return `An imaginative Disney-style picture showing "${block.content.prompt?.substring(0, 50)}..."`;
      case 'task':
        return `A motivational Pixar-style illustration of ${block.content.task?.substring(0, 50)}...`;
      case 'riddle':
        return `A mysterious Disney-inspired picture about "${block.content.riddle?.substring(0, 50)}..."`;
      case 'activity':
        return `A playful Disney-inspired picture showing ${block.content.activity?.substring(0, 50)}...`;
      case 'news':
        return `A vibrant Pixar-style illustration depicting "${block.content.headline?.substring(0, 50)}..."`;
      case 'mindfulness':
        return `A soothing Pixar-inspired picture of ${block.content.exercise?.substring(0, 50)}...`;
      default:
        return "A magical Disney-inspired picture about learning and discovery!";
    }
  } catch (e) {
    console.error("Error generating descriptive image text:", e);
    return "A wonderful Disney-inspired illustration about learning!";
  }
};
