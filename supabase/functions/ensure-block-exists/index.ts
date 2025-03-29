
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

    // Create a temporary curio_id if none provided
    // This is needed because curio_id is not nullable in the database
    if (!block.curio_id) {
      console.log('No curio_id provided. Creating a temporary curio.');
      
      // Create a temporary curio
      const { data: tempCurio, error: curioError } = await supabase
        .from('curios')
        .insert({
          child_id: block.child_profile_id || '00000000-0000-0000-0000-000000000000', // Use provided child_profile_id or a placeholder
          query: 'Temporary query for standalone block',
          title: 'Temporary curio for standalone block'
        })
        .select()
        .single();
      
      if (curioError) {
        console.error('Error creating temporary curio:', curioError);
        throw new Error(`Failed to create temporary curio: ${curioError.message}`);
      }
      
      // Use the new curio id
      block.curio_id = tempCurio.id;
      console.log(`Created temporary curio with id: ${block.curio_id}`);
    }

    console.log(`Attempting to insert block with id: ${block.id} and curio_id: ${block.curio_id}`);

    // Using service role to bypass RLS, directly insert the block
    const { data, error } = await supabase
      .from('content_blocks')
      .insert({
        id: block.id, 
        curio_id: block.curio_id,
        type: block.type,
        specialist_id: block.specialist_id,
        content: block.content,
        liked: block.liked !== undefined ? block.liked : false,
        bookmarked: block.bookmarked !== undefined ? block.bookmarked : false
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting block:', error);
      throw error;
    }
    
    console.log('Block successfully inserted:', data);
    
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
