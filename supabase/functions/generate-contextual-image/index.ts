
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

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
    console.log(`[${requestId}] Starting image generation request`);
    
    // Parse request body with better error handling
    let blockContent, blockType;
    try {
      const requestData = await req.json();
      blockContent = requestData.blockContent;
      blockType = requestData.blockType;
      
      console.log(`[${requestId}] Received request for ${blockType} content with data:`, 
                 JSON.stringify(blockContent).substring(0, 100) + '...');
    } catch (parseError) {
      console.error(`[${requestId}] Error parsing request body:`, parseError);
      throw new Error(`Invalid request format: ${parseError.message}`);
    }
    
    if (!blockContent || !blockType) {
      console.error(`[${requestId}] Missing required parameters`);
      throw new Error('Missing required parameters: blockContent and blockType');
    }
    
    // Get the HF token from environment variables
    const HUGGING_FACE_ACCESS_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!HUGGING_FACE_ACCESS_TOKEN) {
      console.error(`[${requestId}] HUGGING_FACE_ACCESS_TOKEN is not set`);
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not set');
    }
    
    console.log(`[${requestId}] Initializing Hugging Face client`);
    const hf = new HfInference(HUGGING_FACE_ACCESS_TOKEN);

    // Generate an appropriate prompt based on block type and content
    let prompt = '';
    
    const getContentString = (content) => {
      if (!content) return '';
      try {
        if (typeof content === 'string') return content.substring(0, 150);
        if (typeof content === 'object') {
          // Extract the most relevant text based on block type
          if (blockType === 'fact' || blockType === 'funFact') return content.fact?.substring(0, 150) || '';
          if (blockType === 'quiz') return content.question?.substring(0, 150) || '';
          if (blockType === 'flashcard') return content.front?.substring(0, 150) || '';
          if (blockType === 'creative') return content.prompt?.substring(0, 150) || '';
          if (blockType === 'task') return content.task?.substring(0, 150) || '';
          if (blockType === 'riddle') return content.riddle?.substring(0, 100) || content.answer?.substring(0, 50) || '';
          if (blockType === 'news') return content.headline?.substring(0, 150) || '';
          if (blockType === 'activity') return content.activity?.substring(0, 150) || '';
          if (blockType === 'mindfulness') return content.exercise?.substring(0, 150) || '';
          
          // If none of the above, try to get any text property
          const firstTextProp = Object.values(content).find(v => typeof v === 'string');
          return firstTextProp?.substring(0, 150) || JSON.stringify(content).substring(0, 100);
        }
        return '';
      } catch (e) {
        console.error(`[${requestId}] Error extracting content:`, e);
        return '';
      }
    };
    
    const contentText = getContentString(blockContent);
    console.log(`[${requestId}] Extracted content text: ${contentText}`);
    
    // Default prompt if we can't extract better content
    prompt = `A child-friendly, educational illustration about: ${contentText || blockType}`;
    
    // Try to make a more specific prompt based on block type
    switch(blockType) {
      case 'fact':
      case 'funFact':
        prompt = `A child-friendly, educational illustration showing: ${getContentString(blockContent.fact)}`;
        break;
      case 'quiz':
        prompt = `A child-friendly, educational illustration related to: ${getContentString(blockContent.question)}`;
        break;
      case 'flashcard':
        prompt = `A child-friendly, educational illustration showing: ${getContentString(blockContent.front)}`;
        break;
      case 'creative':
        prompt = `A child-friendly, inspiring illustration about: ${getContentString(blockContent.prompt)}`;
        break;
      case 'task':
        prompt = `A child-friendly illustration showing a child doing: ${getContentString(blockContent.task)}`;
        break;
      case 'riddle':
        prompt = `A child-friendly, mysterious illustration hinting at: ${
          blockContent.answer ? getContentString(blockContent.answer) : getContentString(blockContent.riddle)
        }`;
        break;
      case 'news':
        prompt = `A child-friendly, informative illustration about: ${getContentString(blockContent.headline)}`;
        break;
      case 'activity':
        prompt = `A child-friendly illustration showing kids doing: ${getContentString(blockContent.activity)}`;
        break;
      case 'mindfulness':
        prompt = `A child-friendly, calming illustration showing: ${getContentString(blockContent.exercise)}`;
        break;
    }
    
    // Make sure the prompt is safe for kids and has appropriate style
    prompt += ", digital art style, bright colors, educational, safe for kids, no text, no words";
    
    console.log(`[${requestId}] Final prompt: ${prompt}`);
    
    // Improved error handling for the Hugging Face API call
    console.log(`[${requestId}] Calling Hugging Face API...`);
    
    try {
      const apiCallStart = Date.now();
      
      const image = await hf.textToImage({
        inputs: prompt,
        model: "black-forest-labs/FLUX.1-schnell", // Fast and high quality model
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 15, // Reduced for faster generation while maintaining quality
        }
      });

      const apiCallEnd = Date.now();
      const apiDuration = (apiCallEnd - apiCallStart) / 1000;
      console.log(`[${requestId}] HF API call finished after ${apiDuration} seconds`);

      // Convert the blob to a base64 string
      const arrayBuffer = await image.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      console.log(`[${requestId}] Image successfully converted to base64, length: ${base64.length}`);

      return new Response(
        JSON.stringify({ 
          image: `data:image/png;base64,${base64}`,
          requestId,
          prompt: prompt.substring(0, 100),
          blockType,
          timing: { 
            apiDuration, 
            totalDuration: (Date.now() - apiCallStart) / 1000,
            timestamp: new Date().toISOString() 
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (hfError) {
      console.error(`[${requestId}] Error from Hugging Face API:`, hfError);
      throw new Error(`Hugging Face API error: ${hfError.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return a structured error response
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        timestamp: new Date().toISOString(),
        message: "Failed to generate image"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
