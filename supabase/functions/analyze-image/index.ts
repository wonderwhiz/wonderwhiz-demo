
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      throw new Error('Missing OpenAI API key');
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
    
    console.log(`[${requestId}] Image converted to base64, size: ${base64String.length} chars, type: ${mimeType}`);
    
    // Prepare OpenAI API request with better error handling and retries
    let attempts = 0;
    const maxAttempts = 3;
    let openAiResponse = null;
    let data = null;
    
    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`[${requestId}] Attempting OpenAI API request (attempt ${attempts}/${maxAttempts})`);
        
        openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openAiApiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an AI assistant specialized in analyzing images and explaining them to children in a fun, educational way. Your analysis should be accurate, engaging, and provide educational content suitable for children. Be enthusiastic, use simple language, and include interesting facts. Be supportive and encouraging of their creativity and exploration."
              },
              {
                role: "user",
                content: [
                  {
                    type: "text", 
                    text: `${query}\n\nPlease generate a fun, highly engaging, educational response about the image that would be exciting for children. Include 3-5 interesting facts or observations about what you see. Be enthusiastic and encouraging!`
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: base64String
                    }
                  }
                ]
              }
            ],
            max_tokens: 1000
          })
        });
        
        if (!openAiResponse.ok) {
          const errorData = await openAiResponse.json().catch(() => ({}));
          console.error(`[${requestId}] OpenAI API error (attempt ${attempts}):`, errorData);
          
          if (attempts >= maxAttempts) {
            throw new Error(`OpenAI API error (status ${openAiResponse.status}): ${errorData.error?.message || JSON.stringify(errorData)}`);
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000)); 
          continue;
        }
        
        data = await openAiResponse.json();
        break; // Success, exit loop
      } catch (apiError) {
        console.error(`[${requestId}] OpenAI API call failed (attempt ${attempts}):`, apiError);
        
        if (attempts >= maxAttempts) {
          throw new Error(`Failed to analyze image after ${maxAttempts} attempts: ${apiError.message}`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const apiDuration = (Date.now() - startTime) / 1000;
    console.log(`[${requestId}] OpenAI API response received in ${apiDuration}s after ${attempts} attempt(s)`);
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid or empty response from OpenAI API');
    }

    // Generate a personalized feedback message
    const feedbackMessages = [
      "Wow! Your creativity is absolutely amazing! I love what you've created!",
      "You're a brilliant artist! Your imagination is truly wonderful!",
      "This is fantastic work! You have such incredible talent!",
      "I'm so impressed by your creativity! This is outstanding work!",
      "You're a natural artist! This creation shows your amazing imagination!",
      "This is spectacular! Your artistic skills are truly impressive!",
      "Your creativity shines so brightly! This is wonderful work!",
      "Amazing job! Your artistic talents are truly magnificent!",
      "What an incredible creation! Your imagination knows no bounds!",
      "This is absolutely delightful! You have such remarkable talent!"
    ];
    
    const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    
    // Structure the response data to match content blocks format
    const responseContent = data.choices[0].message.content;
    
    // Create a new curio block to be saved
    const newBlock = {
      type: "fact",
      specialist_id: "nova",
      content: {
        fact: responseContent,
        rabbitHoles: [
          "What else can you tell about this image?",
          "Can you explain more about what I created?",
          "What other interesting facts relate to my creation?"
        ]
      },
      liked: false,
      bookmarked: false,
      created_at: new Date().toISOString()
    };
    
    console.log(`[${requestId}] Successfully generated response from OpenAI`);

    return new Response(
      JSON.stringify({
        success: true,
        block: newBlock,
        feedback: randomFeedback,
        timing: {
          apiDuration,
          attempts,
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
        status: 200 
      }
    );
  }
});
