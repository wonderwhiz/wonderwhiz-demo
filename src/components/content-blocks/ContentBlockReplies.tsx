
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import BlockReplies from './BlockReplies';

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
  user_id?: string | null;
  specialist_id?: string;
}

interface ContentBlockRepliesProps {
  blockId: string;
  specialistId: string;
  blockType: string;
  blockContent: any;
  userId?: string;
  childProfileId?: string;
}

const ContentBlockReplies: React.FC<ContentBlockRepliesProps> = ({
  blockId,
  specialistId,
  blockType,
  blockContent,
  userId,
  childProfileId
}) => {
  const [replies, setReplies] = useState<BlockReply[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReplies = async () => {
      if (blockId && !blockId.startsWith('generating-') && !blockId.startsWith('error-')) {
        try {
          const { data, error } = await supabase
            .from('block_replies')
            .select('*')
            .eq('block_id', blockId)
            .order('created_at', { ascending: true });
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            setReplies(data);
          }
        } catch (error) {
          console.error('Error fetching replies:', error);
        }
      }
    };
    
    fetchReplies();
  }, [blockId]);

  const handleSubmitReply = async (replyText: string) => {
    if (!replyText.trim() || !userId || !childProfileId) {
      if (!userId || !childProfileId) {
        toast.error("You need to be logged in to send messages.");
      }
      return;
    }
    
    const tempId = `temp-${Date.now()}`;
    const tempTimestamp = new Date().toISOString();

    setReplies(prev => [...prev, {
      id: tempId,
      block_id: blockId,
      content: replyText,
      from_user: true,
      created_at: tempTimestamp,
      user_id: userId
    }]);
    
    try {
      setIsLoading(true);
      console.log('Ensuring block exists in database:', blockId);

      if (!blockId.startsWith('generating-') && !blockId.startsWith('error-')) {
        try {
          const {
            data: ensureBlockData,
            error: ensureBlockError
          } = await supabase.functions.invoke('ensure-block-exists', {
            body: {
              block: {
                id: blockId,
                curio_id: blockContent.curio_id || null,
                type: blockType,
                specialist_id: specialistId,
                content: blockContent,
                liked: blockContent.liked,
                bookmarked: blockContent.bookmarked,
                child_profile_id: childProfileId
              }
            }
          });
          
          if (ensureBlockError) {
            console.error('Error ensuring block exists:', ensureBlockError);
          } else {
            console.log('Block ensured in database:', ensureBlockData);
          }
        } catch (ensureError) {
          console.error('Exception ensuring block exists:', ensureError);
        }
      }

      try {
        const {
          data: replyData,
          error: replyError
        } = await supabase
          .from('block_replies')
          .insert({
            block_id: blockId,
            content: replyText,
            from_user: true,
            user_id: userId
          })
          .select();
          
        if (replyError) {
          throw new Error(`Reply error: ${replyError.message}`);
        }
        
        console.log('Reply added successfully:', replyData);
        
        await handleSpecialistReply(blockId, replyText);
      } catch (replyError) {
        console.error('Error adding reply directly:', replyError);
        throw replyError;
      }
    } catch (error) {
      console.error('Error handling reply:', error);

      setReplies(prev => prev.filter(r => r.id !== tempId));
      
      toast.error("There was an error sending your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSpecialistReply = async (blockId: string, messageContent: string) => {
    try {
      const childProfileString = localStorage.getItem('currentChildProfile');
      const childProfile = childProfileString ? JSON.parse(childProfileString) : {
        age: 8,
        interests: ['science', 'art', 'space']
      };
      
      const response = await supabase.functions.invoke('handle-block-chat', {
        body: {
          blockId,
          messageContent,
          blockType,
          blockContent,
          childProfile,
          specialistId
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const {
        data: aiReplyData,
        error: aiReplyError
      } = await supabase.functions.invoke('handle-block-replies', {
        body: {
          block_id: blockId,
          content: response.data.reply,
          from_user: false,
          user_id: userId,
          child_profile_id: childProfileId,
          specialist_id: specialistId
        }
      });
      
      if (aiReplyError) throw aiReplyError;
      
      const {
        data,
        error
      } = await supabase
        .from('block_replies')
        .select('*')
        .eq('block_id', blockId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching replies after specialist response:', error);
        return;
      }
      
      if (data) {
        setReplies(data);
      }
    } catch (error) {
      console.error('Error getting specialist reply:', error);
      toast.error("There was an error getting a response. Please try again.");
    }
  };

  return (
    <BlockReplies 
      replies={replies} 
      specialistId={specialistId} 
      onSendReply={handleSubmitReply}
    />
  );
};

export default ContentBlockReplies;
