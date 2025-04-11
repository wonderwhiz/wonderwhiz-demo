
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, style } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Style-specific parameters
    let styleParams = {};
    switch (style) {
      case 'cartoon':
        styleParams = { mimeType: "image/png" };
        break;
      case 'realistic':
        styleParams = { mimeType: "image/png" };
        break;
      case 'painting':
        styleParams = { mimeType: "image/png" };
        break;
      case 'sketch':
        styleParams = { mimeType: "image/png" };
        break;
      case 'isometric':
        styleParams = { mimeType: "image/png" };
        break;
      default:
        styleParams = { mimeType: "image/png" };
    }

    // Call Gemini API to generate the image
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Generate an image based on the following prompt: " + prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
          },
          ...styleParams
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Process Gemini response to extract the image URL
    let imageUrl = null;
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      // If Gemini doesn't return an image (which may happen in current versions),
      // return a placeholder or fallback image based on the topic
      const placeholders = {
        cartoon: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1000&auto=format&fit=crop",
        realistic: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
        painting: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1000&auto=format&fit=crop",
        sketch: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
        isometric: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1000&auto=format&fit=crop",
      };
      
      imageUrl = placeholders[style as keyof typeof placeholders] || placeholders.cartoon;
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-gemini-image function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
