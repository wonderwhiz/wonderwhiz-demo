
import React from 'react';
import EnhancedBlockInteractions from './EnhancedBlockInteractions';
import { BlockInteractionsProps } from './interfaces';

// This component wraps the EnhancedBlockInteractions component for backward compatibility
const BlockInteractions: React.FC<BlockInteractionsProps> = ({
  id,
  liked = false,
  bookmarked = false,
  type,
  onToggleLike,
  onToggleBookmark,
  setShowReplyForm,
  onRabbitHoleClick,
  relatedQuestions = []
}) => {
  // Handle reply differently in this wrapper to maintain backward compatibility
  const handleReply = setShowReplyForm ? (message: string) => {
    setShowReplyForm(true);
    // Note: actual message sending is handled differently in the old component
  } : undefined;

  return (
    <EnhancedBlockInteractions
      id={id}
      liked={liked}
      bookmarked={bookmarked}
      type={type}
      onToggleLike={onToggleLike}
      onToggleBookmark={onToggleBookmark}
      onReply={handleReply}
      onRabbitHoleClick={onRabbitHoleClick}
      relatedQuestions={relatedQuestions}
    />
  );
};

export default BlockInteractions;
