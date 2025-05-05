
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bookmark, Share2, VolumeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlockActionsProps {
  onBookmark?: () => void;
  onReply?: () => void;
  onShare?: () => void;
  onReadAloud?: () => void;
  bookmarked?: boolean;
  childAge?: number;
}

const BlockActions: React.FC<BlockActionsProps> = ({
  onBookmark,
  onReply,
  onShare,
  onReadAloud,
  bookmarked = false,
  childAge = 10
}) => {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="flex items-center gap-2">
      {onReply && (
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onReply}
            className="text-white/70 hover:text-wonderwhiz-blue-accent hover:bg-wonderwhiz-blue-accent/10 transition-all duration-300"
          >
            <MessageCircle className="h-4 w-4 mr-1.5" />
            <span className="text-xs">Reply</span>
          </Button>
        </motion.div>
      )}
      
      {onBookmark && (
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            className={`transition-all duration-300 ${
              bookmarked ? 'text-wonderwhiz-vibrant-yellow bg-wonderwhiz-vibrant-yellow/10' : 'text-white/70 hover:text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10'
            }`}
          >
            <Bookmark className="h-4 w-4 mr-1.5" />
            <span className="text-xs">{bookmarked ? 'Saved' : 'Save'}</span>
          </Button>
        </motion.div>
      )}
      
      {onShare && (
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="text-white/70 hover:text-wonderwhiz-green hover:bg-wonderwhiz-green/10 transition-all duration-300"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            <span className="text-xs">Share</span>
          </Button>
        </motion.div>
      )}
      
      {onReadAloud && (
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onReadAloud}
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
