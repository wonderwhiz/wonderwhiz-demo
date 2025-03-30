
import { supabase } from '@/integrations/supabase/client';

export type SparkTrigger = 
  | 'task_completion' 
  | 'quiz_correct' 
  | 'creative_upload' 
  | 'news_read' 
  | 'new_curio' 
  | 'rabbit_hole' 
  | 'mood_check' 
  | 'streak';

interface SparkReward {
  amount: number;
  reason: string;
}

// Spark reward amounts based on the specified requirements
const SPARK_REWARDS: Record<SparkTrigger, SparkReward> = {
  task_completion: { amount: 7, reason: 'Completing a task' },
  quiz_correct: { amount: 5, reason: 'Answering quiz correctly' },
  creative_upload: { amount: 10, reason: 'Uploading creative content' },
  news_read: { amount: 3, reason: 'Reading a news card' },
  new_curio: { amount: 1, reason: 'Starting new Curio' },
  rabbit_hole: { amount: 2, reason: 'Following a rabbit hole' },
  mood_check: { amount: 3, reason: 'Completing mood check-in' },
  streak: { amount: 10, reason: '3-day streak bonus' }
};

export async function awardSparks(childId: string, trigger: SparkTrigger, customReason?: string): Promise<number> {
  try {
    const reward = SPARK_REWARDS[trigger];
    if (!reward) throw new Error(`Unknown spark trigger: ${trigger}`);
    
    const reason = customReason || reward.reason;
    
    // Add the sparks transaction record
    const { error: transactionError } = await supabase
      .from('sparks_transactions')
      .insert({
        child_id: childId,
        amount: reward.amount,
        reason: reason
      });
    
    if (transactionError) throw transactionError;

    // Update the child's sparks balance using direct database update instead of RPC
    // This avoids the TypeScript error and potential database recursion issues
    const { error: updateError } = await supabase
      .from('child_profiles')
      .update({ 
        sparks_balance: supabase.rpc('get_new_balance', { 
          profile_id: childId, 
          add_amount: reward.amount 
        })
      })
      .eq('id', childId);
    
    if (updateError) throw updateError;

    return reward.amount;
  } catch (error) {
    console.error('Error awarding sparks:', error);
    throw error;
  }
}

// Helper function to check if a user has a 3-day streak and award bonus
export async function checkAndAwardStreakBonus(childId: string): Promise<boolean> {
  try {
    // Get current child profile to check streak
    const { data: profile, error: profileError } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return false;
    }
    
    // We need streak data, but child_profiles doesn't have streak_days
    // For now, we'll handle this temporarily without streak data
    // This will be properly implemented when streak tracking is added
    
    return false;
  } catch (error) {
    console.error('Error checking streak bonus:', error);
    return false;
  }
}
