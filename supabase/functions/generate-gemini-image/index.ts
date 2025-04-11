
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
    
    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      console.error('Missing API keys for image generation');
      throw new Error('API configuration error');
    }
    
    // Prepare prompt with style and educational adaptation
    const enhancedPrompt = `${prompt}. Style: ${style}, educational, child-friendly, vibrant colors, inspiring wonder and curiosity`;
    
    console.log(`Generating image for prompt: "${enhancedPrompt}" with style: ${style}`);
    
    // Try Gemini 2.0 Flash Experimental with Imagen 3 first
    if (GEMINI_API_KEY) {
      try {
        // First attempt: Try with Imagen 3 directly as it's most reliable for images
        console.log("Generating image with Imagen 3...");
        
        const imagen3Response = await fetch(
          "https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate:generateImage", 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": GEMINI_API_KEY
            },
            body: JSON.stringify({
              prompt: enhancedPrompt,
              responseFormat: {
                format: "IMAGE"
              }
            })
          }
        );
        
        if (imagen3Response.ok) {
          const imagen3Data = await imagen3Response.json();
          console.log('Imagen 3 API response structure:', JSON.stringify(Object.keys(imagen3Data)).substring(0, 500));
          
          if (imagen3Data?.image?.data) {
            console.log('Found image in Imagen 3 response');
            const mimeType = 'image/png'; // Default to png
            return new Response(
              JSON.stringify({ 
                success: true, 
                imageUrl: `data:${mimeType};base64,${imagen3Data.image.data}`,
                textResponse: "Image generated with Imagen 3",
                source: "gemini"
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          } else {
            console.log("Imagen 3 response didn't contain image data, trying Gemini 2.0 Flash");
          }
        } else {
          const errorText = await imagen3Response.text();
          console.error(`Imagen 3 API error (${imagen3Response.status}):`, errorText);
          console.log("Falling back to Gemini 2.0 Flash Experimental...");
        }
        
        // Second attempt: Try with Gemini 2.0 Flash Experimental
        console.log("Generating image with Gemini 2.0 Flash Experimental...");
        
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
        console.log('Gemini API response structure:', JSON.stringify(Object.keys(responseData)).substring(0, 500));
        
        // Extract image data from the response
        let imageUrl = null;
        let textResponse = '';
        
        // Extraction logic for Gemini 2.0 Flash Experimental
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
              break; // We found the image, exit the loop
            }
          }
        }
        
        if (imageUrl) {
          return new Response(
            JSON.stringify({ 
              success: true, 
              imageUrl: imageUrl,
              textResponse: textResponse,
              source: "gemini"
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        
        // Deep inspection of the response to find any image data
        console.log('Performing deep inspection of Gemini response to find image data...');
        
        if (responseData.candidates) {
          console.log('Candidates count:', responseData.candidates.length);
          console.log('First candidate keys:', responseData.candidates[0] ? Object.keys(responseData.candidates[0]).join(', ') : 'none');
          
          if (responseData.candidates[0]?.content) {
            console.log('Content keys:', Object.keys(responseData.candidates[0].content).join(', '));
            
            if (responseData.candidates[0].content.parts) {
              console.log('Parts count:', responseData.candidates[0].content.parts.length);
              console.log('Parts types:', responseData.candidates[0].content.parts.map(p => Object.keys(p).join(',')).join(' | '));
            }
          }
        }
        
        console.error('Could not extract image from Gemini response after multiple attempts');
        throw new Error('No image data found in Gemini response');
      } catch (geminiError) {
        console.error('Error with Gemini API, trying DALL-E as fallback:', geminiError);
        // Fall through to DALL-E
      }
    }
    
    // Try DALL-E if Gemini fails or is not available
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
              textResponse: "Image generated with DALL-E",
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
        throw new Error(`All image generation services failed: ${dalleError.message}`);
      }
    } else {
      throw new Error('No available image generation services configured');
    }
  } catch (error) {
    console.error('Error in image generation function:', error);
    
    // Return with error - no fallback to Unsplash
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An error occurred during image generation' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
