
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurioCardProps {
  title: string;
  content: string;
  type?: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: () => void;
  onReadMore?: () => void;
}

const CurioCard: React.FC<CurioCardProps> = ({
  title,
  content,
  type = 'fact',
  onLike,
  onBookmark,
  onReply,
  onReadMore
}) => {
  // Define card styling based on type
  const getCardStyle = () => {
    switch (type) {
      case 'quiz':
        return 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-vibrant-yellow/20';
      case 'fact':
        return 'from-wonderwhiz-cyan/20 to-wonderwhiz-vibrant-yellow/20';
      case 'creative':
        return 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-cyan/20';
      default:
        return 'from-wonderwhiz-purple/20 to-wonderwhiz-cyan/20';
    }
  };
  
  const cardStyle = getCardStyle();

  return (
    <motion.div
      className={`w-full rounded-2xl bg-gradient-to-br ${cardStyle} backdrop-blur-sm border border-white/10 overflow-hidden shadow-glow-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm mb-4">{content}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onLike}
              className="flex items-center text-white/60 hover:text-wonderwhiz-bright-pink"
            >
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">Like</span>
            </button>
            
            <button
              onClick={onBookmark}
              className="flex items-center text-white/60 hover:text-wonderwhiz-vibrant-yellow"
            >
              <Bookmark className="h-4 w-4 mr-1" />
              <span className="text-xs">Save</span>
            </button>
            
            <button
              onClick={onReply}
              className="flex items-center text-white/60 hover:text-wonderwhiz-cyan"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Reply</span>
            </button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onReadMore}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <span className="mr-1 text-sm">More</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CurioCard;
