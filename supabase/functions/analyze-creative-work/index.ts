
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
    const { imageUrl, prompt, childProfile, specialistId } = await req.json();
    const language = childProfile.language || 'English';
    
    // Get specialist info
    const specialists = {
      'nova': { name: 'Nova the Explorer', expertise: 'exploration and discovery' },
      'spark': { name: 'Spark the Scientist', expertise: 'science and experiments' },
      'prism': { name: 'Prism the Artist', expertise: 'arts and creativity' },
      'pixel': { name: 'Pixel the Robot', expertise: 'technology and coding' },
      'atlas': { name: 'Atlas the Turtle', expertise: 'geography and history' },
      'lotus': { name: 'Lotus the Wellbeing Panda', expertise: 'wellbeing and mindfulness' },
    };
    
    const specialist = specialists[specialistId] || specialists.prism;

    console.log("Sending request to Claude API for creative analysis");
    
    // Create a system prompt that will analyze the creative work
    const systemPrompt = `You are ${specialist.name}, a friendly educational specialist in ${specialist.expertise} for WonderWhiz, an educational platform for children.

You are analyzing a creative submission from a child who is ${childProfile.age} years old and has interests in: ${childProfile.interests.join(', ')}.

The child was responding to this creative prompt: "${prompt}"

The child has uploaded an image in response. Please analyze this image and provide a thoughtful, encouraging response.

VERY IMPORTANT: You must respond in ${language} language.

Please provide feedback that:
1. Is positive, friendly, and encouraging
2. Highlights 2-3 specific elements you notice in their work
3. Connects their creation to the educational topic they were exploring
4. Suggests one gentle idea for how they might extend or develop their creative work further
5. Asks a thoughtful question that encourages them to reflect on their creation process
6. Uses age-appropriate language for a ${childProfile.age}-year-old
7. Has a warm, supportive tone that celebrates their creativity

Keep your response brief (4-5 sentences) but specific to what you observe in their work.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CLAUDE_API_KEY,
        'Anthropic-Version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [
          { 
            role: 'user', 
            content: [
              {
                type: 'text',
                text: systemPrompt
              },
              {
                type: 'image',
                source: {
                  type: 'url',
                  url: imageUrl
                }
              }
            ]
          }
        ]
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
    
    // Get the analysis response from Claude
    const analysisReply = data.content[0].text.trim();
    
    return new Response(JSON.stringify({ 
      analysis: analysisReply,
      specialistId: specialistId 
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
