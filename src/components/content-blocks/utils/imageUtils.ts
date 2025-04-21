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

    // Use Supabase edge function for DALL-E/OpenAI
    const { data, error } = await supabase.functions.invoke('generate-gemini-image', {
      body: {
        prompt: `${basePrompt}. Style: ${style}`,
        style,
        childAge: block.childAge || 10,
        retryOnFail: true
      }
    });

    if (error) {
      throw new Error(error.message || "Image generation failed");
    }

    if (data?.imageUrl) {
      result.contextualImage = data.imageUrl;
      result.imageDescription = data.textResponse || `Magical image of "${basePrompt}"`;
      localStorage.setItem(imageKey, data.imageUrl);
    } else {
      throw new Error('No image URL returned from Supabase edge function');
    }
  } catch (err: any) {
    result.imageError = err?.message || 'Could not generate image';
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
