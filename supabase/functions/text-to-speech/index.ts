
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to map specialist_id to ElevenLabs voice ID
function getVoiceIdForSpecialist(specialistId: string): string {
  const voiceMapping = {
    nova: "EXAVITQu4vr4xnSDxMaL", // Sarah - female voice for Nova
    spark: "XB0fDUnXU5powFXDhCwa", // Charlotte - female voice for Spark
    prism: "bIHbv24MWmeRgasZH58o", // Will - male voice for Prism
    whizzy: "pFZP5JQG7iQjIQuC4Bku", // Lily - female voice for Whizzy
    atlas: "N2lVS1w4EtoT3dr4eOWO", // Callum - male voice for Atlas
    pixel: "TX3LPaxmHKxFdv7VOQHJ", // Liam - male voice for Pixel
    lotus: "XrExE9yKIg1WjnnlVkGX", // Matilda - female voice for Lotus
    default: "pFZP5JQG7iQjIQuC4Bku" // Lily as default
  };

  return voiceMapping[specialistId as keyof typeof voiceMapping] || voiceMapping.default;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, specialistId, model = 'eleven_turbo_v2_5', optimizeStreamingLatency = true } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    // Get API key from environment
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

    // Get voice ID for the specialist
    const voiceId = specialistId ? getVoiceIdForSpecialist(specialistId) : "pFZP5JQG7iQjIQuC4Bku";

    console.log(`Generating speech for text (length: ${text.length}) with specialist: ${specialistId}, voice: ${voiceId}`);

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
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

      return new Response(
        JSON.stringify({ 
          success: true, 
          audioContent: audioBase64,
          specialist: specialistId,
          voiceId
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
