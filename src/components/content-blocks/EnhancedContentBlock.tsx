
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import BlockHeader from './BlockHeader';
import BlockInteractions from './BlockInteractions';
import BlockRepliesSystem from './BlockRepliesSystem';
import { ContentBlockType } from '@/types/curio';
import { getSpecialistInfo } from '@/utils/specialists';
import BlockDecorator from './BlockDecorator';

interface EnhancedContentBlockProps {
  id: string;
  type: ContentBlockType;
  content: any;
  specialistId: string;
  liked: boolean;
  bookmarked: boolean;
  onToggleLike?: () => void;
  onToggleBookmark?: () => void;
  onReply?: (message: string) => void;
  onReadAloud?: (text: string) => void;
  replies?: any[];
  children: React.ReactNode;
  className?: string;
  relatedQuestions?: string[];
  onRabbitHoleClick?: (question: string) => void;
  childAge?: number;
  childId?: string;
}

const EnhancedContentBlock: React.FC<EnhancedContentBlockProps> = ({
  id,
  type,
  content,
  specialistId,
  liked,
  bookmarked,
  onToggleLike,
  onToggleBookmark,
  onReply,
  onReadAloud,
  replies = [],
  children,
  className = '',
  relatedQuestions,
  onRabbitHoleClick,
  childAge = 10,
  childId
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const specialist = getSpecialistInfo(specialistId);

  // Extract the main text content based on block type
  const getBlockMainContent = () => {
    if (!content) return '';
    
    switch (type) {
      case 'fact':
        return content.fact || '';
      case 'funFact':
        return content.text || '';
      case 'quiz':
        return content.question || '';
      case 'activity':
        return content.activity || '';
      case 'flashcard':
        return `${content.front || ''} ${content.back || ''}`;
      case 'riddle':
        return content.riddle || '';
      case 'creative':
        return content.prompt || '';
      case 'task':
        return content.task || '';
      case 'mindfulness':
        return content.exercise || '';
      case 'news':
        return `${content.headline || ''} ${content.summary || ''}`;
      default:
        return JSON.stringify(content);
    }
  };

  const handleReadAloud = () => {
    if (onReadAloud) {
      const textToRead = getBlockMainContent();
      onReadAloud(textToRead);
    }
  };

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative"
    >
      <Card className={`relative overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-colors ${className}`}>
        <BlockDecorator type={type} />
        
        <div className="p-4 sm:p-5 relative z-10">
          <BlockHeader 
            type={type}
            specialistId={specialistId}
            specialistName={specialist?.name || 'Specialist'}
            specialistAvatar={specialist?.avatar}
          />
          
          <div className="mt-2 sm:mt-3 text-white">
            {children}
          </div>
          
          <BlockInteractions
            id={id}
            type={type}
            onToggleLike={onToggleLike}
            onToggleBookmark={onToggleBookmark}
            onReadAloud={handleReadAloud}
            liked={liked}
            bookmarked={bookmarked}
            relatedQuestions={relatedQuestions}
            onRabbitHoleClick={onRabbitHoleClick}
            childAge={childAge}
            setShowReplyForm={setShowReplyForm}
          />
          
          <AnimatePresence>
            {(showReplyForm || replies.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BlockRepliesSystem
                  blockId={id}
                  specialistId={specialistId}
                  childId={childId}
                  childAge={childAge}
                  initialReplies={replies}
                  onReplySuccess={() => {
                    // Add any additional success handling here
                    if (onReply) {
                      // Just to match the expected callback signature in parent components
                      onReply("");
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default EnhancedContentBlock;
