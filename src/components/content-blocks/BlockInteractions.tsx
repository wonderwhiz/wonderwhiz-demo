
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, ThumbsUp, MessageCircle, Sparkles } from 'lucide-react';
import { BlockInteractionsProps } from './interfaces';

const BlockInteractions: React.FC<BlockInteractionsProps> = ({
  id,
  liked = false,
  bookmarked = false,
  type,
  onToggleLike,
  onToggleBookmark,
  setShowReplyForm,
  onRabbitHoleClick,
  relatedQuestions = []
}) => {
  const [showRelatedQuestions, setShowRelatedQuestions] = useState(false);

  return (
    <div className="border-t border-white/10 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {onToggleLike && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLike}
              className={`text-sm hover:text-pink-400 ${
                liked ? 'text-pink-400' : 'text-white/60'
              }`}
            >
              <ThumbsUp className="h-4 w-4 mr-1.5" />
              <span>{liked ? 'Liked' : 'Like'}</span>
            </Button>
          )}

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

          {setShowReplyForm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(true)}
              className="text-sm hover:text-blue-400 text-white/60"
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <span>Reply</span>
            </Button>
          )}
        </div>

        {relatedQuestions && relatedQuestions.length > 0 && (
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRelatedQuestions(!showRelatedQuestions)}
              className="text-sm hover:text-wonderwhiz-vibrant-yellow text-white/60"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>I wonder...</span>
            </Button>
          </div>
        )}
      </div>

      {showRelatedQuestions && relatedQuestions && relatedQuestions.length > 0 && (
        <div className="mt-3 bg-white/5 rounded-lg p-3">
          <h4 className="text-white/80 text-sm mb-2">Related questions:</h4>
          <div className="space-y-2">
            {relatedQuestions.map((question, index) => (
              <div
                key={index}
                onClick={() => onRabbitHoleClick && onRabbitHoleClick(question)}
                className="bg-white/10 hover:bg-white/15 rounded p-2 text-white/90 text-sm cursor-pointer transition-colors"
              >
                {question}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockInteractions;
