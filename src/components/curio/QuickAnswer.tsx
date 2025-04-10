
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';

interface QuickAnswerProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStartJourney: () => void;
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  question,
  answer,
  isExpanded,
  onToggleExpand,
  onStartJourney
}) => {
  return (
    <motion.div 
      className="mb-6 bg-gradient-to-r from-wonderwhiz-deep-purple/80 to-wonderwhiz-deep-purple/60 rounded-xl border border-wonderwhiz-bright-pink/20 overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold mb-1">
              {question}
            </h3>
            <div className="flex items-center text-xs text-wonderwhiz-bright-pink mb-3">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>Quick Answer</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="text-white/80 hover:text-white hover:bg-white/10 -mt-1 -mr-2"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
        
        <AnimatePresence>
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="text-white/90 overflow-hidden"
            >
              <p className="mb-4">{answer}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/90"
            >
              <p className="line-clamp-2 text-sm">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-3 flex justify-end">
          <Button
            onClick={onStartJourney}
            className="bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink text-wonderwhiz-deep-purple font-medium"
            size="sm"
          >
            Start Learning Journey
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickAnswer;
