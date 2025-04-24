
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 10;  // Max requests
const RATE_LIMIT_WINDOW = 300;   // Time window in seconds (5 minutes)

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Rate limiting: Check if user has exceeded the rate limit
    const userId = user.id;
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    // Get user's recent API calls
    const { data: usageLogs, error: usageError } = await supabase
      .from('api_usage_logs')
      .select('created_at')
      .eq('user_id', userId)
      .eq('api_name', 'huggingface-image')
      .gte('created_at', new Date(windowStart * 1000).toISOString());
    
    if (usageError) {
      console.error('Error checking rate limit:', usageError);
      // Continue execution but log the error
    } else if (usageLogs && usageLogs.length >= RATE_LIMIT_REQUESTS) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `You can only make ${RATE_LIMIT_REQUESTS} requests per ${RATE_LIMIT_WINDOW/60} minutes`,
          retry_after: RATE_LIMIT_WINDOW - (now - Math.floor(new Date(usageLogs[0].created_at).getTime() / 1000))
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse request data after authentication and rate limiting
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

    // 4. Get the API key from environment variables (never expose to client)
    const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!HUGGING_FACE_TOKEN) {
      throw new Error('HUGGING_FACE_ACCESS_TOKEN environment variable not set');
    }

    console.log(`Generating image with HuggingFace for prompt: "${prompt.substring(0, 50)}..."`);

    // 5. Adapt the prompt based on child age to ensure age-appropriate content
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

    try {
      // 6. Use the HuggingFace API
      console.log("Sending request to HuggingFace API using stable-diffusion-xl model");
      
      const hf = new HfInference(HUGGING_FACE_TOKEN);
      
      // Call the HuggingFace API with stable-diffusion-xl model
      const result = await hf.textToImage({
        inputs: safePrompt,
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        parameters: {
          negative_prompt: "ugly, blurry, poor quality, distorted, deformed",
          guidance_scale: 7.5
        }
      });
      
      // Convert the result to a base64 string for the image
      const imageBytes = await result.arrayBuffer();
      const base64Image = btoa(
        new Uint8Array(imageBytes).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      const imageUrl = `data:image/png;base64,${base64Image}`;

      console.log('Successfully generated image with HuggingFace stable-diffusion-xl model');
      
      // 7. Log the API usage for rate limiting
      const { error: logError } = await supabase
        .from('api_usage_logs')
        .insert({
          user_id: userId,
          api_name: 'huggingface-image',
          request_data: { prompt_length: prompt.length },
          response_status: 'success',
          estimated_cost: 0.01, // Store estimated cost in cents for monitoring
        });
      
      if (logError) {
        console.error('Error logging API usage:', logError);
        // Continue execution but log the error
      }
      
      // Return the image data URL
      return new Response(
        JSON.stringify({ 
          imageUrl: imageUrl,
          source: 'huggingface'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (hfError) {
      console.error('HuggingFace API call failed:', hfError);
      
      if (retryOnFail) {
        console.log('Attempting to fetch fallback image from Unsplash');
        const fallbackImage = await getFallbackImage(prompt);
        
        if (fallbackImage) {
          console.log('Successfully retrieved fallback image from Unsplash');
          
          // Log fallback usage
          await supabase
            .from('api_usage_logs')
            .insert({
              user_id: userId,
              api_name: 'huggingface-image-fallback',
              request_data: { prompt_length: prompt.length },
              response_status: 'fallback',
              estimated_cost: 0, // Unsplash is free
            });
            
          return new Response(
            JSON.stringify({ 
              imageUrl: fallbackImage,
              originalError: hfError.message,
              source: 'unsplash'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      throw hfError;
    }
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
