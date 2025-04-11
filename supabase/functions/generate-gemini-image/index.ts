
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
      console.error('Missing GEMINI_API_KEY environment variable');
      throw new Error('API configuration error');
    }
    
    console.log(`Generating image for prompt: "${prompt}" with style: ${style}`);
    
    // Prepare prompt with style and educational adaptation
    const enhancedPrompt = `${prompt}. Style: ${style}, educational, child-friendly, vibrant colors, inspiring wonder and curiosity`;
    
    try {
      // Using Gemini 2.0 Flash Experimental for image generation
      const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: enhancedPrompt
                }
              ]
            }
          ],
          generation_config: {
            response_modalities: ["TEXT", "IMAGE"]
          }
        })
      });
      
      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
      }
      
      const responseData = await geminiResponse.json();
      console.log('Gemini API response received');
      
      // Extract image data from the response
      let imageUrl = '';
      let textResponse = '';
      
      if (responseData?.candidates?.[0]?.content?.parts) {
        for (const part of responseData.candidates[0].content.parts) {
          if (part.text) {
            textResponse = part.text;
            console.log('Text response:', textResponse);
          }
          
          if (part.inline_data && part.inline_data.mime_type.startsWith('image/')) {
            // Convert base64 to image URL
            const imageData = part.inline_data.data;
            const mimeType = part.inline_data.mime_type;
            
            // Return the base64 image data to be displayed
            imageUrl = `data:${mimeType};base64,${imageData}`;
            console.log('Image URL generated from inline data');
            break;
          }
        }
      }
      
      if (!imageUrl) {
        console.warn('No image found in Gemini response, falling back to alternative');
        throw new Error('No image in response');
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: imageUrl,
          textResponse: textResponse
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      
      // Fallback to Unsplash for reliable image results
      const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
      const seed = Math.floor(Math.random() * 1000);
      const fallbackImageUrl = `https://source.unsplash.com/random/800x600?${encodedPrompt}&seed=${seed}`;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: fallbackImageUrl,
          fallback: true,
          error: apiError.message || 'Error generating image with Gemini'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
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
