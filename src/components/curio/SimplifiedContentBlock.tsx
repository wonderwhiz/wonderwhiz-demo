import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bookmark, Share2, ThumbsUp, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AgeAdaptiveBlock from './AgeAdaptiveBlock';
import { toast } from 'sonner';
import BlockReplies from '@/components/content-blocks/BlockReplies';

interface SimplifiedContentBlockProps {
  block: any;
  ageGroup: '5-7' | '8-11' | '12-16';
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onShare?: () => void;
  onLike?: () => void;
  onReadAloud?: () => void;
  liked?: boolean;
  bookmarked?: boolean;
}

const getSpecialistGradient = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return 'from-blue-600/40 via-indigo-600/20 to-transparent';
    case 'spark':
      return 'from-amber-500/40 via-orange-500/20 to-transparent';
    case 'prism':
      return 'from-indigo-600/40 via-purple-600/20 to-transparent';
    case 'pixel':
      return 'from-cyan-500/40 via-blue-500/20 to-transparent';
    case 'atlas':
      return 'from-amber-700/40 via-yellow-600/20 to-transparent';
    case 'lotus':
      return 'from-emerald-500/40 via-green-500/20 to-transparent';
    default:
      return 'from-wonderwhiz-deep-purple/40 via-wonderwhiz-light-purple/20 to-transparent';
  }
};

const getSpecialistAccent = (specialistId: string) => {
  switch (specialistId) {
    case 'nova': return 'border-blue-600/30';
    case 'spark': return 'border-orange-500/30';
    case 'prism': return 'border-purple-600/30';
    case 'pixel': return 'border-cyan-500/30';
    case 'atlas': return 'border-amber-700/30';
    case 'lotus': return 'border-emerald-500/30';
    default: return 'border-wonderwhiz-deep-purple/30';
  }
};

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
  onBookmark,
  onReply,
  onShare,
  onLike,
  onReadAloud,
  liked = false,
  bookmarked = false
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  
  const blockTitle = getBlockTitle(block);
  const blockContent = renderBlockContent(block, ageGroup);
  const specialistId = block.specialist_id || 'whizzy';
  
  const handleSendReply = (message: string) => {
    if (onReply) {
      onReply(message);
      // Add optimistic update for the reply
      const newReply = {
        id: Date.now().toString(),
        block_id: block.id,
        content: message,
        from_user: true,
        created_at: new Date().toISOString()
      };
      setReplies([...replies, newReply]);
      toast.success('Reply sent!');
    }
  };
  
  // Get the appropriate glow effect based on block type
  const getBlockGlow = () => {
    switch (block.type) {
      case 'fact': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(0,226,255,0.5)';
      case 'funFact': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(255,213,79,0.5)';
      case 'quiz': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(255,91,163,0.5)';
      case 'creative': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(0,214,143,0.5)';
      case 'mindfulness': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(126,48,225,0.5)';
      case 'flashcard': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(79,174,255,0.5)';
      case 'task': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(255,150,79,0.5)';
      case 'news': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(79,217,255,0.5)';
      case 'riddle': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(79,255,195,0.5)';
      case 'activity': return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(255,213,79,0.5)';
      default: return '0 8px 28px -2px rgba(0,0,0,0.4), 0 0 15px -3px rgba(74,111,255,0.5)';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-8 rounded-xl overflow-hidden backdrop-blur-lg bg-gradient-to-b ${getSpecialistGradient(specialistId)} border ${getSpecialistAccent(specialistId)}`}
      style={{ 
        boxShadow: getBlockGlow(),
        background: 'linear-gradient(to bottom right, rgba(128, 128, 128, 0.4), rgba(40, 40, 40, 0.5))',
        backdropFilter: 'blur(10px)'
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <AgeAdaptiveBlock
        content={blockContent}
        title={blockTitle}
        type={block.type}
        ageGroup={ageGroup}
        specialist={specialistId}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/10"
          >
            <div className="flex items-center gap-3">
              {onLike && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLike}
                  className={`px-4 py-2 rounded-lg ${liked ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white/90 hover:bg-white/10'}`}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  <span>Like</span>
                </Button>
              )}
              
              {onBookmark && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBookmark}
                  className={`px-4 py-2 rounded-lg ${bookmarked ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white/90 hover:bg-white/10'}`}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  <span>Save</span>
                </Button>
              )}
              
              {onReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="px-4 py-2 rounded-lg text-white/70 hover:text-white/90 hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span>Reply</span>
                </Button>
              )}
              
              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  className="px-4 py-2 rounded-lg text-white/70 hover:text-white/90 hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>Share</span>
                </Button>
              )}
              
              {onReadAloud && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReadAloud}
                  className="px-4 py-2 rounded-lg text-white/70 hover:text-white/90 hover:bg-white/10 ml-auto"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  <span>Read aloud</span>
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showReplyForm && (
            <BlockReplies
              replies={replies}
              specialistId={specialistId}
              onSendReply={handleSendReply}
            />
          )}
        </AnimatePresence>
      </AgeAdaptiveBlock>
    </motion.div>
  );
};

export default SimplifiedContentBlock;
