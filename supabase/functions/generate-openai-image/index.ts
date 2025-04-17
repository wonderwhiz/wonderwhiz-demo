
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style = "vivid", size = "1024x1024", childAge = 10 } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Get API key from environment
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API key is not configured',
          message: 'OpenAI API key is required for image generation',
          fallbackImage: getFallbackImage(prompt, childAge)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating image for prompt: "${prompt}"`);

    // Adapt prompt based on child's age for safety and appropriateness
    let enhancedPrompt = sanitizePrompt(prompt);
    enhancedPrompt = adaptPromptForChildAge(enhancedPrompt, childAge);
    
    console.log(`Enhanced prompt: "${enhancedPrompt}"`);

    try {
      const response = await fetch(
        'https://api.openai.com/v1/images/generations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: enhancedPrompt,
            n: 1,
            size: size,
            quality: "standard",
            style: style
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} ${errorText}`);
        // Return fallback image instead of throwing error
        return new Response(
          JSON.stringify({ 
            success: true, 
            imageUrl: getFallbackImage(prompt, childAge),
            source: 'fallback',
            message: 'Using fallback image due to API error'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const responseData = await response.json();
      const imageUrl = responseData.data?.[0]?.url;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: imageUrl,
          source: 'openai'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (fetchError) {
      console.error('Error fetching from OpenAI:', fetchError);
      // Return fallback image instead of throwing error
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: getFallbackImage(prompt, childAge),
          source: 'fallback',
          message: 'Using fallback image due to API error'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in generate-openai-image function:', error);
    
    const fallbackImage = getFallbackImage("educational illustration", 10);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: fallbackImage,
        source: 'error-fallback',
        error: error.message || 'An error occurred during image generation' 
      }),
      {
        status: 200, // Return 200 even for errors, with fallback image
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Sanitize prompt to avoid DALL-E content policy issues
function sanitizePrompt(prompt: string): string {
  // Remove potential problematic terms that might trigger content filters
  const sanitized = prompt
    .replace(/\b(nude|naked|sex|porn|explicit|violent|gore|blood|weapon|gun|kill)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return sanitized || "educational illustration";
}

// Adapt prompt for child's age
function adaptPromptForChildAge(prompt: string, age: number): string {
  if (age < 8) {
    return `${prompt}, kid-friendly, colorful, educational, safe for children, Pixar-style illustration`;
  } else if (age < 12) {
    return `${prompt}, age-appropriate, educational, colorful, cartoon style`;
  } else {
    return `${prompt}, educational, vibrant, stylized`;
  }
}

// Get a fallback image based on topic
function getFallbackImage(prompt: string, childAge: number): string {
  const promptLower = prompt.toLowerCase();
  
  // Educational stock images by topic
  const fallbackImages = {
    space: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1024&auto=format&fit=crop",
    planet: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1024&auto=format&fit=crop",
    galaxy: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1024&auto=format&fit=crop",
    star: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1024&auto=format&fit=crop",
    ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1024&auto=format&fit=crop",
    sea: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1024&auto=format&fit=crop",
    marine: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1024&auto=format&fit=crop",
    animal: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1024&auto=format&fit=crop",
    wildlife: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1024&auto=format&fit=crop",
    dinosaur: "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1024&auto=format&fit=crop",
    prehistoric: "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1024&auto=format&fit=crop",
    robot: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1024&auto=format&fit=crop",
    technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1024&auto=format&fit=crop",
    computer: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1024&auto=format&fit=crop",
    plant: "https://images.unsplash.com/photo-1502331538081-041522531548?q=80&w=1024&auto=format&fit=crop",
    volcano: "https://images.unsplash.com/photo-1554232682-b9ef9c92f8de?q=80&w=1024&auto=format&fit=crop",
    mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1024&auto=format&fit=crop",
    history: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1024&auto=format&fit=crop",
    art: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1024&auto=format&fit=crop",
    music: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1024&auto=format&fit=crop",
    math: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1024&auto=format&fit=crop",
    science: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1024&auto=format&fit=crop",
    weather: "https://images.unsplash.com/photo-1429552077091-836152271555?q=80&w=1024&auto=format&fit=crop",
    sport: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1024&auto=format&fit=crop"
  };
  
  // Find a matching topic
  for (const [topic, url] of Object.entries(fallbackImages)) {
    if (promptLower.includes(topic)) {
      return url;
    }
  }
  
  // Default fallback images by age
  if (childAge < 8) {
    return "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=1024&auto=format&fit=crop";
  } else if (childAge < 12) {
    return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1024&auto=format&fit=crop";
  } else {
    return "https://images.unsplash.com/photo-1492539161849-b2b8f6a5fd00?q=80&w=1024&auto=format&fit=crop";
  }
}
