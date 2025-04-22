
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import BlockHeader from './BlockHeader';
import BlockInteractions from './BlockInteractions';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

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
      className="overflow-hidden bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-lg border border-white/10 shadow-md"
    >
      <BlockHeader type={getHeader()} specialistId={specialistId} />
      
      <div className="p-4">
        <div className="flex gap-3 items-start">
          <div className="bg-yellow-500/20 p-2 rounded-full flex-shrink-0 mt-1">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
          </div>
          <p className={`text-white/90 ${textSize}`}>{fact}</p>
        </div>
      </div>
      
      <BlockInteractions 
        id={`funfact-${Date.now()}`}
        liked={false}
        bookmarked={false}
        type="funfact"
        onToggleLike={onLike || (() => {})}
        onToggleBookmark={onBookmark || (() => {})}
        setShowReplyForm={setShowReplyForm}
        onRabbitHoleClick={onRabbitHoleClick}
        relatedQuestions={[]}
      />
    </motion.div>
  );
};

export default FunFactBlock;
