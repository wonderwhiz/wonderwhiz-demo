import React from 'react';
import { Heart, Bookmark, MessageCircle, Share, VolumeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AgeAdaptiveInterface from '@/components/curio/AgeAdaptiveInterface';

interface ContentBlockProps {
  block: any;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onCreativeUpload?: () => void;
  onTaskComplete?: () => void;
  onActivityComplete?: () => void;
  onMindfulnessComplete?: () => void;
  onNewsRead?: () => void;
  onQuizCorrect?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  onReadAloud?: (text: string) => void;
  childAge?: number;
  profileId?: string;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  onLike,
  onBookmark,
  onReply,
  onCreativeUpload,
  onTaskComplete,
  onActivityComplete,
  onMindfulnessComplete,
  onNewsRead,
  onQuizCorrect,
  onRabbitHoleClick,
  onReadAloud,
  childAge = 10,
  profileId
}) => {
  const [showReplyInput, setShowReplyInput] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');
  
  const handleSendReply = () => {
    if (replyText.trim() && onReply) {
      onReply(replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const getBlockContent = () => {
    if (!block.content) return '';
    
    if (block.type === 'fact' || block.type === 'funFact') {
      return block.content.fact || block.content.text || '';
    } else if (block.type === 'quiz') {
      return block.content.question || '';
    } else if (block.type === 'creative') {
      return block.content.prompt || '';
    } else if (block.content.description) {
      return block.content.description;
    } else if (typeof block.content === 'string') {
      return block.content;
    }
    
    return '';
  };
  
  const getBlockTitle = () => {
    if (block.type === 'fact') return 'Fascinating Fact';
    if (block.type === 'funFact') return 'Fun Fact';
    if (block.type === 'quiz') return 'Quiz Question';
    if (block.type === 'creative') return 'Creative Challenge';
    if (block.type === 'activity') return 'Activity';
    if (block.type === 'mindfulness') return 'Reflection';
    
    return block.content?.title || 'Discovery';
  };
  
  const getBlockType = () => {
    if (block.type === 'quiz') return 'quiz';
    if (block.type === 'creative') return 'creative';
    if (block.type === 'fact' || block.type === 'funFact') return 'fact';
    return 'question';
  };
  
  const handleReadAloud = () => {
    if (onReadAloud) {
      const content = getBlockContent();
      if (content) {
        onReadAloud(content);
      }
    }
  };
  
  const renderContent = () => {
    const content = getBlockContent();
    
    if (childAge < 8) {
      return (
        <div>
          <p>{content}</p>
          
          {block.type === 'quiz' && block.content?.options && (
            <div className="mt-4 space-y-2">
              {block.content.options.map((option: string, idx: number) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center"
                  onClick={() => idx === block.content.correctIndex && onQuizCorrect?.()}
                >
                  <div className="w-8 h-8 rounded-full bg-wonderwhiz-purple flex items-center justify-center mr-3">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div>
        <p>{content}</p>
        
        {block.type === 'quiz' && block.content?.options && (
          <div className="mt-4 space-y-2">
            {block.content.options.map((option: string, idx: number) => (
              <button
                key={idx}
                className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => idx === block.content.correctIndex && onQuizCorrect?.()}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const getSuggestedQuestions = () => {
    if (block.content?.rabbitHoles && block.content.rabbitHoles.length > 0) {
      return block.content.rabbitHoles;
    }
    
    const content = getBlockContent().toLowerCase();
    if (content) {
      return [
        `Why is this important?`,
        `Tell me more about this`,
        `What's another interesting fact about this?`
      ];
    }
    
    return [];
  };
  
  return (
    <AgeAdaptiveInterface
      childAge={childAge}
      title={getBlockTitle()}
      content={renderContent()}
      type={getBlockType()}
      onPrimaryAction={handleReadAloud}
      primaryActionText="Read Aloud"
      className="mb-6"
    >
      <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onLike}
            className={`flex items-center text-white/60 hover:text-white/90 ${
              block.liked ? 'text-wonderwhiz-bright-pink' : ''
            }`}
          >
            <Heart className="h-4 w-4 mr-1" fill={block.liked ? 'currentColor' : 'none'} />
            <span className="text-xs">Like</span>
          </button>
          
          <button
            onClick={onBookmark}
            className={`flex items-center text-white/60 hover:text-white/90 ${
              block.bookmarked ? 'text-wonderwhiz-gold' : ''
            }`}
          >
            <Bookmark className="h-4 w-4 mr-1" fill={block.bookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs">Save</span>
          </button>
          
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="flex items-center text-white/60 hover:text-white/90"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Discuss</span>
          </button>
          
          <button
            onClick={handleReadAloud}
            className="flex items-center text-white/60 hover:text-white/90"
          >
            <VolumeIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">{childAge < 8 ? "Hear It" : "Listen"}</span>
          </button>
        </div>
      </div>
      
      {showReplyInput && (
        <div className="mt-3 bg-white/5 p-3 rounded-lg">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/50 text-sm"
            rows={2}
          />
          
          <div className="flex justify-end mt-2">
            <Button variant="outline" size="sm" className="mr-2" onClick={() => setShowReplyInput(false)}>
              Cancel
            </Button>
            
            <Button size="sm" onClick={handleSendReply} disabled={!replyText.trim()}>
              Send
            </Button>
          </div>
        </div>
      )}
      
      {onRabbitHoleClick && getSuggestedQuestions().length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-white/70 mb-1">Follow-up Questions:</p>
          
          <div className="flex flex-wrap gap-2">
            {getSuggestedQuestions().slice(0, 3).map((question, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="bg-white/5 hover:bg-white/10 text-white/80 border-white/10"
                onClick={() => onRabbitHoleClick(question)}
              >
                <span className="truncate">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </AgeAdaptiveInterface>
  );
};

export default ContentBlock;
