import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationSystemProps {
  trigger?: boolean;
  milestone?: 'first_block' | 'half_complete' | 'all_complete' | null;
  sparksEarned?: number;
  achievement?: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
  };
  onComplete?: () => void;
  intensity?: 'low' | 'medium' | 'high';
  childAge?: number;
  position?: 'top' | 'center';
  onClose?: () => void;
}

const CelebrationSystem: React.FC<CelebrationSystemProps> = ({ 
  trigger = false,
  milestone,
  sparksEarned = 0,
  achievement,
  onComplete, 
  intensity = 'low',
  childAge = 10,
  position = 'top',
  onClose
}) => {
  // Use refs to track celebrations and prevent duplicates
  const lastCelebrationTime = useRef<number>(0);
  const celebrationCooldown = 30000; // 30 seconds between celebrations
  const milestoneShownRef = useRef<Set<string>>(new Set());
  const achievementShownRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const now = Date.now();
    const shouldCelebrate = now - lastCelebrationTime.current > celebrationCooldown;
    
    // Only celebrate significant milestones with very subtle effects
    if (milestone === 'all_complete' && !milestoneShownRef.current.has(milestone) && shouldCelebrate) {
      milestoneShownRef.current.add(milestone);
      lastCelebrationTime.current = now;
      
      // Very subtle confetti for major milestones only
      confetti({
        particleCount: 8,
        spread: 30,
        origin: { y: 0.8 },
        zIndex: 1000,
        colors: ['#8b5cf6', '#d946ef']
      });
      
      if (onComplete) {
        setTimeout(onComplete, 800);
      }
      
      return;
    }
    
    // No celebrations for regular achievements or sparks - keep it clean
  }, [trigger, milestone, achievement, intensity, onComplete]);
  
  // Reset milestone tracking when component unmounts
  useEffect(() => {
    return () => {
      milestoneShownRef.current.clear();
      achievementShownRef.current.clear();
    };
  }, []);
  
  return null; // This component doesn't render anything visible
};

export default CelebrationSystem;
