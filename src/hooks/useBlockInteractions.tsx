
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
      await supabase
        .from('block_replies')
        .insert({
          block_id: blockId,
          content: message,
          from_user: true,
          user_id: childProfileId
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
  const handleQuizCorrect = async (blockId: string) => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, quiz: true }));
    
    try {
      // Call edge function to handle quiz completion
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'quiz',
          blockId,
          childId: childProfileId
        }
      });
      
      console.log('Quiz completed successfully');
      
      toast.success("Correct answer! +5 sparks");
    } catch (error) {
      console.error('Error handling quiz completion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, quiz: false }));
    }
  };

  // Handle news items being read
  const handleNewsRead = async (blockId: string) => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, news: true }));
    
    try {
      // Call edge function to handle news read
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'news',
          blockId,
          childId: childProfileId
        }
      });
      
      console.log('News read successfully');
    } catch (error) {
      console.error('Error handling news read:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, news: false }));
    }
  };

  // Handle creative content uploads
  const handleCreativeUpload = async (blockId: string) => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, creative: true }));
    
    try {
      // Call edge function to handle creative upload
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'creative',
          blockId,
          childId: childProfileId
        }
      });
      
      console.log('Creative content uploaded successfully');
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
      // Call edge function to handle activity completion
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'activity',
          childId: childProfileId
        }
      });
      
      console.log('Activity completed successfully');
      
      toast.success("Activity completed! +3 sparks");
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
      // Call edge function to handle mindfulness completion
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'mindfulness',
          childId: childProfileId
        }
      });
      
      console.log('Mindfulness exercise completed successfully');
      
      toast.success("Mindfulness exercise completed! +5 sparks");
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
      // Call edge function to handle task completion
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'task',
          childId: childProfileId
        }
      });
      
      console.log('Task completed successfully');
      
      toast.success("Task completed! +8 sparks");
    } catch (error) {
      console.error('Error handling task completion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, task: false }));
    }
  };

  return {
    handleReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleActivityComplete,
    handleMindfulnessComplete,
    handleTaskComplete,
    loadingStates
  };
};
