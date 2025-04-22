
import { useState, useEffect } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  pullDistance?: number;
  disabled?: boolean;
}

export function usePullToRefresh({ onRefresh, pullDistance = 100, disabled = false }: PullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (disabled) return;

    let touchStartY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = Math.max(0, (currentY - touchStartY) * 0.5);
      
      if (deltaY > 0 && window.scrollY === 0) {
        setPullY(deltaY);
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      
      setIsPulling(false);
      
      if (pullY >= pullDistance) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setPullY(0);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, isPulling, onRefresh, pullDistance, pullY]);

  return {
    pullY,
    isRefreshing,
    isPulling
  };
}
