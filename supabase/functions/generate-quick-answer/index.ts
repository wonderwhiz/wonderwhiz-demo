
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
    const reqBody = await req.json();
    const { query, question, childAge, childProfile } = reqBody;
    
    // Support both "query" and "question" fields for backward compatibility
    const actualQuestion = query || question;

    if (!actualQuestion) {
      throw new Error('Query is required');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Adapt the prompt based on child's age
    let ageGuidance = '';
    // Get age from either childAge directly or from childProfile object
    const age = childAge || (childProfile?.age ? childProfile.age : 10);
    
    if (age <= 7) {
      ageGuidance = 'Explain in very simple terms suitable for a 5-7 year old. Use short sentences and simple words.';
    } else if (age <= 11) {
      ageGuidance = 'Explain in clear terms suitable for an 8-11 year old. Use accessible language but introduce some educational terms.';
    } else {
      ageGuidance = 'Explain in engaging terms suitable for a 12-16 year old. Use appropriate educational language and concepts.';
    }

    const curioContext = reqBody.curioContext || ''; 
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

    console.log(`Generating quick answer for question: "${actualQuestion}"`);

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
                { text: actualQuestion }
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

    console.log(`Successfully generated answer: "${answer.substring(0, 50)}..."`);
    
    return new Response(
      JSON.stringify({ answer, source: 'api' }),
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
