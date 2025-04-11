
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      childAge = 10, 
      curioContext = '', 
      specialistId = 'whizzy',
      sessionId = null
    } = await req.json();

    // Build system instruction based on child's age and specialist
    const systemInstruction = buildSystemInstruction(specialistId, childAge, curioContext);
    
    // Create connection configuration
    const config = {
      "system_instruction": {
        "parts": [{ "text": systemInstruction }]
      },
      "response_modalities": ["TEXT", "AUDIO"],
      "speech_config": {
        "voice_config": {
          "prebuilt_voice_config": {
            "voice_name": getSpecialistVoice(specialistId)
          }
        }
      },
      "context_window_compression": {
        "sliding_window": {}
      },
      "session_resumption": sessionId ? {
        "handle": sessionId
      } : {}
    };

    // For production, we would need to implement WebSocket proxying
    // This is a simplified version that simulates the response
    const response = await fetch(`https://generativelanguage.googleapis.com/v1alpha/models/gemini-2.0-flash-live-001:streamGenerateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY || ''
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        generation_config: {
          temperature: 0.4,
          topP: 0.95,
          topK: 64,
          candidateCount: 1,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Extract text response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm having trouble understanding right now. Can you try asking a different way?";
    
    // For now, we'll use a simulated sessionId
    // In a full implementation, this would come from Gemini Live API
    const newSessionId = sessionId || `session-${Date.now()}`;

    return new Response(
      JSON.stringify({
        text: textResponse,
        audioUrl: null, // In a real implementation, this would be streamed
        sessionId: newSessionId,
        specialistId: specialistId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in gemini-live-chat function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        text: "I couldn't process your message right now. Let's try again in a moment.",
        specialistId: "whizzy" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper functions
function buildSystemInstruction(specialistId: string, age: number, curioContext: string): string {
  const baseInstruction = `You are Whizzy, a friendly educational AI assistant from WonderWhiz, designed to help children learn through conversation. The child you're speaking with is ${age} years old.`;
  
  let contextInfo = curioContext 
    ? `You're currently helping them learn about "${curioContext}". Relate your responses to this topic when possible, but be ready to explore other topics they ask about.` 
    : `Help them explore any topic they're curious about in a fun, educational way.`;
  
  let ageSpecificGuidance = "";
  if (age < 8) {
    ageSpecificGuidance = "Use simple language, short sentences, and lots of examples. Be very enthusiastic and encouraging. Avoid complex explanations.";
  } else if (age < 12) {
    ageSpecificGuidance = "Use clear explanations with some vocabulary building. Balance fun facts with educational content. Be encouraging and positive.";
  } else {
    ageSpecificGuidance = "You can use more advanced vocabulary and concepts. Challenge them to think critically while keeping the tone friendly and supportive.";
  }
  
  let specialistPersonality = "";
  switch (specialistId) {
    case 'nova':
      specialistPersonality = "You are Nova, the space expert. You're enthusiastic about astronomy, space exploration, and cosmic phenomena. Use space analogies when possible.";
      break;
    case 'spark':
      specialistPersonality = "You are Spark, the creative genius. You're enthusiastic about arts, creativity, and imagination. Encourage creative thinking in your responses.";
      break;
    case 'prism':
      specialistPersonality = "You are Prism, the science wizard. You're enthusiastic about experiments, discoveries, and explaining how things work. Use scientific analogies.";
      break;
    default:
      specialistPersonality = "You are Whizzy, a friendly, knowledgeable guide. You're curious, supportive, and always excited to help children discover new things.";
  }
  
  return `${baseInstruction} ${specialistPersonality} ${contextInfo} ${ageSpecificGuidance}
  
  IMPORTANT GUIDELINES:
  1. Keep responses brief (3-5 sentences) but packed with fascinating, accurate information
  2. Use a warm, friendly tone that makes learning fun
  3. Include 1-2 "wow" facts that might surprise the child
  4. End with a question that encourages further curiosity
  5. If asked something inappropriate, gently redirect to educational topics
  6. If you don't know something, admit it and suggest what might be fun to explore instead
  
  The child is using voice to talk to you, so keep your responses conversational and natural.`;
}

function getSpecialistVoice(specialistId: string): string {
  // Map specialists to Gemini Live voices
  const voiceMap: Record<string, string> = {
    'nova': 'Fenrir', // Space expert - deeper voice
    'spark': 'Aoede', // Creative genius - enthusiastic voice
    'prism': 'Orus', // Science wizard - clear, precise voice
    'pixel': 'Charon', // Tech guru - tech-savvy voice
    'atlas': 'Leda', // History expert - storytelling voice
    'lotus': 'Kore', // Nature guide - calm, soothing voice
    'whizzy': 'Puck', // Default - friendly, warm voice
  };
  
  return voiceMap[specialistId] || 'Puck';
}
