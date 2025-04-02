
import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  loadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number;
}

/**
 * Hook for implementing infinite scroll functionality
 */
const useInfiniteScroll = ({ 
  loadMore, 
  isLoading, 
  hasMore,
  threshold = 0.1
}: UseInfiniteScrollOptions) => {
  const observerTarget = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadMore();
        }
      },
      { threshold }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [observerTarget, isLoading, hasMore, loadMore, threshold]);

  return observerTarget;
};

export default useInfiniteScroll;
