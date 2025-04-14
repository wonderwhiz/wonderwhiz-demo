
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    // Parse the request body
    const requestData = await req.json().catch(err => {
      console.error("Error parsing request JSON:", err);
      throw new Error("Invalid request format: Could not parse JSON");
    });
    
    const { prompt, style = 'cartoon', retryOnFail = true, childAge = 10 } = requestData;

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log(`Processing image generation request for prompt: "${prompt.substring(0, 50)}..."`);

    // Check API keys
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      console.error('Missing required API keys for image generation');
      throw new Error('Configuration error: No image generation APIs are configured');
    }
    
    // Prepare prompt with style and educational adaptation
    const enhancedPrompt = `${prompt}. Style: ${style}, educational, child-friendly, vibrant colors, inspiring wonder and curiosity`;
    
    // First try using OpenAI's DALL-E as it's more reliable
    if (OPENAI_API_KEY) {
      try {
        console.log('Using OpenAI DALL-E for image generation');
        
        const dalleResponse = await fetch(
          "https://api.openai.com/v1/images/generations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "dall-e-3",
              prompt: enhancedPrompt,
              n: 1,
              size: "1024x1024",
              quality: "standard"
            })
          }
        );
        
        if (!dalleResponse.ok) {
          const errorText = await dalleResponse.text();
          console.error(`DALL-E API error (${dalleResponse.status}):`, errorText);
          throw new Error(`DALL-E API error: ${dalleResponse.status}`);
        }
        
        const dalleData = await dalleResponse.json();
        
        if (dalleData?.data?.[0]?.url) {
          const dalleImageUrl = dalleData.data[0].url;
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              imageUrl: dalleImageUrl,
              textResponse: "Image created just for you!",
              fallback: true,
              fallbackSource: "dalle"
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        } else {
          throw new Error("No image URL in DALL-E response");
        }
      } catch (dalleError) {
        console.error('Error with DALL-E API:', dalleError);
        // If DALL-E fails and we have Gemini, try that next
        if (GEMINI_API_KEY) {
          console.log('DALL-E failed, trying Gemini API instead');
        } else {
          throw new Error(`Image generation failed: ${dalleError.message}`);
        }
      }
    }
    
    // Try Gemini if we have the API key and either:
    // 1. We don't have OpenAI key, or
    // 2. OpenAI attempt failed
    if (GEMINI_API_KEY) {
      try {
        console.log('Using Gemini API for image generation');
        
        // First try the newer Imagen model endpoint
        const imagen3Url = "https://generativelanguage.googleapis.com/v1/models/imagen3:generateImage";
        
        const geminiResponse = await fetch(`${imagen3Url}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            responseFormat: {
              format: "IMAGE" 
            }
          })
        });
        
        if (geminiResponse.ok) {
          const responseData = await geminiResponse.json();
          
          console.log('Gemini response received, extracting image data');
          
          // Extract image data from the response
          let imageUrl = null;
          
          if (responseData?.image?.data) {
            // Convert base64 to image URL
            imageUrl = `data:image/png;base64,${responseData.image.data}`;
            console.log('Image URL generated from Gemini');
          }
          
          if (imageUrl) {
            return new Response(
              JSON.stringify({ 
                success: true, 
                imageUrl: imageUrl,
                textResponse: "Image created with Gemini AI",
                source: "gemini"
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }
          
          console.error('Could not extract image from Gemini response');
          throw new Error('No image data in Gemini response');
        } else {
          const errorText = await geminiResponse.text();
          console.error(`Gemini API error:`, errorText);
          throw new Error(`Gemini API error: ${geminiResponse.status}`);
        }
      } catch (geminiError) {
        console.error('Error with Gemini API:', geminiError);
        throw new Error(`All image generation attempts failed: ${geminiError.message}`);
      }
    }
    
    // If we've reached here, we have no working image generation service
    throw new Error('No image generation service available or all attempts failed');
    
  } catch (error) {
    console.error('Error in image generation function:', error);
    
    // Return a valid response even for errors to avoid 500 status
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An error occurred during image generation',
        fallback: true,
        fallbackSource: 'error',
        // Include a placeholder image URL
        imageUrl: 'https://placehold.co/600x400/252238/FFFFFF?text=Image+Generation+Failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Always return 200 to avoid edge function errors in the frontend
      }
    );
  }
});
