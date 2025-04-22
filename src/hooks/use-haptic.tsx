
import { useCallback } from 'react';

type HapticType = 'success' | 'error' | 'warning' | 'light';

export function useHaptic() {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    if (!navigator.vibrate) return;

    switch (type) {
      case 'success':
        navigator.vibrate([50]);
        break;
      case 'error':
        navigator.vibrate([100, 50, 100]);
        break;
      case 'warning':
        navigator.vibrate([50, 30, 50]);
        break;
      case 'light':
        navigator.vibrate([10]);
        break;
      default:
        navigator.vibrate([15]);
    }
  }, []);

  return { triggerHaptic };
}
