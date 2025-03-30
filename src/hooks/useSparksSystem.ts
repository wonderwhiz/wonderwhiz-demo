
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
            // We're simplifying the streak functionality until database is updated
            setStreakDays(data.streak_days || 0);
            setStreakBonusReceived(data.streak_bonus || false);
            setStreakBonusAmount(data.streak_bonus_amount || 0);
          }
        } catch (err) {
          console.error('Error tracking login streak:', err);
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
