
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Forward the request to the main function
    const reqBody = await req.json();
    
    // Ensure count and startIndex are defined in the request
    if (!reqBody.count) reqBody.count = 2;
    if (!reqBody.startIndex) reqBody.startIndex = 0;
    
    const response = await fetch(
      `${req.url.replace('generate-curiosity-blocks-partial', 'generate-curiosity-blocks')}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.get('Authorization') || '',
          'x-deno-subhost': req.headers.get('x-deno-subhost') || ''
        },
        body: JSON.stringify(reqBody)
      }
    );
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in generate-curiosity-blocks-partial redirect:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
