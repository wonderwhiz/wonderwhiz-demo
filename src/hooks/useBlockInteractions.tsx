
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBlockInteractions = (childId?: string) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = (blockId: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [blockId]: isLoading
    }));
  };

  const handleReply = async (blockId: string, message: string) => {
    if (!childId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('record-user-reply', {
        body: {
          blockId,
          childId,
          message
        }
      });
      
      toast.success('Your message was sent!');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Could not send your message. Please try again.');
    } finally {
      setLoading(blockId, false);
    }
  };

  const handleQuizCorrect = async (blockId: string) => {
    if (!childId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('record-quiz-correct', {
        body: {
          blockId,
          childId
        }
      });
      
      const { error } = await supabase.from('sparks_transactions').insert({
        child_id: childId,
        amount: 1,
        reason: 'Quiz answered correctly'
      });
      
      if (error) throw error;
      
      toast.success('You earned a spark!', {
        icon: '✨'
      });
    } catch (error) {
      console.error('Error recording quiz completion:', error);
    } finally {
      setLoading(blockId, false);
    }
  };

  const handleNewsRead = async (blockId: string) => {
    if (!childId) return;
    
    try {
      await supabase.functions.invoke('record-content-read', {
        body: {
          blockId,
          childId,
          contentType: 'news'
        }
      });
    } catch (error) {
      console.error('Error recording news read:', error);
    }
  };

  const handleCreativeUpload = async (blockId: string, content: any) => {
    if (!childId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('save-creative-content', {
        body: {
          blockId,
          childId,
          content
        }
      });
      
      const { error } = await supabase.from('sparks_transactions').insert({
        child_id: childId,
        amount: 2,
        reason: 'Creative content created'
      });
      
      if (error) throw error;
      
      toast.success('Creative content saved! You earned 2 sparks!', {
        icon: '✨'
      });
    } catch (error) {
      console.error('Error saving creative content:', error);
      toast.error('Could not save your creation. Please try again.');
    } finally {
      setLoading(blockId, false);
    }
  };

  const handleActivityComplete = async (blockId: string) => {
    if (!childId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('record-activity-complete', {
        body: {
          blockId,
          childId
        }
      });
      
      const { error } = await supabase.from('sparks_transactions').insert({
        child_id: childId,
        amount: 1,
        reason: 'Activity completed'
      });
      
      if (error) throw error;
      
      toast.success('Activity completed! You earned a spark!', {
        icon: '✨'
      });
    } catch (error) {
      console.error('Error recording activity completion:', error);
    } finally {
      setLoading(blockId, false);
    }
  };

  const handleMindfulnessComplete = async (blockId: string) => {
    if (!childId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('record-mindfulness-complete', {
        body: {
          blockId,
          childId
        }
      });
      
      toast.success('Mindfulness moment completed!');
    } catch (error) {
      console.error('Error recording mindfulness completion:', error);
    } finally {
      setLoading(blockId, false);
    }
  };

  const handleTaskComplete = async (blockId: string) => {
    if (!childId) return;
    
    setLoading(blockId, true);
    
    try {
      await supabase.functions.invoke('record-task-complete', {
        body: {
          blockId,
          childId
        }
      });
      
      toast.success('Task completed!');
    } catch (error) {
      console.error('Error recording task completion:', error);
    } finally {
      setLoading(blockId, false);
    }
  };

  // Add toggle like functionality
  const handleToggleLike = async (blockId: string) => {
    if (!childId || !blockId) return;
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'like',
          blockId,
          childId
        }
      });
      
      toast.success('Content liked!', { 
        icon: '❤️',
        duration: 2000
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Could not like this wonder. Please try again later.");
    }
  };

  // Add toggle bookmark functionality
  const handleToggleBookmark = async (blockId: string) => {
    if (!childId || !blockId) return;
    
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'bookmark',
          blockId,
          childId
        }
      });
      
      toast.success('Content bookmarked!', {
        icon: '🔖',
        duration: 2000
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error("Could not bookmark this wonder. Please try again later.");
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
