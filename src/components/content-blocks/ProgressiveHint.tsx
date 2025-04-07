
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressiveHintProps {
  hints: string[];
  blockType: string;
}

const ProgressiveHint: React.FC<ProgressiveHintProps> = ({ hints, blockType }) => {
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState(false);
  
  if (!hints || hints.length === 0) return null;
  
  const showNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    
    // If opening and no hint shown yet, show the first hint
    if (!isOpen && currentHintIndex === -1) {
      setCurrentHintIndex(0);
    }
  };
  
  const getHintIcon = () => {
    switch(blockType) {
      case 'quiz':
        return <Lightbulb className="w-4 h-4 text-wonderwhiz-gold" />;
      case 'riddle':
        return <HelpCircle className="w-4 h-4 text-wonderwhiz-cyan" />;
      default:
        return <Lightbulb className="w-4 h-4 text-wonderwhiz-gold" />;
    }
  };
  
  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleOpen}
        className="w-full flex justify-between items-center text-white/70 hover:text-white p-2"
      >
        <span className="flex items-center gap-1 text-sm">
          {getHintIcon()}
          <span>Hints & Tips</span>
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-2"
          >
            <div className="bg-white/5 rounded-lg p-3 my-2">
              {currentHintIndex >= 0 && (
                <div className="space-y-2">
                  {hints.slice(0, currentHintIndex + 1).map((hint, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="text-sm text-white/80"
                    >
                      <div className="flex items-start">
                        <span className="text-wonderwhiz-gold mr-2 mt-1">•</span>
                        <p>{hint}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {currentHintIndex < hints.length - 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showNextHint}
                  className="mt-2 text-xs text-wonderwhiz-gold hover:text-wonderwhiz-gold/80 hover:bg-wonderwhiz-gold/10"
                >
                  Show Next Hint
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressiveHint;
