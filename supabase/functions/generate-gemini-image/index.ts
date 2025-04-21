
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
    const requestData = await req.json().catch(err => {
      console.error("Error parsing request JSON:", err);
      throw new Error("Invalid request format: Could not parse JSON");
    });
    const { prompt, style = 'cartoon', retryOnFail = true, childAge = 10 } = requestData;

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Prefer OpenAI DALL-E first, fallback cleanly
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!OPENAI_API_KEY && !GEMINI_API_KEY) {
      throw new Error('OPENAI_API_KEY or GEMINI_API_KEY required for image generation');
    }

    const enhancedPrompt = `${prompt}. Style: ${style}, educational, child-friendly, vibrant colors, inspiring wonder and curiosity`;

    // 1. Try DALL-E
    if (OPENAI_API_KEY) {
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
          throw new Error(`DALL-E failed: ${dalleResponse.status} - ${errorText}`);
        }
        const dalleData = await dalleResponse.json();
        if (dalleData?.data?.[0]?.url) {
          return new Response(
            JSON.stringify({
              success: true,
              imageUrl: dalleData.data[0].url,
              textResponse: "A magical image just for you!",
              fallback: false,
              fallbackSource: "dalle"
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        throw new Error("DALL-E success but no image URL returned");
      } catch (err) {
        console.error("[generate-gemini-image] DALL-E failed, attempting fallback:", err);
        // will proceed to Gemini if present
      }
    }
    // 2. Fallback: Gemini, if configured
    if (GEMINI_API_KEY) {
      try {
        const imagen3Url = "https://generativelanguage.googleapis.com/v1/models/imagen3:generateImage";
        const geminiResponse = await fetch(`${imagen3Url}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            responseFormat: { format: "IMAGE" }
          })
        });

        if (!geminiResponse.ok) {
          const errorText = await geminiResponse.text();
          throw new Error(`Gemini failed: ${geminiResponse.status} - ${errorText}`);
        }
        const responseData = await geminiResponse.json();
        let imageUrl = null;
        if (responseData?.image?.data) {
          imageUrl = `data:image/png;base64,${responseData.image.data}`;
        }
        if (imageUrl) {
          return new Response(
            JSON.stringify({
              success: true,
              imageUrl,
              textResponse: "Image made by Gemini",
              fallback: true,
              fallbackSource: "gemini"
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        throw new Error('Gemini: No image returned');
      } catch (err) {
        console.error('[generate-gemini-image] Gemini call failed:', err);
        // fall through to error below
      }
    }
    // 3. Final fallback: placeholder
    return new Response(
      JSON.stringify({
        success: false,
        error: 'All AI image generation failed',
        imageUrl: 'https://placehold.co/600x400/252238/FFFFFF?text=Image+Failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in [generate-gemini-image]:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unexpected error in image generation',
        imageUrl: 'https://placehold.co/600x400/252238/FFFFFF?text=Error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
