
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const body = await req.json();
    const { childProfile, pastCurios, topic, specialistIds } = body;

    // Different behavior based on whether we're generating topic-based suggestions
    // or personalized curio suggestions
    if (topic) {
      // Topic-specific suggestions (for rabbit hole feature)
      return generateTopicalSuggestions(topic, specialistIds);
    } else if (childProfile) {
      // Personalized suggestions for dashboard
      return generatePersonalizedSuggestions(childProfile, pastCurios);
    } else {
      // No valid input provided
      throw new Error("No topic or child profile provided");
    }
  } catch (error) {
    console.error('Error in generate-curio-suggestions:', error);
    
    // Return a fallback response with default suggestions
    return new Response(
      JSON.stringify({
        fallbackSuggestions: [
          "How do volcanoes work?",
          "What's inside a black hole?",
          "Why do we dream?",
          "How do animals communicate?",
          "What makes rainbows appear?",
          "How do computers think?"
        ],
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

async function generateTopicalSuggestions(topic: string, specialistIds: string[] = []) {
  if (!topic) {
    throw new Error("No topic provided");
  }

  try {
    // Generate suggestions based on the topic
    // This will be used for the "rabbit hole" feature in curio pages
    const defaultSuggestions = [
      {
        question: `What's the most surprising fact about ${topic}?`,
        description: "Uncover deeper mysteries and fascinating details through scientific inquiry"
      },
      {
        question: `Why is ${topic} important to understand?`,
        description: "Discover the real-world significance and impact on our daily lives"
      },
      {
        question: `How does ${topic} work?`,
        description: "Explore the mechanics and processes behind this fascinating subject"
      },
      {
        question: `${topic} in the future`,
        description: "Imagine how this concept might evolve and change in years to come"
      }
    ];
    
    // Generate specialist insights if specialistIds are provided
    const specialistInsights = generateSpecialistInsights(topic, specialistIds);
    
    return new Response(
      JSON.stringify({
        suggestions: defaultSuggestions,
        specialistInsights
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error generating topical suggestions:', error);
    throw error;
  }
}

function generateSpecialistInsights(topic: string, specialistIds: string[] = []) {
  if (!specialistIds.length) return [];
  
  const specialistMap: Record<string, { title: string, domain: string }> = {
    'nova': { title: 'Space Expert', domain: 'astronomy' },
    'spark': { title: 'Creativity Guide', domain: 'creativity' },
    'prism': { title: 'Science Specialist', domain: 'science' },
    'pixel': { title: 'Tech Guru', domain: 'technology' },
    'atlas': { title: 'History Explorer', domain: 'history' },
    'lotus': { title: 'Nature Observer', domain: 'nature' }
  };
  
  return specialistIds.map(id => {
    const specialist = specialistMap[id] || { title: 'Expert', domain: 'general knowledge' };
    
    return {
      question: `How does ${topic} relate to ${specialist.domain}?`,
      description: `Explore the fascinating connections between ${topic} and the world of ${specialist.domain}`,
      specialist: id
    };
  });
}

async function generatePersonalizedSuggestions(childProfile: any, pastCurios: any[] = []) {
  if (!childProfile) {
    throw new Error("Child profile is required");
  }
  
  try {
    const { age = 10, interests = [] } = childProfile;
    
    // Generate based on time of day
    const hour = new Date().getHours();
    const timeBasedSuggestions = getTimeBasedSuggestions(hour);
    
    // Generate based on interests
    const interestBasedSuggestions = getInterestBasedSuggestions(interests);
    
    // Generate age-appropriate suggestions
    const ageBasedSuggestions = getAgeBasedSuggestions(age);
    
    // Combine and shuffle all suggestions
    const allSuggestions = [
      ...timeBasedSuggestions,
      ...interestBasedSuggestions,
      ...ageBasedSuggestions
    ];
    
    // Shuffle using Fisher-Yates algorithm
    for (let i = allSuggestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSuggestions[i], allSuggestions[j]] = [allSuggestions[j], allSuggestions[i]];
    }
    
    // Take a subset to return
    const finalSuggestions = allSuggestions.slice(0, 6);
    
    return new Response(
      JSON.stringify(finalSuggestions),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error generating personalized suggestions:', error);
    throw error;
  }
}

function getTimeBasedSuggestions(hour: number): string[] {
  const defaultSuggestions = {
    morning: [
      "How do our brains wake up in the morning?",
      "Why is the sky blue?",
      "What makes rainbows appear?",
      "How do birds know which way to fly?"
    ],
    afternoon: [
      "How do volcanoes work?",
      "What are the coolest dinosaurs ever discovered?",
      "How do computers think?",
      "What's inside a black hole?"
    ],
    evening: [
      "Why can we see the stars at night?",
      "How do dreams work?",
      "What animals can see in the dark?",
      "How do fireflies make light?"
    ]
  };

  // Return time-appropriate suggestions
  if (hour < 12) return defaultSuggestions.morning;
  if (hour < 18) return defaultSuggestions.afternoon;
  return defaultSuggestions.evening;
}

function getInterestBasedSuggestions(interests: string[]): string[] {
  const interestMap: Record<string, string[]> = {
    'space': [
      "What is the biggest planet?",
      "How many stars are in the universe?",
      "What happens inside a black hole?",
      "How do astronauts live in space?"
    ],
    'animals': [
      "What's the fastest animal on Earth?",
      "How do chameleons change color?",
      "Which animals can live the longest?",
      "How do birds build their nests?"
    ],
    'science': [
      "How do magnets work?",
      "What are atoms made of?",
      "How does electricity flow?",
      "What's inside a volcano?"
    ],
    'history': [
      "Who built the pyramids?",
      "How did dinosaurs become extinct?",
      "What was the first computer like?",
      "Who were the first people to reach the North Pole?"
    ],
    'music': [
      "How do musical instruments make sound?",
      "Why do some songs make us feel happy or sad?",
      "How do bats use sound to navigate?",
      "What is the oldest musical instrument?"
    ],
    'nature': [
      "How do trees communicate with each other?",
      "What makes lightning and thunder?",
      "How do seeds know which way to grow?",
      "Why do leaves change color in autumn?"
    ]
  };
  
  const result: string[] = [];
  
  // For each interest, add 1-2 related questions
  for (const interest of interests) {
    if (interestMap[interest]) {
      // Shuffle the interest's questions
      const shuffled = [...interestMap[interest]];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      // Add 1-2 questions from this interest
      result.push(shuffled[0]);
      if (Math.random() > 0.5 && shuffled.length > 1) {
        result.push(shuffled[1]);
      }
    }
  }
  
  return result;
}

function getAgeBasedSuggestions(age: number): string[] {
  // Age-appropriate suggestion templates
  const suggestionsByAge = {
    young: [
      "Why is the sky blue?",
      "How do butterflies fly?",
      "Why do we need to sleep?",
      "How do plants grow?"
    ],
    middle: [
      "How do volcanoes work?",
      "What are black holes?",
      "How do computers work?",
      "Why do some animals hibernate?"
    ],
    older: [
      "How does the internet work?",
      "What causes climate change?",
      "How do rockets fly to space?",
      "How does the human brain work?"
    ]
  };
  
  // Get age-appropriate suggestions
  if (age <= 7) return suggestionsByAge.young;
  if (age >= 12) return suggestionsByAge.older;
  return suggestionsByAge.middle;
}
