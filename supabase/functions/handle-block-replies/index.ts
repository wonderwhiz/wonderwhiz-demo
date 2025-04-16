
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
    const { blockId, message, childId } = await req.json();
    
    if (!blockId || !message || !childId) {
      throw new Error('Missing required parameters');
    }

    console.log(`Processing reply for block ${blockId}`);
    
    // Save reply in the database
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/block_replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({
        block_id: blockId,
        content: message,
        user_id: childId,
        from_user: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save reply: ${errorText}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Reply saved successfully"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing reply:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An error occurred while processing the reply' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
