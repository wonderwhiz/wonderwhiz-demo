
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
  // Add a cooldown mechanism
  const lastCelebrationTime = useRef<number>(0);
  const celebrationCooldown = 8000; // Increased from 5000 to 8000ms (8 seconds between celebrations)

  useEffect(() => {
    const now = Date.now();
    const shouldCelebrate = now - lastCelebrationTime.current > celebrationCooldown;
    
    // Only trigger confetti if trigger changed from false to true, not in cooldown, and not already fired
    if (trigger && !previousTriggerRef.current && !confettiFiredRef.current && shouldCelebrate) {
      confettiFiredRef.current = true;
      lastCelebrationTime.current = now;
      
      // Further reduce particle counts for all intensities
      const particleCount = intensity === 'low' ? 20 : intensity === 'medium' ? 40 : 60;
      const spread = intensity === 'low' ? 40 : intensity === 'medium' ? 60 : 80;
      
      confetti({
        particleCount,
        spread,
        origin: { y: 0.6 },
        zIndex: 2000,
        colors: ['#8b5cf6', '#d946ef', '#3b82f6', '#6366f1', '#ec4899']
      });
      
      // Only add additional burst for high intensity, and reduce its particles too
      if (intensity === 'high') {
        setTimeout(() => {
          confetti({
            particleCount: 30, // Reduced from 50
            spread: 60, // Reduced from 70
            origin: { y: 0.7, x: 0.5 },
            zIndex: 2000,
            colors: ['#8b5cf6', '#d946ef', '#3b82f6']
          });
        }, 300);
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
