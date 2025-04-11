
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
    let enhancedPrompt = prompt;
    
    switch (style) {
      case 'cartoon':
        enhancedPrompt = `${prompt}, in a vibrant cartoon style with bright colors and simple shapes, kid-friendly`;
        break;
      case 'realistic':
        enhancedPrompt = `${prompt}, in a realistic photographic style with natural lighting and accurate details`;
        break;
      case 'painting':
        enhancedPrompt = `${prompt}, as a colorful digital painting with artistic brushstrokes and vibrant colors`;
        break;
      case 'sketch':
        enhancedPrompt = `${prompt}, as a detailed pencil sketch with fine linework and shading`;
        break;
      case 'isometric':
        enhancedPrompt = `${prompt}, in an isometric 3D illustration style with geometric shapes and clean lines`;
        break;
      default:
        enhancedPrompt = `${prompt}, as a colorful educational illustration`;
    }

    console.log(`Generating image with prompt: ${enhancedPrompt}`);

    // Call Gemini API to generate the image
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Create an image: ${enhancedPrompt}. Make it educational, visually appealing, and suitable for children.` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
          }
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
      // If Gemini doesn't return an image, return a placeholder based on the topic
      const placeholders = {
        cartoon: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1000&auto=format&fit=crop",
        realistic: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
        painting: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1000&auto=format&fit=crop",
        sketch: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
        isometric: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1000&auto=format&fit=crop",
      };
      
      // Additional topic-specific placeholders for better contextual images
      const topicPlaceholders = {
        brain: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop",
        morning: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000&auto=format&fit=crop",
        space: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop",
        ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
        animal: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1000&auto=format&fit=crop",
        firefly: "https://images.unsplash.com/photo-1562155955-1cb2d73488d7?q=80&w=1000&auto=format&fit=crop",
        star: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1000&auto=format&fit=crop",
      };
      
      // Find if any topics match the prompt
      const promptLower = prompt.toLowerCase();
      let matchedTopic = null;
      
      for (const [topic, url] of Object.entries(topicPlaceholders)) {
        if (promptLower.includes(topic)) {
          matchedTopic = url;
          break;
        }
      }
      
      imageUrl = matchedTopic || placeholders[style as keyof typeof placeholders] || placeholders.cartoon;
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
