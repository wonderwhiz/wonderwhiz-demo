
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY')!;

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
    const { imageUrl, prompt, type } = await req.json();

    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    // Prepare the message for Claude
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `I'm a child who made a ${type || 'drawing'} based on this prompt: "${prompt}". Please give me a brief, enthusiastic, and encouraging analysis (2-3 sentences max) of my work. Be specific in your praise but keep it short, positive and cute. Your tone should be very encouraging for a child.`
          },
          {
            type: "image",
            source: {
              type: "url",
              url: imageUrl
            }
          }
        ]
      }
    ];

    console.log(`Sending request to Claude API for creative analysis`);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Claude analysis received");
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error("Invalid response format from Claude API");
    }
    
    // Get the text response from Claude
    const analysis = data.content[0].text.trim();
    
    return new Response(JSON.stringify({ 
      analysis,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error analyzing creative work:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
