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
  retryCountRef: React.MutableRefObject<number>
) => {
  const result = {
    contextualImage: null as string | null,
    imageLoading: false,
    imageError: null as string | null,
    imageRequestInProgress: false,
    imageDescription: "A magical adventure awaits!"
  };
  
  if (!isFirstBlock) {
    return result;
  }

  console.log(`[${requestId}][${block.id}] Starting image generation for block`);
  
  try {
    const imageKey = `content-image-${block.id}`;
    const cachedImage = localStorage.getItem(imageKey);
    
    if (cachedImage) {
      console.log(`[${requestId}][${block.id}] Using cached image`);
      result.contextualImage = cachedImage;
      return result;
    }
    
    // Determine the appropriate image prompt based on block type and content
    let imagePrompt = '';
    
    if (block.type === 'fact' || block.type === 'funFact') {
      imagePrompt = block.content?.fact || block.content?.text || block.content?.title || 'educational concept';
    } else if (block.type === 'quiz') {
      imagePrompt = block.content?.question || 'quiz question';
    } else {
      // For other block types
      const contentText = JSON.stringify(block.content).substring(0, 150);
      imagePrompt = `Educational concept about ${contentText}`;
    }
    
    result.imageLoading = true;
    result.imageRequestInProgress = true;

    // Use Supabase Edge function to generate image
    console.log(`[${requestId}][${block.id}] Calling Supabase function for image generation`);
    
    // Determine specialist style for prompting
    let specialistStyle = 'educational';
    if (block.specialist_id === 'whizzy') {
      specialistStyle = 'whimsical, colorful cartoon';
    } else if (block.specialist_id === 'nova') {
      specialistStyle = 'cosmic, space-themed';
    } else if (block.specialist_id === 'spark') {
      specialistStyle = 'technical, blueprint style';
    }
    
    const { data, error } = await supabase.functions.invoke('generate-gemini-image', {
      body: { 
        prompt: imagePrompt,
        style: specialistStyle
      }
    });
    
    if (error) {
      console.error(`[${requestId}][${block.id}] Supabase function error:`, error);
      throw new Error(error.message);
    }
    
    console.log(`[${requestId}][${block.id}] Image generation response:`, data);
    
    if (data?.imageUrl) {
      result.contextualImage = data.imageUrl;
      result.imageDescription = data.textResponse || `Visual representation of ${imagePrompt}`;
      
      // Cache the image
      localStorage.setItem(imageKey, data.imageUrl);
      console.log(`[${requestId}][${block.id}] Image cached successfully`);
    } else {
      throw new Error('No image URL in response');
    }
  } catch (error) {
    console.error(`[${requestId}][${block.id}] Error generating image:`, error);
    result.imageError = 'Could not generate image';
    
    // If retry count is below threshold, we'll let the component retry
    if (retryCountRef.current < 2) {
      result.imageRequestInProgress = false;
    }
  } finally {
    result.imageLoading = false;
  }
  
  return result;
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
