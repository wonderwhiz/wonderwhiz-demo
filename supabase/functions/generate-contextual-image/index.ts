
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
    console.log("Received image generation request");
    
    const { blockContent, blockType } = await req.json();
    console.log("Request data received:", { blockType });
    console.log("Content preview:", JSON.stringify(blockContent).substring(0, 100) + "...");
    
    // Get the HF token from environment variables
    const HUGGING_FACE_ACCESS_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!HUGGING_FACE_ACCESS_TOKEN) {
      console.error("HUGGING_FACE_ACCESS_TOKEN is not set");
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not set');
    }
    
    console.log("HF token found, initializing client");
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

    console.log("Generated prompt:", prompt);
    
    // Generate the image using the Hugging Face API
    console.log("Calling Hugging Face API...");
    try {
      const image = await hf.textToImage({
        inputs: prompt,
        model: "black-forest-labs/FLUX.1-schnell", // Fast and high quality model
      });

      console.log("Image generated successfully");

      // Convert the blob to a base64 string
      const arrayBuffer = await image.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      console.log("Image converted to base64");

      return new Response(
        JSON.stringify({ image: `data:image/png;base64,${base64}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (hfError) {
      console.error('Error from Hugging Face API:', hfError);
      throw new Error(`Hugging Face API error: ${hfError.message}`);
    }
  } catch (error) {
    console.error('Error generating image:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        stack: error.stack,
        message: "Failed to generate image"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
