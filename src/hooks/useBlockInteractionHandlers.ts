
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Reply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  timestamp: string;
}

interface ContentBlock {
  id: string;
  type: string;
  specialist_id: string;
  content: any;
  liked: boolean;
  bookmarked: boolean;
}

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  interests: string[];
  age: number;
  sparks_balance: number;
}

export const useBlockInteractionHandlers = (
  profileId?: string, 
  childProfile?: ChildProfile | null,
  setChildProfile?: React.Dispatch<React.SetStateAction<ChildProfile | null>>,
  contentBlocks: ContentBlock[] = []
) => {
  const [blockReplies, setBlockReplies] = useState<Record<string, Reply[]>>({});

  const handleBlockReply = async (blockId: string, message: string) => {
    if (!message.trim() || !childProfile) return;
    
    try {
      const block = contentBlocks.find(b => b.id === blockId);
      if (!block) {
        console.error('Block not found:', blockId);
        return;
      }
      
      const { data: replyData, error: replyError } = await supabase
        .from('block_replies')
        .insert({
          block_id: blockId,
          content: message,
          from_user: true
        })
        .select()
        .single();
        
      if (replyError) throw replyError;
      
      setBlockReplies(prev => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), replyData]
      }));
      
      const aiResponse = await supabase.functions.invoke('handle-block-chat', {
        body: JSON.stringify({
          blockId,
          messageContent: message,
          blockType: block.type,
          blockContent: block.content,
          childProfile,
          specialistId: block.specialist_id
        })
      });
      
      if (aiResponse.error) {
        throw new Error(`Failed to get response: ${aiResponse.error.message}`);
      }
      
      const { data: aiReplyData, error: aiReplyError } = await supabase
        .from('block_replies')
        .insert({
          block_id: blockId,
          content: aiResponse.data.reply,
          from_user: false
        })
        .select()
        .single();
        
      if (aiReplyError) throw aiReplyError;
      
      setBlockReplies(prev => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), aiReplyData]
      }));
    } catch (error) {
      console.error('Error handling reply:', error);
      toast.error("Failed to send message");
    }
  };

  const handleQuizCorrect = async (blockId: string) => {
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 5
        })
      });
      
      if (childProfile && setChildProfile) {
        setChildProfile({
          ...childProfile,
          sparks_balance: (childProfile.sparks_balance || 0) + 5
        });
      }
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 5,
        reason: 'Answering quiz correctly',
        block_id: blockId
      });
      
      toast.success('You earned 5 sparks for answering correctly!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for correct quiz answer:', error);
    }
  };

  const handleNewsRead = async (blockId: string) => {
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 3
        })
      });
      
      if (childProfile && setChildProfile) {
        setChildProfile({
          ...childProfile,
          sparks_balance: (childProfile.sparks_balance || 0) + 3
        });
      }
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 3,
        reason: 'Reading a news card',
        block_id: blockId
      });
      
      toast.success('You earned 3 sparks for reading the news!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for news read:', error);
    }
  };

  const handleCreativeUpload = async (blockId: string) => {
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 10
        })
      });
      
      if (childProfile && setChildProfile) {
        setChildProfile({
          ...childProfile,
          sparks_balance: (childProfile.sparks_balance || 0) + 10
        });
      }
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 10,
        reason: 'Uploading creative content',
        block_id: blockId
      });
      
      toast.success('You earned 10 sparks for your creativity!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for creative upload:', error);
    }
  };

  const handleSparkEarned = (amount: number) => {
    if (childProfile && setChildProfile) {
      setChildProfile({
        ...childProfile,
        sparks_balance: (childProfile.sparks_balance || 0) + amount
      });
    }
  };

  return {
    blockReplies,
    handleBlockReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleSparkEarned
  };
};
