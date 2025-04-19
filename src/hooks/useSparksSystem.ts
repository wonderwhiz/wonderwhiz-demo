
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useSparksSystem(childId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [streakDays, setStreakDays] = useState(0);
  const [streakBonusReceived, setStreakBonusReceived] = useState(false);
  const [streakBonusAmount, setStreakBonusAmount] = useState(0);
  const [sparkAnimation, setSparkAnimation] = useState(false);
  
  useEffect(() => {
    if (!childId) return;
    
    const trackLoginStreak = async () => {
      try {
        setLoading(true);
        
        // Call the edge function to track login streak
        try {
          const { data, error } = await supabase.functions.invoke('track-login-streak', {
            body: JSON.stringify({ childId })
          });
          
          if (error) {
            console.error('Error tracking login streak:', error);
          } else if (data) {
            setStreakDays(data.streak_days || 0);
            setStreakBonusReceived(data.streak_bonus || false);
            setStreakBonusAmount(data.streak_bonus_amount || 0);
            
            // If they received a streak bonus, show a special toast
            if (data.streak_bonus && data.streak_bonus_amount > 0) {
              toast.success(`${data.streak_days}-Day Streak Bonus!`, {
                description: `+${data.streak_bonus_amount} sparks added to your balance!`,
                position: 'top-center',
                duration: 5000,
                className: 'streak-toast-success'
              });
              
              // Trigger spark animation
              setSparkAnimation(true);
              setTimeout(() => setSparkAnimation(false), 3000);
            }
          }
        } catch (err) {
          console.error('Error tracking login streak:', err);
          
          // Fallback: try to get streak days directly from the database
          try {
            const { data: profile, error: profileError } = await supabase
              .from('child_profiles')
              .select('streak_days')
              .eq('id', childId)
              .single();
              
            if (!profileError && profile) {
              setStreakDays(profile.streak_days || 0);
            }
          } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
          }
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
    sparkAnimation 
  };
}
