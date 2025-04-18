import { useState, useEffect, useCallback } from 'react';

interface AppPerformanceOptions {
  offlineFirst?: boolean;
  checkInterval?: number; // in ms
  lowPerformanceThreshold?: number; // FPS threshold for low performance mode
}

interface AppPerformanceState {
  isOnline: boolean;
  isLowPerformanceDevice: boolean;
  fps: number;
  isBatteryLow?: boolean;
  dataSaver?: boolean;
  prefersReducedMotion: boolean;
}

export function useAppPerformance({
  offlineFirst = true,
  checkInterval = 5000,
  lowPerformanceThreshold = 30
}: AppPerformanceOptions = {}) {
  const [performanceState, setPerformanceState] = useState<AppPerformanceState>({
    isOnline: navigator.onLine,
    isLowPerformanceDevice: false,
    fps: 60,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  });
  
  // Check for online status
  useEffect(() => {
    const handleOnline = () => {
      setPerformanceState(prev => ({ ...prev, isOnline: true }));
      
      // If we're coming back online, sync any cached data
      if (offlineFirst) {
        // This would connect to your actual sync mechanism
        console.log('Device is online - syncing data...');
        // syncOfflineChanges();
      }
    };
    
    const handleOffline = () => {
      setPerformanceState(prev => ({ ...prev, isOnline: false }));
      console.log('Device is offline - enabling offline mode');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineFirst]);
  
  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPerformanceState(prev => ({ ...prev, prefersReducedMotion: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handleReducedMotionChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);
  
  // Check for battery status if available
  useEffect(() => {
    if ('getBattery' in navigator) {
      // TypeScript doesn't have this API in its standard lib
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          const isLow = battery.level < 0.2 && !battery.charging;
          setPerformanceState(prev => ({ ...prev, isBatteryLow: isLow }));
        };
        
        updateBatteryStatus();
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        
        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingchange', updateBatteryStatus);
        };
      });
    }
  }, []);
  
  // Check for Data Saver mode if available
  useEffect(() => {
    if ('connection' in navigator && (navigator as any).connection.saveData !== undefined) {
      const connection = (navigator as any).connection;
      
      const updateDataSaverStatus = () => {
        setPerformanceState(prev => ({ ...prev, dataSaver: connection.saveData }));
      };
      
      updateDataSaverStatus();
      connection.addEventListener('change', updateDataSaverStatus);
      
      return () => {
        connection.removeEventListener('change', updateDataSaverStatus);
      };
    }
  }, []);
  
  // Measure FPS and detect low performance devices
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameTimes: number[] = [];
    let rafId: number;
    
    const measureFPS = () => {
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= 1000) {
        // Calculate FPS based on frame count over the last second
        const fps = Math.round((frameCount * 1000) / elapsed);
        frameTimes.push(fps);
        
        // Keep only the last 5 measurements
        if (frameTimes.length > 5) {
          frameTimes.shift();
        }
        
        // Calculate average FPS
        const avgFps = Math.round(frameTimes.reduce((sum, fps) => sum + fps, 0) / frameTimes.length);
        
        // Determine if this is a low performance device
        const isLowPerformance = avgFps < lowPerformanceThreshold;
        
        setPerformanceState(prev => ({
          ...prev,
          fps: avgFps,
          isLowPerformanceDevice: isLowPerformance
        }));
        
        // Reset for next measurement
        frameCount = 0;
        lastTime = now;
      } else {
        frameCount++;
      }
      
      rafId = requestAnimationFrame(measureFPS);
    };
    
    rafId = requestAnimationFrame(measureFPS);
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [lowPerformanceThreshold]);
  
  // Store critical data in localStorage/IndexedDB for offline use
  const storeOfflineData = useCallback((key: string, data: any) => {
    if (offlineFirst) {
      try {
        localStorage.setItem(`offline_${key}`, JSON.stringify(data));
        console.log(`Data stored for offline use: ${key}`);
      } catch (err) {
        console.error('Error storing offline data:', err);
      }
    }
  }, [offlineFirst]);
  
  // Retrieve offline data
  const getOfflineData = useCallback((key: string) => {
    if (offlineFirst) {
      try {
        const data = localStorage.getItem(`offline_${key}`);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        console.error('Error retrieving offline data:', err);
        return null;
      }
    }
    return null;
  }, [offlineFirst]);
  
  // Determine if we should use reduced features based on all factors
  const shouldUseReducedFeatures = performanceState.isLowPerformanceDevice || 
                                   performanceState.prefersReducedMotion ||
                                   performanceState.isBatteryLow || 
                                   performanceState.dataSaver;
  
  return {
    ...performanceState,
    shouldUseReducedFeatures,
    storeOfflineData,
    getOfflineData,
  };
}
