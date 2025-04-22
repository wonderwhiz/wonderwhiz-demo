
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const groqApiKey = Deno.env.get('GROQ_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { interests = ["science", "space", "animals", "history"] } = await req.json();
    
    if (!groqApiKey) {
      console.error("GROQ_API_KEY is missing");
      // Return fallback suggestions
      return new Response(
        JSON.stringify({ 
          suggestions: [
            "Why do stars twinkle in the night sky?",
            "How do pandas survive eating only bamboo?", 
            "What makes rainbows appear after rain?",
            "How did ancient Egyptians build the pyramids?",
            "What happens inside a volcano before it erupts?",
            "How do airplanes stay in the sky?"
          ]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an AI designed to generate engaging, educational wonder questions for children based on their interests.
    Each question should spark curiosity and be specific enough to generate meaningful educational content.
    Questions should be phrased as questions that start with words like "How", "Why", "What", etc.
    Avoid generic questions and focus on creating specific, interesting questions that will genuinely fascinate children.`;

    const userPrompt = `Generate 6 fascinating, educational wonder questions for children interested in: ${interests.join(', ')}.
    
    Make the questions specific, diverse, and appropriate for children.
    Each question should be something that would genuinely fascinate a child and lead to educational exploration.
    
    Format your response as a JSON array of strings containing ONLY the questions.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Try to parse the content as JSON
    try {
      const suggestionsData = JSON.parse(data.choices[0].message.content);
      if (Array.isArray(suggestionsData) && suggestionsData.length > 0) {
        return new Response(
          JSON.stringify({ suggestions: suggestionsData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error("Error parsing JSON from Groq response:", e);
      // If we can't parse as JSON, try to extract from text with regex
      const suggestionsMatch = data.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (suggestionsMatch) {
        try {
          const suggestions = JSON.parse(suggestionsMatch[0]);
          return new Response(
            JSON.stringify({ suggestions }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (nestedError) {
          console.error("Error parsing extracted JSON:", nestedError);
        }
      }
    }

    // If all parsing fails, extract questions with regex
    const text = data.choices[0].message.content;
    const questionsRegex = /["']([^"']+\?)["']/g;
    const questions = [];
    let match;
    while ((match = questionsRegex.exec(text)) !== null && questions.length < 6) {
      questions.push(match[1]);
    }

    if (questions.length > 0) {
      return new Response(
        JSON.stringify({ suggestions: questions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Last fallback
    return new Response(
      JSON.stringify({ 
        suggestions: [
          "How do volcanoes work?",
          "Why does the moon change shape?", 
          "What makes rainbows appear?",
          "How do plants grow from tiny seeds?",
          "What lives in the deepest parts of the ocean?",
          "How did dinosaurs become extinct?"
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in groq-wonder-suggestions function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate suggestions",
        suggestions: [
          "Why is the sky blue?",
          "How do bees make honey?",
          "What makes thunder and lightning?",
          "How do computers work?",
          "Why do leaves change color in autumn?",
          "How do birds know which way to fly?"
        ]
      }),
      { 
        status: 200, // Return 200 even on error so we still get fallback suggestions
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
