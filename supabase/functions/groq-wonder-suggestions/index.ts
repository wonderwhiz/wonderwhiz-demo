
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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
    
    // Determine which API to try first based on available keys
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    let questions = [];
    let apiUsed = 'none';
    
    // First try with available API keys
    if (GROQ_API_KEY || OPENAI_API_KEY) {
      try {
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
        
        Make the questions interesting, educational and diverse across different topics. For young children, use simpler language and more "wow" questions.
        
        Output ONLY the list of ${count} questions as an array in JSON format with no additional text.
        Example format: ["Why is the sky blue?", "How do planes fly?", ...] 
        
        The questions should be complete, standalone questions (not conversation starters) that a child would be curious about.`;

        // Try GROQ first if available
        if (GROQ_API_KEY) {
          console.log("Attempting to use Groq API");
          try {
            const groqCompletion = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                  {
                    role: 'system',
                    content: 'You are an AI designed to generate educational, interesting, and age-appropriate questions for children that spark curiosity and wonder. Your output must be exactly in the JSON format requested.',
                  },
                  {
                    role: 'user',
                    content: prompt,
                  },
                ],
                temperature: 0.7,
                max_tokens: 1000,
              }),
            });

            if (groqCompletion.ok) {
              const data = await groqCompletion.json();
              const responseText = data.choices?.[0]?.message?.content || '[]';
              
              // Parse the response - if this succeeds, use it
              const jsonMatch = responseText.match(/\[.*\]/s);
              if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
                apiUsed = 'groq';
                console.log("Successfully used Groq API");
              }
            } else {
              throw new Error(`Groq API error: ${groqCompletion.status}`);
            }
          } catch (groqError) {
            console.error("Error with Groq API:", groqError);
            // Continue to OpenAI fallback
          }
        }
        
        // If Groq failed or wasn't available, try OpenAI
        if (questions.length === 0 && OPENAI_API_KEY) {
          console.log("Attempting to use OpenAI API");
          try {
            const completion = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  {
                    role: 'system',
                    content: 'You are an AI designed to generate educational, interesting, and age-appropriate questions for children that spark curiosity and wonder. Your output must be exactly in the JSON format requested.',
                  },
                  {
                    role: 'user',
                    content: prompt,
                  },
                ],
                temperature: 0.7,
                max_tokens: 1000,
              }),
            });

            if (!completion.ok) {
              throw new Error(`OpenAI API error: ${completion.status}`);
            }

            const data = await completion.json();
            const responseText = data.choices?.[0]?.message?.content || '[]';
            
            // Parse the response
            const jsonMatch = responseText.match(/\[.*\]/s);
            if (jsonMatch) {
              questions = JSON.parse(jsonMatch[0]);
              apiUsed = 'openai';
              console.log("Successfully used OpenAI API");
            }
          } catch (openaiError) {
            console.error("Error with OpenAI API:", openaiError);
            // Will fall through to hardcoded fallbacks
          }
        }
      } catch (apiError) {
        console.error('Error generating suggestions with APIs:', apiError);
        // Will use fallbacks
      }
    }
    
    // If we couldn't get questions from any API, use our hardcoded fallbacks
    if (questions.length === 0) {
      console.log("Using hardcoded fallback suggestions");
      questions = fallbackSuggestions.slice(0, count);
      apiUsed = 'fallback';
    }

    // Return the questions
    return new Response(
      JSON.stringify({ 
        suggestions: questions,
        source: apiUsed
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in groq-wonder-suggestions:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message, 
        suggestions: getDefaultFallbackSuggestions(),
        source: 'error-fallback'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even with errors to prevent crashing the frontend
      }
    );
  }
});

// Function to get age-appropriate fallback suggestions
function getAgeFallbackSuggestions(childAge: number, interests: string[] = []) {
  // Base sets of questions by age group
  let questions = [];
  
  if (childAge < 8) {
    // For young children (5-7)
    questions = [
      "Why is the sky blue?",
      "How do bees make honey?",
      "What makes rainbows appear in the sky?",
      "Why do we see lightning before we hear thunder?",
      "How do plants grow from tiny seeds?",
      "Why do we need to sleep every night?",
      "How do birds know where to fly in winter?",
      "Why does ice float in water?",
      "How do clouds make rain?",
      "Why do leaves change color in fall?",
      "How do butterflies change from caterpillars?",
      "What happens when we mix colors together?"
    ];
  } else if (childAge < 13) {
    // For middle childhood (8-12)
    questions = [
      "How do earthquakes happen?",
      "What makes the ocean salty?",
      "How do airplanes stay in the sky?",
      "What happens when volcanoes erupt?",
      "How do our eyes see colors?",
      "Why do we have different seasons?",
      "How does sound travel through air?",
      "What makes magnets stick together?",
      "How do computers remember things?",
      "Why do stars twinkle in the night sky?",
      "How do animals communicate with each other?",
      "What makes our hearts beat?"
    ];
  } else {
    // For teenagers (13+)
    questions = [
      "How do black holes work?",
      "What causes the northern lights?",
      "How do computers think and learn?",
      "How does the human brain form memories?",
      "What causes climate change?",
      "How did ancient civilizations build massive structures without modern technology?",
      "Why do different languages evolve differently?",
      "How does DNA determine our traits?",
      "What happens during dreams and why do we have them?",
      "How do vaccines teach our immune system?",
      "Can we predict natural disasters before they happen?",
      "How do we know what's in the center of the Earth?"
    ];
  }
  
  // Add interest-specific questions if available
  if (interests && interests.length > 0) {
    const interestQuestions = getInterestBasedQuestions(interests, childAge);
    
    // Combine and shuffle
    const combined = [...interestQuestions, ...questions];
    
    // Fisher-Yates shuffle algorithm
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    
    return combined;
  }
  
  return questions;
}

// Function to get interest-based questions
function getInterestBasedQuestions(interests: string[], childAge: number): string[] {
  const interestQuestions: string[] = [];
  const interestMap: Record<string, string[]> = {
    'space': [
      "How many stars are in our galaxy?",
      "What would happen if you fell into a black hole?",
      "How do astronauts live in space?",
      "Why does the moon change shape?",
      "Could humans live on Mars someday?"
    ],
    'animals': [
      "How do animals survive in extreme weather?",
      "Why do some animals hibernate in winter?",
      "How do dolphins use sound to 'see'?",
      "Why do some animals have stripes or spots?",
      "How smart are elephants compared to humans?"
    ],
    'science': [
      "How do scientists create new medicines?",
      "What is inside an atom?",
      "How do we know dinosaurs existed?",
      "What makes things glow in the dark?",
      "How do scientists predict weather?"
    ],
    'music': [
      "How do musical instruments make different sounds?",
      "Why do some songs make us feel emotions?",
      "How does sound travel to our ears?",
      "Why do different cultures have different music?",
      "How do animals make music in nature?"
    ],
    'history': [
      "How did ancient people build the pyramids?",
      "What was school like 100 years ago?",
      "How did people communicate before phones?",
      "What did dinosaurs really look like?",
      "How did explorers navigate without GPS?"
    ],
    'art': [
      "How do artists mix colors to make new ones?",
      "Why does art look different in different cultures?",
      "How did cave people make paintings that lasted thousands of years?",
      "What makes something 'beautiful'?",
      "How do optical illusions trick our eyes?"
    ],
    'technology': [
      "How do touchscreens know where your finger is?",
      "How do computers talk to each other?",
      "How do robots learn to do new things?",
      "What makes video games work?",
      "How do phones send messages through the air?"
    ]
  };

  // Add questions based on interests
  interests.forEach(interest => {
    const lowerInterest = interest.toLowerCase();
    
    // Check for partial matches in our map keys
    for (const [key, questions] of Object.entries(interestMap)) {
      if (lowerInterest.includes(key) || key.includes(lowerInterest)) {
        // Add age-appropriate questions from this interest
        const filteredQuestions = childAge < 8 
          ? questions.filter(q => q.split(' ').length < 10)  // Simpler questions for young children
          : questions;
          
        interestQuestions.push(...filteredQuestions);
        break;
      }
    }
  });

  return interestQuestions;
}

// Default fallback if everything else fails
function getDefaultFallbackSuggestions(): string[] {
  return [
    "Why is the sky blue?",
    "How do computers work?",
    "Why do seasons change?",
    "How do birds fly?",
    "What makes thunder and lightning?",
    "How do plants grow from seeds?"
  ];
}
