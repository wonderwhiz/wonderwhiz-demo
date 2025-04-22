
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    // Get the API key from environment variable
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable not set');
    }

    // Parse request body
    const { prompt, style = 'vivid', childAge = 10, size = '1024x1024', retryOnFail = true } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log(`Generating image for prompt: "${prompt}" with style: ${style}`);
    
    // Adapt the prompt based on child age to ensure age-appropriate content
    let safePrompt = prompt;
    
    if (childAge <= 7) {
      safePrompt = `${prompt}, kid-friendly, colorful, cartoon style, simple shapes, cheerful, educational illustration for young children`;
    } else if (childAge <= 11) {
      safePrompt = `${prompt}, educational, vibrant colors, age-appropriate for ${childAge} year olds, learning material, engaging illustration`;
    } else {
      safePrompt = `${prompt}, educational, detailed, engaging, teenage-appropriate illustration, modern style`;
    }

    // Call DALL-E 3 API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: safePrompt,
        n: 1,
        size: size,
        style: style,
        quality: "standard",
        // Setting response_format to url instead of b64_json because URL is more efficient
        response_format: "url" 
      })
    });

    // Process the response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('DALL-E API error:', errorData);
      
      // If this is a content policy violation or similar issue, try to get a fallback image
      if (retryOnFail) {
        // Try to fetch a fallback image from Unsplash
        console.log('Attempting to fetch fallback image from Unsplash');
        const fallbackImage = await getFallbackImage(prompt);
        
        if (fallbackImage) {
          return new Response(
            JSON.stringify({ 
              imageUrl: fallbackImage,
              originalError: errorData.error?.message || 'OpenAI API error',
              source: 'fallback'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      throw new Error(errorData.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('No image URL returned from OpenAI API');
    }

    console.log('Successfully generated image');
    
    // Return the image URL
    return new Response(
      JSON.stringify({ 
        imageUrl: data.data[0].url,
        revised_prompt: data.data[0].revised_prompt,
        source: 'dalle'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return the error
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error generating image',
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Still return 200 to handle gracefully on the client
      }
    );
  }
});

// Helper function to get a fallback image from Unsplash
async function getFallbackImage(prompt: string): Promise<string | null> {
  try {
    // Clean the prompt by removing any complex terms
    const searchTerms = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(term => term.length > 3)
      .slice(0, 2)
      .join(',');
    
    // Use Unsplash source API to get a relevant image
    const unsplashUrl = `https://source.unsplash.com/featured/800x600?${encodeURIComponent(searchTerms)}`;
    
    const response = await fetch(unsplashUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*'
      }
    });
    
    if (response.ok && response.url) {
      return response.url;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching fallback image:', error);
    return null;
  }
}
