
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  magneticPull?: number;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  magneticPull = 30,
  onClick
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    
    // Calculate center of button
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Calculate pull effect (stronger when closer to center)
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const maxDistance = rect.width / 2; // Use half of button width as max distance
    
    // Only apply effect within reasonable distance
    if (distance < maxDistance * 2) {
      const pull = (1 - Math.min(distance / maxDistance, 1)) * magneticPull;
      setPosition({
        x: (distanceX / maxDistance) * pull,
        y: (distanceY / maxDistance) * pull
      });
    }
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <div 
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={buttonRef}
    >
      <motion.div
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1
        }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default MagneticButton;
