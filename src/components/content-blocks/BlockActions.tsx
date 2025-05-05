
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bookmark, BookmarkCheck, Share2, VolumeIcon, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface BlockActionsProps {
  onBookmark?: () => void;
  onReply?: () => void;
  onShare?: () => void;
  onReadAloud?: () => void;
  onLike?: () => void;
  bookmarked?: boolean;
  liked?: boolean;
  childAge?: number;
}

const BlockActions: React.FC<BlockActionsProps> = ({
  onBookmark,
  onReply,
  onShare,
  onReadAloud,
  onLike,
  bookmarked = false,
  liked = false,
  childAge = 10
}) => {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const handleBookmarkClick = () => {
    if (onBookmark) {
      onBookmark();
    } else {
      toast.success(bookmarked ? 'Content removed from saved items' : 'Content saved!', {
        icon: bookmarked ? '✓' : '🔖',
        position: 'bottom-right',
        duration: 2000
      });
    }
  };

  const handleLikeClick = () => {
    if (onLike) {
      onLike();
    } else {
      toast.success('Content liked!', {
        icon: '👍',
        position: 'bottom-right',
        duration: 2000
      });
    }
  };

  const handleReplyClick = () => {
    if (onReply) {
      onReply();
    } else {
      toast.info('Reply feature coming soon!', {
        position: 'bottom-right',
        duration: 2000
      });
    }
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else {
      toast.info('Share feature coming soon!', {
        position: 'bottom-right',
        duration: 2000
      });
    }
  };

  const handleReadAloudClick = () => {
    if (onReadAloud) {
      onReadAloud();
    } else {
      toast.info('Read aloud feature coming soon!', {
        icon: '🔊',
        position: 'bottom-right',
        duration: 2000
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {onLike !== undefined && (
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
            className={`${
              liked 
                ? "text-wonderwhiz-bright-pink bg-wonderwhiz-bright-pink/10" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            } transition-all duration-300`}
          >
            <ThumbsUp className="h-4 w-4 mr-1.5" />
            <span className="text-xs">{liked ? "Liked" : "Like"}</span>
          </Button>
        </motion.div>
      )}
      
      {(onBookmark !== undefined) && (
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
            className={`transition-all duration-300 ${
              bookmarked 
                ? "text-wonderwhiz-vibrant-yellow bg-wonderwhiz-vibrant-yellow/10" 
                : "text-white/70 hover:text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10"
            }`}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 mr-1.5" />
            ) : (
              <Bookmark className="h-4 w-4 mr-1.5" />
            )}
            <span className="text-xs">{bookmarked ? 'Saved' : 'Save'}</span>
          </Button>
        </motion.div>
      )}
      
      {onReply !== undefined && (
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
            className="text-white/70 hover:text-wonderwhiz-blue-accent hover:bg-wonderwhiz-blue-accent/10 transition-all duration-300"
          >
            <MessageCircle className="h-4 w-4 mr-1.5" />
            <span className="text-xs">Reply</span>
          </Button>
        </motion.div>
      )}
      
      {onShare !== undefined && (
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareClick}
            className="text-white/70 hover:text-wonderwhiz-green hover:bg-wonderwhiz-green/10 transition-all duration-300"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            <span className="text-xs">Share</span>
          </Button>
        </motion.div>
      )}
      
      {onReadAloud !== undefined && (
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReadAloudClick}
            className="text-white/70 hover:text-wonderwhiz-purple hover:bg-wonderwhiz-purple/10 transition-all duration-300"
          >
            <VolumeIcon className="h-4 w-4 mr-1.5" />
            <span className="text-xs">
              {childAge && childAge <= 8 ? "Read to me!" : "Read aloud"}
            </span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default BlockActions;
