
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
    const { text, voiceId, model = 'eleven_turbo_v2_5', optimizeStreamingLatency = true } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          success: true, 
          audioContent: '', // Empty audio content as fallback
          fallback: true,
          message: 'Text-to-speech fallback: No API key configured'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use a valid default voice ID if none provided
    const finalVoiceId = voiceId || 'pkDwhVp7Wc7dQq2DBbpK';

    console.log(`Generating speech for text (length: ${text.length}) with voice: ${finalVoiceId}`);

    // Make the request with a timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
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
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ElevenLabs API error: ${response.status} ${errorText}`);
        
        // Return graceful fallback
        return new Response(
          JSON.stringify({ 
            success: true, 
            audioContent: '', // Empty audio content as fallback
            fallback: true,
            message: `ElevenLabs API error: ${response.status}`,
            error: errorText
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get audio data as ArrayBuffer
      const audioBuffer = await response.arrayBuffer();
      
      // Convert to base64
      const audioBase64 = btoa(
        [...new Uint8Array(audioBuffer)]
          .map(byte => String.fromCharCode(byte))
          .join('')
      );

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
      clearTimeout(timeoutId);
      console.error('Error fetching from ElevenLabs:', fetchError);
      
      // Return graceful fallback
      return new Response(
        JSON.stringify({ 
          success: true, 
          audioContent: '', // Empty audio content as fallback
          fallback: true,
          message: 'Error connecting to ElevenLabs API',
          error: fetchError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
