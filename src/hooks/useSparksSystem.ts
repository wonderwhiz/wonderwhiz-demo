
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useSparksSystem(childId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [streakDays, setStreakDays] = useState(0);
  const [streakBonusReceived, setStreakBonusReceived] = useState(false);
  const [streakBonusAmount, setStreakBonusAmount] = useState(0);
  const [sparkAnimation, setSparkAnimation] = useState(false);
  const [streakFreezeUsedToday, setStreakFreezeUsedToday] = useState(false);
  const [isStreakFreezeAvailable, setIsStreakFreezeAvailable] = useState(true); // Assume available initially
  
  useEffect(() => {
    if (!childId) {
      setLoading(false); // Ensure loading is false if no childId
      return;
    }
    
    const trackLoginStreak = async () => {
      setLoading(true); // Set loading true at the start of the attempt
      try {
        const { data, error } = await supabase.functions.invoke('track-login-streak', {
          body: JSON.stringify({ childId })
        });
        
        if (error) {
          console.error('Error tracking login streak:', error);
          // Attempt to fetch current streak data from profile as fallback
          const { data: profileData, error: profileError } = await supabase
            .from('child_profiles')
            .select('streak_days, streak_freeze_available')
            .eq('id', childId)
            .single();
          if (profileData) {
            setStreakDays(profileData.streak_days || 0);
            setIsStreakFreezeAvailable(profileData.streak_freeze_available ?? true);
          } else if (profileError) {
            console.error('Error fetching profile data on streak track failure:', profileError);
          }
          toast.error("Could not update streak. Displaying last known data.");

        } else if (data) {
          setStreakDays(data.streak_days || 0);
          setStreakBonusReceived(data.streak_bonus || false);
          setStreakBonusAmount(data.streak_bonus_amount || 0);
          setStreakFreezeUsedToday(data.streak_freeze_used || false);
          setIsStreakFreezeAvailable(data.streak_freeze_available ?? true); // Default to true if undefined
          
          if (data.streak_freeze_used) {
            toast.info("Streak saved! Your freeze kept your streak going for yesterday.", {
              position: 'top-center',
              duration: 5000,
            });
          }
          
          // If they received a streak bonus, show a special toast
          if (data.streak_bonus && data.streak_bonus_amount > 0) {
            toast.success(`${data.streak_days}-Day Streak Bonus!`, {
              description: `+${data.streak_bonus_amount} sparks added to your balance!${data.streak_freeze_used ? " (Thanks to your freeze!)" : ""}`,
              position: 'top-center',
              duration: 5000,
              className: 'streak-toast-success'
            });
            
            // Trigger spark animation
            setSparkAnimation(true);
            setTimeout(() => setSparkAnimation(false), 3000);
          }
          // Consider a toast if data.streak_freeze_available becomes true and was previously false
          // This requires storing the previous state of isStreakFreezeAvailable or handling in component
        }
      } catch (err) { // Catches errors from the invoke call itself if it throws
        console.error('Critical error invoking track-login-streak:', err);
        toast.error("A problem occurred while checking your streak.");
         // Fallback: try to get streak days directly from the database
        try {
          const { data: profile, error: profileError } = await supabase
            .from('child_profiles')
            .select('streak_days, streak_freeze_available')
            .eq('id', childId)
            .single();
            
          if (!profileError && profile) {
            setStreakDays(profile.streak_days || 0);
            setIsStreakFreezeAvailable(profile.streak_freeze_available ?? true);
          } else {
            console.error('Fallback profile fetch error:', profileError);
          }
        } catch (fallbackError) {
          console.error('Critical fallback error:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    trackLoginStreak();
  }, [childId]);
  
  return { 
    streakDays, 
    streakBonusReceived, 
    streakBonusAmount, 
    loading,
    sparkAnimation,
    streakFreezeUsedToday,
    isStreakFreezeAvailable
  };
}
