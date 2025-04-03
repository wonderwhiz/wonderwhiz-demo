import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY')!;

// Basic fallback content for when Claude API is unavailable or for quick first rendering
const generateFallbackContent = (query: string, blockCount: number) => {
  const blocks = [];
  const specialistIds = ['nova', 'spark', 'prism', 'pixel', 'atlas', 'lotus'];
  const types = ['fact', 'quiz', 'flashcard', 'creative', 'task', 'riddle', 'funFact', 'activity', 'news', 'mindfulness'];
  
  for (let i = 0; i < blockCount; i++) {
    const specialistId = specialistIds[Math.floor(Math.random() * specialistIds.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let content;
    switch (type) {
      case 'fact':
      case 'funFact':
        content = {
          fact: `Here's an interesting fact related to "${query}". We're currently generating more detailed content for you.`,
          rabbitHoles: [`Learn more about ${query}`, `Explore related topics`]
        };
        break;
      case 'quiz':
        content = {
          question: `What's something interesting about ${query}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 2
        };
        break;
      case 'flashcard':
        content = {
          front: `Key concept about ${query}`,
          back: `This is where you'll find the answer! More detailed content is being generated.`
        };
        break;
      case 'creative':
        content = {
          prompt: `Draw or write something about ${query}`,
          type: Math.random() > 0.5 ? "drawing" : "writing"
        };
        break;
      case 'task':
        content = {
          task: `Do a simple activity related to ${query}`,
          reward: 5
        };
        break;
      case 'riddle':
        content = {
          riddle: `Here's a riddle about ${query}`,
          answer: `The answer relates to ${query}`
        };
        break;
      case 'activity':
        content = {
          activity: `Try this activity to learn more about ${query}`
        };
        break;
      case 'news':
        content = {
          headline: `Latest Discovery About ${query}!`,
          summary: `Scientists have made an amazing discovery about ${query}. More detailed content coming soon!`,
          source: "WonderWhiz News"
        };
        break;
      case 'mindfulness':
        content = {
          exercise: `Take a moment to think about ${query} and how it relates to the world around you`,
          duration: 30
        };
        break;
      default:
        content = {
          fact: `Learning about ${query} is fascinating! More content is being generated.`,
          rabbitHoles: ["Explore more"]
        };
    }
    
    blocks.push({
      type,
      specialist_id: specialistId,
      content
    });
  }
  
  return blocks;
};

// Maximum retry attempts for Claude API
const MAX_RETRIES = 2;

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
    
    // OPTIMIZATION: Determine if we should use fallback content immediately (for fast first responses)
    const useFastFallback = quickGeneration && blockCount <= 2;

    // If we need quick generation with minimal blocks, use fallback immediately
    if (useFastFallback) {
      console.log("Using immediate fallback content for fast response");
      const fallbackBlocks = generateFallbackContent(query, blockCount);
      
      const contentBlocks = fallbackBlocks.map((block: any) => ({
        ...block,
        id: crypto.randomUUID(),
        liked: false,
        bookmarked: false
      }));
      
      return new Response(JSON.stringify(contentBlocks), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // OPTIMIZATION: Adjust the system prompt based on whether this is a quick generation or not
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
      // OPTIMIZATION: Streamlined detailed prompt for better performance
      systemPrompt = `You are an AI assistant creating educational content for children aged ${childProfile.age}. 
      Generate ${blockCount} diverse, engaging content blocks about the topic: "${query}". 
      ${skipInitial > 0 ? `Skip the first ${skipInitial} most obvious blocks as they've already been generated.` : ''}

      Each block should be appropriate for the age group, aligned with these interests: ${childProfile.interests.join(', ')}, and demonstrate these qualities:
      
      1. Educational value - Provide accurate, interesting information
      2. Age-appropriate explanations - Use examples and language children can understand
      3. Visual descriptiveness - Include details that could be used to generate related images
      
      VERY IMPORTANT: All content must be in ${language} language.

      Return your response as a JSON array with ${blockCount} objects, each having this structure:
      {
        "type": "one of: fact, quiz, flashcard, creative, task, riddle, funFact, activity, news, mindfulness",
        "specialist_id": "one of: nova, spark, prism, pixel, atlas, lotus",
        "content": {
          // Different fields based on block type
        }
      }

      For each block type, include these specific fields:
      - fact/funFact: { "fact": "detailed fact", "rabbitHoles": ["question 1", "question 2"] }
      - quiz: { "question": "quiz question", "options": ["option1", "option2", "option3", "option4"], "correctIndex": 0-3 }
      - flashcard: { "front": "question", "back": "answer" }
      - creative: { "prompt": "creative prompt", "type": "drawing or writing" }
      - task: { "task": "activity description", "reward": 5-10 }
      - riddle: { "riddle": "riddle text", "answer": "answer" }
      - activity: { "activity": "activity description" }
      - news: { "headline": "headline", "summary": "summary", "source": "WonderWhiz News" }
      - mindfulness: { "exercise": "exercise description", "duration": 30-60 }

      Match specialists with appropriate content topics. Make content educational and visually descriptive in ${language} language!`;
    }
    
    // OPTIMIZATION: Choose appropriate model based on generation type
    // Always use haiku for faster generation
    const model = 'claude-3-haiku-20240307';
    const maxTokens = quickGeneration ? 1500 : 3000; // OPTIMIZATION: Reduced token counts for faster responses

    console.log(`Using model: ${model} with max_tokens: ${maxTokens}`);
    
    // Implement retry logic for Claude API
    let attempt = 0;
    let contentBlocksJSON;
    
    while (attempt <= MAX_RETRIES) {
      try {
        attempt++;
        console.log(`Claude API attempt ${attempt} of ${MAX_RETRIES + 1}`);
        
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
            // OPTIMIZATION: Higher temperature for quick generation for more variety
            temperature: quickGeneration ? 0.8 : 0.7
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Claude API error (attempt ${attempt}):`, errorText);
          
          // If this is our last retry and there's an Overloaded error, use fallback content
          if (attempt > MAX_RETRIES || errorText.includes("overloaded")) {
            console.log("Claude API overloaded or max retries reached, using fallback content");
            contentBlocksJSON = generateFallbackContent(query, blockCount);
            break;
          }
          
          // If not the last retry, wait before trying again
          if (attempt <= MAX_RETRIES) {
            const delay = Math.pow(2, attempt - 1) * 500; // Exponential backoff
            console.log(`Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          throw new Error(`Claude API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Claude response received");
        
        if (!data.content || !data.content[0] || !data.content[0].text) {
          throw new Error("Invalid response format from Claude API");
        }
        
        // Extract the JSON content from Claude's response
        const text = data.content[0].text;
        
        // Find and parse the JSON array in Claude's response
        try {
          // Try to extract a JSON array from the response
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            contentBlocksJSON = JSON.parse(jsonMatch[0]);
          } else {
            // If no JSON array found, try parsing the whole text as JSON
            contentBlocksJSON = JSON.parse(text);
          }
          
          // We got valid content, break the retry loop
          break;
          
        } catch (parseError) {
          console.error("Error parsing Claude's response:", parseError);
          console.log("Raw response:", text);
          
          // If this is our last retry, use fallback content
          if (attempt > MAX_RETRIES) {
            console.log("Max retries reached with parsing errors, using fallback content");
            contentBlocksJSON = generateFallbackContent(query, blockCount);
            break;
          }
          
          // Otherwise, prepare to retry
          const delay = Math.pow(2, attempt - 1) * 500; // Exponential backoff
          console.log(`Waiting ${delay}ms before retry due to parse error...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Error in Claude API request (attempt ${attempt}):`, error);
        
        // If this is our last retry, use fallback content
        if (attempt > MAX_RETRIES) {
          console.log("Max retries reached with request errors, using fallback content");
          contentBlocksJSON = generateFallbackContent(query, blockCount);
          break;
        }
        
        // Otherwise, prepare to retry
        const delay = Math.pow(2, attempt - 1) * 500; // Exponential backoff
        console.log(`Waiting ${delay}ms before retry due to request error...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Calculate response time in seconds
    const responseTime = (Date.now() - startTime) / 1000;
    console.log(`Generation completed in ${responseTime.toFixed(2)} seconds`);
    
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
    
    // Generate basic fallback content even in case of catastrophic errors
    const fallbackBlocks = generateFallbackContent("knowledge and curiosity", 2).map((block: any) => ({
      ...block,
      id: crypto.randomUUID(),
      liked: false,
      bookmarked: false
    }));
    
    return new Response(JSON.stringify(fallbackBlocks), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
