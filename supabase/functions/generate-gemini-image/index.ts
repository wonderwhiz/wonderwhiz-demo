
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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      throw new Error('API configuration error');
    }
    
    // Prepare prompt with style and educational adaptation
    const enhancedPrompt = `${prompt}. Style: ${style}, educational, child-friendly, vibrant colors, inspiring wonder and curiosity`;
    
    console.log(`Generating image for prompt: "${enhancedPrompt}" with style: ${style}`);
    
    try {
      // First attempt - Using the Gemini 2.0 Flash Experimental model for image generation
      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp-image-generation:generateContent", 
        {
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
              response_modalities: ["TEXT", "IMAGE"],
              temperature: 0.4,
              top_p: 1,
              top_k: 32
            }
          })
      });
      
      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error(`Gemini API error (${geminiResponse.status}):`, errorText);
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      }
      
      const responseData = await geminiResponse.json();
      console.log('Gemini API response received:', JSON.stringify(responseData).substring(0, 500) + '...');
      
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
            
            imageUrl = `data:${mimeType};base64,${imageData}`;
            console.log('Image URL generated from inline data');
          }
        }
      }
      
      if (!imageUrl) {
        console.warn('No image found in Gemini response, falling back to DALL-E');
        throw new Error("No image in Gemini response - falling back to DALL-E");
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
    } catch (geminiError) {
      console.error('Error calling Gemini API:', geminiError);
      
      // Second attempt - Fall back to OpenAI DALL-E if available
      if (OPENAI_API_KEY) {
        console.log('Falling back to OpenAI DALL-E for image generation');
        
        try {
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
            throw new Error(`DALL-E API error: ${dalleResponse.status} - ${errorText}`);
          }
          
          const dalleData = await dalleResponse.json();
          console.log('DALL-E response received:', JSON.stringify(dalleData).substring(0, 500) + '...');
          
          if (dalleData?.data?.[0]?.url) {
            const dalleImageUrl = dalleData.data[0].url;
            
            return new Response(
              JSON.stringify({ 
                success: true, 
                imageUrl: dalleImageUrl,
                textResponse: "Image generated with DALL-E (fallback)",
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
          console.error('Error calling DALL-E API:', dalleError);
          
          // If DALL-E also fails, fall back to Unsplash
          const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
          const seed = Math.floor(Math.random() * 1000);
          const fallbackUrl = `https://source.unsplash.com/random/800x600?${encodedPrompt}&seed=${seed}`;
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              imageUrl: fallbackUrl,
              fallback: true,
              fallbackSource: "unsplash",
              error: dalleError.message || 'Error generating image with DALL-E'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      } else {
        // If OpenAI key is not available, fall back to Unsplash
        console.log('No OpenAI API key, falling back to Unsplash');
        const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
        const seed = Math.floor(Math.random() * 1000);
        const fallbackUrl = `https://source.unsplash.com/random/800x600?${encodedPrompt}&seed=${seed}`;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            imageUrl: fallbackUrl,
            fallback: true,
            fallbackSource: "unsplash",
            error: geminiError.message || 'Error generating image with Gemini'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }
  } catch (error) {
    console.error('Error in image generation function:', error);
    
    // Return a fallback image even in case of error
    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl: 'https://source.unsplash.com/random/800x600?education',
        fallback: true,
        fallbackSource: "unsplash",
        error: error.message || 'An error occurred during image generation' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
