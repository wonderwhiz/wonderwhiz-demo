
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Received OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();
    console.log(`[${requestId}] Starting image generation request at ${new Date().toISOString()}`);
    
    // Parse request body with better error handling
    let blockContent, blockType;
    try {
      const requestData = await req.json();
      blockContent = requestData.blockContent;
      blockType = requestData.blockType;
      
      console.log(`[${requestId}] Received request for ${blockType} content:`, JSON.stringify(blockContent).substring(0, 200));
    } catch (parseError) {
      console.error(`[${requestId}] Error parsing request body:`, parseError);
      return new Response(
        JSON.stringify({ 
          error: `Invalid request format: ${parseError.message}`,
          imageDescription: "A magical picture about learning!",
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    if (!blockContent || !blockType) {
      console.error(`[${requestId}] Missing required parameters`);
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: blockContent and blockType',
          imageDescription: "A wonderful picture about learning!",
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    // Extract content for prompt generation
    let prompt = "";
    let contentSummary = "";
    let imageDescription = "";
    
    try {
      if (typeof blockContent === 'object') {
        // Generate more detailed and specific prompts based on block type
        if (blockType === 'fact' || blockType === 'funFact') {
          const factText = blockContent.fact?.substring(0, 200) || "";
          prompt = `Create a vibrant, educational illustration for children showing: ${factText}`;
          contentSummary = factText.substring(0, 50);
          imageDescription = `A magical picture showing ${contentSummary.toLowerCase() || "amazing facts"}!`;
        } else if (blockType === 'quiz') {
          const questionText = blockContent.question?.substring(0, 200) || "";
          prompt = `Create a colorful, educational illustration for children about: ${questionText}`;
          contentSummary = questionText.substring(0, 50);
          imageDescription = `A fun picture about ${contentSummary.toLowerCase() || "this quiz question"}!`;
        } else if (blockType === 'flashcard') {
          const frontText = blockContent.front?.substring(0, 200) || "";
          prompt = `Create a colorful, educational illustration for children that explains: ${frontText}`;
          contentSummary = frontText.substring(0, 50);
          imageDescription = `A colorful picture showing ${contentSummary.toLowerCase() || "this fact"}!`;
        } else if (blockType === 'creative') {
          const promptText = blockContent.prompt?.substring(0, 200) || "";
          prompt = `Create a creative, inspiring illustration for children about: ${promptText}`;
          contentSummary = promptText.substring(0, 50);
          imageDescription = `A magical picture for your creative adventure about ${contentSummary.toLowerCase()}!`;
        } else if (blockType === 'task') {
          const taskText = blockContent.task?.substring(0, 200) || "";
          prompt = `Create a motivational illustration for children showing: ${taskText}`;
          contentSummary = taskText.substring(0, 50);
          imageDescription = `A picture to inspire you on your mission to ${contentSummary.toLowerCase()}!`;
        } else if (blockType === 'riddle') {
          const riddleText = blockContent.riddle?.substring(0, 200) || "";
          prompt = `Create a mysterious, magical illustration for children about: ${riddleText}`;
          contentSummary = riddleText.substring(0, 50);
          imageDescription = `A mysterious picture with clues to the riddle about ${contentSummary.toLowerCase()}!`;
        } else if (blockType === 'news') {
          const headlineText = blockContent.headline?.substring(0, 200) || "";
          prompt = `Create a journalistic illustration for children about: ${headlineText}`;
          contentSummary = headlineText.substring(0, 50);
          imageDescription = `A picture showing the latest news about ${contentSummary.toLowerCase() || "this topic"}!`;
        } else if (blockType === 'activity') {
          const activityText = blockContent.activity?.substring(0, 200) || "";
          prompt = `Create a fun, active illustration for children showing: ${activityText}`;
          contentSummary = activityText.substring(0, 50);
          imageDescription = `A fun picture showing you how to ${contentSummary.toLowerCase() || "do this activity"}!`;
        } else if (blockType === 'mindfulness') {
          const exerciseText = blockContent.exercise?.substring(0, 200) || "";
          prompt = `Create a calm, peaceful illustration for children about: ${exerciseText}`;
          contentSummary = exerciseText.substring(0, 50);
          imageDescription = `A peaceful picture to help you ${contentSummary.toLowerCase() || "relax and focus"}!`;
        }
        
        // Enhanced prompts specific to DALL-E
        prompt = `${prompt} in a bright, colorful, child-friendly style with simple shapes and vibrant colors. Make it educational, magical, and engaging for children. Digital art style.`;
      }
    } catch (e) {
      console.error(`[${requestId}] Error creating prompt:`, e);
      contentSummary = "Content visualization";
      prompt = "A colorful educational illustration for children";
      imageDescription = "A magical picture about learning!";
    }
    
    // If prompt is too short, use a default
    if (!prompt || prompt.length < 20) {
      prompt = `A colorful educational illustration about ${blockType} for children. Bright, engaging, and child-friendly style.`;
      imageDescription = "A wonderful picture about learning!";
    }

    console.log(`[${requestId}] Generated DALL-E prompt: ${prompt}`);
    
    try {
      // Call OpenAI API to generate an image with DALL-E
      const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAiApiKey) {
        console.error(`[${requestId}] OpenAI API key is not configured`);
        return new Response(
          JSON.stringify({ 
            error: 'OpenAI API key is not configured',
            imageDescription,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
      
      console.log(`[${requestId}] Calling DALL-E API`);
      
      const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiApiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",  // Using DALL-E 3 for better quality
          prompt: prompt,
          n: 1,
          size: "1024x1024",  // Using high quality for better images
          quality: "standard",
          style: "vivid",     // Vivid style for more colorful, engaging images
          response_format: "url"
        })
      });
      
      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json().catch(() => ({}));
        console.error(`[${requestId}] DALL-E API error:`, errorData);
        
        return new Response(
          JSON.stringify({ 
            error: `DALL-E API error: ${errorData.error?.message || JSON.stringify(errorData)}`,
            imageDescription,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
      
      const imageData = await openaiResponse.json();
      
      if (!imageData.data || !imageData.data[0] || !imageData.data[0].url) {
        console.error(`[${requestId}] Invalid response from DALL-E API:`, imageData);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid response from DALL-E API',
            imageDescription,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
      
      const imageUrl = imageData.data[0].url;
      console.log(`[${requestId}] Successfully generated image URL`);
      
      const totalDuration = (Date.now() - startTime) / 1000;
      console.log(`[${requestId}] Generated image in ${totalDuration} seconds`);
      
      return new Response(
        JSON.stringify({ 
          image: imageUrl,
          imageDescription,
          requestId,
          contentSummary,
          blockType,
          timing: { 
            totalDuration,
            timestamp: new Date().toISOString() 
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } catch (dalleError) {
      console.error(`[${requestId}] DALL-E generation failed:`, dalleError);
      
      // Return a response with the image description even on error
      return new Response(
        JSON.stringify({ 
          error: dalleError.message,
          imageDescription,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return a suitable error with image description
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        imageDescription: "A fun picture about learning! (We're creating more soon!)",
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 // Always return 200 to prevent client errors
      }
    );
  }
});
