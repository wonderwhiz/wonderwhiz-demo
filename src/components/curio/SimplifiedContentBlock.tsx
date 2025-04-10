
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, MessageCircle, Share2, ThumbsUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AgeAdaptiveBlock from './AgeAdaptiveBlock';

interface SimplifiedContentBlockProps {
  block: any;
  ageGroup: '5-7' | '8-11' | '12-16';
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onShare?: () => void;
}

// Extract the title based on block type
const getBlockTitle = (block: any) => {
  if (!block) return '';
  
  switch (block.type) {
    case 'fact':
      return block.content?.title || 'Interesting Fact';
    case 'funFact':
      return 'Did You Know?';
    case 'quiz':
      return block.content?.question || 'Quiz Question';
    case 'creative':
      return block.content?.prompt || 'Creative Challenge';
    case 'activity':
      return block.content?.title || 'Fun Activity';
    case 'mindfulness':
      return block.content?.title || 'Mindfulness Moment';
    case 'flashcard':
      return block.content?.front || 'Flashcard';
    case 'news':
      return block.content?.headline || 'News Update';
    default:
      return '';
  }
};

// Render block content based on type
const renderBlockContent = (block: any, ageGroup: '5-7' | '8-11' | '12-16') => {
  if (!block || !block.content) return null;
  
  const textStyles = ageGroup === '5-7' 
    ? 'text-lg leading-relaxed' 
    : ageGroup === '8-11'
      ? 'text-base leading-relaxed' 
      : 'text-sm leading-relaxed';
  
  switch (block.type) {
    case 'fact':
    case 'funFact':
      return <p className={textStyles}>{block.content.fact || block.content.text}</p>;
      
    case 'quiz':
      return (
        <div className="space-y-4">
          <p className={textStyles}>{block.content.question}</p>
          
          <div className="mt-2 space-y-2">
            {block.content.options?.map((option: string, index: number) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-3 rounded-lg ${
                  ageGroup === '5-7' 
                    ? 'bg-white/10 text-lg border-2 border-white/5'
                    : 'bg-white/5 hover:bg-white/10 text-base'
                } transition-colors`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      );
      
    case 'creative':
      return (
        <div>
          <p className={textStyles}>{block.content.prompt || block.content.description}</p>
          
          {ageGroup === '5-7' && (
            <div className="mt-4 rounded-xl bg-gradient-to-r from-pink-500/20 to-yellow-500/20 p-4 border border-white/10">
              <p className="text-white/80 text-center">Tap to start creating!</p>
            </div>
          )}
        </div>
      );
      
    case 'activity':
      return (
        <div>
          <p className={textStyles}>{block.content.description}</p>
          
          {block.content.steps && (
            <ol className="mt-3 space-y-2 list-decimal list-inside">
              {block.content.steps.map((step: string, index: number) => (
                <li key={index} className={`${textStyles} text-white/80`}>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
      );
      
    case 'mindfulness':
      return <p className={textStyles}>{block.content.instruction || block.content.text}</p>;
      
    case 'flashcard':
      return (
        <div className="relative">
          <div className="bg-white/5 rounded-lg p-4">
            <p className={textStyles}>{block.content.front}</p>
          </div>
          
          <div className="mt-2 bg-white/5 rounded-lg p-4">
            <p className={`${textStyles} text-white/70`}>{block.content.back}</p>
          </div>
        </div>
      );
      
    case 'news':
      return (
        <div>
          <p className={`${textStyles} font-medium`}>{block.content.headline}</p>
          <p className={`${textStyles} mt-2`}>{block.content.body}</p>
        </div>
      );
      
    default:
      return <p className={textStyles}>{JSON.stringify(block.content)}</p>;
  }
};

const SimplifiedContentBlock: React.FC<SimplifiedContentBlockProps> = ({
  block,
  ageGroup,
  onLike,
  onBookmark,
  onReply,
  onShare
}) => {
  const [showInteractions, setShowInteractions] = useState(false);
  
  const blockTitle = getBlockTitle(block);
  const blockContent = renderBlockContent(block, ageGroup);
  
  const handleInteraction = () => {
    setShowInteractions(!showInteractions);
  };
  
  return (
    <AgeAdaptiveBlock
      content={blockContent}
      title={blockTitle}
      type={block.type}
      ageGroup={ageGroup}
      specialist={block.specialist_id}
      onInteract={handleInteraction}
      interactionLabel={ageGroup === '5-7' ? 'I like this!' : 'Engage'}
      className="mb-10"
    >
      {showInteractions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-3 rounded-lg bg-white/5"
        >
          <div className="flex items-center gap-2 justify-around">
            {onLike && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                className="text-white/70 hover:text-pink-400 hover:bg-white/5"
              >
                <Heart className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Like</span>
              </Button>
            )}
            
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBookmark}
                className="text-white/70 hover:text-yellow-400 hover:bg-white/5"
              >
                <Bookmark className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Save</span>
              </Button>
            )}
            
            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply('I love this!')}
                className="text-white/70 hover:text-blue-400 hover:bg-white/5"
              >
                <MessageCircle className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Comment</span>
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
          </div>
        </motion.div>
      )}
    </AgeAdaptiveBlock>
  );
};

export default SimplifiedContentBlock;
