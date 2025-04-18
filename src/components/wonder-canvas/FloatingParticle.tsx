
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingParticleProps {
  size?: number;
  color?: string;
  duration?: number;
  delay?: number;
}

const FloatingParticle: React.FC<FloatingParticleProps> = ({
  size = 4,
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 15,
  delay = 0
}) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100
  });
  
  useEffect(() => {
    // Set random initial position
    setPosition({
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }, []);
  
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      animate={{
        y: [0, -Math.random() * 100 - 50],
        x: [0, (Math.random() - 0.5) * 30],
        opacity: [0, 0.7, 0],
        rotate: [0, Math.random() * 360],
      }}
      transition={{
        duration: duration + Math.random() * 5,
        delay: delay + Math.random() * 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop"
      }}
    />
  );
};

export default FloatingParticle;
