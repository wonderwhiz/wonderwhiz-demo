
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

// Unsplash fallback images for different topics
const TOPIC_FALLBACK_IMAGES = {
  space: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&auto=format&fit=crop&q=80",
  ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&auto=format&fit=crop&q=80",
  animals: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&auto=format&fit=crop&q=80",
  dinosaur: "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?w=1200&auto=format&fit=crop&q=80",
  robot: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1200&auto=format&fit=crop&q=80",
  history: "https://images.unsplash.com/photo-1566055909643-5e9f4c10de6d?w=1200&auto=format&fit=crop&q=80",
  science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80",
  art: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&auto=format&fit=crop&q=80",
  music: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=80",
  math: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80",
  plant: "https://images.unsplash.com/photo-1502331538081-041522531548?w=1200&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80"
};

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
    // Generate a cache key based on the block ID and content
    const blockContent = JSON.stringify(block.content || {}).substring(0, 100);
    const imageKey = `content-image-${block.id}-${blockContent.replace(/[^a-zA-Z0-9]/g, '')}`;
    const cachedImage = localStorage.getItem(imageKey);

    if (cachedImage) {
      console.log('Using cached image for block:', block.id);
      result.contextualImage = cachedImage;
      result.imageDescription = localStorage.getItem(`${imageKey}-alt`) || "A magical image about learning";
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
    console.log('Attempting to generate image for prompt:', basePrompt.substring(0, 50) + '...');
    
    try {
      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('generate-dalle-image', {
        body: {
          prompt: `${basePrompt}. Style: ${style}`,
          childAge: block.childAge || 10
        }
      });

      if (openaiError) {
        console.error('OpenAI Supabase function error:', openaiError);
        throw new Error(openaiError.message || "OpenAI image generation failed");
      }

      if (openaiData?.imageUrl) {
        console.log('Successfully generated image via DALL-E');
        result.contextualImage = openaiData.imageUrl;
        result.imageDescription = openaiData.altText || `Magical image of "${basePrompt}"`;
        localStorage.setItem(imageKey, openaiData.imageUrl);
        localStorage.setItem(`${imageKey}-alt`, result.imageDescription);
        result.imageLoading = false;
        return result;
      }
      
      // If we have a fallbackImageUrl from the function, use it
      if (openaiData?.fallbackImageUrl) {
        console.log('Using fallback image URL from DALL-E function');
        result.contextualImage = openaiData.fallbackImageUrl;
        result.imageDescription = openaiData.fallbackAltText || `Image related to "${basePrompt}"`;
        localStorage.setItem(imageKey, openaiData.fallbackImageUrl);
        localStorage.setItem(`${imageKey}-alt`, result.imageDescription);
        result.imageLoading = false;
        return result;
      }
      
      // If we get here, the DALL-E function didn't provide an image or a fallback
      throw new Error("No image returned from DALL-E API");
    } catch (openaiErr) {
      console.error('OpenAI image generation failed:', openaiErr);
      // Continue to fallback options
    }

    // Fallback to Gemini if OpenAI fails
    try {
      console.log('Attempting to generate image via Gemini');
      const { data: geminiData, error: geminiError } = await supabase.functions.invoke('generate-gemini-image', {
        body: {
          prompt: `${basePrompt}. Style: ${style}`,
          style,
          childAge: block.childAge || 10,
          retryOnFail: true
        }
      });

      if (geminiError) {
        console.error('Gemini image generation error:', geminiError);
        throw new Error(geminiError.message || "Gemini image generation failed");
      }

      if (geminiData?.imageUrl) {
        console.log('Successfully generated image via Gemini');
        result.contextualImage = geminiData.imageUrl;
        result.imageDescription = geminiData.textResponse || `Magical image of "${basePrompt}"`;
        localStorage.setItem(imageKey, geminiData.imageUrl);
        localStorage.setItem(`${imageKey}-alt`, result.imageDescription);
        result.imageLoading = false;
        return result;
      }
      
      throw new Error("No image returned from Gemini API");
    } catch (geminiErr) {
      console.error('Gemini image generation failed:', geminiErr);
      // Continue to topic-based fallback images
    }

    // Topic-based fallback: use Unsplash images related to the topic
    const topicImage = getTopicBasedImage(basePrompt);
    if (topicImage) {
      console.log('Using topic-based fallback image');
      result.contextualImage = topicImage;
      result.imageDescription = `Illustration related to ${basePrompt}`;
      localStorage.setItem(imageKey, topicImage);
      localStorage.setItem(`${imageKey}-alt`, result.imageDescription);
      result.imageLoading = false;
      return result;
    }
    
    // Last resort: use placeholder image if all methods fail
    console.log('Using random character placeholder image');
    const fallbackImage = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
    result.contextualImage = fallbackImage;
    result.imageDescription = `Illustration related to ${basePrompt}`;
    localStorage.setItem(imageKey, fallbackImage);
    localStorage.setItem(`${imageKey}-alt`, result.imageDescription);
    
  } catch (err: any) {
    console.error('Error in getContextualImage:', err);
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

// Function to get a topic-based image from our predefined fallbacks
const getTopicBasedImage = (prompt: string): string | null => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('space') || lowerPrompt.includes('planet') || lowerPrompt.includes('star') || lowerPrompt.includes('galaxy')) {
    return TOPIC_FALLBACK_IMAGES.space;
  } else if (lowerPrompt.includes('ocean') || lowerPrompt.includes('sea') || lowerPrompt.includes('marine') || lowerPrompt.includes('water')) {
    return TOPIC_FALLBACK_IMAGES.ocean;
  } else if (lowerPrompt.includes('animal') || lowerPrompt.includes('wildlife') || lowerPrompt.includes('creature')) {
    return TOPIC_FALLBACK_IMAGES.animals;
  } else if (lowerPrompt.includes('dinosaur') || lowerPrompt.includes('prehistoric')) {
    return TOPIC_FALLBACK_IMAGES.dinosaur;
  } else if (lowerPrompt.includes('robot') || lowerPrompt.includes('tech') || lowerPrompt.includes('computer')) {
    return TOPIC_FALLBACK_IMAGES.robot;
  } else if (lowerPrompt.includes('history') || lowerPrompt.includes('ancient') || lowerPrompt.includes('past')) {
    return TOPIC_FALLBACK_IMAGES.history;
  } else if (lowerPrompt.includes('science') || lowerPrompt.includes('experiment') || lowerPrompt.includes('chemistry') || lowerPrompt.includes('physics')) {
    return TOPIC_FALLBACK_IMAGES.science;
  } else if (lowerPrompt.includes('art') || lowerPrompt.includes('draw') || lowerPrompt.includes('paint') || lowerPrompt.includes('creative')) {
    return TOPIC_FALLBACK_IMAGES.art;
  } else if (lowerPrompt.includes('music') || lowerPrompt.includes('sound') || lowerPrompt.includes('instrument')) {
    return TOPIC_FALLBACK_IMAGES.music;
  } else if (lowerPrompt.includes('math') || lowerPrompt.includes('number') || lowerPrompt.includes('count')) {
    return TOPIC_FALLBACK_IMAGES.math;
  } else if (lowerPrompt.includes('plant') || lowerPrompt.includes('flower') || lowerPrompt.includes('tree') || lowerPrompt.includes('garden')) {
    return TOPIC_FALLBACK_IMAGES.plant;
  }
  
  return TOPIC_FALLBACK_IMAGES.default;
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
export const getDescriptiveImageText = (block: any): string => {
  if (!block || !block.content) return "";
  
  try {
    switch (block.type) {
      case 'fact':
      case 'funFact':
        return `A colorful Pixar-style illustration about "${block.content.fact?.substring(0, 50) || block.content.text?.substring(0, 50)}..."`;
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
        return `A playful Disney-inspired picture showing ${block.content.title?.substring(0, 50) || block.content.description?.substring(0, 50)}...`;
      case 'news':
        return `A vibrant Pixar-style illustration depicting "${block.content.headline?.substring(0, 50)}..."`;
      case 'mindfulness':
        return `A soothing Pixar-inspired picture of ${block.content.instruction?.substring(0, 50) || block.content.exercise?.substring(0, 50)}...`;
      default:
        return "A magical Disney-inspired picture about learning and discovery!";
    }
  } catch (e) {
    console.error("Error generating descriptive image text:", e);
    return "A wonderful Disney-inspired illustration about learning!";
  }
};
