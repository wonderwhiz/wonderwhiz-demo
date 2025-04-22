
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { childAge, interests = [], count = 6 } = await req.json()

    // Get the GROQ API key from environment
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')!
    
    if (!GROQ_API_KEY) {
      console.error('Missing GROQ_API_KEY environment variable')
      throw new Error('API configuration error')
    }

    console.log(`Generating wonder suggestions for childAge: ${childAge}, interests: ${interests.join(', ')}, count: ${count}`)

    try {
      // Create prompt based on child's age and interests
      const interestsText = interests.length > 0 
        ? `Their interests include: ${interests.join(', ')}.` 
        : 'They have diverse interests.'

      let ageDescription = 'a young person'
      if (childAge <= 7) {
        ageDescription = 'a young child (5-7 years old)'
      } else if (childAge <= 11) {
        ageDescription = 'a child (8-11 years old)'
      } else {
        ageDescription = 'a teenager (12-16 years old)'
      }

      const prompt = `Generate ${count} engaging, age-appropriate curiosity questions for ${ageDescription}. ${interestsText}
      
      Make the questions interesting, educational and diverse across different topics. For young children, use simpler language and more "wow" questions.
      
      Output ONLY the list of ${count} questions as an array in JSON format with no additional text.
      Example format: ["Why is the sky blue?", "How do planes fly?", ...] 
      
      The questions should be complete, standalone questions (not conversation starters) that a child would be curious about.`

      // Call the OpenAI API instead of Groq since there's an issue with Groq library
      const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an AI designed to generate educational, interesting, and age-appropriate questions for children that spark curiosity and wonder. Your output must be exactly in the JSON format requested.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!completion.ok) {
        throw new Error(`OpenAI API error: ${completion.status} - ${await completion.text()}`)
      }

      const data = await completion.json()
      const responseText = data.choices[0]?.message?.content || '[]'
      
      // Parse the response
      let questions
      
      try {
        // Find JSON array in the response
        const jsonMatch = responseText.match(/\[.*\]/s)
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0])
        } else {
          // Fallback if no JSON array is found
          questions = JSON.parse(responseText)
        }
      } catch (error) {
        console.error('Error parsing JSON response:', error)
        console.log('Raw response:', responseText)
        
        // Fallback questions if parsing fails
        questions = [
          "Why is the sky blue?",
          "How do animals communicate?", 
          "What makes rainbows form?",
          "How do planes stay in the air?",
          "Why do we dream?",
          "What is beyond our solar system?"
        ]
      }

      // Return the questions
      return new Response(
        JSON.stringify({ suggestions: questions }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          status: 200
        }
      )
    } catch (apiError) {
      console.error('Error generating suggestions:', apiError)
      
      // Provide fallback suggestions
      const fallbackSuggestions = [
        "Why is the sky blue?",
        "How do computers work?",
        "Why do seasons change?",
        "How do birds fly?",
        "What makes thunder and lightning?",
        "How do plants grow from seeds?"
      ]
      
      return new Response(
        JSON.stringify({ 
          suggestions: fallbackSuggestions.slice(0, count),
          error: apiError.message,
          fallback: true 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
  } catch (error) {
    console.error('Error in groq-wonder-suggestions:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message, 
        suggestions: [
          "Why is the sky blue?",
          "How do computers work?",
          "Why do seasons change?",
          "How do birds fly?",
          "What makes thunder and lightning?",
          "How do plants grow from seeds?"
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even with errors to prevent crashing the frontend
      }
    )
  }
})
