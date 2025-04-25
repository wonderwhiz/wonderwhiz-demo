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
        <motion.div
          className="relative mx-auto w-full max-w-lg min-h-[200px]"
          initial={false}
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
            transition: {
              type: "spring",
              stiffness: 80,
              damping: 12
            }
          }}
        >
          {/* Front of card */}
          <div className={`absolute w-full h-full backface-hidden ${
            isFlipped ? 'invisible' : 'visible'
          } bg-gradient-to-br ${getFrontGradient()} rounded-xl border-2 border-white/20 shadow-lg`}>
            <div className="p-6">
              <motion.p 
                className={`text-white font-medium ${childAge && childAge <= 8 ? 'text-xl' : 'text-lg'} text-center`}
                initial={false}
                animate={{ 
                  scale: isFlipped ? 0.8 : 1,
                  opacity: isFlipped ? 0 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                {content.front}
              </motion.p>
            </div>
          </div>

          {/* Back of card */}
          <div 
            className={`absolute w-full h-full backface-hidden ${
              !isFlipped ? 'invisible' : 'visible'
            } bg-gradient-to-br ${getFrontGradient()} rounded-xl border-2 border-white/20 shadow-lg`}
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="p-6">
              <motion.p 
                className={`text-white font-medium ${childAge && childAge <= 8 ? 'text-xl' : 'text-lg'} text-center`}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isFlipped ? 1 : 0,
                  transition: { delay: 0.2 }
                }}
              >
                {content.back}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      <Button 
        onClick={handleFlip}
        className="mt-4 mx-auto block bg-white/10 hover:bg-white/20 text-white border border-white/20"
      >
        {isFlipped ? (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            Show Question
          </motion.span>
        ) : (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            Reveal Answer
          </motion.span>
        )}
      </Button>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default FlashcardBlock;
