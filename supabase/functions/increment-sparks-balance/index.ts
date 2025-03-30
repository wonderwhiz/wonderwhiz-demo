
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
    
    // Support multiple parameter naming conventions for backward compatibility
    const childId = requestData.childId || requestData.profileId || requestData.child_id;
    const amount = requestData.amount;

    if (!childId || typeof amount !== 'number') {
      return new Response(
        JSON.stringify({ 
          error: "Profile ID and amount are required",
          requestData
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Instead of using RPC, directly update the balance
    // This avoids potential infinite recursion issues
    const { data: profile, error: fetchError } = await supabaseClient
      .from('child_profiles')
      .select('sparks_balance')
      .eq('id', childId)
      .single();

    if (fetchError) {
      console.error("Error fetching profile:", fetchError.message);
      return new Response(
        JSON.stringify({ error: "Error fetching profile", details: fetchError.message }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Calculate new balance and update
    const currentBalance = profile.sparks_balance || 0;
    const newBalance = currentBalance + amount;

    const { error: updateError } = await supabaseClient
      .from('child_profiles')
      .update({ sparks_balance: newBalance })
      .eq('id', childId);

    if (updateError) {
      console.error("Error updating sparks balance:", updateError.message);
      return new Response(
        JSON.stringify({ error: "Error updating sparks balance", details: updateError.message }),
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
      JSON.stringify({ success: true, newBalance }),
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
