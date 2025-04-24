
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 20;     // Max requests
const RATE_LIMIT_WINDOW = 3600;     // Time window in seconds (60 minutes)
const MAX_TEXT_LENGTH = 1000;      // Maximum text length to process

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized: Invalid token' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Rate limiting: Check if user has exceeded the rate limit
    const userId = user.id;
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    // Get user's recent API calls
    const { data: usageLogs, error: usageError } = await supabase
      .from('api_usage_logs')
      .select('created_at, request_data')
      .eq('user_id', userId)
      .eq('api_name', 'text-to-speech')
      .gte('created_at', new Date(windowStart * 1000).toISOString());
    
    if (usageError) {
      console.error('Error checking rate limit:', usageError);
      // Continue execution but log the error
    } else if (usageLogs && usageLogs.length >= RATE_LIMIT_REQUESTS) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded',
          message: `You can only make ${RATE_LIMIT_REQUESTS} text-to-speech requests per hour`,
          retry_after: RATE_LIMIT_WINDOW - (now - Math.floor(new Date(usageLogs[0].created_at).getTime() / 1000))
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse the request
    const { text, voiceId, model = 'eleven_turbo_v2_5', optimizeStreamingLatency = true } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    // 4. Enforce text length limit for cost control
    if (text.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 5. Get API key from environment
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY');
    
    // Log relevant information for debugging
    console.log(`Using ElevenLabs API key exists: ${!!ELEVENLABS_API_KEY}`);
    console.log(`API key length: ${ELEVENLABS_API_KEY ? ELEVENLABS_API_KEY.length : 0}`);
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVEN_LABS_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'ElevenLabs API key is not configured',
          message: 'ElevenLabs API key is required for text-to-speech'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Use a valid default voice ID if none provided
    const finalVoiceId = voiceId || 'pkDwhVp7Wc7dQq2DBbpK';

    console.log(`Generating speech for text (length: ${text.length}) with voice: ${finalVoiceId}`);

    try {
      // 7. Call the ElevenLabs API
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
              style: 0.5,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ElevenLabs API error: ${response.status} ${errorText}`);
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      // Get audio data as ArrayBuffer
      const audioBuffer = await response.arrayBuffer();
      
      // Convert to base64
      const audioBase64 = btoa(
        [...new Uint8Array(audioBuffer)]
          .map(byte => String.fromCharCode(byte))
          .join('')
      );

      // 8. Log the API usage for rate limiting and cost tracking
      const characterCount = text.length;
      const estimatedCost = characterCount * 0.00003; // $0.03 per 1000 characters
      
      const { error: logError } = await supabase
        .from('api_usage_logs')
        .insert({
          user_id: userId,
          api_name: 'text-to-speech',
          request_data: { 
            text_length: characterCount,
            voice_id: finalVoiceId,
            model: model
          },
          response_status: 'success',
          estimated_cost: estimatedCost, // Cost in USD
        });
      
      if (logError) {
        console.error('Error logging API usage:', logError);
        // Continue execution but log the error
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          audioContent: audioBase64 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (fetchError) {
      console.error('Error fetching from ElevenLabs:', fetchError);
      throw new Error(`Error connecting to ElevenLabs API: ${fetchError.message}`);
    }
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An error occurred during speech generation' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
