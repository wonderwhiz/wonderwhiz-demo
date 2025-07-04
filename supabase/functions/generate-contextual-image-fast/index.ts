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
    const { section_title, section_content, child_age, topic_title } = await req.json()

    // Fast, curated educational images for different topics
    const topicImageMaps = {
      'space': [
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop"
      ],
      'ocean': [
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1000&auto=format&fit=crop"
      ],
      'animals': [
        "https://images.unsplash.com/photo-1549366021-9f761d040a94?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=1000&auto=format&fit=crop"
      ],
      'science': [
        "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=1000&auto=format&fit=crop"
      ],
      'nature': [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop"
      ]
    }

    const defaultImages = [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop"
    ]

    // Smart topic detection for better image matching
    const detectTopic = (title: string, content: string) => {
      const text = `${title} ${content} ${topic_title}`.toLowerCase()
      
      if (text.includes('space') || text.includes('planet') || text.includes('star') || text.includes('galaxy') || text.includes('solar')) {
        return 'space'
      } else if (text.includes('ocean') || text.includes('sea') || text.includes('water') || text.includes('marine') || text.includes('fish')) {
        return 'ocean'
      } else if (text.includes('animal') || text.includes('wildlife') || text.includes('mammal') || text.includes('bird') || text.includes('creature')) {
        return 'animals'
      } else if (text.includes('science') || text.includes('experiment') || text.includes('chemistry') || text.includes('physics') || text.includes('biology')) {
        return 'science'
      } else if (text.includes('nature') || text.includes('forest') || text.includes('tree') || text.includes('plant') || text.includes('environment')) {
        return 'nature'
      }
      return 'default'
    }

    const detectedTopic = detectTopic(section_title, section_content || '')
    const imagePool = topicImageMaps[detectedTopic] || defaultImages
    
    // Use hash of section title for consistent image selection
    const hash = section_title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const selectedImage = imagePool[hash % imagePool.length]

    // Create a descriptive prompt for future AI image generation
    const imagePrompt = createImagePrompt(section_title, section_content, child_age)
    
    return new Response(
      JSON.stringify({ 
        image_url: selectedImage,
        prompt: imagePrompt,
        topic: detectedTopic,
        is_fast_cached: true
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error generating image:', error)
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

function createImagePrompt(title: string, content: string, childAge: number) {
  const style = childAge <= 8 
    ? "colorful, cartoon-like, child-friendly illustration" 
    : childAge <= 12 
    ? "detailed, educational illustration with bright colors"
    : "realistic, detailed scientific visualization"
    
  return `Create a ${style} depicting ${title}. The image should be educational, engaging, and appropriate for a ${childAge} year old learning about this topic. Style: ${style}. Content context: ${content?.substring(0, 200) || 'educational content'}`
}