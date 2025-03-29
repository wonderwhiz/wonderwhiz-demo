
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
        const { data, error } = await supabase.functions.invoke('track-login-streak', {
          body: JSON.stringify({ childId })
        });
        
        if (error) {
          console.error('Error tracking login streak:', error);
          return;
        }
        
        if (data) {
          setStreakDays(data.streak_days);
          
          // If streak was updated, show a toast
          if (data.streak_updated) {
            // Trigger the spark animation
            setSparkAnimation(true);
            setTimeout(() => setSparkAnimation(false), 2000);
            
            toast.success(data.streak_bonus 
              ? `✨ ${data.streak_days}-day streak! You earned ${data.streak_bonus_amount} bonus sparks! ✨`
              : `✨ ${data.streak_days}-day streak! Keep it up! ✨`, 
              { 
                duration: 4000,
                className: 'streak-toast-success'
              }
            );
          }
          
          setStreakBonusReceived(data.streak_bonus || false);
          setStreakBonusAmount(data.streak_bonus_amount || 0);
        }
      } catch (err) {
        console.error('Error in tracking login streak:', err);
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
