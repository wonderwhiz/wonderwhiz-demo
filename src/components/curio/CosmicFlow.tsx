import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle, Planet, Star, Milestone, Rocket, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CosmicFlowProps {
  blocks: any[];
  currentBlockIndex: number;
  onNavigate: (index: number) => void;
  ageGroup: '5-7' | '8-11' | '12-16';
}

const CosmicFlow: React.FC<CosmicFlowProps> = ({
  blocks,
  currentBlockIndex,
  onNavigate,
  ageGroup
}) => {
  const [showFlow, setShowFlow] = useState(false);
  const [highlightedStep, setHighlightedStep] = useState(-1);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlow(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const journeySteps = blocks.map((block, index) => {
    const isCurrentBlock = index === currentBlockIndex;
    
    const getBlockIcon = () => {
      switch (block.type) {
        case 'fact':
          return <Star className="h-4 w-4" />;
        case 'funFact':
          return <Sparkle className="h-4 w-4" />;
        case 'quiz':
          return <Milestone className="h-4 w-4" />;
        case 'creative':
          return <Rocket className="h-4 w-4" />;
        default:
          return <Planet className="h-4 w-4" />;
      }
    };
    
    return {
      index,
      title: getBlockTitle(block) || `Step ${index + 1}`,
      icon: getBlockIcon(),
      isActive: isCurrentBlock,
      isCurrent: isCurrentBlock
    };
  });
  
  const handleMouseOver = (index: number) => {
    setHighlightedStep(index);
  };
  
  const handleMouseLeave = () => {
    setHighlightedStep(-1);
  };
  
  const getStepSize = () => {
    switch (ageGroup) {
      case '5-7':
        return 'h-14 w-14';
      case '8-11':
        return 'h-12 w-12';
      case '12-16':
        return 'h-10 w-10';
      default:
        return 'h-12 w-12';
    }
  };
  
  const getConnectorStyles = () => {
    switch (ageGroup) {
      case '5-7':
        return 'h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500';
      case '8-11':
        return 'h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600';
      case '12-16':
        return 'h-0.5 bg-white/30';
      default:
        return 'h-1 bg-white/30';
    }
  };
  
  const goToPrevious = () => {
    if (currentBlockIndex > 0) {
      onNavigate(currentBlockIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (currentBlockIndex < blocks.length - 1) {
      onNavigate(currentBlockIndex + 1);
    }
  };

  function getBlockTitle(block: any): string {
    if (!block || !block.content) return '';
    
    switch (block.type) {
      case 'fact':
        return extractTitleFromText(block.content.fact || block.content.text || '');
      case 'funFact':
        return 'Fun Fact';
      case 'quiz':
        return block.content.question ? extractTitleFromText(block.content.question) : 'Quiz Question';
      case 'creative':
        return block.content.title || 'Creative Challenge';
      case 'activity':
        return block.content.title || 'Fun Activity';
      case 'mindfulness':
        return block.content.title || 'Mindful Moment';
      case 'flashcard':
        return extractTitleFromText(block.content.front || '');
      case 'news':
        return block.content.headline || 'News Update';
      default:
        return '';
    }
  }
  
  function extractTitleFromText(text: string): string {
    if (!text) return '';
    
    if (text.length < 40) return text;
    
    const firstSentenceMatch = text.match(/^[^.!?]+[.!?]/);
    if (firstSentenceMatch && firstSentenceMatch[0].length < 60) {
      return firstSentenceMatch[0];
    }
    
    return text.substring(0, 40) + '...';
  }

  if (ageGroup === '5-7') {
    return (
      <AnimatePresence mode="wait">
        {showFlow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 mb-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                disabled={currentBlockIndex === 0}
                className={`text-white/70 hover:text-white ${currentBlockIndex === 0 ? 'invisible' : ''}`}
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span>Previous</span>
              </Button>
              
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Your Adventure Path</h3>
                <p className="text-white/60 text-xs">Step {currentBlockIndex + 1} of {blocks.length}</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                disabled={currentBlockIndex === blocks.length - 1}
                className={`text-white/70 hover:text-white ${currentBlockIndex === blocks.length - 1 ? 'invisible' : ''}`}
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
            
            <div className="relative py-4 px-2">
              <div className={`absolute top-1/2 left-4 right-4 -translate-y-1/2 ${getConnectorStyles()}`}></div>
              
              <div className="relative flex justify-between items-center">
                {journeySteps.map((step, idx) => {
                  const isActive = currentBlockIndex === idx;
                  const isPast = currentBlockIndex > idx;
                  
                  return (
                    <motion.div
                      key={`step-${idx}`}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ 
                        scale: isActive ? 1.2 : 1, 
                        opacity: isActive ? 1 : (isPast ? 0.9 : 0.7),
                        y: isActive ? -8 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="relative flex flex-col items-center cursor-pointer"
                      onClick={() => onNavigate(idx)}
                      onMouseOver={() => handleMouseOver(idx)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={`
                        ${getStepSize()}
                        ${isActive 
                          ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-2 border-white' 
                          : isPast 
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/50' 
                            : 'bg-white/20 border border-white/30'
                        }
                        rounded-full flex items-center justify-center shadow-lg z-10
                      `}>
                        {step.icon}
                      </div>
                      
                      <AnimatePresence>
                        {(isActive || highlightedStep === idx) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute top-full mt-2 text-center px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis"
                          >
                            {step.title}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      {showFlow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 mb-8 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              disabled={currentBlockIndex === 0}
              className={`text-white/70 hover:text-white ${currentBlockIndex === 0 ? 'invisible' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Previous</span>
            </Button>
            
            <div className="text-center">
              <h3 className="text-base font-medium text-white">Learning Journey</h3>
              <p className="text-white/60 text-xs">{currentBlockIndex + 1} of {blocks.length}</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={currentBlockIndex === blocks.length - 1}
              className={`text-white/70 hover:text-white ${currentBlockIndex === blocks.length - 1 ? 'invisible' : ''}`}
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
          
          <div className="relative py-4">
            <div className={`absolute top-1/2 left-0 right-0 -translate-y-1/2 ${getConnectorStyles()}`}></div>
            
            <div className="relative flex justify-between items-center">
              {journeySteps.map((step, idx) => {
                const isActive = currentBlockIndex === idx;
                const isPast = currentBlockIndex > idx;
                
                return (
                  <motion.div
                    key={`step-${idx}`}
                    initial={{ scale: 0.9, opacity: 0.7 }}
                    animate={{ 
                      scale: isActive ? 1.1 : 1, 
                      opacity: isActive ? 1 : (isPast ? 0.9 : 0.6)
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => onNavigate(idx)}
                    onMouseOver={() => handleMouseOver(idx)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className={`
                      ${getStepSize()}
                      ${isActive 
                        ? 'bg-white/20 border-2 border-white shadow-glow' 
                        : isPast 
                          ? 'bg-white/15 border border-white/50' 
                          : 'bg-white/10 border border-white/20'
                      }
                      rounded-full flex items-center justify-center z-10
                    `}>
                      {step.icon}
                    </div>
                    
                    <AnimatePresence>
                      {(isActive || highlightedStep === idx) && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute top-full mt-2 text-center px-1.5 py-0.5 bg-white/10 backdrop-blur-sm rounded text-xs text-white/90 whitespace-nowrap max-w-[100px] overflow-hidden text-ellipsis"
                        >
                          {step.title}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CosmicFlow;
