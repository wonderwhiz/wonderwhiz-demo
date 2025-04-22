import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    // Get the API key from environment variable
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable not set');
    }

    // Parse request body with better error handling
    let requestData;
    try {
      requestData = await req.json();
      console.log('Request data:', JSON.stringify(requestData).substring(0, 200) + '...');
    } catch (parseError) {
      console.error('Error parsing request JSON:', parseError);
      throw new Error('Invalid request format: Could not parse JSON');
    }
    
    const { 
      prompt, 
      style = 'vivid', 
      childAge = 10, 
      size = '1024x1024', 
      retryOnFail = true 
    } = requestData;
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log(`Generating image for prompt: "${prompt.substring(0, 50)}..." with style: ${style}, childAge: ${childAge}`);
    
    // Adapt the prompt based on child age to ensure age-appropriate content
    let safePrompt = prompt;
    
    if (childAge <= 7) {
      safePrompt = `${prompt}, kid-friendly, colorful, cartoon style, simple shapes, cheerful, educational illustration for young children`;
    } else if (childAge <= 11) {
      safePrompt = `${prompt}, educational, vibrant colors, age-appropriate for ${childAge} year olds, learning material, engaging illustration`;
    } else {
      safePrompt = `${prompt}, educational, detailed, engaging, teenage-appropriate illustration, modern style`;
    }

    // Truncate prompt if too long (OpenAI has a max length)
    if (safePrompt.length > 900) {
      safePrompt = safePrompt.substring(0, 900);
      console.log('Prompt truncated to 900 characters');
    }

    // Call DALL-E 3 API with updated parameters according to OpenAI docs
    console.log('Calling OpenAI API with prompt:', safePrompt.substring(0, 50) + '...');
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: safePrompt,
        n: 1,
        size: size,
        style: style,
        quality: "standard",
        response_format: "url" // URL is more efficient than b64_json
      })
    });

    // Check if response is OK and handle error responses properly
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('DALL-E API error:', errorData);
      } catch (e) {
        // If we can't parse JSON response, get text instead
        const errorText = await response.text();
        console.error('DALL-E API error (raw):', errorText);
        errorData = { error: { message: `HTTP ${response.status}: ${errorText}` } };
      }
      
      // If this is a content policy violation or similar issue, try to get a fallback image
      if (retryOnFail) {
        console.log('Attempting to fetch fallback image from Unsplash');
        const fallbackImage = await getFallbackImage(prompt);
        
        if (fallbackImage) {
          console.log('Successfully retrieved fallback image from Unsplash');
          return new Response(
            JSON.stringify({ 
              imageUrl: fallbackImage,
              originalError: errorData.error?.message || 'OpenAI API error',
              source: 'fallback'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    // Process the successful response
    try {
      const data = await response.json();
      
      if (!data.data || !data.data[0] || !data.data[0].url) {
        console.error('Unexpected API response structure:', data);
        throw new Error('No image URL returned from OpenAI API');
      }

      console.log('Successfully generated image with revised prompt:', 
        data.data[0].revised_prompt ? data.data[0].revised_prompt.substring(0, 50) + '...' : 'No revised prompt');
      
      // Return the image URL and additional metadata
      return new Response(
        JSON.stringify({ 
          imageUrl: data.data[0].url,
          revised_prompt: data.data[0].revised_prompt,
          source: 'dalle'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Invalid response from OpenAI API');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return a structured error response
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error generating image',
        success: false,
        // Include a placeholder image URL if suitable
        fallbackImageUrl: 'https://placehold.co/600x400/252238/FFFFFF?text=Image+Generation+Failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Still return 200 to handle gracefully on the client
      }
    );
  }
});

// Helper function to get a fallback image from Unsplash with improved topic handling
async function getFallbackImage(prompt: string): Promise<string | null> {
  try {
    // Clean and extract main terms from the prompt for better search results
    const searchTerms = extractSearchTerms(prompt);
    console.log('Using search terms for Unsplash:', searchTerms);
    
    // Use Unsplash source API to get a relevant image
    const unsplashUrl = `https://source.unsplash.com/featured/800x600?${encodeURIComponent(searchTerms)}`;
    
    const response = await fetch(unsplashUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*'
      }
    });
    
    if (response.ok && response.url) {
      return response.url;
    }
    
    console.error('Unsplash API error:', response.status);
    return null;
  } catch (error) {
    console.error('Error fetching fallback image:', error);
    return null;
  }
}

// Extract meaningful search terms from a prompt
function extractSearchTerms(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // First check for common categories
  if (lowerPrompt.includes('space') || lowerPrompt.includes('planet') || 
      lowerPrompt.includes('galaxy') || lowerPrompt.includes('cosmos')) {
    return 'space,cosmos,stars';
  }
  if (lowerPrompt.includes('ocean') || lowerPrompt.includes('sea') || 
      lowerPrompt.includes('marine') || lowerPrompt.includes('underwater')) {
    return 'ocean,underwater,sea';
  }
  if (lowerPrompt.includes('dinosaur') || lowerPrompt.includes('prehistoric')) {
    return 'dinosaur,prehistoric';
  }
  if (lowerPrompt.includes('animal') || lowerPrompt.includes('wildlife')) {
    return 'animal,wildlife,nature';
  }
  if (lowerPrompt.includes('robot') || lowerPrompt.includes('technology')) {
    return 'robot,technology,future';
  }
  if (lowerPrompt.includes('history') || lowerPrompt.includes('ancient')) {
    return 'history,ancient,vintage';
  }
  
  // If no categories matched, extract key nouns
  // Remove common words and keep only significant terms
  const cleanedPrompt = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(the|and|or|of|in|on|at|to|for|with|by|about|from|an|a)\b/g, ' ')
    .split(' ')
    .filter(term => term.length > 3)
    .slice(0, 3)
    .join(',');
    
  return cleanedPrompt || 'educational,learning,knowledge';
}
