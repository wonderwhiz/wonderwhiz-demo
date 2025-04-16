
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const useBlockInteractions = (profileId: string | undefined) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Handle liking blocks
  const handleToggleLike = async (blockId: string) => {
    if (!profileId || isLiking) return;
    
    setIsLiking(true);
    
    try {
      // Instead of using separate tables for likes, use the content_blocks table's liked field
      const { data: block, error: fetchError } = await supabase
        .from('content_blocks')
        .select('liked')
        .eq('id', blockId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Toggle like status
      const newLikedStatus = !block.liked;
      
      const { error: updateError } = await supabase
        .from('content_blocks')
        .update({ liked: newLikedStatus })
        .eq('id', blockId);
          
      if (updateError) throw updateError;
      
      toast.success(newLikedStatus ? "Added to liked content!" : "Removed from liked content");
      
      // Award spark for liking
      if (newLikedStatus) {
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: profileId,
              amount: 1
            })
          });
          
          await supabase.from('sparks_transactions').insert({
            child_id: profileId,
            amount: 1,
            reason: 'Liking content'
          });
          
          toast.success('You earned 1 spark for liking content!', {
            duration: 2000,
            position: 'bottom-right'
          });
        } catch (err) {
          console.error('Error awarding spark:', err);
        }
      }
    } catch (error) {
      console.error('Error updating like status:', error);
      toast.error("Could not update like");
    } finally {
      setIsLiking(false);
    }
  };

  // Handle bookmarking blocks
  const handleToggleBookmark = async (blockId: string) => {
    if (!profileId || isBookmarking) return;
    
    setIsBookmarking(true);
    
    try {
      // Instead of using separate tables for bookmarks, use the content_blocks table's bookmarked field
      const { data: block, error: fetchError } = await supabase
        .from('content_blocks')
        .select('bookmarked')
        .eq('id', blockId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Toggle bookmark status
      const newBookmarkedStatus = !block.bookmarked;
      
      const { error: updateError } = await supabase
        .from('content_blocks')
        .update({ bookmarked: newBookmarkedStatus })
        .eq('id', blockId);
          
      if (updateError) throw updateError;
      
      toast.success(newBookmarkedStatus ? "Added to bookmarks!" : "Removed from bookmarks");
      
      // Award spark for first bookmark
      if (newBookmarkedStatus) {
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: profileId,
              amount: 1
            })
          });
          
          await supabase.from('sparks_transactions').insert({
            child_id: profileId,
            amount: 1,
            reason: 'Bookmarking content'
          });
          
          toast.success('You earned 1 spark for saving content!', {
            duration: 2000,
            position: 'bottom-right'
          });
        } catch (err) {
          console.error('Error awarding spark:', err);
        }
      }
    } catch (error) {
      console.error('Error updating bookmark status:', error);
      toast.error("Could not update bookmark");
    } finally {
      setIsBookmarking(false);
    }
  };

  // Handle quiz correct answer
  const handleQuizCorrect = async () => {
    if (!profileId) return;
    
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 2
        })
      });
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 2,
        reason: 'Answering quiz correctly'
      });
      
      toast.success('You earned 2 sparks for answering correctly!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for quiz:', error);
    }
  };

  // Handle news read completion
  const handleNewsRead = async () => {
    if (!profileId) return;
    
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 1
        })
      });
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 1,
        reason: 'Reading news update'
      });
      
      toast.success('You earned 1 spark for reading news!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding spark for news:', error);
    }
  };

  // Handle creative upload
  const handleCreativeUpload = async () => {
    if (!profileId) return;
    
    try {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 3
        })
      });
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 3,
        reason: 'Completing creative challenge'
      });
      
      toast.success('You earned 3 sparks for your creativity!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for creative upload:', error);
    }
  };

  // Handle activity completion
  const handleActivityComplete = async () => {
    if (!profileId) return;
    
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 2
        })
      });
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 2,
        reason: 'Completing activity'
      });
      
      toast.success('You earned 2 sparks for completing the activity!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for activity:', error);
    }
  };

  // Handle mindfulness completion
  const handleMindfulnessComplete = async () => {
    if (!profileId) return;
    
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 2
        })
      });
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 2,
        reason: 'Completing mindfulness exercise'
      });
      
      toast.success('You earned 2 sparks for practicing mindfulness!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for mindfulness:', error);
    }
  };

  // Handle task completion
  const handleTaskComplete = async () => {
    if (!profileId) return;
    
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 2
        })
      });
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 2,
        reason: 'Completing task'
      });
      
      toast.success('You earned 2 sparks for completing the task!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for task:', error);
    }
  };

  // Handle block replies
  const handleReply = async (blockId: string, message: string) => {
    if (!profileId || !message.trim() || isReplying) return false;
    
    setIsReplying(true);
    
    try {
      // Send reply through edge function
      const { data, error } = await supabase.functions.invoke('handle-block-replies', {
        body: {
          blockId,
          message: message.trim(),
          childId: profileId
        }
      });
      
      if (error) throw error;
      
      toast.success("Your comment was sent!");
      
      // Award spark for engagement
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: profileId,
            amount: 1
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: profileId,
          amount: 1,
          reason: 'Commenting on content'
        });
        
        toast.success('You earned 1 spark for sharing your thoughts!', {
          duration: 2000,
          position: 'bottom-right'
        });
      } catch (err) {
        console.error('Error awarding spark for reply:', err);
      }
      
      return true;
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error("Could not post your comment");
      return false;
    } finally {
      setIsReplying(false);
    }
  };

  return {
    handleToggleLike,
    handleToggleBookmark,
    handleReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleActivityComplete,
    handleMindfulnessComplete,
    handleTaskComplete,
    isReplying,
    isLiking,
    isBookmarking
  };
};
