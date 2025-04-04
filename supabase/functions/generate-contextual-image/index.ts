
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
      
      console.log(`[${requestId}] Received request for ${blockType} content`);
    } catch (parseError) {
      console.error(`[${requestId}] Error parsing request body:`, parseError);
      throw new Error(`Invalid request format: ${parseError.message}`);
    }
    
    if (!blockContent || !blockType) {
      console.error(`[${requestId}] Missing required parameters`);
      throw new Error('Missing required parameters: blockContent and blockType');
    }
    
    // Extract content for prompt generation
    let prompt = "";
    let contentSummary = "";
    
    try {
      if (typeof blockContent === 'object') {
        // Extract the most relevant text based on block type to create a prompt
        if (blockType === 'fact' || blockType === 'funFact') {
          prompt = `A beautiful, educational illustration about: ${blockContent.fact?.substring(0, 100)}`;
          contentSummary = blockContent.fact?.substring(0, 50);
        } else if (blockType === 'quiz') {
          prompt = `A colorful, educational illustration about: ${blockContent.question?.substring(0, 100)}`;
          contentSummary = blockContent.question?.substring(0, 50);
        } else if (blockType === 'flashcard') {
          prompt = `A colorful, educational illustration about: ${blockContent.front?.substring(0, 100)}`;
          contentSummary = blockContent.front?.substring(0, 50);
        } else if (blockType === 'creative') {
          prompt = `A creative, inspiring illustration about: ${blockContent.prompt?.substring(0, 100)}`;
          contentSummary = blockContent.prompt?.substring(0, 50);
        } else if (blockType === 'task') {
          prompt = `A motivational illustration about: ${blockContent.task?.substring(0, 100)}`;
          contentSummary = blockContent.task?.substring(0, 50);
        } else if (blockType === 'riddle') {
          prompt = `A mysterious, magical illustration about: ${blockContent.riddle?.substring(0, 100)}`;
          contentSummary = blockContent.riddle?.substring(0, 50);
        } else if (blockType === 'news') {
          prompt = `A journalistic illustration about: ${blockContent.headline?.substring(0, 100)}`;
          contentSummary = blockContent.headline?.substring(0, 50);
        } else if (blockType === 'activity') {
          prompt = `A fun, active illustration showing: ${blockContent.activity?.substring(0, 100)}`;
          contentSummary = blockContent.activity?.substring(0, 50);
        } else if (blockType === 'mindfulness') {
          prompt = `A calm, peaceful illustration about: ${blockContent.exercise?.substring(0, 100)}`;
          contentSummary = blockContent.exercise?.substring(0, 50);
        }
        
        // Enhance prompt for DALL-E
        prompt = `${prompt} in a vibrant digital art style, child-friendly, educational, detailed, colorful`;
      }
    } catch (e) {
      console.error(`[${requestId}] Error creating prompt:`, e);
      contentSummary = "Content visualization";
      prompt = "A colorful educational illustration for children";
    }
    
    // If prompt is too short, use a default
    if (!prompt || prompt.length < 20) {
      prompt = `A colorful educational illustration about ${blockType} for children`;
    }

    console.log(`[${requestId}] Generated prompt: ${prompt}`);
    
    try {
      // Call OpenAI API to generate an image with DALL-E
      const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAiApiKey) {
        throw new Error('OpenAI API key is not configured');
      }
      
      console.log(`[${requestId}] Calling DALL-E API`);
      
      const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiApiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-2",  // Using DALL-E 2 for faster responses
          prompt: prompt,
          n: 1,
          size: "512x512",    // Smaller size for faster generation
          response_format: "url"
        })
      });
      
      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json().catch(() => ({}));
        console.error(`[${requestId}] DALL-E API error:`, errorData);
        throw new Error(`DALL-E API error: ${errorData.error?.message || JSON.stringify(errorData)}`);
      }
      
      const imageData = await openaiResponse.json();
      
      if (!imageData.data || !imageData.data[0] || !imageData.data[0].url) {
        throw new Error('Invalid response from DALL-E API');
      }
      
      const imageUrl = imageData.data[0].url;
      console.log(`[${requestId}] Successfully generated image URL: ${imageUrl}`);
      
      const totalDuration = (Date.now() - startTime) / 1000;
      console.log(`[${requestId}] Generated image in ${totalDuration} seconds`);
      
      return new Response(
        JSON.stringify({ 
          image: imageUrl,
          requestId,
          contentSummary,
          blockType,
          timing: { 
            totalDuration,
            timestamp: new Date().toISOString() 
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (dalleError) {
      console.error(`[${requestId}] DALL-E generation failed:`, dalleError);
      throw dalleError;
    }
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Instead of generating a SVG placeholder, return a suitable error
    // but don't make it too obvious to the user
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
