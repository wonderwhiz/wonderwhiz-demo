
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlipHorizontal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardBlockProps } from './interfaces';
import TiltCard from '@/components/TiltCard';

const FlashcardBlock: React.FC<FlashcardBlockProps> = ({
  content,
  specialistId,
  updateHeight,
  childAge = 10
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [glarePosition, setGlarePosition] = useState<{x: number, y: number} | null>(null);
  const [sparkles, setSparkles] = useState<{x: number, y: number, size: number, delay: number}[]>([]);
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);
  
  useEffect(() => {
    // Generate random sparkles for animation
    const newSparkles = Array(12).fill(null).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 4
    }));
    setSparkles(newSparkles);
    
    // Remove initial animation flag after first animation
    const timer = setTimeout(() => {
      setIsInitialAnimation(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleFlip = () => {
    // Animate the glare across the card during flip
    setGlarePosition({ x: 0, y: 50 });
    
    setTimeout(() => {
      setGlarePosition({ x: 100, y: 50 });
    }, 300);
    
    setTimeout(() => {
      setGlarePosition(null);
      setIsFlipped(!isFlipped);
    }, 600);
  };
  
  // Define enhanced gradients based on the specialist ID for variety
  const getFrontGradient = () => {
    switch(specialistId) {
      case 'nova':
        return 'from-purple-600/30 via-indigo-500/30 to-pink-400/30';
      case 'prism':
        return 'from-blue-600/30 via-cyan-500/30 to-sky-400/30';
      case 'spark':
        return 'from-amber-600/30 via-orange-500/30 to-pink-400/30';
      case 'atlas':
        return 'from-emerald-600/30 via-teal-500/30 to-green-400/30';
      default:
        return 'from-purple-600/30 via-indigo-500/30 to-pink-400/30';
    }
  };
  
  const getBackGradient = () => {
    switch(specialistId) {
      case 'nova':
        return 'from-pink-400/30 via-purple-500/30 to-indigo-600/30';
      case 'prism':
        return 'from-sky-400/30 via-blue-500/30 to-cyan-600/30';
      case 'spark':
        return 'from-pink-400/30 via-amber-500/30 to-orange-600/30';
      case 'atlas':
        return 'from-green-400/30 via-emerald-500/30 to-teal-600/30';
      default:
        return 'from-pink-400/30 via-purple-500/30 to-indigo-600/30';
    }
  };

  return (
    <div className="my-6">
      <div className="relative perspective-1000">
        <div className="relative mx-auto w-full max-w-lg min-h-[200px]">
          {/* Floating sparkles */}
          {sparkles.map((sparkle, index) => (
            <motion.div
              key={`sparkle-${index}`}
              className="absolute w-1 h-1 rounded-full bg-yellow-300 z-20 pointer-events-none"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                boxShadow: '0 0 8px 2px rgba(255, 221, 87, 0.6)',
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [1, 0.7, 1],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3 + sparkle.delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay: sparkle.delay
              }}
            />
          ))}
          
          <motion.div
            className="relative preserve-3d w-full h-full"
            initial={isInitialAnimation ? { rotateY: -5 } : false}
            animate={{ 
              rotateY: isFlipped ? 180 : 0,
              z: isFlipped ? 20 : 0
            }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20
            }}
          >
            {/* Front of card */}
            <TiltCard
              className={`absolute w-full h-full backface-hidden ${
                isFlipped ? 'hidden' : 'block'
              } bg-gradient-to-br ${getFrontGradient()} rounded-xl border-2 border-white/20 shadow-lg shadow-indigo-500/10`}
              glareEnabled={true}
              glarePosition={glarePosition}
              maxTilt={6}
            >
              <div className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                  <motion.div 
                    className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-white/80" />
                  </motion.div>
                  <div className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                    Flashcard
                  </div>
                </div>
                
                <motion.div 
                  className="flex-grow flex items-center justify-center py-4"
                  animate={{ scale: isFlipped ? 0.9 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className={`text-white font-medium ${childAge && childAge <= 8 ? 'text-xl' : 'text-lg'} text-center drop-shadow-lg`}>
                    {content.front}
                  </p>
                </motion.div>
                
                <div className="pt-4 mt-auto border-t border-white/10">
                  <p className="text-xs text-white/60 mb-2 text-center">
                    Tap to reveal
                  </p>
                </div>
              </div>
            </TiltCard>
            
            {/* Back of card */}
            <TiltCard
              className={`absolute w-full h-full backface-hidden ${
                isFlipped ? 'block' : 'hidden'
              } bg-gradient-to-br ${getBackGradient()} rounded-xl border-2 border-white/20 shadow-lg shadow-purple-500/10`}
              glareEnabled={true}
              glarePosition={glarePosition}
              maxTilt={6}
            >
              <div className="p-6 flex flex-col justify-between h-full" style={{ transform: 'rotateY(180deg)' }}>
                <div className="flex items-start justify-between mb-4">
                  <motion.div 
                    className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-white/80" />
                  </motion.div>
                  <div className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                    Answer
                  </div>
                </div>
                
                <motion.div 
                  className="flex-grow flex items-center justify-center py-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: isFlipped ? 1 : 0, scale: isFlipped ? 1 : 0.9 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p className={`text-white font-medium ${childAge && childAge <= 8 ? 'text-xl' : 'text-lg'} text-center drop-shadow-lg`}>
                    {content.back}
                  </p>
                </motion.div>
                
                <div className="pt-4 mt-auto border-t border-white/10">
                  <p className="text-xs text-white/60 mb-2 text-center">
                    Tap to flip back
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={handleFlip}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-lg"
        >
          <FlipHorizontal className="h-4 w-4 mr-2" />
          {childAge && childAge < 8 ? "Flip Card!" : "Flip Card"}
        </Button>
      </div>
      
      {content.hint && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 shadow-inner"
        >
          <p className="text-white/80 text-sm">
            <span className="font-medium">Hint:</span> {content.hint}
          </p>
        </motion.div>
      )}
      
      {/* Add CSS classes as regular CSS */}
      <style>
        {`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        `}
      </style>
    </div>
  );
};

export default FlashcardBlock;
