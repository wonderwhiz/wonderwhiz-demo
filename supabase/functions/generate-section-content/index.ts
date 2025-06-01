
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
    const { topic, section_title, section_description, child_age, section_number } = await req.json()

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not found')
    }

    // Create age-appropriate content prompt
    const prompt = createContentPrompt(topic, section_title, section_description, child_age)

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
            content: `You are Wonder Whiz, an award-winning educational AI created by leading IB educationalists and Cambridge PhD child psychologists. You create engaging, age-appropriate encyclopedia content that makes learning fun and addictive through gamification principles.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedContent = data.choices[0]?.message?.content

    if (!generatedContent) {
      throw new Error('No content generated')
    }

    // Parse the generated content
    const parsedContent = parseGeneratedContent(generatedContent)
    
    return new Response(
      JSON.stringify(parsedContent),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error generating content:', error)
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

function createContentPrompt(topic: string, sectionTitle: string, sectionDescription: string, childAge: number) {
  const ageGuidance = getAgeGuidance(childAge)
  
  return `Create engaging encyclopedia content for "${sectionTitle}" about "${topic}".

Section Description: ${sectionDescription}
Target Age: ${childAge} years old
${ageGuidance}

Requirements:
- Write approximately 500 words of detailed, engaging content
- Include 3-5 amazing facts that will blow young minds
- Use ${childAge <= 8 ? 'simple, fun language with emojis' : childAge <= 12 ? 'clear explanations with some technical terms' : 'detailed explanations with proper scientific/technical terminology'}
- If the topic is complex or heavy, include a simple story/analogy to explain it
- Make it educational but entertaining
- Include specific examples and real-world applications

Format your response as JSON:
{
  "content": "Main 500-word content here...",
  "facts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5"],
  "story_mode_content": "Optional story/analogy if needed for complex topics",
  "word_count": 500
}

Make this content amazing and memorable!`
}

function getAgeGuidance(age: number) {
  if (age <= 6) {
    return `
Age Guidance (5-6 years):
- Use very simple words and short sentences
- Include lots of emojis and exclamation points
- Compare to things they know (toys, animals, family)
- Use "imagine if..." scenarios
- Keep paragraphs very short`
  } else if (age <= 9) {
    return `
Age Guidance (7-9 years):
- Use clear, straightforward language
- Include fun comparisons and analogies
- Add "did you know?" facts
- Use some educational vocabulary but explain it
- Make it interactive and engaging`
  } else if (age <= 12) {
    return `
Age Guidance (10-12 years):
- Use more sophisticated vocabulary
- Include scientific concepts explained simply
- Add historical context where relevant
- Use real statistics and measurements
- Encourage critical thinking`
  } else {
    return `
Age Guidance (13-16 years):
- Use proper scientific/academic terminology
- Include complex concepts and theories
- Add detailed explanations and mechanisms
- Include current research and discoveries
- Encourage deeper analysis and understanding`
  }
}

function parseGeneratedContent(content: string) {
  try {
    // Try to parse as JSON first
    return JSON.parse(content)
  } catch {
    // If not JSON, create structured response
    const lines = content.split('\n').filter(line => line.trim())
    
    // Extract facts (lines that start with bullet points or numbers)
    const facts = lines
      .filter(line => /^[\d•\-\*]/.test(line.trim()))
      .map(line => line.replace(/^[\d•\-\*\s\.]+/, '').trim())
      .slice(0, 5)
    
    // Remove facts from main content
    const mainContent = lines
      .filter(line => !/^[\d•\-\*]/.test(line.trim()))
      .join('\n')
    
    return {
      content: mainContent,
      facts: facts.length > 0 ? facts : [
        "This topic has fascinating aspects that scientists are still discovering!",
        "There are many real-world applications of this concept!",
        "This knowledge connects to many other interesting subjects!"
      ],
      story_mode_content: null,
      word_count: mainContent.split(' ').length
    }
  }
}
