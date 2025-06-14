
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { curioId, childId } = await req.json()
    console.log(`Triggering content generation for curio ${curioId} and child ${childId}`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get curio details
    const { data: curio, error: curioError } = await supabase
      .from('curios')
      .select('title, query')
      .eq('id', curioId)
      .single()

    if (curioError || !curio) {
      throw new Error('Curio not found')
    }

    console.log('Found curio with title:', curio.title)

    // Get child profile
    const { data: child, error: childError } = await supabase
      .from('child_profiles')
      .select('name, age, interests')
      .eq('id', childId)
      .single()

    if (childError || !child) {
      throw new Error('Child profile not found')
    }

    console.log('Found child profile with name:', child.name)

    // Generate content blocks immediately
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    const childAge = child.age || 10

    const contentBlocks = []

    if (GROQ_API_KEY) {
      try {
        // Generate multiple blocks in parallel
        const blockPromises = [
          generateBlock('fact', curio.title, childAge, 'nova'),
          generateBlock('quiz', curio.title, childAge, 'spark'),
          generateBlock('funFact', curio.title, childAge, 'prism'),
          generateBlock('activity', curio.title, childAge, 'pixel')
        ]

        const results = await Promise.allSettled(blockPromises)
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            contentBlocks.push(result.value)
          }
        })

      } catch (error) {
        console.error('Error generating blocks with Groq:', error)
      }
    }

    // Add fallback blocks if needed
    if (contentBlocks.length === 0) {
      contentBlocks.push(
        {
          specialist_id: 'nova',
          type: 'fact',
          content: {
            fact: `${curio.title} is a fascinating topic that has captured human curiosity for ages. Let's explore what makes it so special!`,
            rabbitHoles: [`How does ${curio.title} work?`, `Why is ${curio.title} important?`]
          }
        },
        {
          specialist_id: 'spark',
          type: 'quiz',
          content: {
            question: `What would you like to know most about ${curio.title}?`,
            options: [
              'How it works',
              'Where we find it',
              'Why it matters',
              'Fun facts about it'
            ],
            correctIndex: 0
          }
        }
      )
    }

    // Insert all blocks into database
    for (const block of contentBlocks) {
      try {
        const { error: insertError } = await supabase
          .from('content_blocks')
          .insert({
            curio_id: curioId,
            specialist_id: block.specialist_id,
            type: block.type,
            content: block.content
          })

        if (insertError) {
          console.error('Error inserting block:', insertError)
        } else {
          console.log('Successfully inserted content block')
        }
      } catch (err) {
        console.error('Error inserting block:', err)
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      blocksGenerated: contentBlocks.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in trigger-content-generation:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function generateBlock(type: string, topic: string, childAge: number, specialistId: string) {
  const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
  
  if (!GROQ_API_KEY) {
    return null
  }

  try {
    const prompt = createPrompt(type, topic, childAge)
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content creator for children aged ${childAge}. Create engaging, age-appropriate content. Return ONLY valid JSON.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const content = JSON.parse(data.choices[0].message.content)

    return {
      specialist_id: specialistId,
      type: type,
      content: content
    }

  } catch (error) {
    console.error(`Error generating ${type} block:`, error)
    return null
  }
}

function createPrompt(type: string, topic: string, childAge: number) {
  switch (type) {
    case 'fact':
      return `Create a fact block about "${topic}". Return JSON: {"fact": "Amazing fact text", "rabbitHoles": ["Question 1", "Question 2"]}`
    
    case 'quiz':
      return `Create a quiz about "${topic}". Return JSON: {"question": "Question text", "options": ["A", "B", "C", "D"], "correctIndex": 0}`
    
    case 'funFact':
      return `Create a fun fact about "${topic}". Return JSON: {"text": "Did you know that..."}`
    
    case 'activity':
      return `Create an activity about "${topic}". Return JSON: {"activity": "Try this fun activity...", "instructions": ["Step 1", "Step 2"]}`
    
    default:
      return `Create educational content about "${topic}". Return JSON with appropriate fields.`
  }
}
