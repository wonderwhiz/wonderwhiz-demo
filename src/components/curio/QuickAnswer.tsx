
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Sparkles, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  answer,
  isExpanded,
  onToggleExpand,
  onStartJourney,
  childId
}) => {
  const [generatingAnswer, setGeneratingAnswer] = useState(!answer);
  const [quickAnswer, setQuickAnswer] = useState(answer || '');
  
  React.useEffect(() => {
    if (!answer && childId) {
      // Simulate generating an answer
      const timer = setTimeout(() => {
        setQuickAnswer(`${question} is a fascinating topic! It involves several key concepts and fun facts that you'll explore in this learning journey. Whether you're curious about how it works, why it matters, or what makes it special, you'll find answers in the activities ahead.`);
        setGeneratingAnswer(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [answer, childId, question]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="overflow-hidden bg-white/5 backdrop-blur-lg border-primary/10">
        <div className="bg-gradient-to-r from-wonderwhiz-purple/40 to-wonderwhiz-cyan/20 px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
            <h3 className="font-medium text-white text-sm">Quick Answer</h3>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onToggleExpand}
            className="text-white/60 h-8 px-2 hover:bg-white/10"
          >
            {isExpanded ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </Button>
        </div>
        
        <div className="p-4">
          <h2 className="text-lg font-medium text-white mb-2">{question}</h2>
          
          <AnimatePresence mode="wait">
            {generatingAnswer ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/70 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5, 
                      ease: "linear" 
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-wonderwhiz-bright-pink" />
                  </motion.div>
                  <span className="text-sm">Generating quick answer...</span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="h-3 bg-white/10 animate-pulse rounded-full w-full" />
                  <div className="h-3 bg-white/10 animate-pulse rounded-full w-5/6" />
                  <div className="h-3 bg-white/10 animate-pulse rounded-full w-4/6" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="answer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={`text-white/80 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-20'}`}>
                  <p className={isExpanded ? '' : 'line-clamp-2'}>{quickAnswer}</p>
                </div>
                
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-wonderwhiz-purple/80 to-transparent pointer-events-none" />
                )}
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={onStartJourney}
                    className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:brightness-110 text-black font-medium"
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    Continue Your Wonder Journey
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuickAnswer;
