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
    const { topicId, sectionTitle, sectionNumber, childAge, topicTitle } = await req.json()
    console.log(`Generating content for: ${sectionTitle} (Age: ${childAge})`)

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    
    let content = ''
    let facts: string[] = []

    if (GROQ_API_KEY) {
      try {
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
                content: `You are an expert children's educator. Create engaging, age-appropriate content for a ${childAge}-year-old child about "${sectionTitle}" which is part of a larger topic on "${topicTitle}".

Your response must be a single, valid JSON object with the following structure:
{
  "content": "string",
  "facts": ["string", "string", "string"]
}

The "content" should be 2-3 paragraphs of clear, educational text. Use simple language, exciting examples, and make it fun.
The "facts" should be an array of 3 fascinating facts.
Do not include any text or formatting outside of the single JSON object.`
              },
              {
                role: 'user',
                content: `Create content for the section "${sectionTitle}" about ${topicTitle}`
              }
            ],
            max_tokens: 800,
            temperature: 0.8,
            response_format: { type: "json_object" }
          })
        })

        if (response.ok) {
          const data = await response.json()
          const fullResponse = data.choices[0].message.content

          try {
            const parsed = JSON.parse(fullResponse)
            content = parsed.content || ''
            facts = parsed.facts || []
            
            if (!content || !Array.isArray(facts) || facts.length === 0) {
              console.log('Generated JSON missing fields, falling back.')
              throw new Error('Generated JSON missing required fields.')
            }

            console.log('Successfully generated content with Groq')
          } catch (parseError) {
            console.error('Failed to parse JSON from Groq, falling back.', parseError)
            const fallbackContent = generateFallbackContent(sectionTitle, topicTitle, childAge)
            content = fallbackContent.content
            facts = fallbackContent.facts
          }
        } else {
          throw new Error(`Groq API error: ${response.status}`)
        }
      } catch (groqError) {
        console.error('Groq API call failed:', groqError.message)
        const fallbackContent = generateFallbackContent(sectionTitle, topicTitle, childAge)
        content = fallbackContent.content
        facts = fallbackContent.facts
      }
    } else {
      console.log('No Groq API key, using fallback content generation')
      const fallbackContent = generateFallbackContent(sectionTitle, topicTitle, childAge)
      content = fallbackContent.content
      facts = fallbackContent.facts
    }

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: section, error } = await supabase
      .from('learning_sections')
      .insert({
        topic_id: topicId,
        title: sectionTitle,
        section_number: sectionNumber,
        content: content,
        facts: facts,
        word_count: content.split(' ').length
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Successfully created section:', section.id)
    return new Response(JSON.stringify(section), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in generate-section-content:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function generateFallbackContent(sectionTitle: string, topicTitle: string, childAge: number) {
  console.log('Falling back to local content generation')
  
  const templates = {
    'Introduction': {
      content: `Welcome to the amazing world of ${topicTitle}! This is going to be an exciting journey where we'll discover incredible things together.

${topicTitle} is all around us, and once you start learning about it, you'll see it everywhere! From the moment you wake up in the morning to when you go to sleep at night, ${topicTitle} plays an important role in our daily lives.

Get ready to become an expert! We'll explore fascinating facts, learn how things work, and discover why ${topicTitle} is so special. Let's begin our adventure!`,
      facts: [
        `${topicTitle} has been fascinating people for thousands of years!`,
        `Scientists are still discovering new things about ${topicTitle} every day.`,
        `You can find examples of ${topicTitle} in your own backyard or home!`
      ]
    },
    'Fun Facts': {
      content: `Did you know that ${topicTitle} is full of surprises? There are so many amazing things that will blow your mind!

Some of the coolest facts about ${topicTitle} might seem almost impossible to believe, but they're absolutely true! Scientists have spent years studying these incredible phenomena, and what they've discovered is truly spectacular.

These fun facts will help you understand just how awesome ${topicTitle} really is. You'll be able to share these amazing discoveries with your friends and family!`,
      facts: [
        `The largest example of ${topicTitle} is bigger than you could ever imagine!`,
        `${topicTitle} can be found in the most unexpected places on Earth.`,
        `Some forms of ${topicTitle} are older than the dinosaurs!`
      ]
    },
    'How It Works': {
      content: `Have you ever wondered how ${topicTitle} actually works? The science behind it is absolutely fascinating!

Everything in nature follows special rules, and ${topicTitle} is no exception. These rules, called scientific principles, help us understand why things happen the way they do. It's like solving an exciting puzzle!

When we understand how ${topicTitle} works, we can appreciate it even more. We can also use this knowledge to create amazing inventions and solve important problems in our world.`,
      facts: [
        `The process behind ${topicTitle} involves incredible forces of nature.`,
        `Scientists use special tools to study how ${topicTitle} works.`,
        `Understanding ${topicTitle} has led to many important inventions!`
      ]
    }
  }

  const template = templates[sectionTitle] || templates['Introduction']
  
  return {
    content: template.content,
    facts: template.facts
  }
}

function generateFallbackFacts(sectionTitle: string, topicTitle: string) {
  return [
    `${topicTitle} is more amazing than most people realize!`,
    `There are still many mysteries about ${topicTitle} waiting to be discovered.`,
    `Learning about ${topicTitle} can help us understand our world better.`
  ]
}
