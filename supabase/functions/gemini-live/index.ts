
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // This is a WebSocket route
  const upgradeHeader = req.headers.get('Upgrade');
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { 
      status: 426,
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  // Parse query parameters
  const url = new URL(req.url);
  const childAge = url.searchParams.get('childAge') || '10';
  const curioContext = url.searchParams.get('curioContext') || '';
  const specialistId = url.searchParams.get('specialistId') || 'whizzy';
  
  console.log(`WebSocket connection established. Child age: ${childAge}, Context: ${curioContext}, Specialist: ${specialistId}`);
  
  // Setup client connection handlers
  socket.onopen = () => {
    console.log("Client socket connected");
    socket.send(JSON.stringify({
      type: 'connection',
      status: 'connected'
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("Received message from client:", message);
      
      if (message.type === 'setup') {
        // Use REST API instead of WebSocket for Gemini
        await handleGeminiChat(socket, "Hi there! I'm Whizzy. How can I help you explore today?", childAge, curioContext, specialistId);
      } else if (message.type === 'message') {
        // Process user message with Gemini
        await handleGeminiChat(socket, message.text, childAge, curioContext, specialistId);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      socket.send(JSON.stringify({
        type: 'error',
        error: error.message || 'Unknown error'
      }));
    }
  };

  socket.onerror = (error) => {
    console.error("Client socket error:", error);
    try {
      socket.send(JSON.stringify({
        type: 'error',
        error: 'WebSocket error occurred'
      }));
    } catch (e) {
      // Socket might already be closed
    }
  };

  socket.onclose = () => {
    console.log("Client socket closed");
  };

  return response;
});

// Function to handle chat interaction using REST API instead of WebSocket
async function handleGeminiChat(socket: WebSocket, userMessage: string, childAge: string, curioContext: string, specialistId: string) {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  
  if (!GEMINI_API_KEY) {
    socket.send(JSON.stringify({
      type: 'error',
      error: 'GEMINI_API_KEY is not set'
    }));
    return;
  }

  try {
    // Build system instruction based on the specialist and child's age
    const systemInstruction = buildSystemInstruction(specialistId, parseInt(childAge), curioContext);
    
    // Use Gemini API with REST endpoint instead of WebSocket
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 2048,
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
    
    // Send the response back to the client
    socket.send(JSON.stringify({
      type: 'text',
      text: textResponse
    }));
    
    // Send a complete message to signal the end of the response
    socket.send(JSON.stringify({
      type: 'complete'
    }));
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    socket.send(JSON.stringify({
      type: 'error',
      error: error.message || 'Unknown error processing your message'
    }));
  }
}

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
    case 'pixel':
      specialistPersonality = "You are Pixel, the tech guru. You're enthusiastic about computers, coding, and digital innovation. Use technology examples when relevant.";
      break;
    case 'atlas':
      specialistPersonality = "You are Atlas, the history expert. You're enthusiastic about past events, cultures, and historical figures. Use historical anecdotes when relevant.";
      break;
    case 'lotus':
      specialistPersonality = "You are Lotus, the nature guide. You're enthusiastic about plants, animals, and the environment. Use nature examples in your explanations.";
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
