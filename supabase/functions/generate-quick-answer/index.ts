
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    // Validate request
    if (!req.body) {
      throw new Error('Request body is required');
    }
    
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { query, childAge = 10 } = requestBody;
    
    if (!query) {
      throw new Error('Query is required');
    }

    console.log(`Generating quick answer for query: ${query}, age: ${childAge}`);

    // Adjust complexity based on child's age
    const complexityLevel = childAge <= 7 ? 'very simple' : 
                          childAge <= 12 ? 'grade-school level' : 'teen-appropriate';

    // Check if we have API keys available
    if (!groqApiKey && !openAIApiKey) {
      console.error('Neither GROQ_API_KEY nor OPENAI_API_KEY is configured');
      return new Response(JSON.stringify({ 
        error: 'API keys not configured',
        answer: generateFallbackAnswer(query) 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Try Groq first if available
    if (groqApiKey) {
      try {
        console.log('Attempting to use Groq API');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              { 
                role: 'system', 
                content: `You are a child-friendly educational assistant designed to provide concise, accurate quick answers to children's questions. 
                Format your response at a ${complexityLevel} reading level. Keep your answer concise (max 3 sentences) but fascinating.
                Do not use bullet points or numbered lists. Write in a conversational, engaging tone that sparks curiosity.`
              },
              { role: 'user', content: `Provide a quick, fascinating answer about: ${query}` }
            ],
            temperature: 0.7,
            max_tokens: 150,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Groq API error:', errorData);
          throw new Error(`Groq API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const answer = data.choices[0].message.content.trim();

        console.log('Successfully generated answer with Groq');

        return new Response(JSON.stringify({ answer }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (groqError) {
        console.error('Error using Groq API:', groqError);
        // Fall through to OpenAI if Groq fails
      }
    }

    // Fallback to OpenAI if Groq failed or isn't available
    if (openAIApiKey) {
      try {
        console.log('Attempting to use OpenAI API');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: `You are a child-friendly educational assistant designed to provide concise, accurate quick answers to children's questions. 
                Format your response at a ${complexityLevel} reading level. Keep your answer concise (max 3 sentences) but fascinating.
                Do not use bullet points or numbered lists. Write in a conversational, engaging tone that sparks curiosity.`
              },
              { role: 'user', content: `Provide a quick, fascinating answer about: ${query}` }
            ],
            temperature: 0.7,
            max_tokens: 150,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('OpenAI API error:', errorData);
          throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const answer = data.choices[0].message.content.trim();

        console.log('Successfully generated answer with OpenAI');

        return new Response(JSON.stringify({ answer }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (openAIError) {
        console.error('Error using OpenAI API:', openAIError);
        // Fall through to fallback
      }
    }

    // If all API calls fail, return a fallback answer
    console.log('All API calls failed, using fallback answer');
    return new Response(JSON.stringify({ 
      error: 'API calls failed',
      answer: generateFallbackAnswer(query) 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-quick-answer function:', error);
    
    // Extract query from the request to provide a relevant fallback
    let query = '';
    try {
      const { query: requestQuery } = await req.json();
      if (requestQuery) query = requestQuery;
    } catch (e) {
      // If parsing fails, use empty query
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      answer: generateFallbackAnswer(query) 
    }), {
      status: 200, // Return 200 even for errors to prevent client failures
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to generate fallback answers based on the topic
function generateFallbackAnswer(query: string): string {
  // Default answer if query is empty
  if (!query) {
    return "Learning about our world is an amazing adventure! Asking questions is how all great discoveries start. What else would you like to know?";
  }
  
  // Common topics with fallback responses
  const fallbacks: Record<string, string> = {
    ocean: "The ocean is Earth's last great frontier! Covering over 70% of our planet, oceans are home to millions of species, from microscopic plankton to enormous whales. Scientists estimate we've explored less than 20% of this vast underwater world.",
    volcano: "Volcanoes are Earth's natural pressure valves! They form when hot magma from deep underground rises to the surface. While they can be destructive, volcanoes create new land and release minerals that enrich the soil for plants.",
    space: "Space is an endless frontier of discovery! From distant galaxies to mysterious black holes, our universe contains billions of stars and planets. The light we see from some stars has traveled for millions of years to reach Earth.",
    dinosaur: "Dinosaurs ruled Earth for over 165 million years! These fascinating creatures came in all shapes and sizes, from tiny chicken-sized predators to massive plant-eaters longer than three school buses. Scientists learn about them through fossils preserved in rock.",
    robot: "Robots are machines programmed to perform tasks automatically! They range from simple factory robots that assemble cars to advanced AI systems that can learn and make decisions. Engineers are constantly improving robot capabilities.",
    weather: "Weather is the condition of the atmosphere at a specific time and place. It includes temperature, humidity, wind, clouds, and precipitation. Weather patterns are created by the interaction of the sun's energy with Earth's atmosphere and surface.",
    animal: "Animals are incredible in their diversity! From tiny insects to massive whales, they've evolved amazing adaptations to survive in virtually every environment on Earth. Scientists estimate there may be up to 10 million animal species!",
    plant: "Plants are essential for all life on Earth! They produce oxygen through photosynthesis, provide food and habitats for animals, and help regulate the climate. From tiny mosses to massive sequoia trees, plants have evolved incredible adaptations.",
    human: "Humans are remarkable for their capacity to think, create, and adapt. Our unique abilities to use complex language, create art, develop technology, and work together in large societies have allowed us to thrive in environments across the planet."
  };
  
  // Find the most relevant fallback by checking if the query contains any of our keywords
  const queryLower = query.toLowerCase();
  const relevantTopic = Object.keys(fallbacks).find(topic => 
    queryLower.includes(topic)
  );
  
  if (relevantTopic) {
    return fallbacks[relevantTopic];
  }
  
  // Default fallback for any topic
  return `${query} is a fascinating topic to explore! As you journey through this exploration, you'll discover key facts, understand important concepts, and engage with fun activities that will deepen your knowledge.`;
}
