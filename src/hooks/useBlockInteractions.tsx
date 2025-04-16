
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
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('block_likes')
        .select('*')
        .eq('block_id', blockId)
        .eq('child_id', profileId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingLike) {
        // Unlike
        const { error: unlikeError } = await supabase
          .from('block_likes')
          .delete()
          .eq('id', existingLike.id);
          
        if (unlikeError) throw unlikeError;
        
        toast.success("Removed from liked content");
      } else {
        // Like
        const { error: likeError } = await supabase
          .from('block_likes')
          .insert({
            block_id: blockId,
            child_id: profileId
          });
          
        if (likeError) throw likeError;
        
        toast.success("Added to liked content!");
        
        // Award spark for first like
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
      // Check if already bookmarked
      const { data: existingBookmark, error: checkError } = await supabase
        .from('block_bookmarks')
        .select('*')
        .eq('block_id', blockId)
        .eq('child_id', profileId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingBookmark) {
        // Remove bookmark
        const { error: removeError } = await supabase
          .from('block_bookmarks')
          .delete()
          .eq('id', existingBookmark.id);
          
        if (removeError) throw removeError;
        
        toast.success("Removed from bookmarks");
      } else {
        // Add bookmark
        const { error: bookmarkError } = await supabase
          .from('block_bookmarks')
          .insert({
            block_id: blockId,
            child_id: profileId
          });
          
        if (bookmarkError) throw bookmarkError;
        
        toast.success("Added to bookmarks!");
        
        // Award spark for first bookmark
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
    if (!profileId || !message.trim() || isReplying) return;
    
    setIsReplying(true);
    
    try {
      const { error } = await supabase
        .from('block_replies')
        .insert({
          block_id: blockId,
          child_id: profileId,
          message: message.trim()
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
    handleTaskComplete
  };
};
