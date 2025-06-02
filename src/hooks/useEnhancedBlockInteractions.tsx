
import { useState, useCallback } from 'react';

export const useEnhancedBlockInteractions = (profileId?: string) => {
  const [likedBlocks, setLikedBlocks] = useState<Set<string>>(new Set());
  const [bookmarkedBlocks, setBookmarkedBlocks] = useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleLike = useCallback((blockId: string) => {
    setLikedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blockId)) {
        newSet.delete(blockId);
      } else {
        newSet.add(blockId);
      }
      return newSet;
    });
  }, []);

  const handleBookmark = useCallback((blockId: string) => {
    setBookmarkedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blockId)) {
        newSet.delete(blockId);
      } else {
        newSet.add(blockId);
      }
      return newSet;
    });
  }, []);

  const handleReply = useCallback((blockId: string, message: string) => {
    console.log('Reply to block:', blockId, message);
  }, []);

  const handleReadAloud = useCallback((text: string) => {
    console.log('Read aloud:', text);
  }, []);

  const handleQuizCorrect = useCallback((blockId: string) => {
    console.log('Quiz correct for block:', blockId);
  }, []);

  const handleNewsRead = useCallback((blockId: string) => {
    console.log('News read for block:', blockId);
  }, []);

  const handleCreativeUpload = useCallback((blockId: string) => {
    console.log('Creative upload for block:', blockId);
  }, []);

  const handleMindfulnessComplete = useCallback((blockId: string) => {
    console.log('Mindfulness complete for block:', blockId);
  }, []);

  const handleTaskComplete = useCallback((blockId: string) => {
    console.log('Task complete for block:', blockId);
  }, []);

  return {
    handleLike,
    handleBookmark,
    handleReply,
    handleReadAloud,
    likedBlocks,
    bookmarkedBlocks,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleMindfulnessComplete,
    handleTaskComplete,
    loadingStates
  };
};
