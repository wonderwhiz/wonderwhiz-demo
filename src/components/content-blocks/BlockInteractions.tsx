
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { BlockInteractionsProps } from './interfaces';

const BlockInteractions: React.FC<BlockInteractionsProps> = ({
  id,
  bookmarked,
  type,
  onToggleBookmark,
  onRabbitHoleClick,
  relatedQuestions
}) => {
  return (
    <div className="border-t border-white/10 p-2 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleBookmark}
          className={`text-sm hover:text-yellow-400 ${
            bookmarked ? 'text-yellow-400' : 'text-white/60'
          }`}
        >
          {bookmarked ? (
            <>
              <BookmarkCheck className="h-4 w-4 mr-1.5" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4 mr-1.5" />
              <span>Save</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BlockInteractions;
