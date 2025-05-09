
import { useEffect, useRef } from 'react';

/**
 * A hook that logs changes to the specified value whenever it changes
 */
export const useConsoleLogger = <T>(value: T, label: string): void => {
  const prevValueRef = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    const prevValue = prevValueRef.current;
    
    if (JSON.stringify(prevValue) !== JSON.stringify(value)) {
      console.log(`[${label}]`, value);
      console.log(`[${label} changed]`, {
        from: prevValue,
        to: value
      });
      
      prevValueRef.current = value;
    }
  }, [value, label]);
};

/**
 * A hook that logs when a component renders and why
 */
export const useRenderLogger = (componentName: string, props: Record<string, any> = {}): void => {
  const renderCount = useRef(0);
  const prevPropsRef = useRef<Record<string, any>>({});
  
  useEffect(() => {
    renderCount.current += 1;
    
    const changedProps: Record<string, { from: any, to: any }> = {};
    let hasChanges = false;
    
    // Find which props changed
    Object.entries(props).forEach(([key, value]) => {
      if (JSON.stringify(prevPropsRef.current[key]) !== JSON.stringify(value)) {
        changedProps[key] = {
          from: prevPropsRef.current[key],
          to: value
        };
        hasChanges = true;
      }
    });
    
    console.log(`[${componentName}] render #${renderCount.current}`);
    
    if (hasChanges) {
      console.log(`[${componentName}] changed props:`, changedProps);
    }
    
    prevPropsRef.current = {...props};
    
    // Return cleanup function
    return () => {
      console.log(`[${componentName}] unmounted`);
    };
  });
};
