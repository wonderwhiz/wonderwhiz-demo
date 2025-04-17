
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
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set in environment variables');
      // Fall back to OpenAI if Groq key isn't available
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'API keys are not configured',
            message: 'API keys are required for summary generation'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return await generateWithOpenAI(query, childAge, maxLength, OPENAI_API_KEY, corsHeaders);
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
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
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
        console.error(`Groq API error: ${response.status} ${errorText}`);
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
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
      console.error('Error fetching from Groq:', fetchError);
      throw new Error(`Error connecting to Groq API: ${fetchError.message}`);
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

// Fallback to OpenAI if Groq isn't available
async function generateWithOpenAI(query: string, childAge: number, maxLength: number, apiKey: string, corsHeaders: Record<string, string>) {
  console.log(`Falling back to OpenAI for summary: "${query}"`);

  let promptTemplate = '';
  
  if (childAge < 8) {
    promptTemplate = `Create a very simple summary of "${query}" for a ${childAge}-year-old child. Use short sentences and basic words. Make it fun and engaging! Keep it under ${maxLength} characters.`;
  } else if (childAge < 12) {
    promptTemplate = `Create a concise summary of "${query}" for a ${childAge}-year-old child. Use clear explanations with some educational value. Keep it under ${maxLength} characters.`;
  } else {
    promptTemplate = `Create an informative summary of "${query}" for a ${childAge}-year-old. Include key concepts and facts in a conversational style. Keep it under ${maxLength} characters.`;
  }

  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
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
}
