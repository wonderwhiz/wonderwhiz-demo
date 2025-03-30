import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse request body
    const requestData = await req.json();
    const taskId = requestData.taskId;
    const childId = requestData.childId;
    const completedAt = new Date().toISOString();

    if (!taskId) {
      return new Response(
        JSON.stringify({ error: "Task ID is required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    console.log(`Completing task ${taskId} for child ${childId}`);

    // Update the task status directly - bypassing RLS policies
    const { error: updateError } = await supabaseClient
      .from('child_tasks')
      .update({ 
        status: 'completed',
        completed_at: completedAt 
      })
      .eq('id', taskId);

    if (updateError) {
      console.error("Error updating task status:", updateError.message);
      return new Response(
        JSON.stringify({ error: "Error updating task status", details: updateError.message }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, completedAt }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
