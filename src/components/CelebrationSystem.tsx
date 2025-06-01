
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
  const celebrationCooldown = 15000; // 15 seconds between celebrations
  const milestoneShownRef = useRef<Set<string>>(new Set());
  const achievementShownRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const now = Date.now();
    const shouldCelebrate = now - lastCelebrationTime.current > celebrationCooldown;
    
    // Handle milestone celebrations
    if (milestone && !milestoneShownRef.current.has(milestone) && shouldCelebrate) {
      milestoneShownRef.current.add(milestone);
      lastCelebrationTime.current = now;
      
      // Reduced particle counts for milestones
      const particleCount = 15;
      const spread = 40;
      
      confetti({
        particleCount,
        spread,
        origin: { y: 0.7 },
        zIndex: 2000,
        colors: ['#8b5cf6', '#d946ef', '#3b82f6']
      });
      
      if (onComplete) {
        setTimeout(onComplete, 1500);
      }
      
      return;
    }
    
    // Handle achievement celebrations
    if (achievement && !achievementShownRef.current.has(achievement.id) && shouldCelebrate) {
      achievementShownRef.current.add(achievement.id);
      lastCelebrationTime.current = now;
      
      // Slightly more particles for achievements
      const particleCount = 25;
      const spread = 50;
      
      confetti({
        particleCount,
        spread,
        origin: { y: 0.6 },
        zIndex: 2000,
        colors: [achievement.color, '#8b5cf6', '#d946ef']
      });
      
      if (onComplete) {
        setTimeout(onComplete, 2000);
      }
      
      return;
    }
    
    // Handle basic trigger celebrations (legacy support)
    if (trigger && shouldCelebrate) {
      lastCelebrationTime.current = now;
      
      const particleCount = intensity === 'low' ? 10 : intensity === 'medium' ? 20 : 30;
      const spread = intensity === 'low' ? 30 : intensity === 'medium' ? 40 : 50;
      
      confetti({
        particleCount,
        spread,
        origin: { y: 0.6 },
        zIndex: 2000,
        colors: ['#8b5cf6', '#d946ef', '#3b82f6']
      });
      
      if (onComplete) {
        setTimeout(onComplete, 1000);
      }
    }
  }, [trigger, milestone, achievement, intensity, onComplete]);
  
  // Reset milestone tracking when component unmounts or resets
  useEffect(() => {
    return () => {
      milestoneShownRef.current.clear();
      achievementShownRef.current.clear();
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default CelebrationSystem;
