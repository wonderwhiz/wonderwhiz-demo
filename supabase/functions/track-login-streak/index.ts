
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
      .select('id, sparks_balance, last_active, streak_days, streak_last_updated')
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
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActive = profile.last_active ? new Date(profile.last_active) : null;
    const lastStreakUpdate = profile.streak_last_updated ? new Date(profile.streak_last_updated) : null;
    
    let streakUpdated = false;
    let streakDays = profile.streak_days || 0;
    let streakBonus = false;
    let streakBonusAmount = 0;
    
    // Check if we need to update the streak
    if (lastStreakUpdate) {
      const lastUpdateDay = new Date(lastStreakUpdate.getFullYear(), lastStreakUpdate.getMonth(), lastStreakUpdate.getDate());
      const dayDiff = Math.floor((today.getTime() - lastUpdateDay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day login - increase streak
        streakDays++;
        streakUpdated = true;
        
        // Check if we've hit a 3-day streak milestone
        if (streakDays % 3 === 0) {
          streakBonus = true;
          streakBonusAmount = 10; // Award 10 sparks for 3-day streaks
          
          // Add sparks transaction for streak bonus
          await supabaseClient
            .from('sparks_transactions')
            .insert({
              child_id: childId,
              amount: streakBonusAmount,
              reason: `${streakDays}-day streak bonus`
            });
            
          // Update sparks balance
          await supabaseClient
            .from('child_profiles')
            .update({ 
              sparks_balance: (profile.sparks_balance || 0) + streakBonusAmount
            })
            .eq('id', childId);
        }
      } else if (dayDiff > 1) {
        // Streak broken - reset to 1 (today)
        streakDays = 1;
        streakUpdated = true;
      }
    } else {
      // First recorded streak day
      streakDays = 1;
      streakUpdated = true;
    }
    
    // Update profile with last_active time and streak info
    const { error: updateError } = await supabaseClient
      .from('child_profiles')
      .update({ 
        last_active: now.toISOString(),
        streak_days: streakDays,
        streak_last_updated: today.toISOString().split('T')[0]
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

    return new Response(
      JSON.stringify({ 
        success: true,
        streak_days: streakDays,
        streak_updated: streakUpdated,
        streak_bonus: streakBonus,
        streak_bonus_amount: streakBonusAmount
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
