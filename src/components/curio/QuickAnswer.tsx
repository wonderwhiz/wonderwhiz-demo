
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 bg-gradient-to-b from-wonderwhiz-deep-purple/40 to-wonderwhiz-deep-purple/20 rounded-xl border border-white/10 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-wonderwhiz-bright-pink/20 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-wonderwhiz-bright-pink" />
          </div>
          
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-white mb-1">{question}</h3>
            
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? 'auto' : '2.5rem' }}
              className="overflow-hidden"
            >
              <p className="text-white/80 text-sm leading-relaxed">
                {answer}
              </p>
            </motion.div>
            
            <div className="flex items-center justify-between mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="text-white/60 hover:text-white hover:bg-white/10 flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Show less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Read more</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={onStartJourney}
                className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-wonderwhiz-deep-purple hover:opacity-90"
              >
                Start learning journey
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickAnswer;
