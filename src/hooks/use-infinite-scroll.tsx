
import { useRef, useState, useEffect, useCallback } from 'react';

export function useInfiniteScroll(loadMore: () => void, hasMore: boolean) {
  const [loadingMore, setLoadingMore] = useState(false);
  const loadTriggerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loadingMore) {
        setLoadingMore(true);
        loadMore().finally(() => {
          setLoadingMore(false);
        });
      }
    },
    [hasMore, loadMore, loadingMore]
  );

  useEffect(() => {
    const element = loadTriggerRef.current;
    if (!element) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 200px 0px'
    });
    
    observer.current.observe(element);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleObserver, loadTriggerRef]);

  return { loadingMore, loadTriggerRef };
}
