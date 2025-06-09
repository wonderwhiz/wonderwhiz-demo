
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { childAge, interests = [], count = 6 } = await req.json()

    console.log(`Generating wonder suggestions for childAge: ${childAge}, interests: ${interests.join(', ')}, count: ${count}`)

    // Create an array of robust, hardcoded fallback suggestions by age group
    const fallbackSuggestions = getAgeFallbackSuggestions(childAge, interests);
    
    // Get API key
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    
    let questions: string[] = [];
    let apiUsed = 'fallback';
    
    // Try Groq API with latest Llama model
    if (GROQ_API_KEY) {
      try {
        console.log('Attempting to use Groq API with latest Llama model...');
        
        // Create prompt based on child's age and interests
        const interestsText = interests.length > 0 
          ? `Their interests include: ${interests.join(', ')}.` 
          : 'They have diverse interests.'

        let ageDescription = 'a young person';
        if (childAge <= 7) {
          ageDescription = 'a young child (5-7 years old)';
        } else if (childAge <= 11) {
          ageDescription = 'a child (8-11 years old)';
        } else {
          ageDescription = 'a teenager (12-16 years old)';
        }

        const prompt = `Generate ${count} engaging, age-appropriate curiosity questions for ${ageDescription}. ${interestsText}

Make the questions interesting, educational and diverse across different topics. For young children, focus on simple "how" and "why" questions about everyday phenomena. For older children, include more complex scientific and historical topics.

Return ONLY a numbered list of questions, nothing else. Each question should spark curiosity and be perfect for their age level.

Examples for young children:
1. Why do leaves change colors in fall?
2. How do bees make honey?

Examples for older children:
1. How do black holes form in space?
2. Why did ancient civilizations build pyramids?

Now generate ${count} similar questions:`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile', // Latest Groq Llama model
            messages: [
              {
                role: 'system',
                content: 'You are an expert in creating age-appropriate educational questions for children. Generate engaging curiosity questions that spark wonder and learning.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 800,
            temperature: 0.8
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Groq API error:', response.status, errorText);
          throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Groq API response received successfully');

        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
          const content = data.choices[0].message.content;
          
          // Parse the numbered list
          questions = content
            .split(/\d+\.\s+/)
            .filter(q => q.trim().length > 10)
            .map(q => q.trim().replace(/\n.*$/, ''))
            .slice(0, count);

          if (questions.length >= 3) {
            apiUsed = 'groq-llama-3.3';
            console.log(`Successfully generated ${questions.length} questions using Groq API`);
          } else {
            throw new Error('Insufficient questions generated');
          }
        } else {
          throw new Error('Invalid response format from Groq');
        }
      } catch (error) {
        console.error('Groq API failed:', error.message);
        questions = fallbackSuggestions;
        apiUsed = 'fallback-after-groq-error';
      }
    } else {
      console.log('No Groq API key available, using fallback suggestions');
      questions = fallbackSuggestions;
      apiUsed = 'fallback-no-key';
    }

    // Ensure we have questions
    if (questions.length === 0) {
      questions = fallbackSuggestions;
      apiUsed = 'emergency-fallback';
    }

    return new Response(JSON.stringify({
      suggestions: questions.slice(0, count),
      source: apiUsed,
      childAge,
      interests
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in groq-wonder-suggestions:', error);
    
    // Return fallback suggestions even on error
    const fallbackSuggestions = getAgeFallbackSuggestions(10, []);
    
    return new Response(JSON.stringify({
      suggestions: fallbackSuggestions,
      source: 'error-fallback',
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function getAgeFallbackSuggestions(childAge: number, interests: string[]): string[] {
  const baseQuestions = {
    young: [
      "Why do rainbows appear after it rains?",
      "How do plants grow from tiny seeds?",
      "Why do we see lightning before thunder?",
      "How do bees make honey?",
      "Why do leaves change colors in fall?",
      "How do birds learn to fly?"
    ],
    middle: [
      "How do volcanoes work?",
      "Why do we have different seasons?",
      "How do our eyes see colors?",
      "What makes earthquakes happen?",
      "How do animals communicate?",
      "Why is the ocean salty?"
    ],
    older: [
      "How do black holes form?",
      "What causes the northern lights?",
      "How does DNA work?",
      "Why did dinosaurs become extinct?",
      "How do computers think?",
      "What makes time seem to go faster or slower?"
    ]
  };

  if (childAge <= 7) return baseQuestions.young;
  if (childAge <= 11) return baseQuestions.middle;
  return baseQuestions.older;
}
