
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SparksBadgeProps {
  sparks: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAnimation?: boolean;
  className?: string;
}

const SparksBadge: React.FC<SparksBadgeProps> = ({ 
  sparks, 
  size = 'md', 
  showAnimation = false,
  className = '' 
}) => {
  const [displaySparks, setDisplaySparks] = useState(sparks);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Animate the sparks change if there's a difference
    if (sparks !== displaySparks) {
      setIsAnimating(true);
      
      // Gradually increment the display value
      const diff = sparks - displaySparks;
      const increment = Math.max(1, Math.abs(Math.floor(diff / 10)));
      const direction = diff > 0 ? 1 : -1;
      
      const timer = setInterval(() => {
        setDisplaySparks(prev => {
          const next = prev + (increment * direction);
          if ((direction > 0 && next >= sparks) || (direction < 0 && next <= sparks)) {
            clearInterval(timer);
            setTimeout(() => setIsAnimating(false), 1000);
            return sparks;
          }
          return next;
        });
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [sparks, displaySparks]);
  
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-1 px-2',
    lg: 'text-base py-1.5 px-3',
    xl: 'text-lg py-2 px-4'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };
  
  return (
    <motion.div
      className={`flex items-center space-x-1 rounded-full bg-gradient-to-r from-amber-500/70 to-amber-600/70 text-white font-medium ${sizeClasses[size]} ${className}`}
      initial={{ scale: 1 }}
      animate={isAnimating || showAnimation ? { 
        scale: [1, 1.1, 1],
        boxShadow: [
          "0px 0px 0px rgba(255,199,44,0)",
          "0px 0px 15px rgba(255,199,44,0.6)",
          "0px 0px 0px rgba(255,199,44,0)"
        ]
      } : {}}
      transition={{ duration: 1 }}
    >
      <Sparkles className={`${iconSizes[size]} text-wonderwhiz-gold`} />
      <AnimatePresence mode="wait">
        <motion.span 
          key={displaySparks}
          initial={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -10 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          {displaySparks.toLocaleString()}
        </motion.span>
      </AnimatePresence>
      
      {/* Floating sparkles when animating */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                className="absolute"
                initial={{ 
                  opacity: 1, 
                  scale: 0,
                  x: '50%',
                  y: '50%'
                }}
                animate={{ 
                  opacity: [1, 0],
                  scale: [0, 1.5],
                  x: ['50%', `${30 + (i * 10)}%`],
                  y: ['50%', `${20 - (i * 10)}%`]
                }}
                transition={{ 
                  duration: 1 + (i * 0.2),
                  ease: "easeOut"
                }}
              >
                <Sparkles className="h-2 w-2 text-wonderwhiz-gold" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SparksBadge;
