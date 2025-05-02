
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import BlockHeader from './BlockHeader';
import BlockInteractions from './BlockInteractions';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';
import BlockAccent from './BlockAccent';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden bg-gradient-to-br from-purple-500/30 to-blue-500/20 rounded-lg border border-white/15 shadow-xl"
      style={{ boxShadow: '0 6px 20px -2px rgba(0,0,0,0.25), 0 0 15px -3px rgba(255,213,79,0.35)' }}
    >
      {/* Add the accent icon */}
      <div className="absolute top-0 right-0">
        <BlockAccent type="funFact" childAge={childAge} />
      </div>
      
      <BlockHeader type={getHeader()} specialistId={specialistId} />
      
      <div className="p-5">
        <div className="flex gap-3 items-start">
          <div className="bg-yellow-500/25 p-2 rounded-full flex-shrink-0 mt-1 shadow-lg shadow-yellow-500/20">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
          </div>
          <p className={`text-white/95 ${textSize} font-nunito`}>{fact}</p>
        </div>
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
    </motion.div>
  );
};

export default FunFactBlock;
