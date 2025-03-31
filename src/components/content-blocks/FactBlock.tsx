
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface FactBlockProps {
  content: {
    fact: string;
    rabbitHoles?: string[];
  };
  onRabbitHoleClick: (question: string) => void;
  expanded?: boolean;
  setExpanded?: (expanded: boolean) => void;
}

const FactBlock: React.FC<FactBlockProps> = ({ 
  content, 
  onRabbitHoleClick, 
  expanded = false,
  setExpanded = () => {}
}) => {
  const factIsTooLong = content.fact.length > 120;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-2 mb-2">
          <div className="flex-shrink-0 mt-1">
            <Lightbulb className="h-5 w-5 text-wonderwhiz-gold" />
          </div>
          <div className="flex-1">
            {factIsTooLong && !expanded ? (
              <>
                <p className="text-white text-sm sm:text-base">
                  {content.fact.substring(0, 120)}...
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(true)}
                  className="mt-1 text-wonderwhiz-purple hover:text-wonderwhiz-purple/80 px-2 py-0.5 h-auto text-xs flex items-center"
                >
                  Read more <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </>
            ) : (
              <>
                <p className="text-white text-sm sm:text-base">{content.fact}</p>
                {factIsTooLong && expanded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(false)}
                    className="mt-1 text-wonderwhiz-purple hover:text-wonderwhiz-purple/80 px-2 py-0.5 h-auto text-xs flex items-center"
                  >
                    Show less <ChevronUp className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {content.rabbitHoles && content.rabbitHoles.length > 0 && (
        <motion.div 
          className="mt-3 sm:mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-white/80 text-xs sm:text-sm mb-2">🐇 Want to explore more?</p>
          <div className="flex flex-wrap gap-2">
            {content.rabbitHoles.map((question: string, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm py-1.5 px-3 h-auto rounded-full"
                  onClick={() => onRabbitHoleClick(question)}
                >
                  {question}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FactBlock;
