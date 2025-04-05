
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
          imageDescription: "A magical adventure awaits!",
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
          imageDescription: "Imagine a world of wonders!",
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
          prompt = `Create a whimsical Pixar/Disney-style illustration for children showing: ${factText}`;
          contentSummary = factText.substring(0, 50);
          imageDescription = `A magical Pixar-style picture about ${contentSummary.toLowerCase() || "amazing facts"}!`;
        } else if (blockType === 'quiz') {
          const questionText = blockContent.question?.substring(0, 200) || "";
          prompt = `Create a Disney-inspired, colorful educational illustration for children about: ${questionText}`;
          contentSummary = questionText.substring(0, 50);
          imageDescription = `A fun Disney-style picture about ${contentSummary.toLowerCase() || "this quiz question"}!`;
        } else if (blockType === 'flashcard') {
          const frontText = blockContent.front?.substring(0, 200) || "";
          prompt = `Create a cute Pixar-style educational illustration for children that explains: ${frontText}`;
          contentSummary = frontText.substring(0, 50);
          imageDescription = `A charming Pixar-inspired picture showing ${contentSummary.toLowerCase() || "this fact"}!`;
        } else if (blockType === 'creative') {
          const promptText = blockContent.prompt?.substring(0, 200) || "";
          prompt = `Create a Disney-inspired, magical illustration for children about: ${promptText}`;
          contentSummary = promptText.substring(0, 50);
          imageDescription = `A magical Disney-style picture for your creative adventure about ${contentSummary.toLowerCase()}!`;
        } else if (blockType === 'task') {
          const taskText = blockContent.task?.substring(0, 200) || "";
          prompt = `Create a motivational Pixar-style illustration for children showing: ${taskText}`;
          contentSummary = taskText.substring(0, 50);
          imageDescription = `A Pixar-inspired picture to inspire you on your mission to ${contentSummary.toLowerCase()}!`;
        } else if (blockType === 'riddle') {
          const riddleText = blockContent.riddle?.substring(0, 200) || "";
          prompt = `Create a mysterious, magical Disney-style illustration for children about: ${riddleText}`;
          contentSummary = riddleText.substring(0, 50);
          imageDescription = `A mysterious Disney-inspired picture with clues to the riddle about ${contentSummary.toLowerCase()}!`;
        } else if (blockType === 'news') {
          const headlineText = blockContent.headline?.substring(0, 200) || "";
          prompt = `Create a journalistic Pixar-style illustration for children about: ${headlineText}`;
          contentSummary = headlineText.substring(0, 50);
          imageDescription = `A Pixar-inspired picture showing the latest news about ${contentSummary.toLowerCase() || "this topic"}!`;
        } else if (blockType === 'activity') {
          const activityText = blockContent.activity?.substring(0, 200) || "";
          prompt = `Create a fun, Disney-style illustration for children showing: ${activityText}`;
          contentSummary = activityText.substring(0, 50);
          imageDescription = `A fun Disney-inspired picture showing you how to ${contentSummary.toLowerCase() || "do this activity"}!`;
        } else if (blockType === 'mindfulness') {
          const exerciseText = blockContent.exercise?.substring(0, 200) || "";
          prompt = `Create a calm, peaceful Pixar-style illustration for children about: ${exerciseText}`;
          contentSummary = exerciseText.substring(0, 50);
          imageDescription = `A soothing Pixar-inspired picture to help you ${contentSummary.toLowerCase() || "relax and focus"}!`;
        }
        
        // Enhanced prompts specific to DALL-E for Disney/Pixar style
        prompt = `${prompt} in the style of modern Pixar or Disney animation. Use bright, vibrant colors, expressive characters with big eyes, and a magical, whimsical atmosphere. Make it cute, educational, and engaging for children with simple shapes and clear details. Digital art style with clean edges and slight texture.`;
      }
    } catch (e) {
      console.error(`[${requestId}] Error creating prompt:`, e);
      contentSummary = "Content visualization";
      prompt = "A colorful Pixar-style educational illustration for children";
      imageDescription = "A magical Disney-inspired picture about learning!";
    }
    
    // If prompt is too short, use a default
    if (!prompt || prompt.length < 20) {
      prompt = `A colorful educational illustration in the style of Pixar/Disney animation about ${blockType} for children. Bright, engaging, cute characters with big eyes, and a magical atmosphere.`;
      imageDescription = "A wonderful Disney-inspired picture about learning!";
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
      
      try {
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
          
          // Check for billing-related errors
          const billingError = errorData.error?.message?.includes('billing') 
            || errorData.error?.message?.includes('quota')
            || errorData.error?.type === 'insufficient_quota';
          
          const friendlyError = billingError 
            ? "Our magical Disney artists are taking a break! You'll still have a wonderful time learning without the pictures."
            : `DALL-E API error: ${errorData.error?.message || JSON.stringify(errorData)}`;
          
          return new Response(
            JSON.stringify({ 
              error: friendlyError,
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
          imageDescription: "A fun Disney-style picture about learning! (We're creating more soon!)",
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 200 // Always return 200 to prevent client errors
        }
      );
    }
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return a suitable error with image description
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        imageDescription: "A fun Disney-inspired picture about learning! (We're creating more soon!)",
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 // Always return 200 to prevent client errors
      }
    );
  }
});
