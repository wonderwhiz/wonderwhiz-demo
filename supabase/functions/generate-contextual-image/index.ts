
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(JSON.stringify({ 
        error: 'Invalid request body',
      }), {
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Extract parameters with better error handling
    let topic = '';
    
    // Try multiple possible property names to be robust
    if (typeof requestBody.topic === 'string' && requestBody.topic.trim()) {
      topic = requestBody.topic.trim();
    } else if (typeof requestBody.blockContent === 'string' && requestBody.blockContent.trim()) {
      topic = requestBody.blockContent.trim();
    } else if (typeof requestBody.query === 'string' && requestBody.query.trim()) {
      topic = requestBody.query.trim();
    } else if (requestBody.content) {
      if (typeof requestBody.content.fact === 'string' && requestBody.content.fact.trim()) {
        topic = requestBody.content.fact.trim();
      } else if (typeof requestBody.content.question === 'string' && requestBody.content.question.trim()) {
        topic = requestBody.content.question.trim();
      } else if (typeof requestBody.content.front === 'string' && requestBody.content.front.trim()) {
        topic = requestBody.content.front.trim();
      }
    }
    
    // If still no topic, default to ocean mysteries
    if (!topic) {
      console.warn('No valid topic found in request, using default');
      topic = "ocean mysteries and deep sea exploration";
    }
    
    // Extract other common parameters with defaults
    const style = requestBody.style || "Pixar-style educational illustration";
    const childAge = requestBody.childAge || requestBody.age || 10;
    
    // Log request parameters
    console.log(`Generating image for topic: ${topic}, style: ${style}, age: ${childAge}`);

    // Check if we have the necessary API keys
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!geminiApiKey && !openAiApiKey) {
      console.error('No API keys configured for image generation');
      return new Response(JSON.stringify({ 
        error: 'API keys not configured',
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Adjust complexity based on child's age
    let ageAppropriate;
    if (childAge <= 7) {
      ageAppropriate = 'simple, colorful, and suitable for young children (age 5-7)';
    } else if (childAge <= 12) {
      ageAppropriate = 'engaging and educational, suitable for children (age 8-12)';
    } else {
      ageAppropriate = 'visually interesting and informative, suitable for teenagers';
    }

    const prompt = `A ${style} about ${topic}. The image should be ${ageAppropriate}, educational, inspiring wonder and curiosity. No text in the image.`;

    // Try Gemini Imagen first if available
    if (geminiApiKey) {
      try {
        console.log('Attempting to generate image with Gemini Imagen 3...');
        
        const imagen3Response = await fetch(
          "https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate:generateImage", 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": geminiApiKey
            },
            body: JSON.stringify({
              prompt: prompt,
              responseFormat: {
                format: "IMAGE"
              }
            })
          }
        );
        
        if (imagen3Response.ok) {
          const imagen3Data = await imagen3Response.json();
          
          if (imagen3Data?.image?.data) {
            console.log('Successfully generated image with Gemini Imagen 3');
            const imageUrl = `data:image/png;base64,${imagen3Data.image.data}`;
            
            return new Response(JSON.stringify({ 
              imageUrl,
              source: 'gemini'
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } else {
            console.log('No image data in Imagen 3 response, trying Gemini 2.0 Flash...');
          }
        } else {
          const errorText = await imagen3Response.text();
          console.error(`Imagen 3 API error (${imagen3Response.status}):`, errorText);
          console.log('Falling back to Gemini 2.0 Flash...');
        }
        
        // Try Gemini 2.0 Flash next
        const geminiResponse = await fetch(
          "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp-image-generation:generateContent", 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": geminiApiKey
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: prompt
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
          
          // Extract image data from the response
          let imageUrl = null;
          
          // Extraction logic for Gemini 2.0 Flash Experimental
          if (responseData?.candidates?.[0]?.content?.parts) {
            for (const part of responseData.candidates[0].content.parts) {
              if (part.inline_data && part.inline_data.mime_type.startsWith('image/')) {
                // Convert base64 to image URL
                const imageData = part.inline_data.data;
                const mimeType = part.inline_data.mime_type;
                
                imageUrl = `data:${mimeType};base64,${imageData}`;
                console.log('Image URL generated from Gemini 2.0 Flash Experimental');
                break; // We found the image, exit the loop
              }
            }
          }
          
          if (imageUrl) {
            return new Response(JSON.stringify({ 
              imageUrl,
              source: 'gemini'
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      } catch (geminiError) {
        console.error('Error using Gemini for image generation:', geminiError);
        // Fall through to OpenAI
      }
    }

    // Try OpenAI DALL-E as fallback
    if (openAiApiKey) {
      try {
        console.log('Using OpenAI DALL-E for image generation');
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('OpenAI API error:', errorData);
          throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const imageUrl = data.data[0].url;

        console.log('Successfully generated image with DALL-E:', imageUrl.substring(0, 40) + '...');

        return new Response(JSON.stringify({ 
          imageUrl,
          source: 'dalle'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (openAIError) {
        console.error('Error calling OpenAI API:', openAIError);
        throw openAIError;
      }
    }
    
    // If we reach here, all image generation attempts failed
    throw new Error('All image generation services failed');
  } catch (error) {
    console.error('Error in generate-contextual-image function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred during image generation',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
