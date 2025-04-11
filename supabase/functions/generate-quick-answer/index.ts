
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, childAge, curioContext } = await req.json();

    if (!query) {
      throw new Error('Query is required');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Adapt the prompt based on child's age
    let ageGuidance = '';
    if (childAge <= 7) {
      ageGuidance = 'Explain in very simple terms suitable for a 5-7 year old. Use short sentences and simple words.';
    } else if (childAge <= 11) {
      ageGuidance = 'Explain in clear terms suitable for an 8-11 year old. Use accessible language but introduce some educational terms.';
    } else {
      ageGuidance = 'Explain in engaging terms suitable for a 12-16 year old. Use appropriate educational language and concepts.';
    }

    const contextPrompt = curioContext ? 
      `The child is learning about "${curioContext}". ` : 
      '';

    // Create system prompt
    const systemPrompt = `
      You are Whizzy, a friendly AI assistant for a children's educational platform called WonderWhiz.
      ${contextPrompt}
      ${ageGuidance}
      Keep your answer concise (maximum 4 sentences) but informative and engaging.
      Focus on making learning fun and memorable.
      Always be encouraging and positive.
    `;

    // Call Gemini API to generate the answer
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: query }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 200,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the answer from Gemini response
    let answer = "I'm not sure about that. Would you like to explore something else?";
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      answer = data.candidates[0].content.parts[0].text || answer;
    }

    return new Response(
      JSON.stringify({ answer }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-quick-answer function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
