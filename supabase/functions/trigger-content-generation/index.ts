
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { curioId, childId } = await req.json();

    if (!curioId || !childId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client
    const supabaseAdmin = Deno.env.get('SUPABASE_URL')
      ? Deno.createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )
      : null;

    if (!supabaseAdmin) {
      throw new Error('Supabase client could not be created');
    }

    // Get the curio details
    const { data: curioData, error: curioError } = await supabaseAdmin
      .from('curios')
      .select('title, query')
      .eq('id', curioId)
      .single();

    if (curioError || !curioData) {
      throw new Error('Could not fetch curio data: ' + (curioError?.message || 'No data found'));
    }

    // Get the child profile
    const { data: childProfile, error: childError } = await supabaseAdmin
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();

    if (childError || !childProfile) {
      throw new Error('Could not fetch child profile: ' + (childError?.message || 'No profile found'));
    }

    // Call the generate-curiosity-blocks function
    const generateResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-curiosity-blocks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          query: curioData.query,
          childProfile: childProfile,
          blockCount: 5
        })
      }
    );

    if (!generateResponse.ok) {
      const errorData = await generateResponse.text();
      throw new Error(`Failed to generate blocks: ${errorData}`);
    }

    const generatedBlocks = await generateResponse.json();

    // Insert the generated blocks into the database
    for (const block of generatedBlocks) {
      const { error: insertError } = await supabaseAdmin
        .from('content_blocks')
        .insert({
          ...block,
          curio_id: curioId
        });

      if (insertError) {
        console.error("Error inserting block:", insertError);
      }
    }

    // Clear any generation errors on the curio
    await supabaseAdmin
      .from('curios')
      .update({ generation_error: null })
      .eq('id', curioId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated ${generatedBlocks.length} blocks for curio ${curioId}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in trigger-content-generation function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to trigger content generation' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
