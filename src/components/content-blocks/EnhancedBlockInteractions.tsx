
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookmarkCheck,
  Bookmark,
  MessageCircle,
  Share2,
  Sparkles,
  VolumeIcon,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';
import { ContentBlockType } from '@/types/curio';

export interface EnhancedBlockInteractionsProps {
  id: string;
  liked?: boolean;
  bookmarked?: boolean;
  type: ContentBlockType;
  onToggleLike?: () => void;
  onToggleBookmark?: () => void;
  onReply?: (message: string) => void;
  onShare?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  onReadAloud?: (text: string) => void;
  relatedQuestions?: string[];
  readableContent?: string;
  childAge?: number;
}

const EnhancedBlockInteractions: React.FC<EnhancedBlockInteractionsProps> = ({
  id,
  liked = false,
  bookmarked = false,
  type,
  onToggleLike,
  onToggleBookmark,
  onReply,
  onShare,
  onRabbitHoleClick,
  onReadAloud,
  relatedQuestions = [],
  readableContent = '',
  childAge = 10
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showRelatedQuestions, setShowRelatedQuestions] = useState(false);
  const { interactionSize, interactionStyle } = useAgeAdaptation(childAge);
  
  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };
  
  const getButtonSizeClass = () => {
    switch (interactionSize) {
      case 'xl': return 'h-10 text-base';
      case 'large': return 'h-9 text-base';
      case 'default': return 'h-8 text-sm';
      case 'small': return 'h-7 text-xs';
      case 'xs': return 'h-6 text-xs';
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'fact': return 'text-wonderwhiz-cyan';
      case 'quiz': return 'text-wonderwhiz-bright-pink';
      case 'creative': return 'text-wonderwhiz-green';
      case 'funFact': return 'text-wonderwhiz-vibrant-yellow';
      case 'mindfulness': return 'text-wonderwhiz-purple';
      case 'flashcard': return 'text-wonderwhiz-blue-accent';
      case 'task': return 'text-wonderwhiz-orange';
      case 'news': return 'text-wonderwhiz-light-blue';
      case 'riddle': return 'text-wonderwhiz-teal';
      case 'activity': return 'text-wonderwhiz-gold';
      default: return 'text-wonderwhiz-blue';
    }
  };
  
  const getEmoji = () => {
    if (childAge <= 8) {
      if (type === 'quiz') return '🎯';
      if (type === 'fact') return '✨';
      if (type === 'funFact') return '🌟';
      if (type === 'creative') return '🎨';
      if (type === 'mindfulness') return '🧘';
      if (type === 'flashcard') return '🔍';
      if (type === 'task') return '📝';
      if (type === 'news') return '📰';
      if (type === 'riddle') return '🧩';
      if (type === 'activity') return '🏃';
      return '🌟';
    }
    return null;
  };
  
  const emoji = getEmoji();
  const buttonSize = getButtonSizeClass();
  const showLabels = interactionSize !== 'xs';
  const typeColor = getTypeColor();
  
  return (
    <div className="mt-3">
      <div className={`flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 ${
        childAge <= 8 ? 'justify-center' : 'justify-between'
      }`}>
        <motion.div 
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {onToggleBookmark && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleBookmark}
                className={`${buttonSize} rounded-full transition-colors duration-300 ${
                  bookmarked ? 'text-wonderwhiz-vibrant-yellow bg-wonderwhiz-vibrant-yellow/10' : 'text-white/60 hover:text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10'
                }`}
                aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {bookmarked ? (
                  <BookmarkCheck className={`${interactionSize === 'xs' ? 'h-3 w-3' : 'h-4 w-4'} ${showLabels ? 'mr-1.5' : ''}`} />
                ) : (
                  <Bookmark className={`${interactionSize === 'xs' ? 'h-3 w-3' : 'h-4 w-4'} ${showLabels ? 'mr-1.5' : ''}`} />
                )}
                {showLabels && (
                  <span className="font-medium">
                    {childAge <= 8 ? (bookmarked ? "Saved!" : "Save!") : (bookmarked ? "Saved" : "Save")}
                  </span>
                )}
              </Button>
            </motion.div>
          )}
          
          {onReply && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className={`${buttonSize} rounded-full text-white/60 hover:${typeColor}`}
                aria-label="Reply"
              >
                <MessageCircle className={`${interactionSize === 'xs' ? 'h-3 w-3' : 'h-4 w-4'} ${showLabels ? 'mr-1.5' : ''}`} />
                {showLabels && (
                  <span>
                    {childAge <= 8 ? "Reply!" : "Reply"}
                  </span>
                )}
              </Button>
            </motion.div>
          )}
          
          {onReadAloud && readableContent && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReadAloud(readableContent)}
                className={`${buttonSize} rounded-full ${
                  childAge <= 8 ? `bg-${typeColor.replace('text-', '')}/10 ${typeColor} hover:bg-${typeColor.replace('text-', '')}/20` : 'text-white/60 hover:text-wonderwhiz-bright-pink'
                }`}
                aria-label="Read aloud"
              >
                <VolumeIcon className={`${interactionSize === 'xs' ? 'h-3 w-3' : 'h-4 w-4'} ${showLabels ? 'mr-1.5' : ''}`} />
                {showLabels && (
                  <span>
                    {childAge <= 8 ? "Read to me!" : "Read aloud"}
                  </span>
                )}
              </Button>
            </motion.div>
          )}
          
          {emoji && (
            <motion.span 
              className="text-lg ml-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {emoji}
            </motion.span>
          )}
        </motion.div>
        
        {relatedQuestions.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRelatedQuestions(!showRelatedQuestions)}
              className={`${buttonSize} rounded-full transition-colors duration-300 ${
                childAge <= 8 
                  ? `bg-wonderwhiz-bright-pink/10 text-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/20` 
                  : 'text-white/60 hover:text-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/10'
              }`}
              aria-label={showRelatedQuestions ? "Hide related questions" : "Show related questions"}
            >
              <Sparkles className={`${interactionSize === 'xs' ? 'h-3 w-3' : 'h-4 w-4'} ${showLabels ? 'mr-1.5' : ''}`} />
              {showLabels && (
                <span className="font-medium">
                  {childAge <= 8 ? "I wonder..." : "Related"}
                </span>
              )}
              {showRelatedQuestions ? 
                <ChevronUp className="ml-1 h-3 w-3" /> : 
                <ChevronDown className="ml-1 h-3 w-3" />
              }
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showReplyForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <div className={`rounded-lg p-3 ${childAge <= 8 ? 'bg-white/10 border border-wonderwhiz-bright-pink/20' : 'bg-white/5'}`}>
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={childAge <= 8 ? "Type your thoughts here!" : "Write your reply..."}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 mb-2"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                  className="border-white/20 text-white/70"
                >
                  {childAge <= 8 ? "Nevermind" : "Cancel"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                  className={`bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 ${childAge <= 8 ? 'animate-pulse' : ''}`}
                >
                  {childAge <= 8 ? "Send it!" : "Send"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {showRelatedQuestions && relatedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3"
          >
            <div className={`rounded-lg ${childAge <= 8 ? 'bg-indigo-500/10 p-4 border border-indigo-500/20' : 'bg-white/5 p-3'}`}>
              <h4 className={`text-white/80 ${childAge <= 8 ? 'text-base mb-3' : 'text-sm mb-2'}`}>
                {childAge <= 8 ? "I'm curious about..." : "Related questions:"}
              </h4>
              <div className="space-y-2">
                {relatedQuestions.map((question, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onRabbitHoleClick && onRabbitHoleClick(question)}
                    className={`rounded-lg p-3 cursor-pointer transition-colors flex items-center ${
                      childAge <= 8 
                        ? 'bg-white/15 hover:bg-white/20 border border-wonderwhiz-vibrant-yellow/30' 
                        : 'bg-white/10 hover:bg-white/15'
                    }`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Explore question: ${question}`}
                  >
                    {childAge <= 8 && <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-vibrant-yellow" />}
                    <span className={`text-white/90 ${childAge <= 8 ? 'text-base' : 'text-sm'}`}>
                      {question}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedBlockInteractions;
