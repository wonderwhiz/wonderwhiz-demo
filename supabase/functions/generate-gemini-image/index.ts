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
    const { prompt, style = 'cartoon', retryOnFail = true, maxRetries = 2 } = await req.json();

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
    
    // Try Gemini first - using both Imagen 3 and Flash 2.0 APIs
    if (GEMINI_API_KEY) {
      // Keep track of retries
      let retryAttempt = 0;
      let lastError = null;
      
      // Start a retry loop for Gemini APIs
      while (retryAttempt <= maxRetries) {
        try {
          // First attempt with Imagen 3 (Direct image generation API)
          console.log(`Attempt ${retryAttempt + 1}: Generating image with Imagen 3...`);
          
          // Try the newer endpoint format first
          const imagen3Url = "https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate:generateImage";
          
          const imagen3Response = await fetch(`${imagen3Url}?key=${GEMINI_API_KEY}`, {
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
          
          if (imagen3Response.ok) {
            const imagen3Data = await imagen3Response.json();
            
            if (imagen3Data?.image?.data) {
              console.log('Successfully generated image with Imagen 3.0 endpoint');
              const mimeType = 'image/png'; // Default to png
              return new Response(
                JSON.stringify({ 
                  success: true, 
                  imageUrl: `data:${mimeType};base64,${imagen3Data.image.data}`,
                  textResponse: "Image generated with Imagen 3.0",
                  source: "gemini"
                }),
                { 
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
              );
            } else {
              console.log("No image data in Imagen 3.0 response, trying alternate endpoint");
            }
          } else {
            const errorText = await imagen3Response.text();
            console.error(`Imagen 3.0 API error (${imagen3Response.status}):`, errorText);
            console.log("Trying alternative Imagen 3 endpoint...");
            
            // Try the older endpoint format
            const imagen3AlternateUrl = "https://generativelanguage.googleapis.com/v1/models/imagen3:generateImage";
            
            const imagen3AlternateResponse = await fetch(`${imagen3AlternateUrl}?key=${GEMINI_API_KEY}`, {
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
            
            if (imagen3AlternateResponse.ok) {
              const imagen3AltData = await imagen3AlternateResponse.json();
              
              if (imagen3AltData?.image?.data) {
                console.log('Successfully generated image with Imagen 3 alternative endpoint');
                const mimeType = 'image/png';
                return new Response(
                  JSON.stringify({ 
                    success: true, 
                    imageUrl: `data:${mimeType};base64,${imagen3AltData.image.data}`,
                    textResponse: "Image generated with Imagen 3",
                    source: "gemini"
                  }),
                  { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                  }
                );
              } else {
                console.log('No image data in Imagen 3 alternate response, trying Gemini 2.0 Flash...');
              }
            } else {
              const errorAlt = await imagen3AlternateResponse.text();
              console.error(`Imagen 3 alternate API error:`, errorAlt);
              console.log('Falling back to Gemini 2.0 Flash...');
            }
          }
          
          // Second attempt with Gemini 2.0 Flash Experimental for image gen
          console.log("Trying Gemini 2.0 Flash Experimental for image generation...");
          
          const geminiFlashUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp-image-generation:generateContent";
          
          const geminiResponse = await fetch(`${geminiFlashUrl}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
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
          
          if (geminiResponse.ok) {
            const responseData = await geminiResponse.json();
            
            console.log('Flash experimental response structure:', JSON.stringify(responseData));
            
            // Extract image data from the response
            let imageUrl = null;
            let textResponse = '';
            
            // Extraction logic for Gemini 2.0 Flash Experimental
            if (responseData?.candidates?.[0]?.content?.parts) {
              for (const part of responseData.candidates[0].content.parts) {
                if (part.text) {
                  textResponse = part.text;
                }
                
                if (part.inline_data && part.inline_data.mime_type.startsWith('image/')) {
                  // Convert base64 to image URL
                  const imageData = part.inline_data.data;
                  const mimeType = part.inline_data.mime_type;
                  
                  imageUrl = `data:${mimeType};base64,${imageData}`;
                  console.log('Image URL generated from Gemini Flash 2.0');
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
            
            console.error('Could not extract image from Gemini Flash response');
          } else {
            const errorText = await geminiResponse.text();
            console.error(`Gemini Flash API error:`, errorText);
          }
          
          // If we've reached here, all Gemini APIs failed on this attempt
          throw new Error(`All Gemini APIs failed on attempt ${retryAttempt + 1}`);
          
        } catch (geminiError) {
          lastError = geminiError;
          console.error(`Gemini API attempt ${retryAttempt + 1} failed:`, geminiError);
          
          // Increment retry counter
          retryAttempt++;
          
          // If we've exceeded max retries, break the loop
          if (retryAttempt > maxRetries) {
            console.log(`Exceeded max retries (${maxRetries}), falling back to DALL-E if available`);
            break;
          }
          
          // Short delay before retrying to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // All Gemini attempts failed, pass through to DALL-E fallback if enabled
      console.error('All Gemini API attempts failed with error:', lastError);
      if (!retryOnFail) {
        throw new Error(`Gemini API error after ${maxRetries} attempts: ${lastError.message}`);
      }
      // Otherwise continue to DALL-E fallback
    }
    
    // Use DALL-E if Gemini fails or is not available
    if (OPENAI_API_KEY && retryOnFail) {
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
    } else if (!retryOnFail) {
      throw new Error('Gemini image generation failed and fallback disabled');
    } else {
      throw new Error('No available image generation services configured');
    }
  } catch (error) {
    console.error('Error in image generation function:', error);
    
    // Return with error
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
