
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
    const requestStart = new Date().getTime();
    console.log(`[${requestStart}] Received image generation request`);
    
    // Parse request body
    let blockContent, blockType;
    try {
      const requestData = await req.json();
      blockContent = requestData.blockContent;
      blockType = requestData.blockType;
      
      console.log(`[${requestStart}] Request data received:`, { blockType, contentSample: JSON.stringify(blockContent).substring(0, 50) + "..." });
    } catch (parseError) {
      console.error(`[${requestStart}] Error parsing request body:`, parseError);
      throw new Error(`Invalid request format: ${parseError.message}`);
    }
    
    if (!blockContent || !blockType) {
      console.error(`[${requestStart}] Missing required parameters`);
      throw new Error('Missing required parameters: blockContent and blockType');
    }
    
    // Get the HF token from environment variables
    const HUGGING_FACE_ACCESS_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!HUGGING_FACE_ACCESS_TOKEN) {
      console.error(`[${requestStart}] HUGGING_FACE_ACCESS_TOKEN is not set`);
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not set');
    }
    
    console.log(`[${requestStart}] Initializing Hugging Face client`);
    const hf = new HfInference(HUGGING_FACE_ACCESS_TOKEN);

    // Generate an appropriate prompt based on block type and content
    let prompt = '';
    
    switch(blockType) {
      case 'fact':
      case 'funFact':
        // Extract the key concept from the fact
        prompt = `A child-friendly, educational illustration showing: ${blockContent.fact?.substring(0, 100) || 'educational fact'}`;
        break;
      case 'quiz':
        prompt = `A child-friendly, educational illustration related to: ${blockContent.question || 'quiz question'}`;
        break;
      case 'flashcard':
        prompt = `A child-friendly, educational illustration showing: ${blockContent.front || 'flashcard concept'}`;
        break;
      case 'creative':
        prompt = `A child-friendly, inspiring illustration about: ${blockContent.prompt?.substring(0, 100) || 'creative prompt'}`;
        break;
      case 'task':
        prompt = `A child-friendly illustration showing a child doing: ${blockContent.task?.substring(0, 100) || 'educational task'}`;
        break;
      case 'riddle':
        prompt = `A child-friendly, mysterious illustration hinting at: ${blockContent.answer || 'riddle answer'}`;
        break;
      case 'news':
        prompt = `A child-friendly, informative illustration about: ${blockContent.headline || 'news topic'}`;
        break;
      case 'activity':
        prompt = `A child-friendly illustration showing kids doing: ${blockContent.activity?.substring(0, 100) || 'fun activity'}`;
        break;
      case 'mindfulness':
        prompt = `A child-friendly, calming illustration showing: ${blockContent.exercise?.substring(0, 100) || 'mindfulness exercise'}`;
        break;
      default:
        prompt = `A child-friendly, educational illustration`;
    }
    
    // Make sure the prompt is safe for kids and has appropriate style
    prompt += ", digital art style, bright colors, educational, safe for kids, no text, no words";

    console.log(`[${requestStart}] Generated prompt for image:`, prompt);
    
    // Generate the image using the Hugging Face API
    console.log(`[${requestStart}] Calling Hugging Face API...`);
    
    try {
      const apiCallStart = new Date().getTime();
      console.log(`[${requestStart}] HF API call started at: ${apiCallStart}`);
      
      const image = await hf.textToImage({
        inputs: prompt,
        model: "black-forest-labs/FLUX.1-schnell", // Fast and high quality model
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 25, // Reduced slightly for faster generation while maintaining quality
        }
      });

      const apiCallEnd = new Date().getTime();
      const apiDuration = (apiCallEnd - apiCallStart) / 1000;
      console.log(`[${requestStart}] HF API call finished after ${apiDuration} seconds`);

      // Convert the blob to a base64 string
      const arrayBuffer = await image.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const imageSize = base64.length;
      console.log(`[${requestStart}] Image successfully converted to base64, size: ${imageSize} bytes`);

      const requestEnd = new Date().getTime();
      const totalDuration = (requestEnd - requestStart) / 1000;
      console.log(`[${requestStart}] Total request processed in ${totalDuration} seconds`);

      return new Response(
        JSON.stringify({ 
          image: `data:image/png;base64,${base64}`,
          stats: { 
            apiDuration, 
            totalDuration,
            imageSize,
            timestamp: new Date().toISOString() 
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (hfError) {
      console.error(`[${requestStart}] Error from Hugging Face API:`, hfError);
      console.error(`[${requestStart}] Error details:`, JSON.stringify(hfError));
      throw new Error(`Hugging Face API error: ${hfError.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error generating image:', error);
    console.error('Error stack:', error.stack);
    
    // Return a structured error response
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        stack: error.stack,
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
