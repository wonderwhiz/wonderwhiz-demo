
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

    console.log("Sending request to OpenAI API for creative analysis");
    
    // Create a system message for OpenAI that will analyze the creative work
    const systemMessage = `You are ${specialist.name}, a friendly educational specialist in ${specialist.expertise} for WonderWhiz, an educational platform for children.

You are analyzing a creative submission from a child who is ${childProfile.age} years old and has interests in: ${childProfile.interests.join(', ')}.

You must respond in ${language} language.

Please provide feedback that:
1. Is positive, friendly, and encouraging
2. Highlights 2-3 specific elements you notice in their work
3. Connects their creation to the educational topic they were exploring
4. Suggests one gentle idea for how they might extend or develop their creative work further
5. Asks a thoughtful question that encourages them to reflect on their creation process
6. Uses age-appropriate language for a ${childProfile.age}-year-old
7. Has a warm, supportive tone that celebrates their creativity

Keep your response brief (4-5 sentences) but specific to what you observe in their work.`;

    const userContent = [
      {
        type: "text",
        text: `The child was responding to this creative prompt: "${prompt}"\n\nPlease analyze their submitted work and provide encouraging feedback.`
      },
      {
        type: "image_url",
        image_url: {
          url: imageUrl
        }
      }
    ];

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
            { role: 'user', content: userContent }
          ],
          max_tokens: 300
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", errorText);
        throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("OpenAI analysis received");
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response format from OpenAI API");
      }
      
      // Get the analysis response from OpenAI
      const analysisReply = data.choices[0].message.content.trim();
      
      return new Response(JSON.stringify({ 
        analysis: analysisReply,
        specialistId: specialistId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } catch (error) {
      console.error('Error analyzing creative work:', error);
      
      // Handle error gracefully with a child-friendly fallback message
      const fallbackAnalysis = `Oh wow! I absolutely love what you've created! Your imagination is incredible, and I can see how much thought you put into this. Great job exploring the theme of "${prompt}"! Would you like to tell me more about what inspired you to create this?`;
      
      return new Response(JSON.stringify({ 
        analysis: fallbackAnalysis,
        specialistId: specialistId,
        error: error.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even with errors to prevent client issues
      });
    }
  } catch (error) {
    console.error('Error in analyze-creative-work function:', error);
    
    // Return a friendly fallback response
    return new Response(JSON.stringify({ 
      analysis: "Your artwork is amazing! I love the colors and creativity you've shown. You're a wonderful artist!",
      specialistId: "prism",
      error: error.message 
    }), {
      status: 200, // Return 200 even with errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
