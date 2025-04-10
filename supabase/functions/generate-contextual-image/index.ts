
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request
    if (!req.body) {
      throw new Error('Request body is required');
    }
    
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { topic, style = "Pixar-style educational illustration", childAge = 10 } = requestBody;
    
    if (!topic) {
      throw new Error('Topic is required');
    }

    console.log(`Generating image for topic: ${topic}, style: ${style}, age: ${childAge}`);

    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        imageUrl: getFallbackImage(topic) 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Adjust complexity based on child's age
    let ageAppropriate;
    if (childAge <= 7) {
      ageAppropriate = 'simple, colorful, and suitable for young children (age 5-7)';
    } else if (childAge <= 12) {
      ageAppropriate = 'engaging and educational, suitable for children (age 8-12)';
    } else {
      ageAppropriate = 'visually interesting and informative, suitable for teenagers';
    }

    const prompt = `A ${style} about ${topic}. The image should be ${ageAppropriate}, educational, inspiring wonder and curiosity. No text in the image.`;

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;

      console.log('Successfully generated image:', imageUrl.substring(0, 40) + '...');

      return new Response(JSON.stringify({ imageUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (openAIError) {
      console.error('Error calling OpenAI API:', openAIError);
      
      // Return a fallback image URL
      return new Response(JSON.stringify({ 
        error: openAIError.message,
        imageUrl: getFallbackImage(topic) 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-contextual-image function:', error);
    
    // Extract topic from the request to provide a relevant fallback
    let topic = 'general';
    try {
      const { topic: requestTopic } = await req.json();
      if (requestTopic) topic = requestTopic;
    } catch (e) {
      // If parsing fails, use default topic
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      imageUrl: getFallbackImage(topic) 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to provide fallback images based on topic
function getFallbackImage(topic: string): string {
  const fallbackImages: Record<string, string> = {
    ocean: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
    volcano: "https://images.unsplash.com/photo-1562117532-14a6c72858c9?q=80&w=1000&auto=format&fit=crop",
    space: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop",
    dinosaur: "https://images.unsplash.com/photo-1615243029542-4fcced64c70e?q=80&w=1000&auto=format&fit=crop",
    robot: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1000&auto=format&fit=crop",
    animal: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1000&auto=format&fit=crop",
    plant: "https://images.unsplash.com/photo-1502331538081-041522531548?q=80&w=1000&auto=format&fit=crop",
    earth: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop"
  };
  
  // Find the most relevant image by checking if the topic contains any of our keywords
  const topicLower = topic.toLowerCase();
  const relevantTopic = Object.keys(fallbackImages).find(key => 
    topicLower.includes(key)
  );
  
  return relevantTopic ? fallbackImages[relevantTopic] : fallbackImages.earth;
}
