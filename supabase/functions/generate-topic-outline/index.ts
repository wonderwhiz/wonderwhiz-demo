
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, child_age } = await req.json()

    // Generate age-appropriate table of contents
    const sections = generateSections(topic, child_age)
    
    return new Response(
      JSON.stringify({ sections }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function generateSections(topic: string, childAge: number) {
  const baseTime = childAge <= 8 ? 3 : childAge <= 12 ? 4 : 5

  return [
    {
      section_number: 1,
      title: childAge <= 8 ? "What is it?" : "Introduction",
      description: childAge <= 8 
        ? `Let's discover what ${topic} is all about!` 
        : `Understanding the basics of ${topic}`,
      estimated_reading_time: baseTime,
      completed: false
    },
    {
      section_number: 2,
      title: childAge <= 8 ? "Cool Facts!" : "Amazing Facts & Discovery",
      description: childAge <= 8 
        ? "Super cool things you didn't know!" 
        : "Mind-blowing facts and historical discoveries",
      estimated_reading_time: baseTime + 1,
      completed: false
    },
    {
      section_number: 3,
      title: childAge <= 8 ? "How Does It Work?" : "Science & Mechanics",
      description: childAge <= 8 
        ? "The magic behind how it works!" 
        : "The scientific principles and mechanisms involved",
      estimated_reading_time: baseTime + 2,
      completed: false
    },
    {
      section_number: 4,
      title: childAge <= 8 ? "Fun Examples" : "Real-World Applications",
      description: childAge <= 8 
        ? "Cool examples you can see around you!" 
        : "How this applies in the real world and everyday life",
      estimated_reading_time: baseTime + 1,
      completed: false
    },
    {
      section_number: 5,
      title: childAge <= 8 ? "Why Is It Important?" : "Impact & Significance",
      description: childAge <= 8 
        ? "Why this is so awesome and important!" 
        : "The broader impact and significance in our world",
      estimated_reading_time: baseTime,
      completed: false
    }
  ]
}
