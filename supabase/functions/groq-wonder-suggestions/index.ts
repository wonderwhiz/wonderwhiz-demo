
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
// Fix the Groq import to use the official npm package
import Groq from 'https://esm.sh/groq@latest'

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

    // Initialize Groq client
    const groqClient = new Groq({
      apiKey: Deno.env.get('GROQ_API_KEY')!,
    })

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

    // Call Groq API
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a children\'s educational content generator. You specialize in creating age-appropriate questions that spark curiosity and wonder in children. Your output must be exactly in the JSON format requested.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Parse the response
    const responseText = completion.choices[0]?.message?.content || '[]'
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
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})
