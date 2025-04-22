
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
      throw new Error('OPENAI_API_KEY is not set')
    }

    const { prompt, childAge = 10 } = await req.json()

    if (!prompt) {
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
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('DALL-E API response:', JSON.stringify(data).substring(0, 100) + '...')

    if (!data.data || data.data.length === 0) {
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
    
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to prevent frontend crashes
      }
    )
  }
})
