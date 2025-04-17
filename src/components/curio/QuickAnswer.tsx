
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface QuickAnswerProps {
  question: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onStartJourney?: () => void;
  childId?: string;
  childAge?: number;
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  question,
  isExpanded: propIsExpanded = false,
  onToggleExpand,
  onStartJourney,
  childId,
  childAge = 10
}) => {
  const [isExpanded, setIsExpanded] = useState(propIsExpanded);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsExpanded(propIsExpanded);
  }, [propIsExpanded]);

  useEffect(() => {
    if ((isExpanded || propIsExpanded) && !summary && !isLoading) {
      generateQuickSummary();
    }
  }, [isExpanded, propIsExpanded]);

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggleExpand) {
      onToggleExpand();
    }
    
    if (newExpandedState && !summary && !isLoading) {
      generateQuickSummary();
    }
  };

  const generateQuickSummary = async () => {
    if (isLoading || summary) return;
    
    setIsLoading(true);
    
    try {
      // Create a simplified version for younger audiences
      let summaryText = '';
      
      if (childAge && childAge < 8) {
        summaryText = `${question} is something fun to learn about! Let's explore together.`;
      } else {
        summaryText = `${question} is an interesting topic to learn about. Let's discover cool facts!`;
      }
      
      setSummary(summaryText);
    } catch (err) {
      console.error('Error generating summary:', err);
      setSummary('Let\'s learn about this cool topic together!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartJourney = () => {
    if (onStartJourney) {
      onStartJourney();
    }
  };

  return (
    <div className="mb-6">
      <motion.div
        className="bg-gradient-to-r from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/30 backdrop-blur-md rounded-xl border border-wonderwhiz-light-purple/20 shadow-lg overflow-hidden"
        animate={{ height: 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="flex items-center">
            <h3 className="text-lg font-bold text-white font-nunito">Quick Start</h3>
            {!isExpanded && (
              <div className="ml-2 bg-wonderwhiz-bright-pink/20 px-2 py-0.5 rounded-full text-xs text-wonderwhiz-bright-pink font-medium hidden sm:block">
                Tap here
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          >
            {isExpanded ? 
              <ChevronUp className="h-5 w-5" /> : 
              <ChevronDown className="h-5 w-5" />
            }
          </Button>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-wonderwhiz-bright-pink"></div>
                  <span className="ml-2 text-white/70">Loading...</span>
                </div>
              ) : (
                <>
                  <p className="text-white mb-4 font-inter text-lg">
                    {summary || 'Let\'s learn together!'}
                  </p>
                  
                  <div className="flex items-center justify-end">
                    <Button
                      size="sm"
                      onClick={handleStartJourney}
                      className="text-white bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-purple/90 shadow-glow-brand-pink transition-all duration-300"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Start Learning</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default QuickAnswer;
