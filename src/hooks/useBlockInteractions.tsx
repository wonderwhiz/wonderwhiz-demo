
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

  // Handle toggle like function
  const handleToggleLike = async (blockId: string) => {
    if (!childProfileId) return;
    
    try {
      const { data: block } = await supabase
        .from('content_blocks')
        .select('liked')
        .eq('id', blockId)
        .single();
      
      if (block) {
        await supabase
          .from('content_blocks')
          .update({ liked: !block.liked })
          .eq('id', blockId);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Could not update like status. Please try again.');
    }
  };

  // Handle toggle bookmark function
  const handleToggleBookmark = async (blockId: string) => {
    if (!childProfileId) return;
    
    try {
      const { data: block } = await supabase
        .from('content_blocks')
        .select('bookmarked')
        .eq('id', blockId)
        .single();
      
      if (block) {
        await supabase
          .from('content_blocks')
          .update({ bookmarked: !block.bookmarked })
          .eq('id', blockId);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Could not update bookmark status. Please try again.');
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
      
      // We don't show a toast here as the CreativeBlock component now handles its own feedback
    } catch (error) {
      console.error('Error handling creative upload:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, creative: false }));
    }
  };

  // Handle activity completion
  const handleActivityComplete = async () => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, activity: true }));
    
    try {
      // Award sparks for activity completion
      await supabase.functions.invoke('increment-sparks-balance', {
        body: { childId: childProfileId, amount: 3 }
      });
      
      console.log('Activity completed successfully');
      
      toast.success("Activity completed! +3 sparks", {
        position: 'top-center',
        classNames: {
          toast: 'bg-wonderwhiz-purple text-white'
        }
      });
    } catch (error) {
      console.error('Error handling activity completion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, activity: false }));
    }
  };

  // Handle mindfulness completion
  const handleMindfulnessComplete = async () => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, mindfulness: true }));
    
    try {
      // Award sparks for mindfulness completion
      await supabase.functions.invoke('increment-sparks-balance', {
        body: { childId: childProfileId, amount: 5 }
      });
      
      console.log('Mindfulness exercise completed successfully');
      
      toast.success("Mindfulness exercise completed! +5 sparks", {
        position: 'top-center',
        classNames: {
          toast: 'bg-wonderwhiz-purple text-white'
        }
      });
    } catch (error) {
      console.error('Error handling mindfulness completion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, mindfulness: false }));
    }
  };

  // Handle task completion  
  const handleTaskComplete = async () => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, task: true }));
    
    try {
      // Award sparks for task completion
      await supabase.functions.invoke('increment-sparks-balance', {
        body: { childId: childProfileId, amount: 8 }
      });
      
      console.log('Task completed successfully');
      
      toast.success("Task completed! +8 sparks", {
        position: 'top-center',
        classNames: {
          toast: 'bg-wonderwhiz-purple text-white'
        }
      });
    } catch (error) {
      console.error('Error handling task completion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, task: false }));
    }
  };

  return {
    handleReply,
    handleToggleLike,
    handleToggleBookmark,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleActivityComplete,
    handleMindfulnessComplete,
    handleTaskComplete,
    loadingStates
  };
};
