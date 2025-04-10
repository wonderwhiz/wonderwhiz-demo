
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { topic, style = "Pixar-style educational illustration", childAge = 10 } = await req.json();
    
    if (!topic) {
      throw new Error('Topic is required');
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

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
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

    const data = await response.json();
    const imageUrl = data.data[0].url;

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-contextual-image function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
