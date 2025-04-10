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
    mindfulness: false,
    like: false,
    bookmark: false
  });

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

  const handleQuizCorrect = async (blockId: string) => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, quiz: true }));
    
    try {
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

  const handleNewsRead = async (blockId: string) => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, news: true }));
    
    try {
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

  const handleCreativeUpload = async (blockId: string) => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, creative: true }));
    
    try {
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

  const handleActivityComplete = async () => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, activity: true }));
    
    try {
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

  const handleMindfulnessComplete = async () => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, mindfulness: true }));
    
    try {
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

  const handleTaskComplete = async () => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, task: true }));
    
    try {
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

  const handleToggleLike = async (blockId: string) => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, like: true }));
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'like',
          blockId,
          childId: childProfileId
        }
      });
      
      console.log('Like toggled successfully');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Could not like this content. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, like: false }));
    }
  };

  const handleToggleBookmark = async (blockId: string) => {
    if (!childProfileId) return;
    
    setLoadingStates(prev => ({ ...prev, bookmark: true }));
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'bookmark',
          blockId,
          childId: childProfileId
        }
      });
      
      console.log('Bookmark toggled successfully');
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Could not bookmark this content. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, bookmark: false }));
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
    handleToggleLike,
    handleToggleBookmark,
    loadingStates
  };
};
