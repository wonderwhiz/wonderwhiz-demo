
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  interests: string[];
  age: number;
  language: string;
}

interface Curio {
  query: string;
  created_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { childProfile, pastCurios = [] } = await req.json();
    
    if (!childProfile) {
      throw new Error('Child profile is required');
    }

    const interests = childProfile.interests || [];
    const recentQueries = pastCurios.slice(0, 5).map((c: Curio) => c.query);
    const language = childProfile.language || 'English';

    // Updated prompt to generate shorter, more engaging suggestions in the child's preferred language
    const systemMessage = `Generate 4 fun, exciting curiosity prompts for a ${childProfile.age} year old child who has interests in: ${interests.join(', ')}. These should be questions that spark curiosity and wonder. The suggestions MUST be in ${language} language.`;
    
    const userMessage = `
    I need 4 short, fun question suggestions for a child to explore.
    
    Their recent searches were: ${recentQueries.length ? recentQueries.join(', ') : 'None yet'}.
    
    Please make each question:
    - SHORT (max 5-6 words)
    - Exciting and engaging
    - Age-appropriate for a ${childProfile.age} year old
    - Diverse across different topics
    - Educational but fun
    - Avoid repeating the past searches
    
    Return your response as a simple JSON array of strings:
    ["Short question 1?", "Short question 2?", "Short question 3?", "Short question 4?"]
    `;

    console.log("Sending request to OpenAI API for curio suggestions");

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
          { role: 'user', content: userMessage }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("Invalid response format from OpenAI API");
    }
    
    const content = data.choices[0].message.content;
    
    // Extract the JSON array from OpenAI's response
    let suggestionsJSON;
    try {
      const parsedData = JSON.parse(content);
      
      // Look for any array property that might contain our suggestions
      if (Array.isArray(parsedData)) {
        suggestionsJSON = parsedData;
      } else {
        const arrayProps = Object.keys(parsedData).filter(key => Array.isArray(parsedData[key]));
        if (arrayProps.length > 0) {
          suggestionsJSON = parsedData[arrayProps[0]];
        } else {
          throw new Error("Could not find suggestions array in response");
        }
      }
    } catch (error) {
      console.error("Error parsing OpenAI's response:", error);
      console.log("Raw response:", content);
      
      // Fallback to default short suggestions if parsing fails
      suggestionsJSON = [
        "How do volcanoes work?",
        "Coolest dinosaur ever?",
        "Space aliens?",
        "Ocean mysteries?"
      ];
    }
    
    return new Response(JSON.stringify(suggestionsJSON), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating curio suggestions:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackSuggestions: [
        "How do volcanoes work?",
        "Coolest dinosaur ever?",
        "Space aliens?",
        "Ocean mysteries?"
      ] 
    }), {
      status: 200, // Return 200 even on error for client resilience
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
