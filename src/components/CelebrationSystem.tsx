
import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationSystemProps {
  trigger: boolean;
  onComplete?: () => void;
  intensity?: 'low' | 'medium' | 'high';
}

const CelebrationSystem: React.FC<CelebrationSystemProps> = ({ 
  trigger, 
  onComplete, 
  intensity = 'medium' 
}) => {
  // Use a ref to track previous trigger value to avoid duplicate celebrations
  const previousTriggerRef = useRef(false);
  // Use a ref to track if confetti has been fired
  const confettiFiredRef = useRef(false);

  useEffect(() => {
    // Only trigger confetti if trigger changed from false to true
    if (trigger && !previousTriggerRef.current && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      
      const particleCount = intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 150;
      const spread = intensity === 'low' ? 60 : intensity === 'medium' ? 80 : 100;
      
      confetti({
        particleCount,
        spread,
        origin: { y: 0.6 },
        zIndex: 2000,
        colors: ['#8b5cf6', '#d946ef', '#3b82f6', '#6366f1', '#ec4899']
      });
      
      // For high intensity, add multiple bursts
      if (intensity === 'high') {
        setTimeout(() => {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.7, x: 0.3 },
            zIndex: 2000,
            colors: ['#8b5cf6', '#d946ef', '#3b82f6']
          });
        }, 250);
        
        setTimeout(() => {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.7, x: 0.7 },
            zIndex: 2000,
            colors: ['#8b5cf6', '#d946ef', '#3b82f6']
          });
        }, 500);
      }
      
      // Call onComplete after animation finishes
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
        // Reset the flag after the celebration is complete
        confettiFiredRef.current = false;
      }, 2000);
    }
    
    // Update previous trigger value
    previousTriggerRef.current = trigger;
  }, [trigger, intensity, onComplete]);
  
  return null; // This component doesn't render anything
};

export default CelebrationSystem;
