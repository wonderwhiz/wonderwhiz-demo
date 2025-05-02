
import React from 'react';
import EnhancedBlockInteractions from './EnhancedBlockInteractions';
import { BlockInteractionsProps } from './interfaces';
import { ContentBlockType, isValidContentBlockType } from '@/types/curio';

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
  relatedQuestions = [],
  childAge = 10
}) => {
  // Handle reply differently in this wrapper to maintain backward compatibility
  const handleReply = setShowReplyForm ? (message: string) => {
    setShowReplyForm(true);
    // Note: actual message sending is handled differently in the old component
  } : undefined;

  // Ensure type is a valid ContentBlockType
  const validType = isValidContentBlockType(type) ? type : "fact" as ContentBlockType;

  return (
    <EnhancedBlockInteractions
      id={id}
      liked={liked}
      bookmarked={bookmarked}
      type={validType}
      onToggleLike={onToggleLike}
      onToggleBookmark={onToggleBookmark}
      onReply={handleReply}
      onRabbitHoleClick={onRabbitHoleClick}
      relatedQuestions={relatedQuestions}
      childAge={childAge}
    />
  );
};

export default BlockInteractions;
