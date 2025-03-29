
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { block_id, content, from_user, specialist_id, user_id, child_profile_id } = await req.json();
    
    // Validate required fields
    if (!block_id || !content) {
      throw new Error('Block ID and content are required');
    }

    console.log(`Processing reply for block: ${block_id}`);

    // Check if the block exists first
    const { data: blockData, error: blockCheckError } = await supabase
      .from('content_blocks')
      .select('id')
      .eq('id', block_id)
      .single();

    if (blockCheckError || !blockData) {
      console.log(`Block ${block_id} not found, cannot create reply`);
      throw new Error(`Block with ID ${block_id} does not exist. Please ensure the block exists before adding replies.`);
    }

    console.log(`Block ${block_id} exists, proceeding with reply`);

    // Now save the reply using the service role to bypass RLS
    const { data, error } = await supabase
      .from('block_replies')
      .insert({
        block_id,
        content,
        from_user,
        specialist_id
      })
      .select();

    if (error) {
      console.error('Error saving reply:', error);
      throw error;
    }
    
    console.log('Reply successfully saved');
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling block reply:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
