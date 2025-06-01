
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
    const { section_title, section_content, child_age } = await req.json()

    // For now, return a placeholder image URL
    // In production, this would integrate with DALL-E, Midjourney, or similar
    const imagePrompt = createImagePrompt(section_title, section_content, child_age)
    
    // Placeholder implementation - replace with actual image generation API
    const placeholderImages = [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1000&auto=format&fit=crop"
    ]
    
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)]
    
    return new Response(
      JSON.stringify({ 
        image_url: randomImage,
        prompt: imagePrompt
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
    
  return `Create a ${style} depicting ${title}. The image should be educational, engaging, and appropriate for a ${childAge} year old learning about this topic. Style: ${style}. Content context: ${content.substring(0, 200)}`
}
