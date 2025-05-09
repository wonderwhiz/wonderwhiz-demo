import { useState } from 'react';
import { toast } from 'sonner';
import { useBlockInteractions } from './useBlockInteractions';

export function useEnhancedBlockInteractions(childId?: string) {
  const {
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
  } = useBlockInteractions(childId);

  const [likedBlocks, setLikedBlocks] = useState<{[key: string]: boolean}>({});
  const [bookmarkedBlocks, setBookmarkedBlocks] = useState<{[key: string]: boolean}>({});
  
  // Enhanced reply handler with animation and feedback
  const enhancedReplyHandler = async (blockId: string, message: string) => {
    if (!message.trim()) {
      toast.error('Please enter a message first');
      return false;
    }
    
    toast.loading('Sending your reply...', {
      id: `reply-${blockId}`,
      duration: 1000
    });
    
    try {
      await handleReply(blockId, message);
      toast.success('Your reply has been sent!', {
        id: `reply-${blockId}`,
        duration: 2000
      });
      return true;
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Could not send your reply. Please try again.', {
        id: `reply-${blockId}`,
        duration: 3000
      });
      return false;
    }
  };

  // Enhanced like handler with animation
  const enhancedLikeHandler = async (blockId: string) => {
    const newLikedState = !likedBlocks[blockId];
    
    // Optimistic update
    setLikedBlocks(prev => ({
      ...prev,
      [blockId]: newLikedState
    }));
    
    try {
      await handleToggleLike(blockId);
      
      if (newLikedState) {
        toast.success('Content liked!', {
          icon: '👍',
          position: 'bottom-right',
          duration: 2000
        });
      }
      
      return newLikedState;
    } catch (error) {
      // Revert on error
      setLikedBlocks(prev => ({
        ...prev,
        [blockId]: !newLikedState
      }));
      
      console.error('Error toggling like:', error);
      toast.error('Could not update like status. Please try again.', {
        duration: 3000
      });
      
      return !newLikedState;
    }
  };

  // Enhanced bookmark handler with animation
  const enhancedBookmarkHandler = async (blockId: string) => {
    const newBookmarkedState = !bookmarkedBlocks[blockId];
    
    // Optimistic update
    setBookmarkedBlocks(prev => ({
      ...prev,
      [blockId]: newBookmarkedState
    }));
    
    try {
      await handleToggleBookmark(blockId);
      
      if (newBookmarkedState) {
        toast.success('Content saved!', {
          icon: '🔖',
          position: 'bottom-right',
          duration: 2000
        });
      } else {
        toast.success('Content removed from saved items', {
          position: 'bottom-right',
          duration: 2000
        });
      }
      
      return newBookmarkedState;
    } catch (error) {
      // Revert on error
      setBookmarkedBlocks(prev => ({
        ...prev,
        [blockId]: !newBookmarkedState
      }));
      
      console.error('Error toggling bookmark:', error);
      toast.error('Could not update saved status. Please try again.', {
        duration: 3000
      });
      
      return !newBookmarkedState;
    }
  };

  // Enhanced quiz handler with feedback animation
  const enhancedQuizCorrectHandler = async (blockId: string) => {
    toast.loading('Checking answer...', {
      id: `quiz-${blockId}`,
      duration: 1000
    });
    
    try {
      await handleQuizCorrect(blockId);
      
      toast.success('Correct! You earned 3 sparks! ✨', {
        id: `quiz-${blockId}`,
        duration: 3000
      });
      
      return true;
    } catch (error) {
      console.error('Error handling quiz:', error);
      
      toast.error('Could not process your answer. Please try again.', {
        id: `quiz-${blockId}`,
        duration: 3000
      });
      
      return false;
    }
  };

  // Enhanced creative upload handler with consistent signature
  const enhancedCreativeUploadHandler = async (blockId: string) => {
    toast.loading('Saving your creative work...', {
      id: `creative-${blockId}`,
      duration: 1000
    });
    
    try {
      // Call the original handler
      await handleCreativeUpload(blockId);
      
      toast.success('Your creative work was saved! You earned sparks! ✨', {
        id: `creative-${blockId}`,
        duration: 3000
      });
      
      return true;
    } catch (error) {
      console.error('Error handling creative upload:', error);
      
      toast.error('Could not save your creative work. Please try again.', {
        id: `creative-${blockId}`,
        duration: 3000
      });
      
      return false;
    }
  };

  // Enhanced read aloud handler
  const handleReadAloud = (text: string) => {
    // This is where you'd integrate with a text-to-speech service
    // For now, we'll just provide visual feedback
    toast.success('Reading content aloud...', {
      icon: '🔊',
      position: 'bottom-right',
      duration: 3000
    });
    
    console.log('Reading aloud:', text);
    
    // Return a dummy cleanup function that would stop speech in a real implementation
    return () => {
      console.log('Stopped reading');
    };
  };

  return {
    // Original handlers
    handleNewsRead,
    handleActivityComplete,
    handleMindfulnessComplete,
    handleTaskComplete,
    loadingStates,
    
    // Enhanced handlers
    handleReply: enhancedReplyHandler,
    handleLike: enhancedLikeHandler,
    handleBookmark: enhancedBookmarkHandler,
    handleQuizCorrect: enhancedQuizCorrectHandler,
    handleCreativeUpload: enhancedCreativeUploadHandler,
    handleReadAloud,
    
    // Reactive state
    likedBlocks,
    bookmarkedBlocks
  };
}
