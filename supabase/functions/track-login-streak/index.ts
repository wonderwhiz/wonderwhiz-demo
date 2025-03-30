
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

    const { childId } = await req.json();

    if (!childId) {
      return new Response(
        JSON.stringify({ error: "Child ID is required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Get the child profile
    const { data: profile, error: fetchError } = await supabaseClient
      .from('child_profiles')
      .select('id, sparks_balance, last_active')
      .eq('id', childId)
      .single();

    if (fetchError) {
      console.error("Error fetching child profile:", fetchError.message);
      return new Response(
        JSON.stringify({ 
          error: "Error fetching child profile", 
          details: fetchError.message 
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    const now = new Date();
    const lastActive = profile.last_active ? new Date(profile.last_active) : null;
    
    // Update profile with last_active time
    // Skip streak tracking for now until streak_days column is added
    const { error: updateError } = await supabaseClient
      .from('child_profiles')
      .update({ 
        last_active: now.toISOString()
      })
      .eq('id', childId);

    if (updateError) {
      console.error("Error updating child profile:", updateError.message);
      return new Response(
        JSON.stringify({ 
          error: "Error updating child profile", 
          details: updateError.message 
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Return a simplified response without streak information
    return new Response(
      JSON.stringify({ 
        success: true,
        streak_days: 0,
        streak_updated: false,
        streak_bonus: false,
        streak_bonus_amount: 0
      }),
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
