
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

    // Use RPC function to update the sparks balance
    const { error: rpcError } = await supabaseClient.rpc(
      'increment_sparks_balance',
      { 
        child_id: profileId, 
        amount: amount 
      }
    );

    if (rpcError) {
      console.error("Error calling RPC function:", rpcError.message);
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

    // Get the updated balance
    const { data: profile, error: fetchError } = await supabaseClient
      .from('child_profiles')
      .select('sparks_balance')
      .eq('id', profileId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated balance:", fetchError.message);
      return new Response(
        JSON.stringify({ error: "Error fetching updated balance" }),
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
      JSON.stringify({ success: true, newBalance: profile.sparks_balance }),
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
