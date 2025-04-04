
import React from 'react';
import { Heart, Bookmark, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface BlockInteractionsProps {
  blockId: string;
  liked: boolean;
  bookmarked: boolean;
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  setShowReplyForm: React.Dispatch<React.SetStateAction<boolean>>;
  blockType?: string;
}

const BlockInteractions: React.FC<BlockInteractionsProps> = ({
  blockId,
  liked,
  bookmarked,
  onToggleLike,
  onToggleBookmark,
  setShowReplyForm,
  blockType
}) => {
  // Check if this is one of the interactive blocks where replies make sense
  const allowsReplies = !['task', 'activity', 'mindfulness'].includes(blockType || '');
  
  // Fixed the implementation to properly toggle the reply form
  const handleReplyClick = () => {
    setShowReplyForm(prev => !prev);
  };

  return (
    <div className="flex items-center justify-end mt-3 gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleLike(blockId)}
        className={`text-xs text-white/70 hover:text-white hover:bg-white/10 ${liked ? 'text-pink-400 hover:text-pink-300' : ''}`}
      >
        <motion.div
          animate={liked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart className="h-4 w-4 mr-1" fill={liked ? 'currentColor' : 'none'} />
        </motion.div>
        Like
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleBookmark(blockId)}
        className={`text-xs text-white/70 hover:text-white hover:bg-white/10 ${bookmarked ? 'text-amber-400 hover:text-amber-300' : ''}`}
      >
        <motion.div
          animate={bookmarked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Bookmark className="h-4 w-4 mr-1" fill={bookmarked ? 'currentColor' : 'none'} />
        </motion.div>
        Save
      </Button>
      
      {allowsReplies && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReplyClick}
          className="text-xs text-white/70 hover:text-white hover:bg-white/10"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Reply
        </Button>
      )}
    </div>
  );
};

export default BlockInteractions;
