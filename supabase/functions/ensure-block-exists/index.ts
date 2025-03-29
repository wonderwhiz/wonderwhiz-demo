
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
    
    const { block } = await req.json();
    
    if (!block || !block.id) {
      throw new Error('Block data is required');
    }

    // Using service role to bypass RLS, directly insert the block
    const { data, error } = await supabase
      .from('content_blocks')
      .insert({
        id: block.id, 
        curio_id: block.curio_id || null,
        type: block.type,
        specialist_id: block.specialist_id,
        content: block.content,
        liked: block.liked !== undefined ? block.liked : false,
        bookmarked: block.bookmarked !== undefined ? block.bookmarked : false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error ensuring block exists:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
