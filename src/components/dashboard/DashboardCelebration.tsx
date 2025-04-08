
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface DashboardCelebrationProps {
  childProfile: {
    streak_days: number;
    name: string;
  } | null;
  isLoaded: boolean;
}

const DashboardCelebration: React.FC<DashboardCelebrationProps> = ({ 
  childProfile, 
  isLoaded 
}) => {
  useEffect(() => {
    if (childProfile && isLoaded) {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#8b5cf6', '#ec4899', '#3b82f6']
        });
        
        if (childProfile.streak_days > 0) {
          toast.success(
            <div className="flex flex-col items-center">
              <span className="font-bold">{childProfile.streak_days} day streak!</span>
              <span className="text-sm">Keep learning to earn more sparks! ✨</span>
            </div>,
            { position: "bottom-center", duration: 5000 }
          );
        }
      }, 800);
    }
  }, [childProfile, isLoaded]);

  return null; // This is a side-effect component with no UI
};

export default DashboardCelebration;
