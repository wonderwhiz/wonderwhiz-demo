
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROJECT_ID = Deno.env.get('PROJECT_ID') || 'turexhnvsvmllwitllmg';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const reqBody = await req.json();
    
    // Ensure count and startIndex are defined in the request
    if (!reqBody.count) reqBody.count = 2;
    if (!reqBody.startIndex === undefined) reqBody.startIndex = 0;
    
    // Log what we're doing for debugging
    console.log(`Forwarding request to generate-curiosity-blocks with count=${reqBody.count}, startIndex=${reqBody.startIndex}`);
    
    // Get all headers from the original request
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      headers.set(key, value);
    });
    
    // Ensure we have the required headers
    headers.set('Content-Type', 'application/json');
    headers.set('x-deno-subhost', PROJECT_ID);
    
    // Forward the request to the main function
    const response = await fetch(
      `${new URL(req.url).origin}/functions/v1/generate-curiosity-blocks`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(reqBody)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from generate-curiosity-blocks: ${errorText}`);
      throw new Error(`Failed to generate content: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully generated ${data?.length || 0} blocks`);
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in generate-curiosity-blocks-partial:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
