
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { getBlockTypeColor, getHoverAnimation } from '@/components/BlockStyleUtils';
import { ArrowRight, MessageCircle, BrainCircuit } from 'lucide-react';

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
            <p className={`${textSize} text-white`}>
              {fact}
            </p>
          </div>
        </motion.div>
        
        {hasRabbitHoles && (
          <div className="mt-4">
            <p className="text-white/60 text-xs mb-2 flex items-center">
              <MessageCircle className="h-3 w-3 mr-1.5" />
              Curious about...
            </p>
            
            <div className="flex flex-wrap gap-2">
              {rabbitHoles.map((question, index) => (
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
