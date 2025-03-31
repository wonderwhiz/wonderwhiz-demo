
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBlockInteractions = (childProfileId?: string) => {
  const [loadingStates, setLoadingStates] = useState({
    reply: false,
    quiz: false,
    news: false,
    creative: false,
    task: false,
    activity: false,
    mindfulness: false
  });

  // Handle block replies
  const handleReply = async (blockId: string, message: string) => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, reply: true }));
    
    try {
      await supabase.functions.invoke('handle-block-replies', {
        body: {
          blockId,
          message,
          childProfileId
        }
      });
      
      console.log('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Could not send reply. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, reply: false }));
    }
  };

  // Handle correct quiz answers
  const handleQuizCorrect = async () => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, quiz: true }));
    
    try {
      // Award sparks for quiz correct answer
      await supabase.functions.invoke('increment-sparks-balance', {
        body: { childId: childProfileId, amount: 5 }
      });
      
      console.log('Quiz completed successfully');
      
      toast.success("Correct answer! +5 sparks", {
        position: 'top-center',
        classNames: {
          toast: 'bg-wonderwhiz-green text-white'
        }
      });
    } catch (error) {
      console.error('Error handling quiz completion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, quiz: false }));
    }
  };

  // Handle news items being read
  const handleNewsRead = async () => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, news: true }));
    
    try {
      // Award sparks for reading news
      await supabase.functions.invoke('increment-sparks-balance', {
        body: { childId: childProfileId, amount: 3 }
      });
      
      console.log('News read successfully');
      
      // Update child_daily_activity counter
      await supabase.from('child_daily_activity').upsert({
        child_profile_id: childProfileId,
        activity_date: new Date().toISOString().split('T')[0],
        quizzes_completed: 1
      }, {
        onConflict: 'child_profile_id, activity_date',
        ignoreDuplicates: false
      });
    } catch (error) {
      console.error('Error handling news read:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, news: false }));
    }
  };

  // Handle creative content uploads
  const handleCreativeUpload = async () => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, creative: true }));
    
    try {
      // Award sparks for creative upload
      await supabase.functions.invoke('increment-sparks-balance', {
        body: { childId: childProfileId, amount: 10 }
      });
      
      console.log('Creative content uploaded successfully');
      
      toast.success("Creative work shared! +10 sparks", {
        position: 'top-center',
        classNames: {
          toast: 'bg-wonderwhiz-pink text-white'
        }
      });
    } catch (error) {
      console.error('Error handling creative upload:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, creative: false }));
    }
  };

  return {
    handleReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    loadingStates
  };
};
