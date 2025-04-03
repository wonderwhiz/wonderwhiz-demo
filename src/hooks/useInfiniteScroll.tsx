
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  loadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number;
  rootMargin?: string;
  delayMs?: number;
}

/**
 * Hook for implementing infinite scroll functionality with improved performance
 */
const useInfiniteScroll = ({ 
  loadMore, 
  isLoading, 
  hasMore,
  threshold = 0.1,
  rootMargin = '100px',
  delayMs = 100
}: UseInfiniteScrollOptions) => {
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const [intersecting, setIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredInitial = useRef<boolean>(false);
  
  // Debounced load function to prevent multiple rapid calls
  const debouncedLoadMore = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!isLoading && hasMore) {
      timeoutRef.current = setTimeout(() => {
        console.log('Infinite scroll triggered loadMore');
        loadMore();
        timeoutRef.current = null;
      }, delayMs);
    }
  }, [loadMore, isLoading, hasMore, delayMs]);
  
  useEffect(() => {
    // If we're intersecting and not loading and have more content, trigger load
    if (intersecting && !isLoading && hasMore) {
      // For the first visible intersection, trigger immediately
      if (!hasTriggeredInitial.current) {
        console.log('First intersection detected - loading content immediately');
        loadMore();
        hasTriggeredInitial.current = true;
      } else {
        debouncedLoadMore();
      }
    }
  }, [intersecting, isLoading, hasMore, debouncedLoadMore, loadMore]);

  useEffect(() => {
    // Create new observer
    observer.current = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        setIntersecting(entry.isIntersecting);
      },
      { 
        threshold,
        rootMargin // Load before the element is actually visible
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
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin]);

  return observerTarget;
};

export default useInfiniteScroll;
