
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API key from environment variable
const groqApiKey = Deno.env.get('GROQ_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { topic, specialistIds = [] } = await req.json();

    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'No topic provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a system prompt for generating curio suggestions
    const systemPrompt = `You are a highly intelligent educational assistant for a children's learning platform. 
    Your task is to generate engaging, educational, and age-appropriate follow-up questions related to the topic.
    Make the questions curious, educational, and inspiring for children age 7-13.
    Each question should open up new areas of exploration, and help children develop a love for learning.`;

    // Create a user prompt with the topic
    const userPrompt = `Generate 4 intriguing follow-up questions for children related to the topic: "${topic}".
    For each question, also provide a brief description of what the child will learn.
    
    Also, generate 2 specialist insights where experts would provide unique perspectives. 
    Format your response as a JSON object with:
    {
      "suggestions": [
        {"question": "Question text here", "description": "Brief description of what they'll learn"},
        ...
      ],
      "specialistInsights": [
        {"question": "Expert question here", "description": "Brief description", "specialist": "SPECIALIST_ID"},
        ...
      ]
    }
    
    Available specialist IDs: ${specialistIds.join(', ') || "nova, spark, prism, pixel, atlas, lotus"}
    
    Make all questions genuinely interesting and intriguing for children.`;

    // Call the Groq API to generate suggestions
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
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Groq API:', errorData);
      throw new Error('Failed to generate suggestions from Groq API');
    }

    const data = await response.json();
    
    let suggestions;
    try {
      // Try to parse the content as JSON
      suggestions = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // If parsing fails, try to extract JSON with regex
      console.error('Error parsing Groq response as JSON:', parseError);
      
      const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          suggestions = JSON.parse(jsonMatch[0]);
        } catch (nestedParseError) {
          console.error('Error parsing extracted JSON:', nestedParseError);
          // Fall back to default suggestions
          suggestions = generateDefaultSuggestions(topic, specialistIds);
        }
      } else {
        // Fall back to default suggestions
        suggestions = generateDefaultSuggestions(topic, specialistIds);
      }
    }

    return new Response(
      JSON.stringify(suggestions),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-curio-suggestions function:', error);
    
    // Generate default suggestions as fallback
    const defaultSuggestions = generateDefaultSuggestions(
      (req.json?.topic || "this topic") as string, 
      (req.json?.specialistIds || []) as string[]
    );
    
    return new Response(
      JSON.stringify(defaultSuggestions),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});

// Function to generate default suggestions when API fails
function generateDefaultSuggestions(topic: string, specialistIds: string[] = []) {
  const simpleTopic = topic.toLowerCase().replace(/[?.,!]/g, '').trim();
  
  // Default suggestions
  const suggestions = [
    {
      question: `What's the most surprising fact about ${simpleTopic}?`,
      description: "Uncover deeper mysteries and fascinating details through scientific inquiry"
    },
    {
      question: `Why is ${simpleTopic} important to understand?`,
      description: "Discover the real-world significance and impact on our daily lives"
    },
    {
      question: `How ${simpleTopic} connects to creativity`,
      description: "Explore fascinating interdisciplinary connections across different fields of knowledge"
    },
    {
      question: `${simpleTopic} in the natural world`,
      description: "Examine how this concept manifests and influences our understanding"
    }
  ];
  
  // Default specialist insights
  const specialists = specialistIds.length > 0 ? specialistIds : ['nova', 'spark'];
  const specialistInsights = [
    {
      question: `What creative projects are inspired by ${simpleTopic}?`,
      description: "Discover how this topic influences creative thinking and problem-solving",
      specialist: specialists[0] || 'spark'
    },
    {
      question: `How does ${simpleTopic} connect to the natural world?`,
      description: "Explore the fascinating connections between this topic and nature",
      specialist: specialists[1] || 'nova'
    }
  ];
  
  return {
    suggestions,
    specialistInsights
  };
}
