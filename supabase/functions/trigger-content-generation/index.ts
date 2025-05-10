
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

    console.log(`Triggering content generation for curio ${curioId} and child ${childId}`);
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabaseAdmin = Deno.createClient(supabaseUrl, supabaseKey);

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
    
    console.log(`Found curio with title: ${curioData.title}`);

    // Get the child profile
    const { data: childProfile, error: childError } = await supabaseAdmin
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();

    if (childError || !childProfile) {
      throw new Error('Could not fetch child profile: ' + (childError?.message || 'No profile found'));
    }
    
    console.log(`Found child profile with name: ${childProfile.name}`);

    // Call the generate-curiosity-blocks function
    const functionUrl = `${supabaseUrl}/functions/v1/generate-curiosity-blocks`;
    console.log(`Calling function at ${functionUrl}`);
    
    const generateResponse = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        query: curioData.query,
        childProfile: childProfile,
        blockCount: 5
      })
    });

    if (!generateResponse.ok) {
      const errorData = await generateResponse.text();
      throw new Error(`Failed to generate blocks: ${errorData}`);
    }

    const generatedBlocks = await generateResponse.json();
    console.log(`Generated ${generatedBlocks.length} blocks`);

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
