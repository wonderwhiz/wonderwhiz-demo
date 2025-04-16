import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useBlockInteractions(profileId?: string) {
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const setLoading = (blockId: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [blockId]: isLoading
    }));
  };

  const handleReply = async (blockId: string, message: string) => {
    if (!blockId || !message || !profileId) {
      toast.error("Cannot send reply");
      return Promise.reject("Missing required information");
    }

    try {
      const { data, error } = await supabase.functions.invoke('handle-block-replies', {
        body: {
          block_id: blockId,
          content: message,
          from_user: true,
          child_profile_id: profileId
        }
      });

      if (error) {
        console.error('Error sending reply:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error processing reply:', err);
      throw err;
    }
  };

  const handleQuizCorrect = async (blockId: string) => {
    if (!childId || !blockId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'quiz-correct',
          blockId,
          childId
        }
      });
      
      // Award sparks for correct answers
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 3
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 3,
          reason: 'Quiz answered correctly'
        });
        
        toast.success('You earned 3 sparks for your knowledge!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error handling quiz correct:', error);
    } finally {
      setLoading(blockId, false);
    }
  };
  
  const handleNewsRead = async (blockId: string) => {
    if (!childId || !blockId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'news-read',
          blockId,
          childId
        }
      });
      
      // Award sparks for staying informed
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 1
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 1,
          reason: 'Stayed informed with news'
        });
        
        toast.success('You earned 1 spark for staying informed!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error marking news as read:', error);
    } finally {
      setLoading(blockId, false);
    }
  };
  
  const handleCreativeUpload = async (blockId: string, content: any) => {
    if (!childId || !blockId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'creative-upload',
          blockId,
          childId,
          content
        }
      });
      
      // Award sparks for creative submissions
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 5
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 5,
          reason: 'Creative submission'
        });
        
        toast.success('You earned 5 sparks for your creativity!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error handling creative upload:', error);
    } finally {
      setLoading(blockId, false);
    }
  };
  
  const handleActivityComplete = async (blockId: string) => {
    if (!childId || !blockId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'activity-complete',
          blockId,
          childId
        }
      });
      
      // Award sparks for completing activities
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 3
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 3,
          reason: 'Activity completed'
        });
        
        toast.success('You earned 3 sparks for completing an activity!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error marking activity as complete:', error);
    } finally {
      setLoading(blockId, false);
    }
  };
  
  const handleMindfulnessComplete = async (blockId: string) => {
    if (!childId || !blockId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'mindfulness-complete',
          blockId,
          childId
        }
      });
      
      // Award sparks for mindfulness practice
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 2
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 2,
          reason: 'Mindfulness practice'
        });
        
        toast.success('You earned 2 sparks for mindfulness practice!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error marking mindfulness as complete:', error);
    } finally {
      setLoading(blockId, false);
    }
  };
  
  const handleTaskComplete = async (blockId: string) => {
    if (!childId || !blockId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'task-complete',
          blockId,
          childId
        }
      });
      
      // Award sparks for completing tasks
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 1
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 1,
          reason: 'Task completed'
        });
        
        toast.success('You earned 1 spark for completing a task!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error marking task as complete:', error);
    } finally {
      setLoading(blockId, false);
    }
  };
  
  const handleToggleLike = async (blockId: string) => {
    if (!childId || !blockId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'like',
          blockId,
          childId
        }
      });
      
      toast.success('Content liked!', {
        position: 'bottom-right',
        duration: 2000
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Could not like this content. Please try again later.");
    } finally {
      setLoading(blockId, false);
    }
  };
  
  const handleToggleBookmark = async (blockId: string) => {
    if (!childId || !blockId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'bookmark',
          blockId,
          childId
        }
      });
      
      toast.success('Content saved!', {
        position: 'bottom-right',
        duration: 2000
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error("Could not save this content. Please try again later.");
    } finally {
      setLoading(blockId, false);
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
}
