
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Mic, Search, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WonderOrbProps {
  onSearch: (query: string) => void;
  onVoiceInput: (transcript: string) => void;
  onLongPress?: () => void;
  childAge?: number;
  isListening?: boolean;
}

const WonderOrb: React.FC<WonderOrbProps> = ({
  onSearch,
  onVoiceInput,
  onLongPress,
  childAge = 8,
  isListening = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [isPressing, setIsPressing] = useState(false);
  const pressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const orbControls = useAnimation();

  // Pulsing animation
  useEffect(() => {
    const pulse = async () => {
      await orbControls.start({
        scale: [1, 1.05, 1],
        transition: { 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    };
    pulse();
  }, []);

  const handleOrbClick = () => {
    // Only expand if not triggered by long press
    if (!isPressing) {
      setIsExpanded(!isExpanded);
      
      if (!isExpanded) {
        toast.success(childAge < 8 ? "What would you like to explore?" : "Ask me anything!");
      }
    }
  };
  
  const handlePressStart = () => {
    setIsPressing(true);
    
    // Setup long press detection
    pressTimeoutRef.current = setTimeout(() => {
      if (onLongPress) {
        onLongPress();
        
        // Visual feedback
        orbControls.start({
          scale: [1, 1.2, 1],
          transition: { duration: 0.5 }
        });
      }
      setIsPressing(false);
    }, 800); // Consider a press longer than 800ms as a long press
  };
  
  const handlePressEnd = () => {
    // Clear the timeout to prevent long press if released quickly
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
      pressTimeoutRef.current = null;
    }
    
    // If this was a short press, trigger normal click after a short delay
    if (isPressing) {
      setTimeout(() => {
        setIsPressing(false);
        handleOrbClick();
      }, 50);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
      setIsExpanded(false);
    }
  };

  return (
    <motion.div 
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
      animate={orbControls}
    >
      <motion.div
        className={`rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink via-wonderwhiz-purple to-wonderwhiz-cyan 
          backdrop-blur-xl shadow-2xl cursor-pointer overflow-hidden
          ${isExpanded ? 'w-96 h-96' : 'w-32 h-32'}`}
        animate={{ 
          width: isExpanded ? 384 : 128,
          height: isExpanded ? 384 : 128,
          borderRadius: '100%'
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        onClick={handleOrbClick}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
          initial={false}
          animate={{ rotate: isExpanded ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isExpanded ? (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                className="w-full h-full p-8 flex flex-col items-center justify-center gap-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={childAge < 8 ? "What would you like to learn about?" : "Ask your question..."}
                      className="w-full px-6 py-4 rounded-full bg-white/20 text-white placeholder-white/60 
                        outline-none focus:ring-2 focus:ring-white/40 text-lg"
                      autoFocus
                    />
                    <Button 
                      type="submit"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30"
                    >
                      <Search className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </form>

                <Button
                  variant="ghost"
                  size="lg"
                  className={`rounded-full p-6 ${isListening ? 'bg-wonderwhiz-bright-pink text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  onClick={() => onVoiceInput("")}
                >
                  <Mic className={`w-8 h-8 ${isListening ? 'animate-pulse' : ''}`} />
                </Button>

                <div className="text-white/60 text-sm">
                  {childAge < 10 ? (
                    <div className="flex gap-2 text-2xl">
                      {["✨", "🌟", "💫", "⭐️"].map((star, i) => (
                        <motion.span
                          key={i}
                          animate={{ 
                            rotate: [0, 20, -20, 0],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity
                          }}
                        >
                          {star}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <p>Hold orb to see tasks</p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WonderOrb;
