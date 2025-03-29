
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY')!;

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

    // Updated prompt to generate shorter, more engaging suggestions
    const systemPrompt = `Generate 4 short, fun curiosity prompts for a ${childProfile.age} year old child 
    with interests in: ${interests.join(', ')}.
    
    Their recent queries were: ${recentQueries.length ? recentQueries.join(', ') : 'None yet'}.
    
    Based on their age, interests, and past queries, generate 4 interesting, age-appropriate questions.
    
    VERY IMPORTANT: Each prompt must be SHORT (max 5-6 words), punchy, and exciting for a child.
    
    Return your response as a simple JSON array of strings:
    ["Short prompt 1?", "Short prompt 2?", "Short prompt 3?", "Short prompt 4?"]
    
    Make the questions engaging, diverse, educational, and FUN! Avoid repeating past queries.`;

    console.log("Sending request to Claude API for curio suggestions");

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CLAUDE_API_KEY,
        'Anthropic-Version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
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
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error("Invalid response format from Claude API");
    }
    
    const text = data.content[0].text;
    
    // Extract the JSON array from Claude's response
    let suggestionsJSON;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestionsJSON = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found in Claude's response");
      }
    } catch (error) {
      console.error("Error parsing Claude's response:", error);
      console.log("Raw response:", text);
      
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
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
