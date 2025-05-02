
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bookmark, BookmarkCheck, ThumbsUp, Share2, Sparkles, VolumeIcon } from 'lucide-react';
import { BlockInteractionsProps } from './interfaces';
import { ContentBlockType, isValidContentBlockType } from '@/types/curio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Enhanced version of BlockInteractions with improved visuals for 2025 design standards
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

  // Enhanced animation variants for modern micro-interactions
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 }
  };

  // Get color theme based on content type
  const getTypeColorScheme = () => {
    switch (type) {
      case 'fact': return { primary: 'wonderwhiz-cyan', hover: 'cyan-400' };
      case 'quiz': return { primary: 'wonderwhiz-bright-pink', hover: 'pink-400' };
      case 'creative': return { primary: 'wonderwhiz-green', hover: 'green-400' };
      case 'funFact': return { primary: 'wonderwhiz-vibrant-yellow', hover: 'yellow-400' };
      case 'mindfulness': return { primary: 'wonderwhiz-purple', hover: 'purple-400' };
      case 'flashcard': return { primary: 'wonderwhiz-blue-accent', hover: 'blue-400' };
      case 'task': return { primary: 'wonderwhiz-orange', hover: 'orange-400' };
      case 'news': return { primary: 'wonderwhiz-light-blue', hover: 'sky-400' };
      case 'riddle': return { primary: 'wonderwhiz-teal', hover: 'teal-400' };
      case 'activity': return { primary: 'wonderwhiz-gold', hover: 'amber-400' };
      default: return { primary: 'wonderwhiz-blue', hover: 'blue-400' };
    }
  };

  const colorScheme = getTypeColorScheme();
  const interactionColors = `hover:bg-${colorScheme.hover}/10 hover:text-${colorScheme.hover}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="border-t border-white/15 pt-3 mt-3"
    >
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLike}
              className={cn(
                getButtonStyle(),
                "text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300",
                liked && "text-wonderwhiz-bright-pink hover:text-wonderwhiz-bright-pink bg-wonderwhiz-bright-pink/10"
              )}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className={childAge <= 12 ? "" : "sr-only md:not-sr-only"}>
                {liked ? (childAge <= 8 ? "Liked!" : "Liked") : (childAge <= 8 ? "Like!" : "Like")}
              </span>
            </Button>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleBookmark}
              className={cn(
                getButtonStyle(),
                "text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300",
                bookmarked && "text-wonderwhiz-vibrant-yellow hover:text-wonderwhiz-vibrant-yellow bg-wonderwhiz-vibrant-yellow/10"
              )}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              <span className={childAge <= 12 ? "" : "sr-only md:not-sr-only"}>
                {bookmarked ? (childAge <= 8 ? "Saved!" : "Saved") : (childAge <= 8 ? "Save!" : "Save")}
              </span>
            </Button>
          </motion.div>

          {setShowReplyForm && (
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(true)}
                className={cn(
                  getButtonStyle(),
                  "text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                )}
              >
                <MessageCircle className="h-4 w-4" />
                <span className={childAge <= 12 ? "" : "sr-only md:not-sr-only"}>
                  {childAge <= 8 ? "Reply!" : "Reply"}
                </span>
              </Button>
            </motion.div>
          )}
        </div>

        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              getButtonStyle(),
              "text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
            )}
          >
            <Share2 className="h-4 w-4" />
            <span className={childAge <= 12 ? "" : "sr-only md:not-sr-only"}>
              {childAge <= 8 ? "Share!" : "Share"}
            </span>
          </Button>
        </motion.div>
      </div>

      {onRabbitHoleClick && relatedQuestions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {relatedQuestions.slice(0, 2).map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRabbitHoleClick(question)}
              className={`flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-${colorScheme.primary}/20 rounded-full text-xs text-white/80 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10 hover:border-${colorScheme.primary}/30`}
            >
              <Sparkles className={`h-3 w-3 text-${colorScheme.primary}`} />
              <span className="line-clamp-1">{question}</span>
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
