
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import BlockHeader from './BlockHeader';
import BlockInteractions from './BlockInteractions';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';
import BlockAccent from './BlockAccent';
import { blockAnimations, floatingEffect, pulseAnimation } from './utils/blockStyles';

interface FunFactBlockProps {
  fact: string;
  specialistId: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onRabbitHoleClick?: (question: string) => void;
  updateHeight?: (height: number) => void;
  childAge?: number;
}

const FunFactBlock: React.FC<FunFactBlockProps> = ({
  fact,
  specialistId,
  onLike,
  onBookmark,
  onReply,
  onRabbitHoleClick,
  updateHeight,
  childAge = 10
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { textSize, messageStyle } = useAgeAdaptation(childAge);
  
  const getHeader = () => {
    if (messageStyle === 'playful') {
      return "Wow! Did You Know?";
    } else if (messageStyle === 'casual') {
      return "Fun Fact";
    } else {
      return "Interesting Fact";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={blockAnimations.entrance}
      className="relative overflow-hidden rounded-2xl border-2 border-white/15"
      style={{ 
        background: 'linear-gradient(to bottom right, rgba(255, 213, 79, 0.25), rgba(60, 60, 60, 0.2))',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px -2px rgba(0,0,0,0.3), 0 0 20px -4px rgba(255,213,79,0.45)'
      }}
    >
      <motion.div 
        className="absolute top-0 right-0"
        variants={floatingEffect}
        initial="initial"
        animate="animate"
      >
        <BlockAccent type="funFact" childAge={childAge} />
      </motion.div>
      
      <BlockHeader type={getHeader()} specialistId={specialistId} childAge={childAge} />
      
      <div className="p-5">
        <motion.div 
          className="flex gap-3 items-start"
          variants={pulseAnimation}
        >
          <div className="bg-wonderwhiz-vibrant-yellow/30 p-2.5 rounded-full flex-shrink-0 mt-1 shadow-lg shadow-wonderwhiz-vibrant-yellow/30 border border-wonderwhiz-vibrant-yellow/40">
            <Lightbulb className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
          </div>
          <div>
            <p className={`text-white/95 ${textSize} font-nunito leading-relaxed`}>
              {fact}
            </p>
            
            {childAge <= 8 && (
              <motion.div 
                className="mt-4 bg-white/10 border border-white/20 rounded-xl p-3 text-white/90 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-semibold">Why is this cool?</span> Fun facts like this help us learn amazing things about our world!
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      
      <BlockInteractions 
        id={`funfact-${Date.now()}`}
        liked={false}
        bookmarked={false}
        type="funFact"
        onToggleLike={onLike || (() => {})}
        onToggleBookmark={onBookmark || (() => {})}
        setShowReplyForm={setShowReplyForm}
        onRabbitHoleClick={onRabbitHoleClick}
        relatedQuestions={[]}
        childAge={childAge}
      />
      
      {/* Add subtle particle animation for younger children */}
      {childAge <= 10 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-wonderwhiz-vibrant-yellow/30"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%', 
                opacity: 0 
              }}
              animate={{ 
                x: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 0.8
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FunFactBlock;
