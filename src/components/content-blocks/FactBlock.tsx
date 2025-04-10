
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import BlockHeader from './BlockHeader';
import { motion } from 'framer-motion';

export interface FactBlockProps {
  fact: string;
  title?: string;
  specialistId: string;
  rabbitHoles?: string[];
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onTaskComplete?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  updateHeight?: (height: number) => void;
}

const FactBlock: React.FC<FactBlockProps> = ({
  fact,
  title,
  specialistId,
  rabbitHoles = [],
  onLike,
  onBookmark,
  onReply,
  onTaskComplete,
  onRabbitHoleClick,
  updateHeight
}) => {
  const [expanded, setExpanded] = useState(false);
  const blockRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (blockRef.current && updateHeight) {
      updateHeight(blockRef.current.offsetHeight);
    }
  }, [fact, updateHeight, expanded]);
  
  return (
    <Card 
      ref={blockRef}
      className="overflow-hidden bg-white/5 backdrop-blur-sm border-primary/10"
    >
      <BlockHeader 
        type="fact" 
        specialistId={specialistId}
        blockTitle={title}
      />
      
      <div className="p-4">
        <p className="text-white/80 text-base leading-relaxed">{fact}</p>
        
        {rabbitHoles && rabbitHoles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-white/60 text-sm font-medium">I wonder...</p>
            
            <div className="space-y-2">
              {rabbitHoles.map((question, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left p-2.5 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
                  onClick={() => onRabbitHoleClick?.(question)}
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FactBlock;
