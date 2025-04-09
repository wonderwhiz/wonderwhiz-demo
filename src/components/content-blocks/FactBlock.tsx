
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { getBlockTypeColor, getHoverAnimation } from '@/components/BlockStyleUtils';
import { ArrowRight, MessageCircle, BrainCircuit, Sparkles, ArrowDown } from 'lucide-react';

interface FactBlockProps {
  content: {
    fact: string;
    rabbitHoles?: string[];
  };
  onRabbitHoleClick?: (question: string) => void;
  expanded?: boolean;
  setExpanded?: (expanded: boolean) => void;
  textSize?: string;
}

const FactBlock: React.FC<FactBlockProps> = ({ 
  content, 
  onRabbitHoleClick,
  expanded = false,
  setExpanded = () => {},
  textSize = 'text-base'
}) => {
  const [selectedRabbitHole, setSelectedRabbitHole] = useState<string | null>(null);
  const [animateInsight, setAnimateInsight] = useState<boolean>(false);
  const [showThoughtQuestion, setShowThoughtQuestion] = useState<boolean>(false);
  
  // Handle edge cases where content might not be properly structured
  const fact = content?.fact || "Interesting fact coming soon...";
  const rabbitHoles = content?.rabbitHoles || [];
  const hasRabbitHoles = Array.isArray(rabbitHoles) && rabbitHoles.length > 0;
  
  const handleRabbitHoleClick = (question: string) => {
    setSelectedRabbitHole(question);
    setTimeout(() => {
      if (onRabbitHoleClick) {
        onRabbitHoleClick(question);
      }
    }, 400);
  };
  
  const toggleExpandFact = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setAnimateInsight(true);
      setTimeout(() => setAnimateInsight(false), 1500);
    }
  };
  
  // Extract a thought-provoking question from the fact content
  const getThoughtProvokingQuestion = (factText: string) => {
    // Simple heuristic - check if the fact already ends with a question
    if (factText.trim().endsWith('?')) {
      return null; // Fact already ends with a question
    }
    
    // Generate a generic thought-provoking question based on the content
    // Check for keywords to create more relevant questions
    const lowerFact = factText.toLowerCase();
    
    if (lowerFact.includes('animals') || lowerFact.includes('creature') || lowerFact.includes('species')) {
      return "What other amazing adaptations might animals develop in the future?";
    } else if (lowerFact.includes('space') || lowerFact.includes('planet') || lowerFact.includes('star') || lowerFact.includes('galaxy')) {
      return "How does thinking about the vastness of space make you feel?";
    } else if (lowerFact.includes('history') || lowerFact.includes('ancient') || lowerFact.includes('years ago')) {
      return "How might our world be different if this part of history had turned out differently?";
    } else if (lowerFact.includes('technology') || lowerFact.includes('invention') || lowerFact.includes('computer')) {
      return "What inventions do you think we might create in the next 50 years?";
    } else if (lowerFact.includes('brain') || lowerFact.includes('think') || lowerFact.includes('memory')) {
      return "How does your brain help you understand the world in unique ways?";
    }
    
    // Default question if no specific topics detected
    return "What does this make you wonder about our incredible world?";
  };
  
  const thoughtQuestion = getThoughtProvokingQuestion(fact);
  
  // Show thought question after a delay when the block is expanded
  React.useEffect(() => {
    if (expanded && thoughtQuestion) {
      const timer = setTimeout(() => {
        setShowThoughtQuestion(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowThoughtQuestion(false);
    }
  }, [expanded, thoughtQuestion]);
  
  const factVariants = {
    collapsed: { height: "auto" },
    expanded: { height: "auto" }
  };

  return (
    <div className={`relative overflow-hidden ${getHoverAnimation('fact')}`}>
      <motion.div 
        className={`p-3 sm:p-4 rounded-lg ${getBlockTypeColor('fact')}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          variants={factVariants}
          initial="collapsed"
          animate={expanded ? "expanded" : "collapsed"}
        >
          <div className="flex items-start">
            <div className="mr-3 mt-1 flex-shrink-0">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ 
                  scale: animateInsight ? [1, 1.2, 1] : 1,
                  rotate: animateInsight ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.6 }}
                className="h-6 w-6 bg-indigo-500/20 rounded-full flex items-center justify-center"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              </motion.div>
            </div>
            <div className="flex-grow">
              <p className={`${textSize} text-white`}>
                {fact}
              </p>
              
              {/* Thought-provoking question */}
              <AnimatePresence>
                {expanded && thoughtQuestion && showThoughtQuestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 border-t border-white/10 pt-3"
                  >
                    <p className="text-white/80 text-sm flex items-start">
                      <Sparkles className="w-4 h-4 mr-2 mt-0.5 text-wonderwhiz-gold" />
                      <span>{thoughtQuestion}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Expand button - only show if not expanded and there's a thought question */}
              {!expanded && thoughtQuestion && (
                <motion.button
                  onClick={toggleExpandFact}
                  className="mt-2 text-white/60 hover:text-white/80 text-xs flex items-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Think deeper</span>
                  <ArrowDown className="ml-1 w-3 h-3 group-hover:animate-bounce" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
        
        {hasRabbitHoles && (
          <div className="mt-4">
            <p className="text-white/60 text-xs mb-2 flex items-center">
              <MessageCircle className="h-3 w-3 mr-1.5" />
              Curious about...
            </p>
            
            <div className="flex flex-wrap gap-2">
              {rabbitHoles.slice(0, 3).map((question, index) => (
                <motion.button
                  key={`rabbit-hole-${index}`}
                  onClick={() => handleRabbitHoleClick(question)}
                  className={`text-xs px-2.5 py-1.5 rounded-full flex items-center 
                    ${selectedRabbitHole === question
                      ? 'bg-indigo-500 text-white'
                      : 'bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
                    } transition-colors duration-200`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{question}</span>
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FactBlock;
