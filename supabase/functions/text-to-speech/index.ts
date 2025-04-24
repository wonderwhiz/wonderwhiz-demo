
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 20;     // Max requests per hour
const RATE_LIMIT_WINDOW = 3600;     // Time window in seconds (1 hour)
const MAX_TEXT_LENGTH = 1000;       // Maximum text length to process

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

    // Initialize Supabase client
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
      .eq('api_name', 'text-to-speech')
      .gte('created_at', new Date(windowStart * 1000).toISOString());
    
    if (usageError) {
      console.error('Error checking rate limit:', usageError);
      throw new Error('Error checking rate limit');
    }

    if (recentRequests && recentRequests.length >= RATE_LIMIT_REQUESTS) {
      throw new Error(`Rate limit exceeded. Maximum ${RATE_LIMIT_REQUESTS} requests per hour.`);
    }

    // 3. Parse and validate request
    const { text, voiceId, model = 'eleven_turbo_v2_5' } = await req.json();
    if (!text) {
      throw new Error('Text is required');
    }
    if (text.length > MAX_TEXT_LENGTH) {
      throw new Error(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`);
    }

    // 4. Call ElevenLabs API
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is not configured');
    }

    const finalVoiceId = voiceId || 'pkDwhVp7Wc7dQq2DBbpK';
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${finalVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Get audio data and convert to base64
    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = btoa(
      [...new Uint8Array(audioBuffer)]
        .map(byte => String.fromCharCode(byte))
        .join('')
    );

    // 5. Log API usage
    const characterCount = text.length;
    const estimatedCost = characterCount * 0.00003; // $0.03 per 1000 characters
    
    await supabase
      .from('api_usage_logs')
      .insert({
        user_id: user.id,
        api_name: 'text-to-speech',
        request_data: { 
          text_length: characterCount,
          voice_id: finalVoiceId,
          model: model
        },
        response_status: 'success',
        estimated_cost: estimatedCost
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        audioContent: audioBase64 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }),
      {
        status: error.message?.includes('Unauthorized') ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
