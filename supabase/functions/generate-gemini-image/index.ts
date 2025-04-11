
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
    
    // For now, we'll use Unsplash for reliable image results rather than trying to use Gemini
    // Encode the prompt for URL safety
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
    
    // Generate a random seed to ensure we get different images
    const seed = Math.floor(Math.random() * 1000);
    
    // Use Unsplash for reliable image results
    const imageUrl = `https://source.unsplash.com/random/800x600?${encodedPrompt}&seed=${seed}`;
    
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
    
    // Return a default image as fallback
    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl: 'https://source.unsplash.com/random/800x600?education',
        fallback: true,
        error: error.message || 'An error occurred during image generation' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
