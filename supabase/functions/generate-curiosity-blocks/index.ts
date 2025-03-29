
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, childProfile } = await req.json();

    // Construct a detailed system prompt for generating content blocks
    const systemPrompt = `You are an AI assistant creating educational content for children aged ${childProfile.age}. 
    Generate 10 diverse, engaging content blocks about the topic: ${query}. 
    Each block should be unique and interactive, including:
    1. A knowledge card
    2. A quick quiz
    3. An interactive flashcard
    4. A creative prompt
    5. A task/habit suggestion
    6. A fun riddle
    7. An interesting fact
    8. An offline activity
    9. A breaking news-style update
    10. A mindfulness prompt

    Ensure the content is:
    - Age-appropriate
    - Engaging and playful
    - Educational
    - Diverse in format
    - Aligned with child's interests: ${childProfile.interests.join(', ')}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CLAUDE_API_KEY,
        'Anthropic-Version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [
          { role: 'user', content: systemPrompt }
        ]
      })
    });

    const data = await response.json();
    const contentBlocks = JSON.parse(data.content[0].text);

    return new Response(JSON.stringify(contentBlocks), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating curiosity blocks:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
