
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingParticleProps {
  size?: number;
  color?: string;
  duration?: number;
  delay?: number;
  pattern?: 'float' | 'spiral' | 'pulse' | 'zigzag';
  interactive?: boolean;
  onClick?: () => void;
  amplitude?: number;
  speed?: number;
}

const FloatingParticle: React.FC<FloatingParticleProps> = ({
  size = 4,
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 15,
  delay = 0,
  pattern = 'float',
  interactive = false,
  onClick,
  amplitude = 50,
  speed = 1
}) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100
  });
  
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    // Set random initial position
    setPosition({
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }, []);
  
  // Generate animation properties based on pattern
  const getAnimationProps = () => {
    const baseProps = {
      y: [0, -Math.random() * amplitude - 20],
      opacity: [0, 0.7, 0],
    };
    
    switch (pattern) {
      case 'spiral':
        return {
          ...baseProps,
          rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          x: [0, Math.sin(Math.random() * Math.PI * 2) * amplitude],
        };
      case 'pulse':
        return {
          ...baseProps,
          scale: [1, 1 + Math.random(), 1],
          x: [0, (Math.random() - 0.5) * 20],
        };
      case 'zigzag':
        return {
          ...baseProps,
          x: [0, 30, -30, 20, -20, 0],
        };
      default: // float
        return {
          ...baseProps,
          x: [0, (Math.random() - 0.5) * 30],
          rotate: [0, Math.random() * 360],
        };
    }
  };
  
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${interactive ? 'cursor-pointer pointer-events-auto' : ''}`}
      style={{
        width: size,
        height: size,
        backgroundColor: hovered ? 'rgba(255,255,255,0.8)' : color,
        left: `${position.x}%`,
        top: `${position.y}%`,
        boxShadow: hovered ? `0 0 ${size/2}px rgba(255,255,255,0.6)` : 'none',
        transition: 'background-color 0.3s, box-shadow 0.3s',
      }}
      animate={getAnimationProps()}
      transition={{
        duration: (duration + Math.random() * 5) / speed,
        delay: delay + Math.random() * 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop"
      }}
      whileHover={interactive ? { scale: 1.5 } : undefined}
      onHoverStart={interactive ? () => setHovered(true) : undefined}
      onHoverEnd={interactive ? () => setHovered(false) : undefined}
      onClick={interactive ? onClick : undefined}
    />
  );
};

export default FloatingParticle;
