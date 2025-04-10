
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import BlockHeader from './BlockHeader';
import { motion } from 'framer-motion';

export interface FactBlockProps {
  fact: string;
  title?: string;
  specialistId: string;
  rabbitHoles?: string[];
  expanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
  textSize?: string;
  narrativePosition?: 'beginning' | 'middle' | 'end';
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
  expanded,
  setExpanded,
  textSize,
  narrativePosition,
  onLike,
  onBookmark,
  onReply,
  onTaskComplete,
  onRabbitHoleClick,
  updateHeight
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const [prevHeight, setPrevHeight] = useState<number | null>(null);
  const [initialMeasurementDone, setInitialMeasurementDone] = useState(false);
  
  // Only measure and update height when the component mounts or facts/expands change
  useEffect(() => {
    if (blockRef.current && updateHeight) {
      const currentHeight = blockRef.current.offsetHeight;
      
      // Only update if height actually changed or this is the first measurement
      if (!initialMeasurementDone || (prevHeight !== null && prevHeight !== currentHeight)) {
        setPrevHeight(currentHeight);
        updateHeight(currentHeight);
        
        if (!initialMeasurementDone) {
          setInitialMeasurementDone(true);
        }
      }
    }
  }, [fact, expanded, updateHeight, prevHeight, initialMeasurementDone]);
  
  const handleRabbitHoleClick = (question: string) => {
    if (onRabbitHoleClick && typeof onRabbitHoleClick === 'function') {
      onRabbitHoleClick(question);
    }
  };
  
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
        <p className="text-white/80 text-base leading-relaxed">{fact || "No content available"}</p>
        
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
                  onClick={() => handleRabbitHoleClick(question)}
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
