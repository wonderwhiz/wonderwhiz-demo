
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  loadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number;
  rootMargin?: string;
  delayMs?: number;
  immediate?: boolean;
  disabled?: boolean;
}

/**
 * Hook for implementing infinite scroll functionality with improved performance
 */
const useInfiniteScroll = ({ 
  loadMore, 
  isLoading, 
  hasMore,
  threshold = 0.1,
  rootMargin = '300px', // Increased for earlier loading
  delayMs = 50,
  immediate = false,
  disabled = false
}: UseInfiniteScrollOptions) => {
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const [intersecting, setIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredInitial = useRef<boolean>(false);
  
  // Clear any existing timeout on unmount or refresh
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
  
  // Debounced load function to prevent multiple rapid calls
  const debouncedLoadMore = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!isLoading && hasMore && !disabled) {
      timeoutRef.current = setTimeout(() => {
        console.log('Infinite scroll triggered loadMore');
        loadMore();
        timeoutRef.current = null;
      }, delayMs);
    }
  }, [loadMore, isLoading, hasMore, delayMs, disabled]);
  
  // Immediate loading on first render if specified
  useEffect(() => {
    if (immediate && !hasTriggeredInitial.current && hasMore && !isLoading && !disabled) {
      console.log('Initial load triggered immediately via immediate flag');
      loadMore();
      hasTriggeredInitial.current = true;
    }
  }, [immediate, hasMore, isLoading, loadMore, disabled]);
  
  // Effect for intersection detection
  useEffect(() => {
    if (intersecting && !isLoading && hasMore && !disabled) {
      // For the first visible intersection, trigger immediately
      if (!hasTriggeredInitial.current) {
        console.log('First intersection detected - loading content immediately');
        loadMore();
        hasTriggeredInitial.current = true;
      } else {
        debouncedLoadMore();
      }
    }
  }, [intersecting, isLoading, hasMore, debouncedLoadMore, loadMore, disabled]);

  // Setup IntersectionObserver with performance optimizations
  useEffect(() => {
    if (disabled) {
      if (observer.current && observerTarget.current) {
        observer.current.unobserve(observerTarget.current);
      }
      return;
    }

    // Create new observer with better performance options
    observer.current = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting !== intersecting) {
          setIntersecting(entry.isIntersecting);
        }
      },
      { 
        threshold,
        rootMargin // Load before the element is actually visible for smoother experience
      }
    );

    // Observe the target element
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.current.observe(currentTarget);
    }

    return () => {
      // Cleanup
      if (currentTarget && observer.current) {
        observer.current.unobserve(currentTarget);
        observer.current = null;
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [threshold, rootMargin, intersecting, disabled]);

  return observerTarget;
};

export default useInfiniteScroll;
