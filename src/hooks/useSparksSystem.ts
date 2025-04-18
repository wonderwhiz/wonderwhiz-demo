
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useSparksSystem(childId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [streakDays, setStreakDays] = useState(0);
  const [streakBonusReceived, setStreakBonusReceived] = useState(false);
  const [streakBonusAmount, setStreakBonusAmount] = useState(0);
  const [sparkAnimation, setSparkAnimation] = useState(false);
  const [sparkTransactions, setSparkTransactions] = useState<any[]>([]);
  
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
        
        // Fetch recent spark transactions
        try {
          const { data: transactions, error: txError } = await supabase
            .from('sparks_transactions')
            .select('*')
            .eq('child_id', childId)
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (!txError && transactions) {
            setSparkTransactions(transactions);
          }
        } catch (txFetchError) {
          console.error('Error fetching spark transactions:', txFetchError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    trackLoginStreak();
    
    // Set up subscription for new spark transactions
    const sparksChannel = supabase
      .channel('sparks-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sparks_transactions', filter: `child_id=eq.${childId}` },
        (payload) => {
          // New spark transaction received
          const newTransaction = payload.new;
          
          // Update transactions
          setSparkTransactions(prev => [newTransaction, ...prev].slice(0, 10));
          
          // Trigger animation
          setSparkAnimation(true);
          setTimeout(() => setSparkAnimation(false), 3000);
          
          // Show toast
          if (newTransaction.amount > 0) {
            toast.success(`+${newTransaction.amount} sparks earned!`, {
              description: newTransaction.reason,
              position: 'top-right',
              duration: 3000,
              icon: '✨'
            });
          } else {
            toast.info(`${newTransaction.amount} sparks spent`, {
              description: newTransaction.reason,
              position: 'top-right',
              duration: 3000,
              icon: '💫'
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(sparksChannel);
    };
  }, [childId]);
  
  const awardSparks = async (amount: number, reason: string) => {
    if (!childId) return false;
    
    try {
      // Call the edge function to increment sparks balance
      const { data, error } = await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: childId,
          amount: amount
        })
      });
      
      if (error) throw error;
      
      // Create a transaction record
      await supabase.from('sparks_transactions').insert({
        child_id: childId,
        amount: amount,
        reason: reason
      });
      
      // Trigger animation (subscription will handle the rest)
      setSparkAnimation(true);
      
      return true;
    } catch (error) {
      console.error('Error awarding sparks:', error);
      return false;
    }
  };
  
  const spendSparks = async (amount: number, reason: string) => {
    return await awardSparks(-Math.abs(amount), reason);
  };
  
  return { 
    streakDays, 
    streakBonusReceived, 
    streakBonusAmount, 
    loading,
    sparkAnimation,
    sparkTransactions,
    awardSparks,
    spendSparks
  };
}
