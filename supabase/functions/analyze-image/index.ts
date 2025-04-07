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
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!groqApiKey && !openAiApiKey) {
      throw new Error('Missing API keys for image analysis');
    }

    const requestId = crypto.randomUUID();
    const startTime = Date.now();
    console.log(`[${requestId}] Starting image analysis at ${new Date().toISOString()}`);

    // Get the form data containing the image
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const query = formData.get("query") as string || "What's in this image? Give me fun facts about it!";
    
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
    
    // Prepare API request with better error handling and retries
    let attempts = 0;
    const maxAttempts = 3;
    let apiResponse = null;
    let data = null;
    
    // Try Groq first with Llama 4 Insight (Vision model)
    while (attempts < maxAttempts) {
      attempts++;
      try {
        if (groqApiKey) {
          console.log(`[${requestId}] Attempting Groq API request for image analysis (attempt ${attempts}/${maxAttempts})`);
          
          apiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
              model: "meta-llama/llama-4-insight-32b-preview",
              messages: [
                {
                  role: "system",
                  content: `You are an AI assistant specialized in analyzing images drawn by children. Your goal is to provide EXTRAORDINARILY encouraging, joyful, and educational feedback that celebrates their creativity and makes them feel proud of their work.

Use a cheerful, supportive tone with animated expressions and child-friendly language. Include specific, detailed observations about colors, shapes, characters, or scenes they've drawn without being critical. Express genuine excitement about their creative choices.

Your response must include:
1. Enthusiastic praise that highlights specific elements of their artwork
2. Mention specific colors, characters, or scenes you see with precise details
3. 2-3 fascinating, mind-blowing educational facts that connect to themes in their drawing
4. A question that encourages them to think more about their creative process
5. A suggestion for what they might enjoy drawing next that builds on their interests

Remember to be 100% supportive and make children feel like artistic geniuses while teaching them something amazing!`
                },
                {
                  role: "user",
                  content: [
                    {
                      type: "text", 
                      text: `A child has created this image. Please provide enthusiastic, encouraging feedback that celebrates their creativity. Include several specific details about what you see, a couple of fascinating educational facts related to elements in the image, and make the child feel proud and inspired to create more art!`
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
          
          if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({}));
            console.error(`[${requestId}] Groq API error (attempt ${attempts}):`, errorData);
            
            if (attempts >= maxAttempts || !openAiApiKey) {
              throw new Error(`Groq API error (status ${apiResponse.status}): ${errorData.error?.message || JSON.stringify(errorData)}`);
            }
            
            // Wait before trying next option
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          
          data = await apiResponse.json();
          break; // Success with Groq, exit loop
        } else {
          // No Groq key, try OpenAI directly
          console.log(`[${requestId}] No Groq API key, skipping to OpenAI`);
          break;
        }
      } catch (apiError) {
        console.error(`[${requestId}] Groq API call failed (attempt ${attempts}):`, apiError);
        
        if (attempts >= maxAttempts || !openAiApiKey) {
          throw new Error(`Failed to analyze image after ${maxAttempts} attempts: ${apiError.message}`);
        }
        
        // Wait before trying again or falling back to OpenAI
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // If Groq failed or not available, try OpenAI
    if (!data && openAiApiKey) {
      console.log(`[${requestId}] Falling back to OpenAI for image analysis`);
      
      try {
        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
                content: "You are an AI assistant specialized in analyzing images drawn by children. Your goal is to provide extremely encouraging, joyful feedback that celebrates their creativity and makes them feel proud of their work. Use a cheerful, supportive tone with animated expressions and child-friendly language. Include specific observations about colors, shapes, characters, or scenes they've drawn without being critical. Express genuine excitement about their creative choices. Include 2-3 fun educational facts that connect to themes in their drawing. Always be 100% supportive and make children feel like artistic geniuses!"
              },
              {
                role: "user",
                content: [
                  {
                    type: "text", 
                    text: `A child has created this image. Please provide enthusiastic, encouraging feedback that celebrates their creativity. Include a couple of fun, educational facts related to what you see in the image. Make the child feel proud and inspired to create more art!`
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
          throw new Error(`OpenAI API error (status ${openAiResponse.status}): ${errorData.error?.message || JSON.stringify(errorData)}`);
        }
        
        data = await openAiResponse.json();
      } catch (openAiError) {
        console.error(`[${requestId}] OpenAI API call failed:`, openAiError);
        throw openAiError;
      }
    }
    
    const apiDuration = (Date.now() - startTime) / 1000;
    console.log(`[${requestId}] API response received in ${apiDuration}s after ${attempts} attempt(s)`);
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid or empty response from API');
    }

    // Generate a personalized feedback message
    const feedbackMessages = [
      "WOW! Your artwork is absolutely INCREDIBLE! I'm so amazed by what you created!",
      "You're a BRILLIANT artist! Your imagination is truly spectacular!",
      "This is FANTASTIC work! You have such amazing talent!",
      "I'm SO impressed by your creativity! This is outstanding!",
      "You're a natural artist! This shows your amazing imagination!",
      "This is SPECTACULAR! Your artistic skills are truly impressive!",
      "Your creativity shines SO brightly! This is wonderful work!",
      "AMAZING job! Your artistic talents are truly magnificent!",
      "What an INCREDIBLE creation! Your imagination knows no bounds!",
      "This is absolutely DELIGHTFUL! You have such remarkable talent!"
    ];
    
    const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    
    // Structure the response data to match content blocks format
    const responseContent = data.choices[0].message.content;
    
    // Create a new curio block to be saved
    const newBlock = {
      type: "fact",
      specialist_id: "prism", // Prism is more fitting for creative content
      content: {
        fact: responseContent,
        rabbitHoles: [
          "What else can you tell about this image?",
          "What do you like best about my drawing?",
          "Can you suggest what I might draw next?"
        ]
      },
      liked: false,
      bookmarked: false,
      created_at: new Date().toISOString()
    };
    
    console.log(`[${requestId}] Successfully generated response from AI`);

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
