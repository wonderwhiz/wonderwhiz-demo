
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  Bookmark, 
  MessageSquare, 
  Share2, 
  Send, 
  X,
  Rocket
} from 'lucide-react';

interface BlockInteractionsProps {
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onRabbitHoleClick?: (question: string) => void;
  relatedQuestions?: string[];
}

const BlockInteractions: React.FC<BlockInteractionsProps> = ({
  onLike,
  onBookmark,
  onReply,
  onRabbitHoleClick,
  relatedQuestions = []
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [reply, setReply] = useState('');
  const [showRelatedQuestions, setShowRelatedQuestions] = useState(false);
  
  const handleReplySubmit = () => {
    if (reply.trim() && onReply) {
      onReply(reply);
      setReply('');
      setShowReplyBox(false);
    }
  };
  
  return (
    <div className="border-t border-white/10">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-1">
          {onLike && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLike}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">Like</span>
            </Button>
          )}
          
          {onBookmark && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBookmark}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Bookmark className="h-4 w-4 mr-1" />
              <span className="text-xs">Save</span>
            </Button>
          )}
          
          {onReply && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
          )}
        </div>
        
        {relatedQuestions && relatedQuestions.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowRelatedQuestions(!showRelatedQuestions)}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <Rocket className="h-4 w-4 mr-1" />
            <span className="text-xs">Explore</span>
          </Button>
        )}
      </div>
      
      {showReplyBox && (
        <div className="px-4 py-2 border-t border-white/10">
          <Textarea 
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your thoughts..."
            className="mb-2 bg-white/5 border-white/10 text-white"
            rows={2}
          />
          <div className="flex justify-end space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReplyBox(false)}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4 mr-1" />
              <span className="text-xs">Cancel</span>
            </Button>
            <Button 
              size="sm" 
              onClick={handleReplySubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={!reply.trim()}
            >
              <Send className="h-4 w-4 mr-1" />
              <span className="text-xs">Send</span>
            </Button>
          </div>
        </div>
      )}
      
      {showRelatedQuestions && relatedQuestions.length > 0 && (
        <div className="px-4 py-2 border-t border-white/10 bg-indigo-950/30">
          <h4 className="text-sm font-medium text-white/80 mb-2">Related Questions</h4>
          <div className="space-y-2">
            {relatedQuestions.map((question, index) => (
              <Button 
                key={index}
                variant="outline" 
                size="sm" 
                className="bg-white/5 border-white/10 text-white w-full justify-start text-left"
                onClick={() => onRabbitHoleClick?.(question)}
              >
                <Rocket className="h-3 w-3 mr-2 text-indigo-400" />
                <span className="text-xs truncate">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockInteractions;
