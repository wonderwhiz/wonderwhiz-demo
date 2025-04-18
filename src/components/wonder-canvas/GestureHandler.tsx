
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface GestureHandlerProps {
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onPinch: (scale: number) => void;
  onSpread: (scale: number) => void;
  children: React.ReactNode;
  minSwipeDistance?: number;
  disabled?: boolean;
}

const GestureHandler: React.FC<GestureHandlerProps> = ({
  onSwipe,
  onPinch,
  onSpread,
  children,
  minSwipeDistance = 50,
  disabled = false
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchDistanceRef = useRef<number | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (disabled || e.touches.length > 2) return;
      
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      } else if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchDistanceRef.current = distance;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (disabled || !touchStartRef.current) return;

      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartRef.current.x;
        const deltaY = e.touches[0].clientY - touchStartRef.current.y;
        
        if (Math.abs(deltaX) >= minSwipeDistance) {
          onSwipe(deltaX > 0 ? 'right' : 'left');
          touchStartRef.current = null;
        } else if (Math.abs(deltaY) >= minSwipeDistance) {
          onSwipe(deltaY > 0 ? 'down' : 'up');
          touchStartRef.current = null;
        }
      } else if (e.touches.length === 2 && touchDistanceRef.current) {
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        
        const scale = currentDistance / touchDistanceRef.current;
        
        if (scale < 1) {
          onPinch(scale);
        } else if (scale > 1) {
          onSpread(scale);
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
      touchDistanceRef.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, minSwipeDistance, onPinch, onSpread, onSwipe]);

  return (
    <motion.div 
      className="w-full h-full"
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

export default GestureHandler;
