
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles, Star, Zap } from 'lucide-react';

interface SparksSystemProps {
  sparksCount: number;
  onSparkClick?: () => void;
  animate?: boolean;
  className?: string;
  variant?: 'standard' | 'energetic' | 'cosmic';
}

const SparksSystem: React.FC<SparksSystemProps> = ({ 
  sparksCount, 
  onSparkClick, 
  animate = true,
  className = '',
  variant = 'standard'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparksAnimation = useAnimation();
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>(
    sparksCount < 50 ? 'low' : sparksCount < 200 ? 'medium' : 'high'
  );
  const [particlesVisible, setParticlesVisible] = useState(false);
  
  useEffect(() => {
    // Update energy level based on spark count
    setEnergyLevel(
      sparksCount < 50 ? 'low' : sparksCount < 200 ? 'medium' : 'high'
    );
    
    if (animate) {
      const animationVariant = 
        variant === 'energetic' ? {
          scale: [1, 1.2, 1],
          opacity: [0.9, 1, 0.9],
        } :
        variant === 'cosmic' ? {
          scale: [1, 1.1, 0.95, 1.1, 1],
          rotate: [0, 2, -2, 2, 0],
          opacity: [0.9, 1, 0.95, 1, 0.9],
        } : {
          scale: [1, 1.1, 1],
          opacity: [0.9, 1, 0.9],
        };
      
      sparksAnimation.start({
        ...animationVariant,
        transition: {
          duration: variant === 'cosmic' ? 4 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    }
  }, [animate, sparksAnimation, sparksCount, variant]);
  
  const handleSparkClick = () => {
    setParticlesVisible(true);
    setTimeout(() => setParticlesVisible(false), 1500);
    
    if (onSparkClick) {
      // Create spark explosion animation
      const container = containerRef.current;
      if (!container) return;
      
      // Number of particles based on energy level
      const particleCount = energyLevel === 'low' ? 10 : 
                           energyLevel === 'medium' ? 15 : 20;
      
      for (let i = 0; i < particleCount; i++) {
        const spark = document.createElement('div');
        spark.classList.add('absolute', 'h-1', 'w-1', 'rounded-full');
        
        // Color based on variant
        if (variant === 'standard') {
          spark.classList.add('bg-wonderwhiz-gold');
        } else if (variant === 'energetic') {
          spark.classList.add(Math.random() > 0.5 ? 'bg-wonderwhiz-bright-pink' : 'bg-wonderwhiz-vibrant-yellow');
        } else { // cosmic
          const hue = Math.floor(Math.random() * 60) + 240; // Blue-purple range
          spark.style.backgroundColor = `hsl(${hue}, 80%, 70%)`;
        }
        
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
    const maxSparks = variant === 'cosmic' ? 7 : 5; // Show more for cosmic variant
    const visibleSparks = Math.min(maxSparks, sparksCount > 0 ? Math.ceil(Math.log10(sparksCount)) : 1);
    const sparkElements = [];
    
    for (let i = 0; i < visibleSparks; i++) {
      sparkElements.push(
        <motion.div 
          key={i}
          animate={sparksAnimation}
          className="relative"
          style={{ transformOrigin: 'center' }}
        >
          {variant === 'standard' && (
            <Sparkles 
              className="text-wonderwhiz-gold h-4 w-4" 
              style={{ filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))' }}
            />
          )}
          
          {variant === 'energetic' && (
            <Zap 
              className="text-wonderwhiz-vibrant-yellow h-4 w-4" 
              style={{ filter: 'drop-shadow(0 0 3px rgba(255, 220, 0, 0.6))' }}
            />
          )}
          
          {variant === 'cosmic' && (
            <Star 
              className="text-wonderwhiz-bright-pink h-4 w-4" 
              style={{ filter: 'drop-shadow(0 0 3px rgba(255, 105, 180, 0.6))' }}
            />
          )}
        </motion.div>
      );
    }
    
    return sparkElements;
  };
  
  // Small ambient particles that float around the sparks when active
  const renderAmbientParticles = () => {
    if (!particlesVisible) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: variant === 'standard' ? 'rgba(255, 215, 0, 0.6)' :
                             variant === 'energetic' ? 'rgba(255, 105, 180, 0.6)' :
                             `hsl(${Math.floor(Math.random() * 60) + 240}, 80%, 70%)`,
              left: '50%',
              top: '50%',
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x: (Math.random() - 0.5) * 40,
              y: (Math.random() - 0.5) * 40,
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 1 + Math.random() * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <motion.div 
      ref={containerRef}
      className={`relative flex items-center gap-0.5 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSparkClick}
    >
      <div className="flex items-center relative">
        {generateSparks()}
        {renderAmbientParticles()}
      </div>
      
      <span 
        className={`font-bold ml-1 ${
          variant === 'standard' ? 'text-wonderwhiz-gold' :
          variant === 'energetic' ? 'text-wonderwhiz-vibrant-yellow' :
          'text-wonderwhiz-bright-pink'
        }`}
      >
        {sparksCount > 999 ? `${(sparksCount / 1000).toFixed(1)}k` : sparksCount}
      </span>
      
      {/* Energy level indicator */}
      <motion.div 
        className={`absolute -bottom-3 left-0 right-0 h-0.5 rounded-full ${
          variant === 'standard' ? 'bg-wonderwhiz-gold/50' :
          variant === 'energetic' ? 'bg-wonderwhiz-vibrant-yellow/50' :
          'bg-wonderwhiz-bright-pink/50'
        }`}
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: energyLevel === 'low' ? 0.3 : 
                  energyLevel === 'medium' ? 0.6 : 1
        }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
};

export default SparksSystem;
