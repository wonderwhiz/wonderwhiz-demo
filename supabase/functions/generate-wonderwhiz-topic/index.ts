
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
    const { topic, childAge, childId } = await req.json()
    console.log(`NEW REQUEST: Generating WonderWhiz topic for: ${topic}, age: ${childAge}`)

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    
    if (!GROQ_API_KEY) {
      console.error('No Groq API key found. Using fallback.')
      return generateFallbackTopic(topic, childAge, childId)
    }

    try {
      console.log('Calling Groq API...')
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
              content: `You are an expert educational content creator. Generate a comprehensive learning topic structure for children aged ${childAge}. Return ONLY a valid JSON object with this exact structure:
{
  "title": "Topic Title",
  "description": "Brief description",
  "table_of_contents": [
    {"title": "Section 1", "description": "What this covers"},
    {"title": "Section 2", "description": "What this covers"},
    {"title": "Section 3", "description": "What this covers"}
  ],
  "total_sections": 3
}`
            },
            {
              role: 'user',
              content: `Create a learning topic about: ${topic}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error(`Groq API error: ${response.status}`, errorBody)
        throw new Error(`Groq API error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Groq response received.')
      const content = data.choices[0].message.content
      console.log('Raw content from Groq:', content)

      let topicData
      try {
        topicData = JSON.parse(content)
        console.log('Successfully parsed Groq response:', topicData)
      } catch (parseError) {
        console.error('Failed to parse Groq response content:', content, parseError)
        return generateFallbackTopic(topic, childAge, childId)
      }

      try {
        // Insert into database
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        console.log('Inserting generated topic into database...')
        const { data: insertedTopic, error } = await supabase
          .from('learning_topics')
          .insert({
            child_id: childId,
            title: topicData.title,
            description: topicData.description,
            table_of_contents: topicData.table_of_contents,
            total_sections: topicData.total_sections,
            child_age: childAge,
            status: 'planning'
          })
          .select()
          .single()

        if (error) {
          console.error('Database insertion error:', error)
          throw error
        }

        console.log('Successfully created topic:', insertedTopic.id)
        return new Response(JSON.stringify(insertedTopic), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      } catch (dbError) {
        console.error('Caught DB error after parsing, using fallback.', dbError)
        return generateFallbackTopic(topic, childAge, childId)
      }

    } catch (groqError) {
      console.error('Groq API call failed:', groqError)
      return generateFallbackTopic(topic, childAge, childId)
    }

  } catch (error) {
    console.error('Generic error in generate-wonderwhiz-topic:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function generateFallbackTopic(topic: string, childAge: number, childId: string) {
  console.log('Using fallback topic generation logic')
  
  const fallbackTopic = {
    title: topic,
    description: `An exciting exploration of ${topic} designed for curious minds!`,
    table_of_contents: [
      { title: "Introduction", description: `What is ${topic}?` },
      { title: "Fun Facts", description: `Amazing things about ${topic}` },
      { title: "How It Works", description: `The science behind ${topic}` },
      { title: "In the Real World", description: `Where we see ${topic} around us` }
    ],
    total_sections: 4
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Inserting fallback topic into database...')
    const { data: insertedTopic, error } = await supabase
      .from('learning_topics')
      .insert({
        child_id: childId,
        title: fallbackTopic.title,
        description: fallbackTopic.description,
        table_of_contents: fallbackTopic.table_of_contents,
        total_sections: fallbackTopic.total_sections,
        child_age: childAge,
        status: 'planning'
      })
      .select()
      .single()

    if (error) {
        console.error('Database fallback insertion failed:', error)
        throw error
    }
    
    console.log('Successfully created fallback topic:', insertedTopic.id)
    return new Response(JSON.stringify(insertedTopic), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (dbError) {
    console.error('Caught final DB error in fallback:', dbError.message)
    return new Response(JSON.stringify({ error: 'Failed to create topic' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
