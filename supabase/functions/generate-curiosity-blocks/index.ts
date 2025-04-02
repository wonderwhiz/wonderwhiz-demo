
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, childProfile, blockCount = 10, quickGeneration = false, skipInitial = 0 } = await req.json();
    const language = childProfile.language || 'English';
    
    console.log(`Generating ${blockCount} blocks for query: "${query}" with quickGeneration=${quickGeneration}, skipInitial=${skipInitial}`);
    
    // Record start time to track performance
    const startTime = Date.now();

    // Adjust the system prompt based on whether this is a quick generation or not
    let systemPrompt;
    
    if (quickGeneration) {
      // Simplified prompt for faster initial generation
      systemPrompt = `You are an AI assistant creating educational content for children aged ${childProfile.age}. 
      Generate ${blockCount} diverse, engaging content blocks about the topic: "${query}".
      
      Each block should be appropriate for the age group, aligned with these interests: ${childProfile.interests.join(', ')}.
      
      VERY IMPORTANT: All content must be in ${language} language.
      Content must be factually accurate and educational.

      Return your response as a JSON array with ${blockCount} objects, each having this structure:
      {
        "type": "one of: fact, quiz, flashcard, creative, task, riddle, funFact, activity, news, mindfulness",
        "specialist_id": "one of: nova, spark, prism, pixel, atlas, lotus",
        "content": {
          // Different fields based on block type
        }
      }
      
      Keep content simple but educational. Focus on speed of generation.`;
    } else {
      // Full detailed prompt for complete content
      systemPrompt = `You are an AI assistant creating educational content for children aged ${childProfile.age}. 
      Generate ${blockCount} diverse, engaging content blocks about the topic: "${query}". 
      ${skipInitial > 0 ? `Skip the first ${skipInitial} most obvious blocks as they've already been generated.` : ''}

      Each block should be appropriate for the age group, aligned with these interests: ${childProfile.interests.join(', ')}, and demonstrate these qualities:
      
      1. Educational depth - Provide accurate, interesting information that genuinely teaches something valuable
      2. Scientific accuracy - Ensure all facts are correct and up-to-date with current research
      3. Age-appropriate explanations - Use examples and language children can understand
      4. Curiosity-sparking elements - Add fascinating details that inspire further questions
      5. Visual descriptiveness - Include concrete, visually descriptive details that could be used to generate related images
      6. Real-world applications - Connect concepts to everyday experiences children can relate to
      
      VERY IMPORTANT: All content must be in ${language} language.

      Return your response as a JSON array with ${blockCount} objects, each having this structure:
      {
        "type": "one of: fact, quiz, flashcard, creative, task, riddle, funFact, activity, news, mindfulness",
        "specialist_id": "one of: nova, spark, prism, pixel, atlas, lotus",
        "content": {
          // Different fields based on block type
        }
      }

      For each block type, include these specific fields with ENHANCED content:
      - fact: { 
          "fact": "detailed, accurate, fascinating fact that teaches something valuable and includes concrete visual details", 
          "rabbitHoles": ["thought-provoking question that extends learning", "question connecting to related topics"] 
        }
      - quiz: { 
          "question": "challenging but age-appropriate question that tests understanding and is visually descriptive", 
          "options": ["incorrect but plausible option", "incorrect but plausible option", "correct answer with clear educational value", "incorrect but plausible option"], 
          "correctIndex": 0-3 
        }
      - flashcard: { 
          "front": "clear, concise, visually descriptive question that focuses on key concept", 
          "back": "comprehensive answer that builds deeper understanding" 
        }
      - creative: { 
          "prompt": "imaginative activity that reinforces learning through creativity and has clear visual elements", 
          "type": "drawing or writing" 
        }
      - task: { 
          "task": "hands-on activity that applies learning to the real world with clear visual components", 
          "reward": 5-10 
        }
      - riddle: { 
          "riddle": "clever, educational riddle related to the topic with visual clues", 
          "answer": "answer that reinforces a key concept" 
        }
      - funFact: { 
          "fact": "surprising or unusual fact that creates a sense of wonder and includes vivid visual details", 
          "rabbitHoles": ["question exploring implications", "question connecting to broader topics"] 
        }
      - activity: { 
          "activity": "engaging, educational activity that deepens understanding through direct experience and has clear visual elements" 
        }
      - news: { 
          "headline": "attention-grabbing but accurate news-style headline", 
          "summary": "informative summary of recent developments or research on the topic with descriptive details", 
          "source": "WonderWhiz News" 
        }
      - mindfulness: { 
          "exercise": "calming activity with visual imagery that connects emotional learning with the topic", 
          "duration": 30-60 
        }

      Specialist assignments (match specialists with appropriate content):
      - nova: exploration and discovery topics (big questions, geography, space)
      - spark: science and experiments (scientific facts, experiments, technical concepts)
      - prism: arts and creativity (artistic expression, imagination, storytelling)
      - pixel: technology and coding (digital technology, robots, computational thinking)
      - atlas: geography and history (places, cultures, historical facts)
      - lotus: wellbeing and mindfulness (emotions, self-awareness, mindfulness)

      Make the content educational, engaging, visually descriptive, and designed to foster genuine curiosity in ${language} language!`;
    }

    // Choose appropriate model based on generation type
    // Use haiku for quick generations, sonnet for full detailed content
    const model = quickGeneration ? 'claude-3-haiku-20240307' : 'claude-3-haiku-20240307';
    const maxTokens = quickGeneration ? 2000 : 4000;

    console.log(`Using model: ${model} with max_tokens: ${maxTokens}`);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CLAUDE_API_KEY,
        'Anthropic-Version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: maxTokens,
        messages: [
          { role: 'user', content: systemPrompt }
        ],
        // Add temperature parameter to control randomness
        temperature: quickGeneration ? 0.7 : 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Claude response received");
    
    // Calculate response time in seconds
    const responseTime = (Date.now() - startTime) / 1000;
    console.log(`Generation completed in ${responseTime.toFixed(2)} seconds`);
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error("Invalid response format from Claude API");
    }
    
    // Extract the JSON content from Claude's response
    const text = data.content[0].text;
    
    // Find and parse the JSON array in Claude's response
    let contentBlocksJSON;
    try {
      // Try to extract a JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        contentBlocksJSON = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array found, try parsing the whole text as JSON
        contentBlocksJSON = JSON.parse(text);
      }
    } catch (error) {
      console.error("Error parsing Claude's response:", error);
      console.log("Raw response:", text);
      throw new Error("Failed to parse content blocks from Claude's response");
    }
    
    // Assign unique IDs to each block
    const contentBlocks = contentBlocksJSON.map((block: any) => ({
      ...block,
      id: crypto.randomUUID(),
      liked: false,
      bookmarked: false
    }));

    console.log(`Successfully processed ${contentBlocks.length} content blocks`);

    return new Response(JSON.stringify(contentBlocks), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating curiosity blocks:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
