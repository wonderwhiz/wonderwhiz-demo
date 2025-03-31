
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const reqBody = await req.json();
    
    // Ensure count and startIndex are defined in the request
    if (!reqBody.count) reqBody.count = 2;
    if (!reqBody.startIndex === undefined) reqBody.startIndex = 0;
    
    console.log(`Requesting ${reqBody.count} blocks from Claude API starting at index ${reqBody.startIndex}`);
    
    // Forward the request to the main generate-curiosity-blocks function
    const response = await fetch(
      `${req.url.replace('generate-curiosity-blocks-partial', 'generate-curiosity-blocks')}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.get('Authorization') || ''
        },
        body: JSON.stringify(reqBody)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from generate-curiosity-blocks: ${errorText}`);
      throw new Error(`Failed to generate content: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Processed ${reqBody.count} content blocks`);
    
    return new Response(JSON.stringify(data), {
      status: 200,
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
