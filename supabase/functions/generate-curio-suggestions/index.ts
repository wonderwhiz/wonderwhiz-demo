
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const requestData = await req.json();
    console.log("Received request to generate-curio-suggestions");
    console.log("Request body parsed successfully:", JSON.stringify(requestData).substring(0, 200) + "...");

    const { childProfile, topic, forceRefresh = false, timestamp } = requestData;

    if (!childProfile) {
      throw new Error("Child profile is required");
    }

    // Get child interests and age to personalize suggestions
    const interests = childProfile.interests || [];
    const age = childProfile.age || 10;
    
    // Generate curio suggestions using child's interests and age
    // If forceRefresh is true, add more variety
    let suggestions;
    
    if (forceRefresh) {
      console.log("Force refresh requested, generating new suggestions");
      // Ensure unique suggestions by using timestamp
      suggestions = await generateFreshSuggestions(interests, age, timestamp);
    } else if (topic) {
      suggestions = await generateTopicSpecificSuggestions(topic, age);
    } else {
      suggestions = await generateGeneralSuggestions(interests, age);
    }

    return new Response(
      JSON.stringify({
        suggestions,
        generatedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in generate-curio-suggestions:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateFreshSuggestions(interests, age, timestamp) {
  // Use timestamp to ensure uniqueness
  const uniqueParam = timestamp ? `&seed=${timestamp}` : '';
  
  // Generate fresh and surprising suggestions
  // Choose from a variety of question styles
  const questionStarters = [
    "Why do",
    "How does",
    "What would happen if",
    "Can you explain",
    "What's the science behind",
    "Where did",
    "Who invented",
    "When did",
  ];
  
  // Generate combinations of interests and question starters
  const suggestions = [];
  
  // Include some interests-based questions
  for (const interest of interests.slice(0, 2)) {
    const randomStarter = questionStarters[Math.floor(Math.random() * questionStarters.length)];
    suggestions.push(`${randomStarter} ${interest}s work?`);
  }
  
  // Add age-appropriate surprising topics
  if (age < 8) {
    suggestions.push(
      "How do rainbows form in the sky?",
      "Why do some animals hibernate in winter?",
      "How do seeds grow into plants?",
      "Why does the moon change shape?"
    );
  } else if (age < 12) {
    suggestions.push(
      "How does electricity power our homes?",
      "What makes volcanoes erupt?",
      "How do airplanes stay in the sky?",
      "Why do we dream when we sleep?"
    );
  } else {
    suggestions.push(
      "How does quantum physics explain the universe?",
      "What caused the extinction of dinosaurs?",
      "How does the human brain process information?",
      "What are black holes and how do they work?"
    );
  }
  
  // Add a timestamp-based random element
  const randomTopics = [
    "ocean exploration",
    "space discoveries",
    "ancient civilizations",
    "future technology",
    "animal communication",
    "weather patterns",
    "human creativity",
    "natural wonders"
  ];
  
  const randomTopic = randomTopics[Math.floor((Number(timestamp) || Date.now()) % randomTopics.length)];
  suggestions.push(`What are the most amazing facts about ${randomTopic}?`);
  
  return suggestions;
}

async function generateTopicSpecificSuggestions(topic, age) {
  // Generate topic-specific suggestions based on age
  // Simple implementation for now
  return [
    `What are the most interesting things about ${topic}?`,
    `How does ${topic} affect our world?`,
    `What's the history of ${topic}?`,
    `Why is ${topic} important?`,
    `What would happen if ${topic} didn't exist?`
  ];
}

async function generateGeneralSuggestions(interests, age) {
  // Generate general suggestions based on interests and age
  const suggestions = [];
  
  // Add interest-based suggestions
  for (const interest of interests.slice(0, 2)) {
    suggestions.push(`What makes ${interest} so fascinating?`);
    suggestions.push(`How does ${interest} work?`);
  }
  
  // Add age-appropriate general suggestions
  if (age < 8) {
    suggestions.push(
      "Why do stars twinkle at night?",
      "How do birds fly so high?",
      "Why do leaves change color in fall?",
      "How do bees make honey?"
    );
  } else if (age < 12) {
    suggestions.push(
      "How does the internet work?",
      "Why is the ocean salty?",
      "How do smartphones know where we are?",
      "What causes earthquakes?"
    );
  } else {
    suggestions.push(
      "How does artificial intelligence learn?",
      "What happens inside a black hole?",
      "How does DNA store information?",
      "What causes climate change?"
    );
  }
  
  return suggestions;
}
