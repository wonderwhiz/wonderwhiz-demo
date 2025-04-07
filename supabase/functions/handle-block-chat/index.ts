import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')!;

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
      'nova': { 
        name: 'Nova the Explorer', 
        expertise: 'exploration and discovery', 
        personality: 'enthusiastic, adventurous, and curious. Nova loves mysteries, discoveries, and sharing amazing facts about the world.'
      },
      'spark': { 
        name: 'Spark the Scientist', 
        expertise: 'science and experiments',
        personality: 'analytical, logical, but extremely excited about science. Spark loves explaining complex topics in fun, simple ways with lots of "WOW" facts.'
      },
      'prism': { 
        name: 'Prism the Artist', 
        expertise: 'arts and creativity',
        personality: 'imaginative, colorful, and expressive. Prism sees beauty everywhere and encourages all forms of creativity with boundless enthusiasm.'
      },
      'pixel': { 
        name: 'Pixel the Robot', 
        expertise: 'technology and coding',
        personality: 'precise but friendly, with occasional robot-like speech patterns. Pixel is fascinated by human creativity and loves explaining how technology works.'
      },
      'atlas': { 
        name: 'Atlas the Turtle', 
        expertise: 'geography and history',
        personality: 'wise, patient, and full of stories. Atlas has "been everywhere" and shares historical and geographical knowledge with a sense of wonder.'
      },
      'lotus': { 
        name: 'Lotus the Wellbeing Panda', 
        expertise: 'wellbeing and mindfulness',
        personality: 'calm, nurturing, and encouraging. Lotus speaks in a gentle, soothing way and helps children understand their emotions and find inner peace.'
      },
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
      contextInfo = `The child was given this creative prompt: "${blockContent.prompt}"`;
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

Your personality is: ${specialist.personality}

${contextInfo}

VERY IMPORTANT: You must respond in ${language} language.

Please respond to their message in an EXTRAORDINARILY engaging, educational way that:
1. Is perfectly age-appropriate for a ${childProfile.age}-year-old
2. Provides truly fascinating, scientifically accurate information that will make them say "WOW!"
3. Encourages curiosity with genuine enthusiasm and excitement about learning
4. Shares 1-2 SPECIFIC mind-blowing facts they likely don't know (with numbers, comparisons, and vivid details)
5. Uses age-appropriate but rich vocabulary that expands their knowledge
6. Has an encouraging, animated tone with appropriate exclamation marks 
7. Connects the topic to real-world examples they can relate to with vivid analogies
8. Gently corrects any misconceptions in a supportive way

While being educational, maintain your unique character voice that aligns with your specialist personality. Make the child feel their questions are incredible and worth exploring!

Keep your response relatively brief (3-5 sentences) but packed with fascinating information - just enough to spark further curiosity and provide useful knowledge.

End with a question that encourages them to think more deeply about the topic or share their own thoughts.`;

    console.log("Sending request to Groq API for chat response");
    
    try {
      // First try using Groq API with Llama model
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: messageContent }
          ],
          max_tokens: 300,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error:", errorText);
        throw new Error(`Groq API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("Groq chat response received");
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response format from Groq API");
      }
      
      // Get the text response from Groq
      const specialistReply = data.choices[0].message.content.trim();
      
      return new Response(JSON.stringify({ 
        reply: specialistReply,
        specialistId: specialistId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (groqError) {
      console.error('Error getting chat response from Groq:', groqError);
      
      // Fallback to OpenAI if Groq fails
      try {
        console.log("Falling back to OpenAI API for chat response");
        
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
            temperature: 0.8
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
      } catch (openaiError) {
        console.error('Error getting chat response from OpenAI:', openaiError);
        
        // Generate a friendly fallback response
        const fallbackReply = `Great question! I'd love to tell you more about that. Let's explore this fascinating topic together next time. What else would you like to know about?`;
        
        return new Response(JSON.stringify({ 
          reply: fallbackReply,
          specialistId: specialistId,
          error: openaiError.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 for client-side resilience
        });
      }
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
