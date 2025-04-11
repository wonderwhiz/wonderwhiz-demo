
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
    const { message, childDetails, history = [] } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      throw new Error('API configuration error');
    }

    // Create system prompt based on child's details
    const childAge = childDetails?.age || 10;
    const ageGroup = childAge < 8 ? 'young child (5-7 years)' : childAge < 12 ? 'child (8-11 years)' : 'teenager (12-16 years)';
    const interests = childDetails?.interests?.join(', ') || 'general topics';
    
    // Build the conversation history
    const safeHistory = Array.isArray(history) ? history : [];
    
    // Add safety measures and error handling
    try {
      // Call Gemini API
      const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are Whizzy, a friendly and educational AI assistant for a ${ageGroup} who is interested in ${interests}. 
                  Answer their questions in a simple, engaging, age-appropriate way, focusing on being educational.
                  Keep answers concise (max 3-4 sentences for young children, 5-6 for older).
                  Use simple language for young children (age 5-7), slightly more advanced for children (8-11), 
                  and more sophisticated for teenagers (12-16).
                  If the question is inappropriate or too complex, gently redirect to a suitable educational topic.
                  Be friendly, supportive, and encouraging of curiosity.`
                }
              ]
            },
            ...safeHistory.map((item: any) => ({
              role: item.role,
              parts: [{ text: item.content }]
            })),
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${errorText}`);
      }

      const data = await geminiResponse.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini');
      }
      
      const responseText = data.candidates[0].content.parts[0].text;
      
      return new Response(
        JSON.stringify({
          success: true,
          message: responseText,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      
      // Return a friendly fallback message
      return new Response(
        JSON.stringify({
          success: false,
          message: "I'm having trouble right now. Can you ask me again or try a different question?",
          error: apiError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in chat function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: "Oops! Something went wrong. Let's try again with a different question.",
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
