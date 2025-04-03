
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
    if (!claudeApiKey) {
      throw new Error('Missing Claude API key');
    }

    const requestId = crypto.randomUUID();
    const startTime = Date.now();
    console.log(`[${requestId}] Starting image analysis at ${new Date().toISOString()}`);

    // Get the form data containing the image
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const query = formData.get("query") as string || "What's in this image? Generate interesting facts for a child.";
    
    if (!imageFile) {
      throw new Error('No image provided');
    }

    // Convert the image to base64
    const imageBytes = await imageFile.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageBytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    const mimeType = imageFile.type;
    const base64String = `data:${mimeType};base64,${base64Image}`;
    
    console.log(`[${requestId}] Image converted to base64, size: ${base64String.length} chars`);
    
    // Prepare Claude API request
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeApiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimeType,
                  data: base64Image
                }
              },
              {
                type: "text",
                text: `${query}\n\nPlease generate a fun, educational response about the image that would be engaging for children. Include 3-5 interesting facts or observations about what you see.`
              }
            ]
          }
        ]
      })
    });

    const data = await claudeResponse.json();
    const apiDuration = (Date.now() - startTime) / 1000;
    console.log(`[${requestId}] Claude API response received in ${apiDuration}s`);
    
    if (!claudeResponse.ok) {
      console.error(`[${requestId}] Claude API error:`, data);
      throw new Error(`Claude API error: ${data.error?.message || JSON.stringify(data)}`);
    }

    // Structure the response data to match content blocks format
    const responseContent = data.content[0].text;
    
    // Create a new curio block to be saved
    const newBlock = {
      type: "fact",
      specialist_id: "nova",
      content: {
        fact: responseContent,
        rabbitHoles: []
      },
      liked: false,
      bookmarked: false,
      created_at: new Date().toISOString()
    };
    
    console.log(`[${requestId}] Generated response from Claude`);

    return new Response(
      JSON.stringify({
        success: true,
        block: newBlock,
        timing: {
          apiDuration,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error analyzing image:', error);
    
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
