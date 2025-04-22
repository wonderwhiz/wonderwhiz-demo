
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

  // Only generate for first block unless you plan to update logic for more blocks
  if (!isFirstBlock) {
    return result;
  }

  try {
    const imageKey = `content-image-${block.id}`;
    const cachedImage = localStorage.getItem(imageKey);

    if (cachedImage) {
      result.contextualImage = cachedImage;
      return result;
    }

    // Build a specific, delightful prompt
    let basePrompt = '';
    switch (block.type) {
      case 'fact':
      case 'funFact':
        basePrompt = block.content?.fact || block.content?.text || block.content?.title || 'educational topic for kids';
        break;
      case 'quiz':
        basePrompt = block.content?.question || 'quiz concept for kids';
        break;
      case 'flashcard':
        basePrompt = block.content?.front || 'learning topic flashcard';
        break;
      case 'creative':
        basePrompt = block.content?.prompt || 'creative prompt for kids';
        break;
      case 'activity':
        basePrompt = block.content?.title || block.content?.description || 'fun activity for kids';
        break;
      case 'task':
        basePrompt = block.content?.task || 'kid learning task';
        break;
      case 'riddle':
        basePrompt = block.content?.riddle || 'kids riddle';
        break;
      case 'news':
        basePrompt = block.content?.headline || 'news for children';
        break;
      case 'mindfulness':
        basePrompt = block.content?.instruction || 'calm and mindful moment for kids';
        break;
      default:
        basePrompt = JSON.stringify(block.content || {}).substring(0, 160);
    }

    let style = 'Pixar/Disney, educational, inspiring wonder, child-friendly, vibrant colors, not realistic, magical, high quality illustration';

    // Add specialist tweaks
    if (block.specialist_id === 'whizzy') {
      style += ', whimsical, sprinkle of fun, cartoonish';
    } else if (block.specialist_id === 'nova') {
      style += ', cosmic, space, glowing';
    } else if (block.specialist_id === 'spark') {
      style += ', technical, blueprint hints';
    }

    result.imageLoading = true;
    result.imageRequestInProgress = true;

    // Try to generate image using OpenAI DALL-E
    try {
      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('generate-dalle-image', {
        body: {
          prompt: `${basePrompt}. Style: ${style}`,
          childAge: block.childAge || 10
        }
      });

      if (openaiError) {
        throw new Error(openaiError.message || "OpenAI image generation failed");
      }

      if (openaiData?.imageUrl) {
        result.contextualImage = openaiData.imageUrl;
        result.imageDescription = openaiData.altText || `Magical image of "${basePrompt}"`;
        localStorage.setItem(imageKey, openaiData.imageUrl);
        result.imageLoading = false;
        return result;
      }
    } catch (openaiErr) {
      console.error('OpenAI image generation failed:', openaiErr);
      // Continue to fallback options
    }

    // Fallback to Gemini if OpenAI fails
    try {
      const { data: geminiData, error: geminiError } = await supabase.functions.invoke('generate-gemini-image', {
        body: {
          prompt: `${basePrompt}. Style: ${style}`,
          style,
          childAge: block.childAge || 10,
          retryOnFail: true
        }
      });

      if (geminiError) {
        throw new Error(geminiError.message || "Gemini image generation failed");
      }

      if (geminiData?.imageUrl) {
        result.contextualImage = geminiData.imageUrl;
        result.imageDescription = geminiData.textResponse || `Magical image of "${basePrompt}"`;
        localStorage.setItem(imageKey, geminiData.imageUrl);
        result.imageLoading = false;
        return result;
      }
    } catch (geminiErr) {
      console.error('Gemini image generation failed:', geminiErr);
      // Continue to fallback options
    }

    // Last resort: use placeholder image if both OpenAI and Gemini fail
    const fallbackImage = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
    result.contextualImage = fallbackImage;
    result.imageDescription = `Illustration related to ${basePrompt}`;
    localStorage.setItem(imageKey, fallbackImage);
    
  } catch (err: any) {
    result.imageError = err?.message || 'Could not generate image';
    if (retryCountRef.current < 2) {
      result.imageRequestInProgress = false;
    }
    
    // Even if there's an error, provide a placeholder image
    const fallbackImage = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
    result.contextualImage = fallbackImage;
    result.imageDescription = "A magical learning adventure awaits!";
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
