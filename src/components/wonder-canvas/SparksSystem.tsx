
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SparksSystemProps {
  sparksCount: number;
  onSparkClick?: () => void;
  animate?: boolean;
  className?: string;
}

const SparksSystem: React.FC<SparksSystemProps> = ({ 
  sparksCount, 
  onSparkClick, 
  animate = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparksAnimation = useAnimation();
  
  useEffect(() => {
    if (animate) {
      sparksAnimation.start({
        scale: [1, 1.1, 1],
        opacity: [0.9, 1, 0.9],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    }
  }, [animate, sparksAnimation]);
  
  const handleSparkClick = () => {
    if (onSparkClick) {
      // Create spark explosion animation
      const container = containerRef.current;
      if (!container) return;
      
      for (let i = 0; i < 10; i++) {
        const spark = document.createElement('div');
        spark.classList.add('absolute', 'h-1', 'w-1', 'rounded-full', 'bg-wonderwhiz-gold');
        
        // Random position near the center
        spark.style.left = '50%';
        spark.style.top = '50%';
        spark.style.transform = 'translate(-50%, -50%)';
        spark.style.opacity = '1';
        
        container.appendChild(spark);
        
        // Animate the spark
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40;
        const destinationX = Math.cos(angle) * distance;
        const destinationY = Math.sin(angle) * distance;
        
        spark.animate(
          [
            { transform: 'translate(-50%, -50%)', opacity: 1 },
            { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px))`, opacity: 0 }
          ],
          { 
            duration: 500 + Math.random() * 500, 
            easing: 'cubic-bezier(0.1, 0.7, 0.1, 1)' 
          }
        ).onfinish = () => spark.remove();
      }
      
      onSparkClick();
    }
  };
  
  // Generate visual representation of sparks
  const generateSparks = () => {
    const maxSparks = 5; // Show max 5 spark icons
    const visibleSparks = Math.min(maxSparks, sparksCount);
    const sparkElements = [];
    
    for (let i = 0; i < visibleSparks; i++) {
      sparkElements.push(
        <motion.div 
          key={i}
          animate={sparksAnimation}
          className="relative"
          style={{ transformOrigin: 'center' }}
        >
          <Sparkles 
            className="text-wonderwhiz-gold h-4 w-4" 
            style={{ filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))' }}
          />
        </motion.div>
      );
    }
    
    return sparkElements;
  };
  
  return (
    <motion.div 
      ref={containerRef}
      className={`relative flex items-center gap-0.5 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSparkClick}
    >
      {generateSparks()}
      
      <span className="text-wonderwhiz-gold font-bold ml-1">
        {sparksCount > 999 ? `${(sparksCount / 1000).toFixed(1)}k` : sparksCount}
      </span>
    </motion.div>
  );
};

export default SparksSystem;
