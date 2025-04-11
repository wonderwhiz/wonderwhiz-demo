
import React from 'react';
import { ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface QuickAnswerProps {
  question: string;
  answer?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStartJourney: () => void;
  childId?: string;
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  question,
  answer = "Here's a quick answer to your question. This is a brief summary before we explore the topic in depth.",
  isExpanded,
  onToggleExpand,
  onStartJourney,
  childId
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 bg-wonderwhiz-deep-purple/80 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
    >
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-white text-lg font-medium mb-2">{question}</h3>
          <button 
            onClick={onToggleExpand}
            className="text-white/60 hover:text-white transition-colors"
            aria-label={isExpanded ? "Collapse quick answer" : "Expand quick answer"}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '80px', overflow: isExpanded ? 'visible' : 'hidden' }}
          transition={{ duration: 0.3 }}
          className="relative text-white/80 text-sm leading-relaxed"
        >
          <p>{answer}</p>
          
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-wonderwhiz-deep-purple/80 to-transparent"></div>
          )}
        </motion.div>
        
        <Button
          variant="default" 
          className="w-full mt-4 bg-wonderwhiz-bright-pink/90 hover:bg-wonderwhiz-bright-pink text-white"
          onClick={onStartJourney}
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          Start Learning Journey
        </Button>
      </div>
    </motion.div>
  );
};

export default QuickAnswer;
