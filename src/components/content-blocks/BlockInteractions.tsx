
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, MessageCircle } from 'lucide-react';

export interface BlockInteractionsProps {
  id: string;
  liked: boolean;
  bookmarked: boolean;
  type: string;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  setShowReplyForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const BlockInteractions: React.FC<BlockInteractionsProps> = ({
  id,
  liked,
  bookmarked,
  type,
  onToggleLike,
  onToggleBookmark,
  setShowReplyForm
}) => {
  return (
    <div className="border-t border-white/10 p-2 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLike}
          className={`text-sm hover:text-pink-400 ${
            liked ? 'text-pink-400' : 'text-white/60'
          }`}
        >
          <Heart className="h-4 w-4 mr-1.5" />
          <span>Like</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleBookmark}
          className={`text-sm hover:text-yellow-400 ${
            bookmarked ? 'text-yellow-400' : 'text-white/60'
          }`}
        >
          <Bookmark className="h-4 w-4 mr-1.5" />
          <span>Save</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplyForm(prev => !prev)}
          className="text-white/60 text-sm hover:text-blue-400"
        >
          <MessageCircle className="h-4 w-4 mr-1.5" />
          <span>Reply</span>
        </Button>
      </div>
    </div>
  );
};

export default BlockInteractions;
