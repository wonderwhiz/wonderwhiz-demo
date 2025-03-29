
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
      .select('id, streak_days, last_active')
      .eq('id', childId)
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

    const now = new Date();
    const lastActive = profile.last_active ? new Date(profile.last_active) : null;
    
    let newStreakDays = profile.streak_days || 0;
    let streakUpdated = false;
    let streakBonus = false;
    
    // Check if this is a new day (compare current date with last_active date)
    if (lastActive) {
      const lastActiveDay = new Date(lastActive).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      
      // If last active was yesterday or earlier and not today
      if (lastActiveDay < today) {
        // Check if the streak is still valid (not more than 1 day gap)
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.setHours(0, 0, 0, 0);
        
        if (lastActiveDay >= yesterdayDate) {
          // Increment streak since they're active on consecutive days
          newStreakDays++;
          streakUpdated = true;
          
          // Check if we hit a 3-day milestone for bonus
          if (newStreakDays % 3 === 0) {
            streakBonus = true;
          }
        } else {
          // Streak broken - reset to 1 for today
          newStreakDays = 1;
          streakUpdated = true;
        }
      }
    } else {
      // First login
      newStreakDays = 1;
      streakUpdated = true;
    }
    
    // Update the profile
    const { error: updateError } = await supabaseClient
      .from('child_profiles')
      .update({ 
        last_active: now.toISOString(),
        streak_days: newStreakDays
      })
      .eq('id', childId);

    if (updateError) {
      console.error("Error updating child profile:", updateError.message);
      return new Response(
        JSON.stringify({ error: "Error updating child profile" }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // If we hit a streak milestone, award bonus sparks
    if (streakBonus) {
      const STREAK_BONUS = 10;
      
      // Add sparks transaction
      await supabaseClient
        .from('sparks_transactions')
        .insert({
          child_id: childId,
          amount: STREAK_BONUS,
          reason: `${newStreakDays}-day streak bonus`
        });
        
      // Update the sparks balance
      await supabaseClient
        .from('child_profiles')
        .update({ 
          sparks_balance: profile.sparks_balance + STREAK_BONUS 
        })
        .eq('id', childId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        streak_days: newStreakDays,
        streak_updated: streakUpdated,
        streak_bonus: streakBonus,
        streak_bonus_amount: streakBonus ? 10 : 0
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
