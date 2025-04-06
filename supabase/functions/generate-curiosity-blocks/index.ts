import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')!;

// Basic fallback content for when API is unavailable or for quick first rendering
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

// Maximum retry attempts for API
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

    // Prepare system message and user message for the API
    let systemMessage = `You are an AI assistant creating highly engaging, educational content for children aged ${childProfile.age}. 
    Each piece of content should be rich with interesting facts, deeply relevant to the topic, and presented in an engaging way.
    The content must be 100% accurate, age-appropriate, and optimized to capture a child's curiosity and imagination.
    Content must be in ${language} language.`;
    
    let userMessage = `Generate ${blockCount} diverse, engaging content blocks about the topic: "${query}". 
    ${skipInitial > 0 ? `Skip the first ${skipInitial} most obvious blocks as they've already been generated.` : ''}

    Each block should:
    1. Be extremely relevant to "${query}"
    2. Contain accurate, fascinating information that would amaze a ${childProfile.age}-year-old
    3. Be written in a fun, engaging style with simple language
    4. Include visual descriptions that could be used to generate related images
    5. Align with these interests: ${childProfile.interests.join(', ')}

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

    Match specialists with appropriate content topics. Make content highly educational, fun, and visually descriptive!
    
    NOTE: Make sure all content is 100% accurate, exceptionally relevant to "${query}", and deeply engaging for children.`;
    
    // Implement retry logic for API calls
    let attempt = 0;
    let contentBlocksJSON;
    
    while (attempt <= MAX_RETRIES) {
      try {
        attempt++;
        console.log(`Groq API attempt ${attempt} of ${MAX_RETRIES + 1}`);
        
        // First try using Groq API with Llama model
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: userMessage }
            ],
            response_format: { type: "json_object" },
            temperature: quickGeneration ? 0.9 : 0.7,
            max_tokens: 4000
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Groq API error (attempt ${attempt}):`, errorText);
          
          // If this is our last retry or there's an overloaded error, try OpenAI
          if (attempt > MAX_RETRIES || errorText.includes("overloaded") || errorText.includes("limit")) {
            console.log("Groq API overloaded or max retries reached, trying OpenAI fallback");
            break;
          }
          
          // If not the last retry, wait before trying again
          if (attempt <= MAX_RETRIES) {
            const delay = Math.pow(2, attempt - 1) * 500; // Exponential backoff
            console.log(`Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          throw new Error(`Groq API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Groq response received");
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
          throw new Error("Invalid response format from Groq API");
        }
        
        // Extract the JSON content from Groq's response
        const content = data.choices[0].message.content;
        
        try {
          // Parse the JSON response
          const parsedData = JSON.parse(content);
          
          // Check if we have a blocks array directly or nested under a property
          if (Array.isArray(parsedData)) {
            contentBlocksJSON = parsedData;
          } else if (parsedData.blocks && Array.isArray(parsedData.blocks)) {
            contentBlocksJSON = parsedData.blocks;
          } else {
            // Look for any array property that might contain our blocks
            const arrayProps = Object.keys(parsedData).filter(key => Array.isArray(parsedData[key]));
            if (arrayProps.length > 0) {
              contentBlocksJSON = parsedData[arrayProps[0]];
            } else {
              throw new Error("Could not find blocks array in response");
            }
          }
          
          // We got valid content, break the retry loop
          break;
          
        } catch (parseError) {
          console.error("Error parsing Groq's response:", parseError);
          console.log("Raw response:", content);
          
          // If this is our last retry, try OpenAI
          if (attempt > MAX_RETRIES) {
            console.log("Max retries reached with parsing errors from Groq, trying OpenAI");
            break;
          }
          
          // Otherwise, prepare to retry
          const delay = Math.pow(2, attempt - 1) * 500; // Exponential backoff
          console.log(`Waiting ${delay}ms before retry due to parse error...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Error in Groq API request (attempt ${attempt}):`, error);
        
        // If this is our last retry, try OpenAI
        if (attempt > MAX_RETRIES) {
          console.log("Max retries reached with request errors from Groq, trying OpenAI");
          break;
        }
        
        // Otherwise, prepare to retry
        const delay = Math.pow(2, attempt - 1) * 500; // Exponential backoff
        console.log(`Waiting ${delay}ms before retry due to request error...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If Groq failed after all retries, try OpenAI as fallback
    if (!contentBlocksJSON) {
      try {
        console.log("Attempting OpenAI fallback after Groq failed");
        
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
            temperature: quickGeneration ? 0.9 : 0.7
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI API error:`, errorText);
          throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("OpenAI response received as fallback");
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
          throw new Error("Invalid response format from OpenAI API");
        }
        
        // Extract the JSON content from OpenAI's response
        const content = data.choices[0].message.content;
        
        try {
          // Parse the JSON response
          const parsedData = JSON.parse(content);
          
          // Check if we have a blocks array directly or nested under a property
          if (Array.isArray(parsedData)) {
            contentBlocksJSON = parsedData;
          } else if (parsedData.blocks && Array.isArray(parsedData.blocks)) {
            contentBlocksJSON = parsedData.blocks;
          } else {
            // Look for any array property that might contain our blocks
            const arrayProps = Object.keys(parsedData).filter(key => Array.isArray(parsedData[key]));
            if (arrayProps.length > 0) {
              contentBlocksJSON = parsedData[arrayProps[0]];
            } else {
              throw new Error("Could not find blocks array in OpenAI response");
            }
          }
        } catch (parseError) {
          console.error("Error parsing OpenAI's response:", parseError);
          console.log("Raw response:", content);
          contentBlocksJSON = generateFallbackContent(query, blockCount);
        }
      } catch (openaiError) {
        console.error('Error in OpenAI fallback:', openaiError);
        contentBlocksJSON = generateFallbackContent(query, blockCount);
      }
    }
    
    // If still no valid content after all attempts, use fallback
    if (!contentBlocksJSON) {
      console.log("All API attempts failed, using fallback content");
      contentBlocksJSON = generateFallbackContent(query, blockCount);
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
