
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 10;  // Max requests
const RATE_LIMIT_WINDOW = 300;   // Time window in seconds (5 minutes)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract JWT token and verify
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized: Invalid token');
    }

    // 2. Rate limiting check
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    const { data: recentRequests, error: usageError } = await supabase
      .from('api_usage_logs')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('api_name', 'huggingface-image')
      .gte('created_at', new Date(windowStart * 1000).toISOString());
    
    if (usageError) {
      console.error('Error checking rate limit:', usageError);
      throw new Error('Error checking rate limit');
    }

    if (recentRequests && recentRequests.length >= RATE_LIMIT_REQUESTS) {
      throw new Error(`Rate limit exceeded. Maximum ${RATE_LIMIT_REQUESTS} requests per ${RATE_LIMIT_WINDOW/60} minutes.`);
    }

    // 3. Parse and validate request
    const { prompt, style = 'cartoon' } = await req.json();
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // 4. Generate image
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));
    console.log(`Generating image for prompt: "${prompt.substring(0, 50)}..."`);

    const result = await hf.textToImage({
      inputs: prompt,
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      parameters: {
        negative_prompt: "ugly, blurry, poor quality, distorted, deformed",
        guidance_scale: 7.5
      }
    });

    // Convert to base64
    const imageBytes = await result.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageBytes).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    // 5. Log API usage
    const estimatedCost = 0.01; // Cost in USD
    await supabase
      .from('api_usage_logs')
      .insert({
        user_id: user.id,
        api_name: 'huggingface-image',
        request_data: { prompt_length: prompt.length },
        response_status: 'success',
        estimated_cost: estimatedCost
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl: `data:image/png;base64,${base64Image}`,
        source: 'huggingface'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred',
        fallbackImageUrl: 'https://placehold.co/600x400/252238/FFFFFF?text=Image+Generation+Failed'
      }),
      { 
        status: error.message?.includes('Unauthorized') ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
