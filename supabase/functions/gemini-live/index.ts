
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  // Check if this is a WebSocket request
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  try {
    // Get API key from environment
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set in environment");
    }

    // Extract data from request
    const url = new URL(req.url);
    const childAgeParam = url.searchParams.get('childAge') || '10';
    const childAge = parseInt(childAgeParam);
    const curioContext = url.searchParams.get('curioContext') || '';
    const specialistId = url.searchParams.get('specialistId') || 'whizzy';

    // Upgrade the connection to WebSocket
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
    
    // Build system instruction based on child's age and specialist
    const systemInstruction = buildSystemInstruction(specialistId, childAge, curioContext);
    
    // Log the connection
    console.log(`WebSocket connection established. Child age: ${childAge}, Context: ${curioContext}, Specialist: ${specialistId}`);
    
    // Connect to Gemini WebSocket API
    const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;
    const geminiSocket = new WebSocket(geminiUrl);
    
    // Event handlers for the client socket
    clientSocket.onopen = () => {
      console.log("Client socket connected");
    };
    
    clientSocket.onmessage = async (event) => {
      try {
        // Process messages from the client
        const clientMessage = JSON.parse(event.data);
        console.log("Received message from client:", clientMessage);
        
        if (clientMessage.type === "setup" && geminiSocket.readyState === WebSocket.OPEN) {
          // Client is setting up the connection
          console.log("Sending setup to Gemini");
          const setupMessage = {
            setup: {
              model: "models/gemini-1.5-flash",
              generationConfig: {
                temperature: 0.4,
                topP: 0.95,
                topK: 64,
                candidateCount: 1,
                maxOutputTokens: 2048,
              },
              systemInstruction: {
                parts: [{ text: systemInstruction }]
              }
            }
          };
          geminiSocket.send(JSON.stringify(setupMessage));
        } else if (clientMessage.type === "message" && geminiSocket.readyState === WebSocket.OPEN) {
          // Client is sending a regular message
          console.log("Sending message to Gemini");
          const contentMessage = {
            clientContent: {
              turns: [
                {
                  role: "user",
                  parts: [{ text: clientMessage.text }]
                }
              ],
              turnComplete: true
            }
          };
          geminiSocket.send(JSON.stringify(contentMessage));
        }
      } catch (error) {
        console.error("Error processing client message:", error);
        clientSocket.send(JSON.stringify({
          error: `Error processing message: ${error.message}`
        }));
      }
    };
    
    clientSocket.onerror = (error) => {
      console.error("Client socket error:", error);
    };
    
    clientSocket.onclose = () => {
      console.log("Client socket closed");
      // Close the Gemini socket when client disconnects
      if (geminiSocket.readyState === WebSocket.OPEN) {
        geminiSocket.close();
      }
    };
    
    // Event handlers for the Gemini socket
    geminiSocket.onopen = () => {
      console.log("Connected to Gemini WebSocket API");
      clientSocket.send(JSON.stringify({
        type: "connection",
        status: "connected"
      }));
    };
    
    geminiSocket.onmessage = (event) => {
      try {
        // Forward responses from Gemini to the client
        const geminiResponse = JSON.parse(event.data);
        console.log("Received response from Gemini:", geminiResponse);
        
        // Forward the response to the client
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify({
            type: "response",
            data: geminiResponse
          }));
          
          // Extract text for easier client-side processing
          if (geminiResponse.serverContent?.modelTurn?.parts) {
            const textContent = geminiResponse.serverContent.modelTurn.parts
              .filter(part => part.text)
              .map(part => part.text)
              .join(' ');
              
            if (textContent) {
              clientSocket.send(JSON.stringify({
                type: "text",
                text: textContent
              }));
            }
          }
          
          // Signal completion of turn
          if (geminiResponse.serverContent?.turnComplete) {
            clientSocket.send(JSON.stringify({
              type: "complete"
            }));
          }
        }
      } catch (error) {
        console.error("Error processing Gemini response:", error);
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify({
            error: `Error processing Gemini response: ${error.message}`
          }));
        }
      }
    };
    
    geminiSocket.onerror = (error) => {
      console.error("Gemini socket error:", error);
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(JSON.stringify({
          error: `Gemini API error: ${error.message || "Unknown error"}`
        }));
      }
    };
    
    geminiSocket.onclose = (event) => {
      console.log(`Gemini socket closed: ${event.code} ${event.reason}`);
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(JSON.stringify({
          type: "disconnected",
          code: event.code,
          reason: event.reason
        }));
        clientSocket.close();
      }
    };
    
    return response;
  } catch (error) {
    console.error("Error in WebSocket handler:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error"
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
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
