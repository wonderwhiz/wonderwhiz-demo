
import { useState, useEffect } from 'react';

export const useSparksSystem = (profileId?: string) => {
  const [streakDays, setStreakDays] = useState(3);

  useEffect(() => {
    // Mock streak calculation
    if (profileId) {
      setStreakDays(Math.floor(Math.random() * 10) + 1);
    }
  }, [profileId]);

  return {
    streakDays
  };
};
