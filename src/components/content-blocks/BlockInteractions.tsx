
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bookmark, BookmarkCheck, ThumbsUp, Share2, Sparkles, VolumeIcon } from 'lucide-react';
import { BlockInteractionsProps } from './interfaces';
import { ContentBlockType, isValidContentBlockType } from '@/types/curio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

  // Get predefined color classes based on content type
  const getTypeColorClasses = () => {
    switch (type) {
      case 'fact': 
        return { 
          primary: 'text-wonderwhiz-cyan bg-wonderwhiz-cyan/10 hover:bg-wonderwhiz-cyan/20',
          hover: 'hover:text-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/10',
          border: 'border-wonderwhiz-cyan/30 hover:border-wonderwhiz-cyan/50'
        };
      case 'quiz': 
        return { 
          primary: 'text-wonderwhiz-bright-pink bg-wonderwhiz-bright-pink/10 hover:bg-wonderwhiz-bright-pink/20', 
          hover: 'hover:text-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/10',
          border: 'border-wonderwhiz-bright-pink/30 hover:border-wonderwhiz-bright-pink/50'
        };
      case 'creative': 
        return { 
          primary: 'text-wonderwhiz-green bg-wonderwhiz-green/10 hover:bg-wonderwhiz-green/20', 
          hover: 'hover:text-wonderwhiz-green hover:bg-wonderwhiz-green/10',
          border: 'border-wonderwhiz-green/30 hover:border-wonderwhiz-green/50'
        };
      case 'funFact': 
        return { 
          primary: 'text-wonderwhiz-vibrant-yellow bg-wonderwhiz-vibrant-yellow/10 hover:bg-wonderwhiz-vibrant-yellow/20', 
          hover: 'hover:text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10',
          border: 'border-wonderwhiz-vibrant-yellow/30 hover:border-wonderwhiz-vibrant-yellow/50'
        };
      case 'mindfulness': 
        return { 
          primary: 'text-wonderwhiz-purple bg-wonderwhiz-purple/10 hover:bg-wonderwhiz-purple/20', 
          hover: 'hover:text-wonderwhiz-purple hover:bg-wonderwhiz-purple/10',
          border: 'border-wonderwhiz-purple/30 hover:border-wonderwhiz-purple/50'
        };
      case 'flashcard': 
        return { 
          primary: 'text-wonderwhiz-blue-accent bg-wonderwhiz-blue-accent/10 hover:bg-wonderwhiz-blue-accent/20', 
          hover: 'hover:text-wonderwhiz-blue-accent hover:bg-wonderwhiz-blue-accent/10',
          border: 'border-wonderwhiz-blue-accent/30 hover:border-wonderwhiz-blue-accent/50'
        };
      case 'task': 
        return { 
          primary: 'text-wonderwhiz-orange bg-wonderwhiz-orange/10 hover:bg-wonderwhiz-orange/20', 
          hover: 'hover:text-wonderwhiz-orange hover:bg-wonderwhiz-orange/10',
          border: 'border-wonderwhiz-orange/30 hover:border-wonderwhiz-orange/50'
        };
      case 'news': 
        return { 
          primary: 'text-wonderwhiz-cyan bg-wonderwhiz-cyan/10 hover:bg-wonderwhiz-cyan/20', 
          hover: 'hover:text-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/10',
          border: 'border-wonderwhiz-cyan/30 hover:border-wonderwhiz-cyan/50'
        };
      case 'riddle': 
        return { 
          primary: 'text-wonderwhiz-green bg-wonderwhiz-green/10 hover:bg-wonderwhiz-green/20', 
          hover: 'hover:text-wonderwhiz-green hover:bg-wonderwhiz-green/10',
          border: 'border-wonderwhiz-green/30 hover:border-wonderwhiz-green/50'
        };
      case 'activity': 
        return { 
          primary: 'text-wonderwhiz-vibrant-yellow bg-wonderwhiz-vibrant-yellow/10 hover:bg-wonderwhiz-vibrant-yellow/20', 
          hover: 'hover:text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10',
          border: 'border-wonderwhiz-vibrant-yellow/30 hover:border-wonderwhiz-vibrant-yellow/50'
        };
      default: 
        return { 
          primary: 'text-wonderwhiz-blue-accent bg-wonderwhiz-blue-accent/10 hover:bg-wonderwhiz-blue-accent/20', 
          hover: 'hover:text-wonderwhiz-blue-accent hover:bg-wonderwhiz-blue-accent/10',
          border: 'border-wonderwhiz-blue-accent/30 hover:border-wonderwhiz-blue-accent/50'
        };
    }
  };

  const colorClasses = getTypeColorClasses();

  const handleRabbitHoleClick = (question: string) => {
    if (onRabbitHoleClick) {
      onRabbitHoleClick(question);
    } else {
      toast.info(`Exploring "${question}"...`, {
        duration: 2000
      });
    }
  };

  const handleReplyClick = () => {
    if (setShowReplyForm) {
      setShowReplyForm(true);
    } else if (onReply) {
      onReply("");
    } else {
      toast.info('Reply feature coming soon!', {
        duration: 2000
      });
    }
  };

  const handleLikeClick = () => {
    if (onToggleLike) {
      onToggleLike();
    } else {
      toast.success(liked ? 'Content unliked' : 'Content liked!', {
        icon: '👍',
        duration: 2000
      });
    }
  };

  const handleBookmarkClick = () => {
    if (onToggleBookmark) {
      onToggleBookmark();
    } else {
      toast.success(bookmarked ? 'Removed from saved items' : 'Content saved!', {
        icon: '🔖',
        duration: 2000
      });
    }
  };

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
              onClick={handleLikeClick}
              className={cn(
                getButtonStyle(),
                liked ? "text-wonderwhiz-bright-pink bg-wonderwhiz-bright-pink/10" : "text-white/70 hover:text-white hover:bg-white/10",
                "transition-all duration-300"
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
              onClick={handleBookmarkClick}
              className={cn(
                getButtonStyle(),
                bookmarked ? "text-wonderwhiz-vibrant-yellow bg-wonderwhiz-vibrant-yellow/10" : "text-white/70 hover:text-white hover:bg-white/10",
                "transition-all duration-300"
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

          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyClick}
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
              onClick={() => handleRabbitHoleClick(question)}
              className={`flex items-center gap-1.5 px-3 py-2 bg-white/10 rounded-full text-xs text-white/80 
                transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10 
                ${colorClasses.hover} ${colorClasses.border}`}
            >
              <Sparkles className="h-3 w-3 text-wonderwhiz-vibrant-yellow" />
              <span className="line-clamp-1">{question}</span>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// This component wraps the EnhancedBlockInteractions component for backward compatibility
const BlockInteractions: React.FC<BlockInteractionsProps> = (props) => {
  // Ensure type is a valid ContentBlockType
  const validType = isValidContentBlockType(props.type) ? props.type as ContentBlockType : "fact" as ContentBlockType;

  return (
    <EnhancedBlockInteractions
      {...props}
      type={validType}
    />
  );
};

export default BlockInteractions;
