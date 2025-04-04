
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
      
      // Return a friendly response even on parse error
      return new Response(
        JSON.stringify({ 
          imageDescription: "A magical picture about learning!",
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract content for prompt generation - continue even if blockContent/blockType are missing
    let prompt = "";
    let contentSummary = "";
    let imageDescription = "A wonderful picture about learning!";
    
    try {
      if (typeof blockContent === 'object') {
        // Extract the most relevant text based on block type to create a prompt
        if (blockType === 'fact' || blockType === 'funFact') {
          prompt = `A beautiful, educational illustration about: ${blockContent.fact?.substring(0, 100)}`;
          contentSummary = blockContent.fact?.substring(0, 50);
          imageDescription = `A magical picture showing ${contentSummary?.toLowerCase() || "amazing facts"}!`;
        } else if (blockType === 'quiz') {
          prompt = `A colorful, educational illustration about: ${blockContent.question?.substring(0, 100)}`;
          contentSummary = blockContent.question?.substring(0, 50);
          imageDescription = `A fun picture about ${contentSummary?.toLowerCase() || "this quiz question"}!`;
        } else if (blockType === 'flashcard') {
          prompt = `A colorful, educational illustration about: ${blockContent.front?.substring(0, 100)}`;
          contentSummary = blockContent.front?.substring(0, 50);
          imageDescription = `A colorful picture showing ${contentSummary?.toLowerCase() || "this fact"}!`;
        } else if (blockType === 'creative') {
          prompt = `A creative, inspiring illustration about: ${blockContent.prompt?.substring(0, 100)}`;
          contentSummary = blockContent.prompt?.substring(0, 50);
          imageDescription = `A magical picture for your creative adventure!`;
        } else if (blockType === 'task') {
          prompt = `A motivational illustration about: ${blockContent.task?.substring(0, 100)}`;
          contentSummary = blockContent.task?.substring(0, 50);
          imageDescription = `A picture to inspire you on your mission!`;
        } else if (blockType === 'riddle') {
          prompt = `A mysterious, magical illustration about: ${blockContent.riddle?.substring(0, 100)}`;
          contentSummary = blockContent.riddle?.substring(0, 50);
          imageDescription = `A mysterious picture with clues to the riddle!`;
        } else if (blockType === 'news') {
          prompt = `A journalistic illustration about: ${blockContent.headline?.substring(0, 100)}`;
          contentSummary = blockContent.headline?.substring(0, 50);
          imageDescription = `A picture showing the latest news about ${contentSummary?.toLowerCase() || "this topic"}!`;
        } else if (blockType === 'activity') {
          prompt = `A fun, active illustration showing: ${blockContent.activity?.substring(0, 100)}`;
          contentSummary = blockContent.activity?.substring(0, 50);
          imageDescription = `A fun picture showing you how to do this activity!`;
        } else if (blockType === 'mindfulness') {
          prompt = `A calm, peaceful illustration about: ${blockContent.exercise?.substring(0, 100)}`;
          contentSummary = blockContent.exercise?.substring(0, 50);
          imageDescription = `A peaceful picture to help you relax and focus!`;
        } else {
          // Fallback for unknown block types
          prompt = `A colorful educational illustration for children about learning`;
          imageDescription = "A wonderful picture about learning!";
        }
      }
    } catch (e) {
      console.error(`[${requestId}] Error creating prompt:`, e);
      prompt = "A colorful educational illustration for children";
      imageDescription = "A colorful picture about learning!";
    }
    
    // Make sure we always have a valid prompt
    if (!prompt || prompt.length < 10) {
      prompt = `A colorful educational illustration about ${blockType || 'learning'} for children`;
      imageDescription = "A wonderful picture about learning!";
    }
    
    // Enhance prompt for DALL-E
    prompt = `${prompt} in a vibrant digital art style, child-friendly, educational, detailed, colorful`;
    console.log(`[${requestId}] Generated prompt: ${prompt}`);
    
    try {
      // Call OpenAI API to generate an image with DALL-E
      const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAiApiKey) {
        console.error(`[${requestId}] OpenAI API key is not configured`);
        // Return friendly response without image
        return new Response(
          JSON.stringify({ 
            imageDescription,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
          model: "dall-e-2",  // Using DALL-E 2 for faster responses
          prompt: prompt,
          n: 1,
          size: "512x512",    // Smaller size for faster generation
          response_format: "url"
        })
      });
      
      if (!openaiResponse.ok) {
        console.error(`[${requestId}] DALL-E API error status: ${openaiResponse.status}`);
        const errorText = await openaiResponse.text();
        console.error(`[${requestId}] DALL-E API error response:`, errorText);
        
        // Return a friendly response even when OpenAI fails
        return new Response(
          JSON.stringify({ 
            imageDescription,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const imageData = await openaiResponse.json();
      
      if (!imageData.data || !imageData.data[0] || !imageData.data[0].url) {
        console.error(`[${requestId}] Invalid or empty response from DALL-E API:`, JSON.stringify(imageData));
        // Return a friendly response even when the response is invalid
        return new Response(
          JSON.stringify({ 
            imageDescription,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (dalleError) {
      console.error(`[${requestId}] DALL-E generation failed:`, dalleError);
      
      // Return a response with the image description even on error
      return new Response(
        JSON.stringify({ 
          imageDescription,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return a suitable error with image description
    return new Response(
      JSON.stringify({ 
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
