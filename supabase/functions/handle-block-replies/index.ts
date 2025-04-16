
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
    
    const { block_id, content, from_user, user_id, child_profile_id } = await req.json();
    
    // Validate required fields
    if (!block_id || !content) {
      throw new Error('Block ID and content are required');
    }

    console.log(`Processing reply for block: ${block_id}`);

    // Check if the block exists first
    const { data: blockData, error: blockCheckError } = await supabase
      .from('content_blocks')
      .select('id, specialist_id')
      .eq('id', block_id)
      .single();

    if (blockCheckError || !blockData) {
      console.log(`Block ${block_id} not found, cannot create reply`);
      throw new Error(`Block with ID ${block_id} does not exist. Please ensure the block exists before adding replies.`);
    }

    console.log(`Block ${block_id} exists, proceeding with reply`);
    
    // Get the specialist ID from the block for AI response
    const specialistId = blockData.specialist_id;

    // Now save the user reply using the service role to bypass RLS
    const { data: userReplyData, error: userReplyError } = await supabase
      .from('block_replies')
      .insert({
        block_id,
        content,
        from_user: true,
        child_profile_id: child_profile_id || null
      })
      .select();

    if (userReplyError) {
      console.error('Error saving user reply:', userReplyError);
      throw userReplyError;
    }
    
    console.log('User reply successfully saved with ID:', userReplyData?.[0]?.id);
    
    // Generate an AI response
    const { data: aiResponseData, error: aiResponseError } = await supabase.functions.invoke('generate-block-response', {
      body: { 
        block_id,
        user_message: content,
        specialist_id: specialistId
      }
    });
    
    if (aiResponseError) {
      console.error('Error generating AI response:', aiResponseError);
      // Don't throw here, we still want to return the user reply
    }
    
    // If AI response was generated, save it
    if (aiResponseData?.response) {
      const { data: aiReplyData, error: aiReplyError } = await supabase
        .from('block_replies')
        .insert({
          block_id,
          content: aiResponseData.response,
          from_user: false,
          specialist_id: specialistId
        })
        .select();
        
      if (aiReplyError) {
        console.error('Error saving AI reply:', aiReplyError);
        // Don't throw here, we still want to return the user reply
      } else {
        console.log('AI reply successfully saved with ID:', aiReplyData?.[0]?.id);
      }
    }
    
    console.log('Reply process completed successfully');
    
    // Return both the user reply and the AI response
    return new Response(JSON.stringify({ 
      success: true, 
      userReply: userReplyData?.[0],
      aiResponse: aiResponseData?.response ? {
        id: 'ai-response',
        block_id,
        content: aiResponseData.response,
        from_user: false,
        specialist_id: specialistId,
        created_at: new Date().toISOString()
      } : null
    }), {
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
