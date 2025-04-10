
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

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
    const { query, childAge = 10 } = await req.json();
    
    if (!query) {
      throw new Error('Query is required');
    }

    // Adjust complexity based on child's age
    const complexityLevel = childAge <= 7 ? 'very simple' : 
                          childAge <= 12 ? 'grade-school level' : 'teen-appropriate';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { 
            role: 'system', 
            content: `You are a child-friendly educational assistant designed to provide concise, accurate quick answers to children's questions. 
            Format your response at a ${complexityLevel} reading level. Keep your answer concise (max 3 sentences) but fascinating.
            Do not use bullet points or numbered lists. Write in a conversational, engaging tone that sparks curiosity.`
          },
          { role: 'user', content: `Provide a quick, fascinating answer about: ${query}` }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    const answer = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-quick-answer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
