
import React from 'react';

interface CelebrationSystemProps {
  childId: string;
  streakDays: number;
  sparksBalance: number;
  explorationsCount: number;
}

// Completely simplified - no popups, no celebrations, just clean experience
const CelebrationSystem: React.FC<CelebrationSystemProps> = () => {
  // This component no longer shows any celebrations or popups
  // All celebration logic has been removed for a cleaner experience
  return null;
};

export default CelebrationSystem;
