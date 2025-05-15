
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useBlockInteractionHandlers(profileId?: string, childProfile?: any, setChildProfile?: any, contentBlocks?: any[]) {
  const [blockReplies, setBlockReplies] = useState<{[key: string]: any[]}>({});
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  // Handle block replies
  const handleBlockReply = useCallback(async (blockId: string, message: string) => {
    if (!profileId || !message.trim()) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, [blockId]: true }));
      
      const blockToReplyTo = contentBlocks?.find(block => block.id === blockId);
      if (!blockToReplyTo) {
        throw new Error('Block not found');
      }
      
      // Add optimistic reply
      const optimisticReply = {
        id: `temp-${Date.now()}`,
        block_id: blockId,
        content: message,
        from_user: true,
        created_at: new Date().toISOString(),
      };
      
      setBlockReplies(prev => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), optimisticReply]
      }));
      
      // Call edge function to get specialist reply
      const { data, error } = await supabase.functions.invoke('handle-block-chat', {
        body: {
          blockId,
          messageContent: message,
          blockType: blockToReplyTo.type,
          blockContent: blockToReplyTo.content,
          childProfile: childProfile || { age: 10, interests: [] },
          specialistId: blockToReplyTo.specialist_id
        }
      });
      
      if (error) throw error;
      
      // Store both user message and specialist reply in database
      const { error: insertError } = await supabase.from('block_replies').insert([
        {
          block_id: blockId,
          content: message,
          from_user: true
        },
        {
          block_id: blockId,
          content: data?.reply || "I'm not sure how to respond to that.",
          from_user: false,
          specialist_id: data?.specialistId || blockToReplyTo.specialist_id
        }
      ]);
      
      if (insertError) throw insertError;
      
      // Fetch updated replies
      const { data: replies, error: fetchError } = await supabase
        .from('block_replies')
        .select('*')
        .eq('block_id', blockId)
        .order('created_at', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      setBlockReplies(prev => ({
        ...prev,
        [blockId]: replies || []
      }));
      
      // Award sparks for engagement
      await handleSparkEarned(1, 'chat-reply');
      
      return true;
    } catch (error) {
      console.error('Error handling block reply:', error);
      toast.error('Could not send your message. Please try again.');
      
      // Remove optimistic reply on error
      setBlockReplies(prev => {
        const currentReplies = prev[blockId] || [];
        return {
          ...prev,
          [blockId]: currentReplies.filter(r => !r.id.toString().startsWith('temp-'))
        };
      });
      
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, [blockId]: false }));
    }
  }, [profileId, contentBlocks, childProfile]);

  // Handle quiz correct
  const handleQuizCorrect = useCallback(async (blockId: string) => {
    if (!profileId || !setChildProfile) return;
    
    try {
      // Award sparks for correct quiz answer
      await handleSparkEarned(3, 'quiz-correct');
      return true;
    } catch (error) {
      console.error('Error handling quiz:', error);
      return false;
    }
  }, [profileId, setChildProfile]);
  
  // Handle news read
  const handleNewsRead = useCallback(async (blockId: string) => {
    if (!profileId) return;
    
    try {
      // Award sparks for reading news
      await handleSparkEarned(1, 'news-read');
      return true;
    } catch (error) {
      console.error('Error handling news read:', error);
      return false;
    }
  }, [profileId]);
  
  // Handle creative upload
  const handleCreativeUpload = useCallback(async (blockId: string) => {
    if (!profileId) return;
    
    try {
      // Award sparks for creative upload
      await handleSparkEarned(5, 'creative-upload');
      return true;
    } catch (error) {
      console.error('Error handling creative upload:', error);
      return false;
    }
  }, [profileId]);
  
  // Helper function to award sparks and update profile
  const handleSparkEarned = useCallback(async (amount: number, reason: string) => {
    if (!profileId || !setChildProfile) return;
    
    try {
      // Call serverless function to award sparks
      const { data, error } = await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId,
          amount
        })
      });
      
      if (error) throw error;
      
      // Update local state
      if (childProfile && setChildProfile) {
        setChildProfile({
          ...childProfile,
          sparks_balance: (childProfile.sparks_balance || 0) + amount
        });
      }
      
      // Record transaction
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount,
        reason
      });
      
      return true;
    } catch (error) {
      console.error('Error awarding sparks:', error);
      return false;
    }
  }, [profileId, childProfile, setChildProfile]);
  
  return { 
    blockReplies, 
    handleBlockReply, 
    handleQuizCorrect, 
    handleNewsRead,
    handleCreativeUpload,
    handleSparkEarned,
    loadingStates 
  };
}
