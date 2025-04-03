
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
    console.log(`[${requestId}] Extracted content text: ${contentText.substring(0, 50)}...`);
    
    // Default prompt
    prompt = `A child-friendly, educational illustration related to: ${contentText || blockType}`;
    
    // Try to make a more specific prompt based on block type
    switch(blockType) {
      case 'fact':
      case 'funFact':
        prompt = `A child-friendly, educational illustration showing: ${getContentString(blockContent.fact)}`;
        break;
      case 'quiz':
        prompt = `A child-friendly, educational illustration related to this question: ${getContentString(blockContent.question)}`;
        break;
      case 'flashcard':
        prompt = `A child-friendly, educational illustration about: ${getContentString(blockContent.front)}`;
        break;
      case 'creative':
        prompt = `A child-friendly, inspiring illustration about: ${getContentString(blockContent.prompt)}`;
        break;
      case 'task':
        prompt = `A child-friendly illustration showing a child doing: ${getContentString(blockContent.task)}`;
        break;
      case 'riddle':
        prompt = `A child-friendly, mysterious illustration about: ${
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
    prompt += ", digital art style, bright colors, educational, safe for kids, no text";
    
    console.log(`[${requestId}] Final prompt: ${prompt}`);
    
    try {
      // Use a fallback approach with simpler model first
      console.log(`[${requestId}] Attempting to generate image with minimalistic approach`);
      const placeholderColors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFC857", "#E9C46A", 
        "#7DB46C", "#9B5DE5", "#F15BB5", "#00BBF9", "#00F5D4"
      ];
      
      // Generate a simple SVG placeholder with a predetermined color based on content
      const colorIndex = Math.abs(prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % placeholderColors.length;
      const backgroundColor = placeholderColors[colorIndex];
      
      // Create a simple SVG with a colored background and an emoji based on block type
      let emoji = "✨"; // default
      
      switch(blockType) {
        case 'fact': emoji = "📚"; break;
        case 'funFact': emoji = "🎯"; break;
        case 'quiz': emoji = "❓"; break;
        case 'flashcard': emoji = "🧠"; break;
        case 'creative': emoji = "🎨"; break;
        case 'task': emoji = "✅"; break;
        case 'riddle': emoji = "🔍"; break;
        case 'news': emoji = "📰"; break;
        case 'activity': emoji = "🏃"; break;
        case 'mindfulness': emoji = "🧘"; break;
      }
      
      const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="${backgroundColor}" />
        <text x="200" y="200" font-family="Arial" font-size="120" text-anchor="middle" dominant-baseline="middle" fill="white">${emoji}</text>
      </svg>
      `;
      
      // Convert SVG to base64
      const base64 = btoa(svg);
      
      const totalDuration = (Date.now() - startTime) / 1000;
      console.log(`[${requestId}] Generated fallback image in ${totalDuration} seconds`);
      
      return new Response(
        JSON.stringify({ 
          image: `data:image/svg+xml;base64,${base64}`,
          isPlaceholder: true,
          requestId,
          prompt: prompt.substring(0, 100),
          blockType,
          timing: { 
            totalDuration,
            timestamp: new Date().toISOString() 
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fallbackError) {
      console.error(`[${requestId}] Error generating fallback image:`, fallbackError);
      throw new Error(`Failed to generate even a fallback image: ${fallbackError.message}`);
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
