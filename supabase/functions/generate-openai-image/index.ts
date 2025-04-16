
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
    const { prompt, style = "vivid", size = "1024x1024", childAge = 10 } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Get API key from environment
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API key is not configured',
          message: 'OpenAI API key is required for image generation'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating image for prompt: "${prompt}"`);

    // Adapt prompt based on child's age for safety and appropriateness
    let enhancedPrompt = prompt;
    if (childAge < 8) {
      enhancedPrompt += ', kid-friendly, colorful, educational, safe for children, Pixar-style illustration';
    } else if (childAge < 12) {
      enhancedPrompt += ', age-appropriate, educational, colorful, cartoon style';
    } else {
      enhancedPrompt += ', educational, vibrant, stylized';
    }

    try {
      const response = await fetch(
        'https://api.openai.com/v1/images/generations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: enhancedPrompt,
            n: 1,
            size: size,
            quality: "standard",
            style: style
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} ${errorText}`);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      const imageUrl = responseData.data?.[0]?.url;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: imageUrl,
          source: 'openai'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (fetchError) {
      console.error('Error fetching from OpenAI:', fetchError);
      throw new Error(`Error connecting to OpenAI API: ${fetchError.message}`);
    }
  } catch (error) {
    console.error('Error in generate-openai-image function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An error occurred during image generation' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
