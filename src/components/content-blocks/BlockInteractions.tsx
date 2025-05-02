
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bookmark, ThumbsUp, Share2, Sparkles } from 'lucide-react';
import { BlockInteractionsProps } from './interfaces';
import { ContentBlockType, isValidContentBlockType } from '@/types/curio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Enhanced version of BlockInteractions with improved visuals
const EnhancedBlockInteractions: React.FC<BlockInteractionsProps> = ({
  id,
  liked = false,
  bookmarked = false,
  type,
  onToggleLike,
  onToggleBookmark,
  setShowReplyForm,
  onReply,
  onRabbitHoleClick,
  relatedQuestions = [],
  childAge = 10
}) => {
  const getButtonStyle = () => {
    if (childAge <= 8) {
      return "text-base flex items-center gap-2 px-4 py-2.5 rounded-full";
    }
    return "text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="border-t border-white/10 px-4 py-3"
    >
      <div className="flex flex-wrap items-center gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLike}
          className={cn(
            getButtonStyle(),
            "text-white/70 hover:text-white hover:bg-white/10 transition-colors",
            liked && "text-wonderwhiz-bright-pink hover:text-wonderwhiz-bright-pink"
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className={childAge <= 12 ? "" : "sr-only md:not-sr-only"}>Like</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleBookmark}
          className={cn(
            getButtonStyle(),
            "text-white/70 hover:text-white hover:bg-white/10 transition-colors",
            bookmarked && "text-wonderwhiz-vibrant-yellow hover:text-wonderwhiz-vibrant-yellow"
          )}
        >
          <Bookmark className="h-4 w-4" />
          <span className={childAge <= 12 ? "" : "sr-only md:not-sr-only"}>Save</span>
        </Button>

        {setShowReplyForm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(true)}
            className={cn(
              getButtonStyle(),
              "text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            )}
          >
            <MessageCircle className="h-4 w-4" />
            <span className={childAge <= 12 ? "" : "sr-only md:not-sr-only"}>Reply</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            getButtonStyle(),
            "text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-auto"
          )}
        >
          <Share2 className="h-4 w-4" />
          <span className={childAge <= 12 ? "" : "sr-only md:not-sr-only"}>Share</span>
        </Button>
      </div>

      {onRabbitHoleClick && relatedQuestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {relatedQuestions.slice(0, 2).map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRabbitHoleClick(question)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-full text-xs text-white/80 transition-colors"
            >
              <Sparkles className="h-3 w-3 text-wonderwhiz-vibrant-yellow" />
              {question}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

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
  const validType = isValidContentBlockType(type) ? type as ContentBlockType : "fact" as ContentBlockType;

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
      setShowReplyForm={setShowReplyForm}
    />
  );
};

export default BlockInteractions;
