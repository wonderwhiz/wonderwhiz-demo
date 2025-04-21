
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Star } from 'lucide-react';
import { blockVariants, contentVariants, getBlockStyle } from './utils/blockAnimations';

interface FactBlockProps {
  fact: string;
  title?: string;
  specialistId: string;
  rabbitHoles?: string[];
  onRabbitHoleClick?: (question: string) => void;
  updateHeight?: (height: number) => void;
}

const FactBlock: React.FC<FactBlockProps> = ({
  fact,
  title,
  specialistId,
  rabbitHoles = [],
  onRabbitHoleClick,
  updateHeight
}) => {
  return (
    <motion.div
      variants={blockVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`bg-gradient-to-br ${getBlockStyle('fact')} p-6 rounded-xl shadow-lg backdrop-blur-sm border`}
    >
      <div className="flex items-start space-x-4">
        <div className="bg-wonderwhiz-cyan/20 p-2 rounded-full">
          <Lightbulb className="h-5 w-5 text-wonderwhiz-cyan" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-3">{title || "Did you know?"}</h3>
          <motion.p 
            variants={contentVariants}
            className="text-white/90 leading-relaxed"
          >
            {fact}
          </motion.p>

          {rabbitHoles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-white/70 text-sm font-medium">Want to learn more?</p>
              <div className="space-y-2">
                {rabbitHoles.map((question, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onRabbitHoleClick?.(question)}
                    className="w-full text-left p-3 bg-white/5 rounded-lg text-white/80 flex items-center space-x-2 transition-colors"
                  >
                    <Star className="h-4 w-4 text-wonderwhiz-cyan" />
                    <span>{question}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FactBlock;
