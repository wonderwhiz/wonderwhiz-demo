
import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUpIcon, BookmarkIcon, MessageCircleIcon } from 'lucide-react';

interface BlockInteractionsProps {
  blockId: string;
  liked: boolean;
  bookmarked: boolean; 
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  setShowReplyForm: (show: boolean) => void;
  blockType: string;
}

const BlockInteractions: React.FC<BlockInteractionsProps> = ({
  blockId,
  liked,
  bookmarked,
  onToggleLike,
  onToggleBookmark,
  setShowReplyForm,
  blockType,
}) => {
  return (
    <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10">
      <div className="flex items-center space-x-1 sm:space-x-2">
        <motion.button 
          onClick={() => onToggleLike(blockId)} 
          className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${liked ? 'text-wonderwhiz-pink' : 'text-white/70'}`}
          aria-label={liked ? "Unlike" : "Like"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.button>
        
        <motion.button 
          onClick={() => onToggleBookmark(blockId)} 
          className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${bookmarked ? 'text-wonderwhiz-gold' : 'text-white/70'}`}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <BookmarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.button>
        
        <motion.button 
          onClick={() => setShowReplyForm(prev => !prev)} 
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/70"
          aria-label="Reply"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.button>
      </div>
      
      <div className="text-white/70 text-xs px-2 py-1 rounded-full bg-black/20">
        {blockType === 'fact' || blockType === 'funFact' ? 'Fact' : blockType.charAt(0).toUpperCase() + blockType.slice(1)}
      </div>
    </div>
  );
};

export default BlockInteractions;
