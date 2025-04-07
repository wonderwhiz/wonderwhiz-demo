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

    // Prepare system message and user message for the API with enhanced prompting
    let systemMessage = `You are an AI assistant creating EXTRAORDINARILY engaging, educational content for children aged ${childProfile.age}. 
    Each piece of content should be scientifically accurate, richly detailed, and presented with an exciting sense of discovery and wonder.
    Your content must have a "WOW factor" that makes children's eyes widen with amazement and makes them say "I never knew that!"
    
    EXTREMELY IMPORTANT GUIDELINES:
    - Content must be 100% factually accurate with no embellishments that might mislead
    - Use age-appropriate but rich vocabulary that expands a child's language while remaining accessible
    - Frame information as exciting discoveries with expressions like "Scientists recently discovered..." or "Did you know that..."
    - Include specific, memorable numbers, measurements, and comparisons that help children grasp scale and significance
    - Connect abstract concepts to everyday experiences a child can relate to
    - Create a sense of narrative and adventure in even the most factual content
    - Use analogies and metaphors to explain complex ideas
    - Invoke wonder by highlighting the most surprising and counter-intuitive aspects of the topic
    - Content must be in ${language} language with an appropriate reading level for ${childProfile.age}-year-olds
    - Always leverage child-friendly humor and a sense of playfulness`;
    
    let userMessage = `Generate ${blockCount} diverse, EXTRAORDINARILY ENGAGING content blocks about the query: "${query}". 
    ${skipInitial > 0 ? `Skip the first ${skipInitial} most obvious blocks as they've already been generated.` : ''}

    Each block MUST:
    1. Be HYPER-RELEVANT to "${query}" with laser-focused content that directly addresses the topic
    2. Contain at least one genuinely mind-blowing, scientific fact that would make a ${childProfile.age}-year-old gasp with wonder
    3. Include vibrant visual language suitable for generating captivating illustrations
    4. Connect with these interests: ${childProfile.interests.join(', ')}
    5. Have interactive elements that make children feel personally involved in the discovery
    6. Be written with a dynamic, enthusiastic tone but avoid being cartoonishly over-excited

    SPECIFIC REQUIREMENTS FOR EACH BLOCK TYPE:
    
    - fact/funFact: Must include a counter-intuitive or surprising SPECIFIC fact (with numbers, examples, and vivid details) that defies expectations. End with an intriguing question that makes children wonder. Example: "Stars don't actually twinkle! The apparent twinkling happens because their light passes through Earth's atmosphere, where air of different temperatures bends the light in different directions. It's like looking at a penny at the bottom of a swimming pool - the water makes it seem to move even though it's perfectly still! Did you know that some stars appear to change colors as they twinkle? That's because different wavelengths of light bend differently in our atmosphere!"
    
    - quiz: Create genuinely challenging but solvable questions that teach even if answered incorrectly. Options should all seem plausible but only one is correct. Include a fascinating explanation of WHY the answer is correct. Example: "When stars 'twinkle' in the night sky, what's really happening? A) The star is pulsating with energy, B) Earth's atmosphere is bending the starlight, C) The star is rotating very quickly, D) Cosmic dust is partially blocking the light"
    
    - flashcard: Provide question/answer pairs that reveal a genuinely surprising connection or fact. The answer should provide a complete explanation with vivid details, not just a simple word or phrase. Example: "Why do stars appear to twinkle in the night sky? [FLIP] Stars don't actually twinkle! The apparent twinkling happens because their light passes through layers of Earth's atmosphere that have different temperatures and densities. These layers act like constantly moving lenses, bending the light in different directions as it travels to your eyes."
    
    - creative: Design imaginative prompts that encourage open-ended exploration while teaching scientific concepts. Include specific guidance that helps channel creativity in educational directions. Example: "Imagine you're an astronaut floating in space near a pulsating variable star that changes brightness every few minutes. Draw or write about what you see and feel as the star's light grows stronger and then dims. How would the changing light affect nearby planets? What colors might flash through space?"
    
    - task: Design real-world, feasible experiments or activities that demonstrate scientific principles related to the query. Include specific materials, clear steps, and explain what will be learned. Example: "Create a star twinkling simulator! You'll need: a flashlight, a bowl of hot water, and a white sheet. In a dark room, shine the flashlight through the steam rising from the hot water onto the sheet. Watch how the light appears to 'twinkle' as it passes through the rising air currents, just like starlight twinkling through Earth's atmosphere!"
    
    - riddle: Craft clever wordplay or logic puzzles that teach scientific concepts when solved. Answers should reveal an interesting fact about the topic. Example: "I'm not a dancer, but I appear to twinkle. I'm extremely hot, but you'll never feel my heat. I'm enormous, but look tiny to your eye. What am I? Answer: A star"
    
    - activity: Design hands-on, feasible activities that demonstrate scientific principles with materials found at home. Include clear instructions and scientific explanations. Example: "Make a star projector! Cover a flashlight with aluminum foil, then poke tiny holes in different patterns. In a dark room, shine it on the ceiling to create your own constellations. The light passing through the small holes creates focused beams, similar to how we see individual stars in space despite their enormous size!"
    
    - news: Frame the most recent scientific discoveries about the topic as exciting breaking news with accurate details. Include quotes from imaginary scientists that explain concepts clearly. Example: "BREAKING: Astronomers Discover Fascinating Binary Star Dance! Scientists at the Cosmic Observatory have recorded two stars orbiting each other in a complex pattern never seen before. 'These stars complete one orbit every 15 Earth days, exchanging stellar material in the process,' explains Dr. Luna Stellar. 'It's teaching us new things about stellar evolution.'"
    
    - mindfulness: Connect scientific understanding with sensory awareness and appreciation of natural phenomena. Design exercises that combine learning with mindfulness. Example: "Star Gazing Mindfulness: Find a dark area outside and lie on your back. As you observe the stars, notice how some appear to twinkle more than others. The steadier stars are planets! As you breathe deeply, imagine the vast distances these light rays traveled - millions of years - just to reach your eyes in this moment."

    For "rabbit hole" questions, create genuinely fascinating follow-up questions that lead to even more mind-blowing discoveries.
    
    Return your response as a JSON array with ${blockCount} objects, each having this structure:
    {
      "type": "one of: fact, quiz, flashcard, creative, task, riddle, funFact, activity, news, mindfulness",
      "specialist_id": "one of: nova, spark, prism, pixel, atlas, lotus",
      "content": {
        // Different fields based on block type as specified before
      }
    }

    Match specialists with appropriate content (nova:exploration, spark:science, prism:creativity, pixel:technology, atlas:history/geography, lotus:wellbeing).
    
    NOTE: Make every single block EXTRAORDINARILY relevant to "${query}" with truly amazing, scientifically accurate content!`;
    
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
            temperature: quickGeneration ? 0.9 : 0.8,
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
