
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useBlockHandler = (childId?: string, initialLikes = {}, initialBookmarks = {}) => {
  const [likes, setLikes] = useState<Record<string, boolean>>(initialLikes);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(initialBookmarks);
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

  const toggleLike = useCallback(async (blockId: string) => {
    if (isProcessing[blockId]) return;
    
    setIsProcessing(prev => ({ ...prev, [blockId]: true }));
    
    try {
      // Optimistic update
      const newLikedState = !likes[blockId];
      setLikes(prev => ({ ...prev, [blockId]: newLikedState }));
      
      // Show visual feedback
      if (newLikedState) {
        toast.success('Content liked!', {
          icon: '👍',
          position: 'bottom-right',
          duration: 2000
        });
      }
      
      // Here you would typically make an API call
      console.log(`${newLikedState ? 'Liked' : 'Unliked'} block ${blockId} for child ${childId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newLikedState;
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert on error
      setLikes(prev => ({ ...prev, [blockId]: !likes[blockId] }));
      
      toast.error('Could not update like status', {
        duration: 3000
      });
      
      return likes[blockId];
    } finally {
      setIsProcessing(prev => ({ ...prev, [blockId]: false }));
    }
  }, [likes, isProcessing, childId]);

  const toggleBookmark = useCallback(async (blockId: string) => {
    if (isProcessing[blockId]) return;
    
    setIsProcessing(prev => ({ ...prev, [blockId]: true }));
    
    try {
      // Optimistic update
      const newBookmarkedState = !bookmarks[blockId];
      setBookmarks(prev => ({ ...prev, [blockId]: newBookmarkedState }));
      
      // Show visual feedback
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
      
      // Here you would typically make an API call
      console.log(`${newBookmarkedState ? 'Bookmarked' : 'Unbookmarked'} block ${blockId} for child ${childId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newBookmarkedState;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      
      // Revert on error
      setBookmarks(prev => ({ ...prev, [blockId]: !bookmarks[blockId] }));
      
      toast.error('Could not update bookmark status', {
        duration: 3000
      });
      
      return bookmarks[blockId];
    } finally {
      setIsProcessing(prev => ({ ...prev, [blockId]: false }));
    }
  }, [bookmarks, isProcessing, childId]);

  const handleReply = useCallback(async (blockId: string, message: string) => {
    if (!message.trim() || isProcessing[blockId]) {
      if (!message.trim()) {
        toast.error('Please enter a message');
      }
      return false;
    }
    
    setIsProcessing(prev => ({ ...prev, [blockId]: true }));
    
    try {
      toast.loading('Sending reply...', {
        id: `reply-${blockId}`,
        duration: 1000
      });
      
      // Here you would typically make an API call
      console.log(`Sending reply to block ${blockId} for child ${childId}: ${message}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Reply sent!', {
        id: `reply-${blockId}`,
        duration: 2000
      });
      
      return true;
    } catch (error) {
      console.error('Error sending reply:', error);
      
      toast.error('Could not send reply', {
        id: `reply-${blockId}`,
        duration: 3000
      });
      
      return false;
    } finally {
      setIsProcessing(prev => ({ ...prev, [blockId]: false }));
    }
  }, [isProcessing, childId]);

  const handleReadAloud = useCallback((text: string) => {
    toast.success('Reading content aloud...', {
      icon: '🔊',
      position: 'bottom-right',
      duration: 3000
    });
    
    console.log('Reading aloud:', text);
    
    // Return a dummy cleanup function
    return () => {
      console.log('Stopped reading');
    };
  }, []);

  return {
    likes,
    bookmarks,
    isProcessing,
    toggleLike,
    toggleBookmark,
    handleReply,
    handleReadAloud
  };
};
