
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThumbsUp, Bookmark, Volume2, ArrowRight } from 'lucide-react';
import { ContentBlockType } from '@/types/curio';
import { Dispatch, SetStateAction } from 'react';

export interface BlockInteractionsProps {
  id: string;
  type: ContentBlockType;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onReadAloud?: () => void;
  liked: boolean;
  bookmarked: boolean;
  relatedQuestions?: string[];
  onRabbitHoleClick?: (question: string) => void;
  childAge?: number;
  setShowReplyForm?: Dispatch<SetStateAction<boolean>>;
  block?: any; // Adding block prop
}

const BlockInteractions: React.FC<BlockInteractionsProps> = ({
  id,
  type,
  onToggleLike,
  onToggleBookmark,
  onReadAloud,
  liked,
  bookmarked,
  relatedQuestions = [],
  onRabbitHoleClick,
  childAge = 10,
  setShowReplyForm
}) => {
  const buttonSize = childAge <= 7 ? 'sm' : 'default';
  const iconSize = childAge <= 7 ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2">
        <Button
          size={buttonSize}
          variant="ghost"
          className={cn(
            "text-white/70 hover:text-white hover:bg-white/10",
            liked && "text-pink-400 hover:text-pink-300"
          )}
          onClick={onToggleLike}
        >
          <ThumbsUp className={cn(iconSize, "mr-1")} />
          {childAge <= 8 && "Like"}
        </Button>
        
        <Button
          size={buttonSize}
          variant="ghost"
          className={cn(
            "text-white/70 hover:text-white hover:bg-white/10",
            bookmarked && "text-blue-400 hover:text-blue-300"
          )}
          onClick={onToggleBookmark}
        >
          <Bookmark className={cn(iconSize, "mr-1")} />
          {childAge <= 8 && "Save"}
        </Button>
        
        {onReadAloud && (
          <Button
            size={buttonSize}
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={onReadAloud}
          >
            <Volume2 className={cn(iconSize, "mr-1")} />
            {childAge <= 8 && "Read"}
          </Button>
        )}
      </div>
      
      {relatedQuestions && relatedQuestions.length > 0 && onRabbitHoleClick && (
        <div className="mt-3 space-y-2">
          {childAge >= 9 && (
            <p className="text-xs text-white/50">Want to explore further?</p>
          )}
          <div className="flex flex-col space-y-1.5">
            {relatedQuestions.slice(0, 2).map((question, index) => (
              <Button
                key={`${id}-rabbithole-${index}`}
                size="sm"
                variant="ghost"
                className="justify-start text-xs text-left text-indigo-300 hover:text-indigo-200 hover:bg-indigo-900/30 font-normal"
                onClick={() => onRabbitHoleClick(question)}
              >
                <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockInteractions;
