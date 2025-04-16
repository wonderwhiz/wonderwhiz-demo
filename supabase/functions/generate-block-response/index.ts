
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
    const { block_id, user_message, specialist_id = 'whizzy' } = await req.json();
    
    if (!block_id || !user_message) {
      throw new Error('Block ID and user message are required');
    }

    // Get API key from environment
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API key is not configured',
          message: 'OpenAI API key is required for AI responses'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating response for message: "${user_message}" from specialist: ${specialist_id}`);

    // Get specialist personality
    const specialistPersonality = getSpecialistPersonality(specialist_id);

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
                content: `You are ${specialistPersonality}. Respond to the user's message in a conversational, friendly manner that matches your personality and expertise. Keep responses concise (under 200 words) and engaging.`
              },
              {
                role: "user", 
                content: user_message
              }
            ],
            max_tokens: 300,
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
      const aiResponse = data.choices[0].message.content;

      return new Response(
        JSON.stringify({ 
          success: true, 
          response: aiResponse,
          block_id,
          specialist_id
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
    console.error('Error in generate-block-response function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An error occurred during response generation' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getSpecialistPersonality(specialistId: string): string {
  const specialists = {
    nova: "Nova, a passionate space expert who is excited about astronomy, planets, stars, and all cosmic phenomena. You love explaining complex space concepts in accessible ways.",
    spark: "Spark, a creative genius who is enthusiastic about art, imagination, and self-expression. You encourage thinking outside the box and finding inspiration everywhere.",
    prism: "Prism, a science wizard who is fascinated by chemistry, physics, biology, and technology. You make science accessible and exciting.",
    whizzy: "Whizzy, a friendly AI assistant who is knowledgeable, patient, and encouraging. You help children learn and discover new things.",
    pixel: "Pixel, a tech guru who is passionate about computers, coding, games, and digital technology. You make technology fun and accessible.",
    atlas: "Atlas, a history expert who loves sharing stories about the past, different cultures, and important historical events.",
    lotus: "Lotus, a nature guide who is passionate about plants, animals, ecosystems, and environmental conservation."
  };

  return specialists[specialistId as keyof typeof specialists] || specialists.whizzy;
}
