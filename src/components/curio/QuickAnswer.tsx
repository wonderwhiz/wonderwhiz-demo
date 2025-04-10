
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-bright-pink/10 backdrop-blur-sm rounded-2xl border border-white/20 p-5 mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-wonderwhiz-vibrant-yellow/30 flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-nunito font-semibold text-white">{question}</h3>
          
          <motion.div 
            className={cn("mt-2 text-white/80 font-inter overflow-hidden")}
            initial={{ height: 0 }}
            animate={{ height: isExpanded ? 'auto' : '4.5rem' }}
            transition={{ duration: 0.3 }}
          >
            <p className={isExpanded ? '' : 'line-clamp-3'}>{answer}</p>
          </motion.div>
          
          <div className="flex items-center mt-3 justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="text-wonderwhiz-vibrant-yellow hover:text-wonderwhiz-vibrant-yellow/80 hover:bg-white/5 -ml-2 flex items-center gap-1"
            >
              {isExpanded ? 'Show less' : 'Read more'} 
              <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-180" : "")} />
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={onStartJourney}
              className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-wonderwhiz-deep-purple font-medium"
            >
              Explore this topic
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickAnswer;
