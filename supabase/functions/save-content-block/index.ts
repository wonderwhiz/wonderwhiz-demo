
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { block } = await req.json();
    
    if (!block || !block.type || !block.specialist_id || !block.content || !block.curio_id) {
      throw new Error('Missing required block properties');
    }
    
    // Generate a new UUID for the block
    const blockId = crypto.randomUUID();
    
    // Create a new object without the generated id
    const blockToInsert = {
      id: blockId,
      type: block.type,
      specialist_id: block.specialist_id,
      content: block.content,
      curio_id: block.curio_id,
      liked: block.liked || false,
      bookmarked: block.bookmarked || false,
      created_at: new Date().toISOString()
    };

    console.log(`Saving content block of type ${block.type} for curio ${block.curio_id}`);
    
    const { data, error } = await supabaseClient
      .from('content_blocks')
      .insert(blockToInsert)
      .select();
    
    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify({ success: true, block: data[0] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error saving content block:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to save content block' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
