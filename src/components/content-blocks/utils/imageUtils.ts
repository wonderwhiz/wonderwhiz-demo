
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

// Fallback topic-based images
const TOPIC_IMAGES = {
  space: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1024&auto=format&fit=crop",
  planet: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1024&auto=format&fit=crop",
  ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1024&auto=format&fit=crop",
  dinosaur: "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1024&auto=format&fit=crop",
  robot: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1024&auto=format&fit=crop",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1024&auto=format&fit=crop",
  plant: "https://images.unsplash.com/photo-1502331538081-041522531548?q=80&w=1024&auto=format&fit=crop",
  volcano: "https://images.unsplash.com/photo-1554232682-b9ef9c92f8de?q=80&w=1024&auto=format&fit=crop",
  animal: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1024&auto=format&fit=crop"
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

    // Use OpenAI to generate image via Edge function
    console.log(`[${requestId}][${block.id}] Calling OpenAI function for image generation`);
    
    // Determine specialist style for prompting
    let specialistStyle = 'educational';
    if (block.specialist_id === 'whizzy') {
      specialistStyle = 'whimsical, colorful cartoon';
    } else if (block.specialist_id === 'nova') {
      specialistStyle = 'cosmic, space-themed';
    } else if (block.specialist_id === 'spark') {
      specialistStyle = 'technical, blueprint style';
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-openai-image', {
        body: { 
          prompt: imagePrompt,
          style: specialistStyle === 'cosmic, space-themed' ? 'vivid' : 'natural',
          childAge: 10 // Default age
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
    } catch (openaiError) {
      console.error(`[${requestId}][${block.id}] OpenAI image generation failed:`, openaiError);
      
      // Try to find a relevant topic-based image as fallback
      const fallbackImage = getFallbackTopicImage(imagePrompt);
      result.contextualImage = fallbackImage;
      result.imageDescription = `Visual representation of ${imagePrompt}`;
      
      // Cache the fallback image
      localStorage.setItem(imageKey, fallbackImage);
      console.log(`[${requestId}][${block.id}] Fallback image cached`);
    }
  } catch (error) {
    console.error(`[${requestId}][${block.id}] Error generating image:`, error);
    result.imageError = 'Could not generate image';
    
    // If retry count is below threshold, we'll let the component retry
    if (retryCountRef.current < 2) {
      result.imageRequestInProgress = false;
    } else {
      // Use a fallback image after retries
      const randomPlaceholder = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
      result.contextualImage = randomPlaceholder;
      result.imageDescription = "A magical learning adventure";
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
export const getDescriptiveImageText = (block: any): string => {
  if (!block || !block.content) return "";
  
  try {
    switch (block.type) {
      case 'fact':
      case 'funFact':
        return `A colorful illustration about "${block.content.fact?.substring(0, 50) || block.content.text?.substring(0, 50)}..."`;
      case 'quiz':
        return `A fun picture illustrating "${block.content.question?.substring(0, 50)}..."`;
      case 'flashcard':
        return `A charming illustration of ${block.content.front?.substring(0, 50)}...`;
      case 'creative':
        return `An imaginative picture showing "${block.content.prompt?.substring(0, 50) || block.content.description?.substring(0, 50)}..."`;
      case 'task':
        return `A motivational illustration of ${block.content.task?.substring(0, 50) || block.content.description?.substring(0, 50)}...`;
      case 'riddle':
        return `A mysterious picture about "${block.content.riddle?.substring(0, 50) || block.content.text?.substring(0, 50)}..."`;
      case 'activity':
        return `A playful picture showing ${block.content.activity?.substring(0, 50) || block.content.description?.substring(0, 50)}...`;
      case 'news':
        return `A vibrant illustration depicting "${block.content.headline?.substring(0, 50) || block.content.title?.substring(0, 50)}..."`;
      case 'mindfulness':
        return `A soothing picture of ${block.content.exercise?.substring(0, 50) || block.content.instruction?.substring(0, 50)}...`;
      default:
        return "A magical picture about learning and discovery!";
    }
  } catch (e) {
    console.error("Error generating descriptive image text:", e);
    return "A wonderful illustration about learning!";
  }
};

// Get a fallback image based on topic
function getFallbackTopicImage(prompt: string): string {
  const promptLower = prompt.toLowerCase();
  
  // Find a matching topic
  for (const [topic, url] of Object.entries(TOPIC_IMAGES)) {
    if (promptLower.includes(topic)) {
      return url;
    }
  }
  
  // Get a random placeholder if no topic matches
  return PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
}
