
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glareEnabled?: boolean;
  maxTilt?: number;
  glarePosition?: {x: number, y: number} | null;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  glareEnabled = true,
  maxTilt = 10,
  glarePosition = null,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 0, y: 0, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    const rotateX = maxTilt * (0.5 - (y / rect.height));
    const rotateY = maxTilt * ((x / rect.width) - 0.5);
    
    setRotation({ x: rotateX, y: rotateY });
    
    // Calculate glare position
    if (glareEnabled) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlare({ x: glareX, y: glareY, opacity: 0.2 });
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        scale: isHovered ? 1.05 : 1,
        z: isHovered ? 20 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 15
      }}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
      
      {/* Dynamic glare effect */}
      {glareEnabled && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition ? glarePosition.x + '%' : glare.x + '%'} ${glarePosition ? glarePosition.y + '%' : glare.y + '%'}, rgba(255, 255, 255, ${isHovered ? glare.opacity : 0}) 0%, rgba(255, 255, 255, 0) 80%)`,
            opacity: isHovered || glarePosition ? 1 : 0,
          }}
        />
      )}
      
      {/* Enhanced edge highlight effect */}
      <div className={`absolute inset-0 border border-white/20 rounded-inherit pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-30' : 'opacity-0'}`} />
      
      {/* Depth shadow effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.2)',
          opacity: isHovered ? 0.6 : 0,
        }}
      />
    </motion.div>
  );
};

export default TiltCard;
