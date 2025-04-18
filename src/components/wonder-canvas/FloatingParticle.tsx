import React, { useEffect, useState, useRef } from 'react';
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
  glow?: boolean;
  trailEffect?: boolean;
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
  speed = 1,
  glow = false,
  trailEffect = false
}) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100
  });
  
  const [hovered, setHovered] = useState(false);
  const [trailElements, setTrailElements] = useState<Array<{id: number, x: number, y: number, opacity: number}>>([]);
  const particleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }, []);
  
  useEffect(() => {
    if (!trailEffect || !particleRef.current) return;
    
    let trailCount = 0;
    let prevX = 0;
    let prevY = 0;
    
    const updateTrail = () => {
      if (!particleRef.current) return;
      
      const rect = particleRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
      
      if (distance > 5 || trailElements.length === 0) {
        prevX = x;
        prevY = y;
        
        setTrailElements(prev => {
          const newTrail = {
            id: trailCount++,
            x,
            y,
            opacity: 0.7
          };
          
          return [...prev, newTrail].slice(-5).map((el, index) => ({
            ...el,
            opacity: 0.7 * ((index + 1) / trailElements.length)
          }));
        });
      }
    };
    
    const intervalId = setInterval(updateTrail, 100);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [trailEffect, trailElements]);
  
  const getAnimationProps = () => {
    const baseProps = {
      y: [0, -Math.random() * amplitude - 20],
      opacity: [0, 0.7, 0],
    };
    
    const patternSpecificProps = (() => {
      switch (pattern) {
        case 'spiral':
          return {
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            x: [0, Math.sin(Math.random() * Math.PI * 2) * amplitude],
            scale: [1, Math.random() * 0.5 + 1, 1]
          };
        case 'pulse':
          return {
            scale: [1, 1 + Math.random(), 0.5 + Math.random(), 1],
            x: [0, (Math.random() - 0.5) * 20],
            boxShadow: glow ? [
              '0 0 0px transparent',
              `0 0 ${size * 2}px ${color.replace(/[^,]+(?=\))/, '0.7')}`,
              '0 0 0px transparent'
            ] : undefined
          };
        case 'zigzag':
          return {
            x: [0, 30, -30, 20, -20, 0],
            rotate: [0, 15, -15, 10, -10, 0]
          };
        default: // float
          return {
            x: [0, (Math.random() - 0.5) * 30],
            rotate: [0, Math.random() * 360],
            scale: [1, 1 + Math.random() * 0.3]
          };
      }
    })();
    
    return {
      ...baseProps,
      ...patternSpecificProps
    };
  };

  const getGlowStyle = () => {
    if (!glow) return {};
    
    const glowColor = color.replace(/[\d.]+\)$/, '0.6)');
    const glowSize = size * (hovered ? 3 : 1.5);
    
    return {
      boxShadow: `0 0 ${glowSize}px ${glowColor}`
    };
  };
  
  const renderTrail = () => {
    if (!trailEffect) return null;
    
    return trailElements.map(trail => (
      <div
        key={trail.id}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          backgroundColor: color.replace(/[\d.]+\)$/, `${trail.opacity})`),
          left: trail.x,
          top: trail.y,
          transform: 'translate(-50%, -50%)',
          opacity: trail.opacity
        }}
      />
    ));
  };
  
  return (
    <>
      {renderTrail()}
      
      <motion.div
        ref={particleRef}
        className={`absolute rounded-full pointer-events-none ${interactive ? 'cursor-pointer pointer-events-auto' : ''}`}
        style={{
          width: size,
          height: size,
          backgroundColor: hovered ? 'rgba(255,255,255,0.8)' : color,
          left: `${position.x}%`,
          top: `${position.y}%`,
          ...getGlowStyle(),
          transition: 'background-color 0.3s, box-shadow 0.3s',
        }}
        animate={getAnimationProps()}
        transition={{
          duration: (duration + Math.random() * 5) / speed,
          delay: delay + Math.random() * 2,
          ease: pattern === 'zigzag' ? 'easeInOut' : 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop'
        }}
        whileHover={interactive ? { scale: 1.5 } : undefined}
        onHoverStart={interactive ? () => setHovered(true) : undefined}
        onHoverEnd={interactive ? () => setHovered(false) : undefined}
        onClick={interactive ? onClick : undefined}
      />
    </>
  );
};

export default FloatingParticle;
