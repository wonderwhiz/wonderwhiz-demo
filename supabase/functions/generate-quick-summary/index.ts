
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
    const { query, childAge = 10, maxLength = 300 } = await req.json();
    
    if (!query) {
      throw new Error('Query is required');
    }

    // Get API key from environment
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API key is not configured',
          message: 'OpenAI API key is required for summary generation'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating summary for query: "${query}"`);

    let promptTemplate = '';
    
    if (childAge < 8) {
      promptTemplate = `Create a very simple, clear, and easy-to-understand summary of "${query}" for a ${childAge}-year-old child. Use short sentences, basic words, and an enthusiastic tone. Make it fun and engaging! Keep it under ${maxLength} characters.`;
    } else if (childAge < 12) {
      promptTemplate = `Create a concise, engaging summary of "${query}" for a ${childAge}-year-old child. Use clear explanations with some educational value. Balance fun facts with key information. Keep it under ${maxLength} characters.`;
    } else {
      promptTemplate = `Create an informative and educational summary of "${query}" for a ${childAge}-year-old. Include key concepts and relevant facts in a conversational style. Be accurate but engaging. Keep it under ${maxLength} characters.`;
    }

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an educational assistant creating concise, accurate summaries for children. Adapt your language based on age. Always be factual, engaging and clear."
              },
              {
                role: "user", 
                content: promptTemplate
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} ${errorText}`);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const summary = data.choices[0].message.content;

      return new Response(
        JSON.stringify({ 
          success: true, 
          summary,
          query
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (fetchError) {
      console.error('Error fetching from OpenAI:', fetchError);
      throw new Error(`Error connecting to OpenAI API: ${fetchError.message}`);
    }
  } catch (error) {
    console.error('Error in generate-quick-summary function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An error occurred during summary generation' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
