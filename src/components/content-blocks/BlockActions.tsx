
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bookmark, Share2, VolumeIcon } from 'lucide-react';

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
  bookmarked,
  childAge = 10
}) => {
  return (
    <div className="flex items-center gap-2">
      {onReply && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReply}
          className="text-white/70 hover:text-blue-400 hover:bg-white/5"
        >
          <MessageCircle className="h-4 w-4 mr-1.5" />
          <span className="text-xs">Reply</span>
        </Button>
      )}
      
      {onBookmark && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBookmark}
          className={`text-white/70 hover:text-yellow-400 hover:bg-white/5 ${
            bookmarked ? 'text-yellow-400' : ''
          }`}
        >
          <Bookmark className="h-4 w-4 mr-1.5" />
          <span className="text-xs">{bookmarked ? 'Saved' : 'Save'}</span>
        </Button>
      )}
      
      {onShare && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="text-white/70 hover:text-green-400 hover:bg-white/5"
        >
          <Share2 className="h-4 w-4 mr-1.5" />
          <span className="text-xs">Share</span>
        </Button>
      )}
      
      {onReadAloud && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReadAloud}
          className="text-white/70 hover:text-purple-400 hover:bg-white/5"
        >
          <VolumeIcon className="h-4 w-4 mr-1.5" />
          <span className="text-xs">
            {childAge && childAge <= 8 ? "Read to me!" : "Read aloud"}
          </span>
        </Button>
      )}
    </div>
  );
};

export default BlockActions;
