
import React, { useState } from 'react';
import { Heart, Bookmark, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

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
  
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  
  // Handle like with micro-celebration
  const handleLike = () => {
    onToggleLike(blockId);
    
    if (!liked) {
      setShowRewardAnimation(true);
      setTimeout(() => setShowRewardAnimation(false), 1500);
      
      if (Math.random() > 0.7) {
        // Sometimes give a spark for liking content
        toast.success('You earned a spark for appreciating this content!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      }
    }
  };
  
  // Fixed the implementation to properly toggle the reply form
  const handleReplyClick = () => {
    setShowReplyForm(prev => !prev);
  };
  
  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this WonderWhiz card!',
        text: 'I found something amazing on WonderWhiz!',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support share API
      toast.success('Link copied to clipboard!', {
        icon: '🔗',
        position: 'bottom-right',
        duration: 2000
      });
      
      // Copy to clipboard
      const dummy = document.createElement('textarea');
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showRewardAnimation && (
          <motion.div 
            className="absolute -top-16 right-0 left-0 flex justify-center"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-wonderwhiz-gold/20 backdrop-blur-sm text-wonderwhiz-gold px-3 py-1.5 rounded-full text-sm flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>Great choice!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-center justify-end mt-3 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`text-xs text-white/70 hover:text-white hover:bg-white/10 ${liked ? 'text-pink-400 hover:text-pink-300' : ''}`}
        >
          <motion.div
            animate={liked ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
            </motion.div>
            Reply
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-xs text-white/70 hover:text-white hover:bg-white/10"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="h-4 w-4 mr-1" />
          </motion.div>
          Share
        </Button>
      </div>
    </div>
  );
};

export default BlockInteractions;
