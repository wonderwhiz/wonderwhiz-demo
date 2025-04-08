
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Lightbulb, Star, CornerRightDown } from 'lucide-react';

interface FactBlockProps {
  content: {
    fact: string;
    rabbitHoles?: string[];
  };
  onRabbitHoleClick: (question: string) => void;  // This accepts a string parameter
  expanded?: boolean;
  setExpanded?: (expanded: boolean) => void;
  textSize?: string;
}

const FactBlock: React.FC<FactBlockProps> = ({ 
  content, 
  onRabbitHoleClick, 
  expanded = false,
  setExpanded = () => {},
  textSize = 'text-sm sm:text-base'
}) => {
  // Add a safety check to make sure content.fact exists
  if (!content || typeof content.fact === 'undefined') {
    console.error('FactBlock received invalid content:', content);
    return (
      <div className="flex items-start space-x-2 mb-2">
        <div className="flex-shrink-0 mt-1">
          <Lightbulb className="h-5 w-5 text-wonderwhiz-gold" />
        </div>
        <div className="flex-1">
          <p className={`text-white/90 ${textSize}`}>
            Loading interesting facts...
          </p>
        </div>
      </div>
    );
  }
  
  const factIsTooLong = content.fact.length > 120;
  
  // Add safety check for rabbitHoles to ensure it exists before accessing its length
  const hasRabbitHoles = content.rabbitHoles && content.rabbitHoles.length > 0;
  
  // State to track which rabbit hole is being hovered
  const [hoveredRabbitHole, setHoveredRabbitHole] = useState<number | null>(null);
  
  // For the mini sparkle animation effect
  const [showSparkle, setShowSparkle] = useState(false);
  
  useEffect(() => {
    // Show sparkle effect on mount
    const timer = setTimeout(() => {
      setShowSparkle(true);
      
      // Hide it after some time
      setTimeout(() => {
        setShowSparkle(false);
      }, 2000);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-2 mb-2 relative">
          <div className="flex-shrink-0 mt-1">
            <div className="relative">
              <Lightbulb className="h-5 w-5 text-wonderwhiz-gold" />
              <AnimatePresence>
                {showSparkle && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Star className="h-3 w-3 text-wonderwhiz-vibrant-yellow" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex-1">
            {factIsTooLong && !expanded ? (
              <>
                <motion.p
                  className={`text-white/90 ${textSize}`}
                  initial={{ filter: "blur(0px)" }}
                  animate={{ filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                >
                  {content.fact.substring(0, 120)}...
                </motion.p>
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
                <motion.p
                  className={`text-white/90 ${textSize}`}
                  initial={{ filter: "blur(0px)" }}
                  animate={{ filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                >
                  {content.fact}
                </motion.p>
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

      {hasRabbitHoles && (
        <motion.div 
          className="mt-4 sm:mt-4 relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center mb-2">
            <CornerRightDown className="h-3 w-3 text-wonderwhiz-vibrant-yellow mr-1.5" />
            <p className="text-white/80 text-xs sm:text-sm">Explore more about this</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {content.rabbitHoles.map((question: string, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredRabbitHole(idx)}
                onHoverEnd={() => setHoveredRabbitHole(null)}
                className="relative"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-wonderwhiz-vibrant-yellow/20 hover:border-wonderwhiz-vibrant-yellow/40 hover:text-white text-xs sm:text-sm py-1.5 px-3 h-auto rounded-full transition-all"
                  onClick={() => onRabbitHoleClick(question)}
                >
                  {question}
                </Button>
                
                <AnimatePresence>
                  {hoveredRabbitHole === idx && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -top-1 -right-1"
                    >
                      <div className="h-3 w-3 rounded-full bg-wonderwhiz-vibrant-yellow animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FactBlock;
