
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
    const { profileId, amount } = await req.json();

    if (!profileId || typeof amount !== 'number') {
      return new Response(
        JSON.stringify({ error: "Profile ID and amount are required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Get the current balance
    const { data: profile, error: fetchError } = await supabaseClient
      .from('child_profiles')
      .select('sparks_balance')
      .eq('id', profileId)
      .single();

    if (fetchError) {
      console.error("Error fetching child profile:", fetchError.message);
      return new Response(
        JSON.stringify({ error: "Error fetching child profile" }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Calculate new balance
    const currentBalance = profile.sparks_balance || 0;
    const newBalance = currentBalance + amount;

    // Update the balance
    const { error: updateError } = await supabaseClient
      .from('child_profiles')
      .update({ sparks_balance: newBalance })
      .eq('id', profileId);

    if (updateError) {
      console.error("Error updating sparks balance:", updateError.message);
      return new Response(
        JSON.stringify({ error: "Error updating sparks balance" }),
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
      JSON.stringify({ error: "Internal Server Error" }),
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
