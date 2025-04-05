
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { blockId, messageContent, blockType, blockContent, childProfile, specialistId } = await req.json();
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
    
    const specialist = specialists[specialistId] || specialists.nova;
    
    // Create a more detailed context based on the block content
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
    
    const systemMessage = `You are ${specialist.name}, a friendly educational specialist in ${specialist.expertise} for WonderWhiz, an educational platform for children.

You are chatting with a child who is ${childProfile.age} years old and has interests in: ${childProfile.interests.join(', ')}.

${contextInfo}

VERY IMPORTANT: You must respond in ${language} language.

Please respond to their message in a friendly, educational way that:
1. Is age-appropriate for a ${childProfile.age}-year-old
2. Provides helpful, accurate information related to their question
3. Encourages curiosity and deeper exploration of the topic
4. Expands their knowledge with 1-2 interesting new facts they might not know
5. Uses simple language a child would understand
6. Has an encouraging, enthusiastic tone
7. Connects the topic to real-world examples they can relate to
8. Gently corrects any misconceptions in a supportive way

While being educational, maintain a warm and friendly character voice that aligns with your specialist personality. Make the child feel their questions are valued and important.

Keep your response relatively brief (3-4 sentences) but engaging - just enough to spark further curiosity and provide useful knowledge.`;

    console.log("Sending request to OpenAI API for chat response");
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: messageContent }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", errorText);
        throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("OpenAI chat response received");
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response format from OpenAI API");
      }
      
      // Get the text response from OpenAI
      const specialistReply = data.choices[0].message.content.trim();
      
      return new Response(JSON.stringify({ 
        reply: specialistReply,
        specialistId: specialistId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error getting chat response:', error);
      
      // Generate a friendly fallback response
      const fallbackReply = `Great question! I'd love to tell you more about that. Let's explore this topic together next time. What else would you like to know about?`;
      
      return new Response(JSON.stringify({ 
        reply: fallbackReply,
        specialistId: specialistId,
        error: error.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 for client-side resilience
      });
    }
  } catch (error) {
    console.error('Error handling block chat:', error);
    
    return new Response(JSON.stringify({ 
      reply: "I'm excited to chat with you! What would you like to explore today?",
      specialistId: "nova",
      error: error.message 
    }), {
      status: 200, // Return 200 even with errors for client resilience
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
