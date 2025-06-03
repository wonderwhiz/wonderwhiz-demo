
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("Received request to generate-curio-suggestions")
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log("Request body parsed successfully:", JSON.stringify(body).substring(0, 200) + "...")

    const { childProfile, pastCurios } = body

    // Validate input
    if (!childProfile) {
      throw new Error('Child profile is required')
    }

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    
    if (!GROQ_API_KEY) {
      console.log('GROQ_API_KEY not found, using fallback suggestions')
      return generateFallbackSuggestions(childProfile, pastCurios)
    }

    try {
      // Create age-appropriate suggestions prompt
      const prompt = createSuggestionsPrompt(childProfile, pastCurios)
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are Wonder Whiz, an AI that generates age-appropriate curiosity questions for children. You create engaging questions that spark wonder and learning.

CRITICAL: Respond ONLY with a valid JSON array of 6 question strings. No other text.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Groq API error ${response.status}:`, errorText)
        throw new Error(`Groq API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedContent = data.choices[0]?.message?.content

      if (!generatedContent) {
        throw new Error('No content generated from Groq API')
      }

      // Parse the suggestions
      const suggestions = parseSuggestions(generatedContent)
      
      return new Response(
        JSON.stringify({
          suggestions,
          source: 'groq'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    } catch (apiError) {
      console.error('Groq API call failed:', apiError)
      console.log('Falling back to local suggestions')
      return generateFallbackSuggestions(childProfile, pastCurios)
    }
  } catch (error) {
    console.error('Error in generate-curio-suggestions:', error)
    
    // Always provide fallback suggestions
    const fallbackSuggestions = [
      "How do rainbows form in the sky?",
      "Why do leaves change color in autumn?",
      "What makes the ocean waves?",
      "How do birds know where to fly?",
      "Why do we see lightning before thunder?",
      "What makes flowers smell so good?"
    ]
    
    return new Response(
      JSON.stringify({
        suggestions: fallbackSuggestions,
        source: 'error-fallback'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function createSuggestionsPrompt(childProfile: any, pastCurios: any[] = []) {
  const age = childProfile.age || 10
  const interests = childProfile.interests || []
  const name = childProfile.name || 'there'
  
  const pastTopics = pastCurios?.map(c => c.title || c.query).filter(Boolean).slice(0, 5) || []
  
  return `Generate 6 age-appropriate curiosity questions for ${name}, age ${age}.

Interests: ${interests.length > 0 ? interests.join(', ') : 'general learning'}
${pastTopics.length > 0 ? `Recent topics explored: ${pastTopics.join(', ')}` : ''}

Guidelines:
- Questions should spark wonder and curiosity
- Use age-appropriate language for ${age}-year-old
- Mix topics: some from interests, some general
- Avoid repeating recent topics
- Make questions engaging and fun
- Each question should be 5-15 words

Respond with exactly 6 questions in JSON array format:
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?", "Question 6?"]`
}

function parseSuggestions(content: string): string[] {
  try {
    // Clean the content and find JSON array
    let cleanContent = content.trim()
    
    const arrayStart = cleanContent.indexOf('[')
    const arrayEnd = cleanContent.lastIndexOf(']')
    
    if (arrayStart !== -1 && arrayEnd !== -1) {
      cleanContent = cleanContent.substring(arrayStart, arrayEnd + 1)
    }
    
    const parsed = JSON.parse(cleanContent)
    
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 6).map(q => String(q).trim())
    }
    
    throw new Error('Invalid array format')
  } catch {
    // Extract questions from text format
    const lines = content.split('\n')
    const questions = lines
      .filter(line => line.includes('?'))
      .map(line => line.replace(/^[\d\-\*\s\"\'\[\]]+/, '').replace(/[\"\'\[\]]+$/, '').trim())
      .filter(q => q.length > 0)
      .slice(0, 6)
    
    return questions.length > 0 ? questions : getDefaultSuggestions()
  }
}

function getDefaultSuggestions(): string[] {
  return [
    "How do rainbows form in the sky?",
    "Why do leaves change color in autumn?",
    "What makes the ocean waves?",
    "How do birds know where to fly?",
    "Why do we see lightning before thunder?",
    "What makes flowers smell so good?"
  ]
}

function generateFallbackSuggestions(childProfile: any, pastCurios: any[] = []) {
  const age = childProfile?.age || 10
  const interests = childProfile?.interests || []
  
  let suggestions = []
  
  // Age-appropriate base questions
  if (age <= 7) {
    suggestions = [
      "Why is the sky blue?",
      "How do birds fly?",
      "Where do rainbows come from?",
      "Why do flowers smell nice?",
      "How do fish breathe underwater?",
      "Why do we need to sleep?"
    ]
  } else if (age <= 11) {
    suggestions = [
      "How do volcanoes work?",
      "Why do planets stay in space?",
      "How do our brains remember things?",
      "What makes lightning?",
      "How do animals talk to each other?",
      "Why do seasons change?"
    ]
  } else {
    suggestions = [
      "How do black holes work?",
      "What causes aurora borealis?",
      "How does DNA store information?",
      "What makes gravity work?",
      "How do computers think?",
      "Why do we dream?"
    ]
  }
  
  // Add interest-based questions
  if (interests.includes('space')) {
    suggestions[0] = age <= 7 ? "What are stars made of?" : age <= 11 ? "How big is the universe?" : "How do galaxies form?"
  }
  
  if (interests.includes('animals')) {
    suggestions[1] = age <= 7 ? "Why do cats purr?" : age <= 11 ? "How do dolphins communicate?" : "How do animals evolve?"
  }
  
  return new Response(
    JSON.stringify({
      suggestions,
      source: 'fallback'
    }),
    { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  )
}
