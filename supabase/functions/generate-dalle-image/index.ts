
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      throw new Error('OPENAI_API_KEY is not set')
    }

    const { prompt, childAge = 10, retryCount = 0 } = await req.json()

    if (!prompt) {
      console.error('Prompt is required')
      throw new Error('Prompt is required')
    }

    // Ensure the prompt is safe for children
    let safePrompt = prompt
    if (safePrompt.length > 800) {
      safePrompt = safePrompt.substring(0, 800)
    }

    // Modify the prompt based on child's age
    let finalPrompt = safePrompt
    if (childAge < 8) {
      finalPrompt = `${safePrompt}. Make it colorful, simple, and playful - suitable for young children.`
    } else if (childAge < 13) {
      finalPrompt = `${safePrompt}. Make it educational, engaging, and visually appealing - suitable for children.`
    } else {
      finalPrompt = `${safePrompt}. Make it visually rich, educational, and appealing to teenagers.`
    }

    console.log('Generating DALL-E image with prompt:', finalPrompt.substring(0, 100) + '...')

    // Call OpenAI DALL-E API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: finalPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url',
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API Error:', errorData)
      
      // If we've already retried or the error is related to content policy
      if (retryCount > 0 || errorData.includes('content_policy')) {
        // Return a useful error so the client can handle it
        return new Response(
          JSON.stringify({
            error: `OpenAI API error: ${response.status}`,
            errorDetails: errorData,
            success: false,
            // Include a fallback image URL from Unsplash based on topic detection
            fallbackImageUrl: getFallbackImageUrl(safePrompt)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }
      
      // For other errors, try with a more generic prompt
      const genericPrompt = makeGenericPrompt(safePrompt, childAge)
      
      // Make a recursive call with the generic prompt
      const retryResponse = await fetch(req.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: genericPrompt,
          childAge,
          retryCount: retryCount + 1
        }),
      })
      
      return retryResponse
    }

    const data = await response.json()
    console.log('DALL-E API response:', JSON.stringify(data).substring(0, 100) + '...')

    if (!data.data || data.data.length === 0) {
      console.error('No image generated')
      throw new Error('No image generated')
    }

    const imageUrl = data.data[0].url
    const altText = data.data[0].revised_prompt || finalPrompt

    return new Response(
      JSON.stringify({
        imageUrl,
        altText,
        success: true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error generating DALL-E image:', error)
    
    // Extract the prompt from the request to generate a fallback
    let prompt = "educational content for children";
    let childAge = 10;
    
    try {
      const requestData = await req.clone().json();
      prompt = requestData.prompt || prompt;
      childAge = requestData.childAge || childAge;
    } catch (parseError) {
      console.error('Failed to parse request for fallback:', parseError);
    }
    
    // Get a topic-appropriate fallback image
    const fallbackImageUrl = getFallbackImageUrl(prompt);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
        fallbackImageUrl: fallbackImageUrl,
        fallbackAltText: `Illustration related to ${prompt.substring(0, 50)}...`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to prevent frontend crashes
      }
    )
  }
})

// Function to create a more generic, DALL-E friendly prompt
function makeGenericPrompt(originalPrompt: string, childAge: number): string {
  // Extract potential topic keywords
  const lowerPrompt = originalPrompt.toLowerCase();
  
  let topic = "educational";
  
  if (lowerPrompt.includes("space") || lowerPrompt.includes("planet") || lowerPrompt.includes("star") || lowerPrompt.includes("galaxy")) {
    topic = "space and planets";
  } else if (lowerPrompt.includes("animal") || lowerPrompt.includes("wildlife")) {
    topic = "animals and wildlife";
  } else if (lowerPrompt.includes("history") || lowerPrompt.includes("ancient")) {
    topic = "historical events";
  } else if (lowerPrompt.includes("science") || lowerPrompt.includes("chemistry") || lowerPrompt.includes("physics")) {
    topic = "science concepts";
  } else if (lowerPrompt.includes("math") || lowerPrompt.includes("number")) {
    topic = "mathematics";
  } else if (lowerPrompt.includes("art") || lowerPrompt.includes("draw") || lowerPrompt.includes("paint")) {
    topic = "art and creativity";
  } else if (lowerPrompt.includes("music") || lowerPrompt.includes("sound")) {
    topic = "music and sounds";
  }
  
  // Create age-appropriate generic prompt
  let genericPrompt = `A child-friendly educational illustration about ${topic}`;
  
  if (childAge < 8) {
    return `${genericPrompt}. Make it colorful, simple, and playful with cute characters - suitable for young children.`;
  } else if (childAge < 13) {
    return `${genericPrompt}. Make it educational, engaging, and visually appealing with interesting details - suitable for children.`;
  } else {
    return `${genericPrompt}. Make it visually rich, educational, and appealing to teenagers with more detailed information.`;
  }
}

// Function to get a fallback image URL based on the prompt
function getFallbackImageUrl(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Default educational fallback
  let fallbackUrl = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80";
  
  // Check for specific topics and provide relevant fallbacks
  if (lowerPrompt.includes("space") || lowerPrompt.includes("planet") || lowerPrompt.includes("star") || lowerPrompt.includes("galaxy")) {
    fallbackUrl = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("ocean") || lowerPrompt.includes("sea") || lowerPrompt.includes("marine")) {
    fallbackUrl = "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("animal") || lowerPrompt.includes("wildlife")) {
    fallbackUrl = "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("dinosaur") || lowerPrompt.includes("prehistoric")) {
    fallbackUrl = "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("robot") || lowerPrompt.includes("technology")) {
    fallbackUrl = "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("history") || lowerPrompt.includes("ancient")) {
    fallbackUrl = "https://images.unsplash.com/photo-1566055909643-5e9f4c10de6d?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("science") || lowerPrompt.includes("experiment")) {
    fallbackUrl = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("art") || lowerPrompt.includes("creative")) {
    fallbackUrl = "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("music") || lowerPrompt.includes("instrument")) {
    fallbackUrl = "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("math") || lowerPrompt.includes("number")) {
    fallbackUrl = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80";
  } else if (lowerPrompt.includes("plant") || lowerPrompt.includes("flower") || lowerPrompt.includes("tree")) {
    fallbackUrl = "https://images.unsplash.com/photo-1502331538081-041522531548?w=1200&auto=format&fit=crop&q=80";
  }
  
  return fallbackUrl;
}
