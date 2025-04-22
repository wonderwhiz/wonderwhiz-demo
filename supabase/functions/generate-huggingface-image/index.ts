import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    // Parse request data
    const requestData = await req.json().catch(err => {
      console.error("Error parsing request JSON:", err);
      throw new Error("Invalid request format: Could not parse JSON");
    });
    
    const { 
      prompt, 
      childAge = 10, 
      retryOnFail = true 
    } = requestData;

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!HUGGING_FACE_TOKEN) {
      throw new Error('HUGGING_FACE_ACCESS_TOKEN environment variable not set');
    }

    console.log(`Generating image with HuggingFace for prompt: "${prompt.substring(0, 50)}..."`);

    // Adapt the prompt based on child age to ensure age-appropriate content
    let safePrompt = prompt;
    
    if (childAge <= 7) {
      safePrompt = `${prompt}, kid-friendly, colorful, cartoon style, simple shapes, cheerful, educational illustration for young children`;
    } else if (childAge <= 11) {
      safePrompt = `${prompt}, educational, vibrant colors, age-appropriate for ${childAge} year olds, learning material, engaging illustration`;
    } else {
      safePrompt = `${prompt}, educational, detailed, engaging, teenage-appropriate illustration, modern style`;
    }

    // Truncate prompt if too long
    if (safePrompt.length > 500) {
      safePrompt = safePrompt.substring(0, 500);
      console.log('Prompt truncated to 500 characters');
    }

    // Call HuggingFace API - we're using the black-forest-labs/FLUX.1-schnell model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`
        },
        body: JSON.stringify({
          inputs: safePrompt,
          parameters: {
            guidance_scale: 7.5, // Controls how closely the image follows the prompt
            num_inference_steps: 25, // Balance between quality and speed
          }
        })
      }
    );

    // Check if response is OK
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        console.error('HuggingFace API error:', errorData);
        errorMessage = errorData.error || `HuggingFace API error: ${response.status}`;
      } catch (e) {
        // If we can't parse JSON response, get text instead
        const errorText = await response.text();
        console.error('HuggingFace API error (raw):', errorText);
        errorMessage = `HTTP ${response.status}: ${errorText}`;
      }
      
      if (retryOnFail) {
        console.log('Attempting to fetch fallback image from Unsplash');
        const fallbackImage = await getFallbackImage(prompt);
        
        if (fallbackImage) {
          console.log('Successfully retrieved fallback image from Unsplash');
          return new Response(
            JSON.stringify({ 
              imageUrl: fallbackImage,
              originalError: errorMessage,
              source: 'unsplash'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      throw new Error(errorMessage);
    }

    // For HuggingFace, we get back binary image data we need to convert to base64
    const imageArrayBuffer = await response.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageArrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    const imageUrl = `data:image/png;base64,${base64Image}`;
    
    console.log('Successfully generated image with HuggingFace');
    
    // Return the image data URL
    return new Response(
      JSON.stringify({ 
        imageUrl: imageUrl,
        source: 'huggingface'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return a structured error response
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error generating image',
        success: false,
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
