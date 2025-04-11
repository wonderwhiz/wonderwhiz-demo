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
    
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    console.log(`Generating image for prompt: ${prompt.substring(0, 100)}...`);

    // For now, we'll use a fallback to keep things simple
    // In production, this would connect to Gemini's image generation API
    // For demonstration, we'll use a placeholder image service
    
    // Encode the prompt for URL safety
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
    
    // Use Unsplash for reliable image results
    const imageUrl = `https://source.unsplash.com/random/800x600?${encodedPrompt}`;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: imageUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in image generation function:', error);
    
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
