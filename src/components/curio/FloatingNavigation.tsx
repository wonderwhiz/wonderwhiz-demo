
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, XCircle, PlusCircle, MenuSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSpecialistInfo } from '@/utils/specialists';

interface FloatingNavigationProps {
  blocks: any[];
  currentBlockIndex: number;
  onNavigate: (index: number) => void;
  onQuickJump?: () => void;
  onClose?: () => void;
  childAge?: number;
}

const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  blocks,
  currentBlockIndex,
  onNavigate,
  onQuickJump,
  onClose,
  childAge = 10
}) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY + 20) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY - 20) {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Position relative to screen size
  const getPosition = () => {
    // Smaller screens: bottom center
    if (window.innerWidth < 640) {
      return "fixed bottom-6 left-1/2 transform -translate-x-1/2";
    }
    // Larger screens: right side
    return "fixed right-6 top-1/2 transform -translate-y-1/2";
  };
  
  const isFirstBlock = currentBlockIndex === 0;
  const isLastBlock = currentBlockIndex === blocks.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`${getPosition()} z-50`}
        >
          <motion.div
            className="bg-wonderwhiz-deep-purple/80 backdrop-blur-md border border-wonderwhiz-purple/30 rounded-lg shadow-lg p-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex md:flex-col items-center gap-2">
              {/* Compact Controls */}
              {!expanded ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 h-10 w-10"
                    onClick={() => onNavigate(Math.max(0, currentBlockIndex - 1))}
                    disabled={isFirstBlock}
                  >
                    <ArrowUpCircle className={`h-5 w-5 ${isFirstBlock ? 'text-white/30' : 'text-white/80'}`} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-wonderwhiz-bright-pink/20 text-white hover:bg-wonderwhiz-bright-pink/30 rounded-full p-2 h-10 w-10"
                    onClick={() => setExpanded(!expanded)}
                  >
                    <MenuSquare className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 h-10 w-10"
                    onClick={() => onNavigate(Math.min(blocks.length - 1, currentBlockIndex + 1))}
                    disabled={isLastBlock}
                  >
                    <ArrowDownCircle className={`h-5 w-5 ${isLastBlock ? 'text-white/30' : 'text-white/80'}`} />
                  </Button>
                </>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-2"
                  >
                    <div className="flex md:flex-col gap-2 items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-white hover:bg-white/10 text-xs p-1"
                        onClick={() => setExpanded(false)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        <span>Close</span>
                      </Button>
                      
                      <div className="px-2 py-1 bg-white/10 rounded text-xs text-white/70">
                        Block {currentBlockIndex + 1}/{blocks.length}
                      </div>
                      
                      {/* Block quick navigation */}
                      <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <div className="space-y-1 p-1">
                          {blocks.slice(0, Math.min(blocks.length, 8)).map((block, index) => {
                            const specialist = getSpecialistInfo(block.specialist_id);
                            const isActive = index === currentBlockIndex;
                            
                            return (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className={`w-full justify-start px-2 py-1 ${isActive ? 'bg-wonderwhiz-purple/40 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                onClick={() => onNavigate(index)}
                              >
                                <img 
                                  src={specialist.avatar} 
                                  alt={specialist.name} 
                                  className="h-4 w-4 rounded-full mr-1"
                                />
                                <span className="text-xs truncate">
                                  {childAge <= 8 ? 'Block' : ''} {index + 1}
                                </span>
                              </Button>
                            );
                          })}
                          
                          {blocks.length > 8 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-center text-xs text-white/60 hover:text-white"
                              onClick={onQuickJump}
                            >
                              <PlusCircle className="h-3 w-3 mr-1" />
                              <span>More</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNavigation;
