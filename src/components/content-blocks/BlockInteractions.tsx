
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Bookmark, MessageSquare, Sparkles } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface BlockInteractionsProps {
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onRabbitHoleClick?: (question: string) => void;
  relatedQuestions?: string[];
  blockId?: any;
  liked?: any;
  bookmarked?: any;
  onToggleLike?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  setShowReplyForm?: Dispatch<SetStateAction<boolean>>;
  blockType?: any;
}

const BlockInteractions: React.FC<BlockInteractionsProps> = ({
  onLike,
  onBookmark,
  onReply,
  onRabbitHoleClick,
  relatedQuestions = [],
  blockId,
  liked,
  bookmarked,
  onToggleLike,
  onToggleBookmark,
  setShowReplyForm,
  blockType
}) => {
  const [showQuestions, setShowQuestions] = useState(false);
  
  // Handle both patterns of like/bookmark to ensure compatibility
  const handleLike = () => {
    if (onToggleLike && blockId) {
      onToggleLike(blockId);
    } else if (onLike) {
      onLike();
    }
  };
  
  const handleBookmark = () => {
    if (onToggleBookmark && blockId) {
      onToggleBookmark(blockId);
    } else if (onBookmark) {
      onBookmark();
    }
  };
  
  const handleReplyClick = () => {
    if (setShowReplyForm) {
      setShowReplyForm(prev => !prev);
    }
  };

  return (
    <div className="p-3 border-t border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleLike}
            className={`text-white/60 hover:text-white hover:bg-white/10 ${liked ? 'bg-white/10 text-white' : ''}`}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-xs">Like</span>
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={handleBookmark}
            className={`text-white/60 hover:text-white hover:bg-white/10 ${bookmarked ? 'bg-white/10 text-white' : ''}`}
          >
            <Bookmark className="h-4 w-4 mr-1" />
            <span className="text-xs">Save</span>
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleReplyClick}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-xs">Reply</span>
          </Button>
        </div>
        
        {relatedQuestions && relatedQuestions.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowQuestions(!showQuestions)}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            <span className="text-xs">Wonder More</span>
          </Button>
        )}
      </div>
      
      {showQuestions && relatedQuestions && relatedQuestions.length > 0 && (
        <div className="mt-2 bg-white/5 rounded-md p-2">
          <p className="text-xs font-medium mb-1 text-white/70">Curious about:</p>
          <div className="space-y-1">
            {relatedQuestions.map((question, index) => (
              <Button
                key={index}
                size="sm"
                variant="ghost"
                className="w-full justify-start text-left text-white/80 hover:text-white hover:bg-white/10 p-1"
                onClick={() => onRabbitHoleClick && onRabbitHoleClick(question)}
              >
                <span className="text-xs">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockInteractions;
