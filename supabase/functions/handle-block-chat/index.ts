
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
    const { blockId, messageContent, blockType, blockContent, childProfile, specialistId } = await req.json();

    // Get specialist info
    const specialists = {
      'nova': { name: 'Nova the Explorer', expertise: 'exploration and discovery' },
      'spark': { name: 'Spark the Scientist', expertise: 'science and experiments' },
      'prism': { name: 'Prism the Artist', expertise: 'arts and creativity' },
      'pixel': { name: 'Pixel the Robot', expertise: 'technology and coding' },
      'atlas': { name: 'Atlas the Turtle', expertise: 'geography and history' },
      'lotus': { name: 'Lotus the Wellbeing Panda', expertise: 'wellbeing and mindfulness' },
    };
    
    const specialist = specialists[specialistId] || specialists.nova;
    
    // Create a prompt for Claude based on the block content and user message
    let contextInfo = "";
    if (blockType === 'fact' || blockType === 'funFact') {
      contextInfo = `The child was exploring this fact: "${blockContent.fact}"`;
    } else if (blockType === 'quiz') {
      contextInfo = `The child was answering this quiz question: "${blockContent.question}" with options: ${blockContent.options.join(', ')}`;
    } else if (blockType === 'flashcard') {
      contextInfo = `The child was studying a flashcard with question: "${blockContent.front}" and answer: "${blockContent.back}"`;
    } else if (blockType === 'creative') {
      contextInfo = `The child received this creative prompt: "${blockContent.prompt}"`;
    } else if (blockType === 'task') {
      contextInfo = `The child was assigned this task: "${blockContent.task}"`;
    } else if (blockType === 'riddle') {
      contextInfo = `The child was solving this riddle: "${blockContent.riddle}" with answer: "${blockContent.answer}"`;
    } else if (blockType === 'activity') {
      contextInfo = `The child was exploring this activity: "${blockContent.activity}"`;
    } else if (blockType === 'news') {
      contextInfo = `The child was reading this news: "${blockContent.headline}: ${blockContent.summary}"`;
    } else if (blockType === 'mindfulness') {
      contextInfo = `The child was doing this mindfulness exercise: "${blockContent.exercise}"`;
    }
    
    const systemPrompt = `You are ${specialist.name}, a friendly educational specialist in ${specialist.expertise} for WonderWhiz, an educational platform for children.

You are chatting with a child who is ${childProfile.age} years old and has interests in: ${childProfile.interests.join(', ')}.

${contextInfo}

The child has sent you this message: "${messageContent}"

Please respond to their message in a friendly, educational way that:
1. Is age-appropriate for a ${childProfile.age}-year-old
2. Provides helpful information related to their question
3. Encourages curiosity and further exploration
4. Is concise (2-3 sentences only)
5. Uses simple language a child would understand
6. Has an encouraging, enthusiastic tone

You must keep your response brief and engaging - no more than 2-3 sentences total.`;

    console.log("Sending request to Claude API for chat response");
    
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
          { role: 'user', content: systemPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Claude chat response received");
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error("Invalid response format from Claude API");
    }
    
    // Get the text response from Claude
    const specialistReply = data.content[0].text.trim();
    
    return new Response(JSON.stringify({ 
      reply: specialistReply,
      specialistId: specialistId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error handling block chat:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
