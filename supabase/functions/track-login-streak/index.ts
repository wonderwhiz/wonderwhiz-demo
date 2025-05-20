
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
      .select('id, sparks_balance, last_active, streak_days, streak_last_updated, last_streak_freeze_used_at, streak_freeze_available')
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
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // const lastActive = profile.last_active ? new Date(profile.last_active) : null; // Not directly used for streak logic here
    const lastStreakUpdate = profile.streak_last_updated ? new Date(profile.streak_last_updated) : null;
    
    let streakDays = profile.streak_days || 0;
    let streakBonus = false;
    let streakBonusAmount = 0;
    let streakFreezeUsed = false;
    let currentFreezeAvailable = profile.streak_freeze_available ?? true; // Default to true if column is null
    let lastFreezeUsedAt = profile.last_streak_freeze_used_at ? new Date(profile.last_streak_freeze_used_at) : null;
    const FREEZE_COOLDOWN_DAYS = 7;

    const profileUpdates: any = {
      last_active: now.toISOString(),
      streak_last_updated: today.toISOString().split('T')[0], // Ensure we only store date part
    };
    
    if (lastStreakUpdate) {
      const lastUpdateDay = new Date(lastStreakUpdate.getFullYear(), lastStreakUpdate.getMonth(), lastStreakUpdate.getDate());
      const dayDiff = Math.floor((today.getTime() - lastUpdateDay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) { // Consecutive day login
        streakDays++;
        // Check for earning back a freeze
        if (!currentFreezeAvailable && lastFreezeUsedAt) {
          const daysSinceFreezeUsed = Math.floor((today.getTime() - lastFreezeUsedAt.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceFreezeUsed >= FREEZE_COOLDOWN_DAYS) {
            currentFreezeAvailable = true;
            profileUpdates.streak_freeze_available = true; // Will be saved later
          }
        }
      } else if (dayDiff === 2) { // Missed one day
        let canUseFreeze = currentFreezeAvailable;
        if (!canUseFreeze && lastFreezeUsedAt) { // Check if cooldown has passed to earn a new one
          const daysSinceLastFreeze = Math.floor((today.getTime() - lastFreezeUsedAt.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceLastFreeze >= FREEZE_COOLDOWN_DAYS) {
            canUseFreeze = true; // Earned it back
            profileUpdates.streak_freeze_available = true; // Will be saved later
          }
        }

        if (canUseFreeze) {
          streakDays++; // Retroactively count the missed day
          streakFreezeUsed = true;
          profileUpdates.last_streak_freeze_used_at = now.toISOString();
          profileUpdates.streak_freeze_available = false;
          currentFreezeAvailable = false; // Update local state for response
        } else {
          streakDays = 1; // Streak broken, no freeze available/usable
        }
      } else if (dayDiff > 2) { // Missed more than one day
        streakDays = 1; // Streak broken
      }
      // If dayDiff is 0 or negative, means already logged in today or bad data, no streak change.
    } else { // First recorded streak day
      streakDays = 1;
    }
    
    profileUpdates.streak_days = streakDays;

    // Handle streak bonus if streak continued (normally or via freeze)
    if (streakDays > 0 && streakDays % 3 === 0 && (lastStreakUpdate ? Math.floor((today.getTime() - new Date(lastStreakUpdate.getFullYear(), lastStreakUpdate.getMonth(), lastStreakUpdate.getDate()).getTime()) / (1000 * 60 * 60 * 24)) >= 1 : true )) {
        // Ensure bonus is only awarded if the streak actually advanced today or was saved by a freeze
        // And not if already awarded for this specific streak_day count if no new login occurred.
        // The condition `dayDiff >=1` (implicitly covered by streakDays++ path) or streakFreezeUsed ensures it's a new qualifying day.
        streakBonus = true;
        streakBonusAmount = 10;
        
        await supabaseClient
          .from('sparks_transactions')
          .insert({
            child_id: childId,
            amount: streakBonusAmount,
            reason: `${streakDays}-day streak bonus${streakFreezeUsed ? " (freeze used)" : ""}`
          });
            
        profileUpdates.sparks_balance = (profile.sparks_balance || 0) + streakBonusAmount;
    }
    
    const { error: updateError } = await supabaseClient
      .from('child_profiles')
      .update(profileUpdates)
      .eq('id', childId);

    if (updateError) {
      console.error("Error updating child profile:", updateError.message);
      return new Response(
        JSON.stringify({ error: "Error updating child profile", details: updateError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        streak_days: streakDays,
        streak_bonus: streakBonus,
        streak_bonus_amount: streakBonusAmount,
        streak_freeze_used: streakFreezeUsed,
        streak_freeze_available: currentFreezeAvailable 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Unexpected error in track-login-streak:", error.message, error.stack);
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
