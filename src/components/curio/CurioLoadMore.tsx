
import React from 'react';

interface CurioLoadMoreProps {
  loadTriggerRef: React.RefObject<HTMLDivElement>;
  loadingMore: boolean;
}

const CurioLoadMore: React.FC<CurioLoadMoreProps> = ({ loadTriggerRef, loadingMore }) => {
  return (
    <div ref={loadTriggerRef} className="h-20 flex items-center justify-center">
      {loadingMore ? (
        <div className="animate-pulse text-white/60">Loading more wonders...</div>
      ) : (
        <div className="text-white/40 text-xs">Scroll for more</div>
      )}
    </div>
  );
};

export default CurioLoadMore;
