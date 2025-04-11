
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
    const { prompt, style = 'cartoon' } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set in environment variables, using Unsplash fallback');
      return getUnsplashImage(prompt);
    }
    
    try {
      // Try to generate image with Gemini API
      console.log('Generating image with Gemini API for prompt:', prompt);
      
      // Use Gemini 2.0 model which supports image generation
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate a ${style} image based on this prompt: ${prompt}. The image should be educational and kid-friendly.`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.4,
              topK: 32,
              topP: 1.0,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if there are inline_data parts which represent images
      const inlineDataParts = data?.candidates?.[0]?.content?.parts?.filter(
        (part: any) => part.inline_data && part.inline_data.mime_type.startsWith('image/')
      );
      
      if (inlineDataParts && inlineDataParts.length > 0) {
        const imageData = inlineDataParts[0].inline_data.data;
        const mimeType = inlineDataParts[0].inline_data.mime_type;
        
        // Return the image as a data URL
        const imageUrl = `data:${mimeType};base64,${imageData}`;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            imageUrl: imageUrl
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Fallback to Unsplash if no image in response
        console.log('No image in Gemini response, fallback to Unsplash');
        return getUnsplashImage(prompt);
      }
    } catch (error) {
      console.error('Error in Gemini image generation:', error);
      // Fallback to Unsplash
      return getUnsplashImage(prompt);
    }
  } catch (error) {
    console.error('Error in image generation function:', error);
    
    // Return a default image as fallback
    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl: 'https://source.unsplash.com/random/800x600?education',
        fallback: true,
        error: error.message || 'An error occurred during image generation' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to get image from Unsplash
async function getUnsplashImage(prompt: string) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  
  try {
    // Encode the prompt for URL safety
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
    
    // Generate a random seed to ensure we get different images
    const seed = Math.floor(Math.random() * 1000);
    
    // Use Unsplash for reliable image results
    const imageUrl = `https://source.unsplash.com/random/800x600?${encodedPrompt}&seed=${seed}`;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: imageUrl,
        fallback: true,
        source: 'unsplash'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    
    // Return a default image as ultimate fallback
    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl: 'https://source.unsplash.com/random/800x600?education',
        fallback: true,
        error: error.message || 'An error occurred during image fetching' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
