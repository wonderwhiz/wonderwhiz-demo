
import React from 'react';
import { Loader2 } from 'lucide-react';

interface CurioLoadMoreProps {
  loadingMoreBlocks: boolean;
  loadTriggerRef: React.RefObject<HTMLDivElement>;
}

const CurioLoadMore: React.FC<CurioLoadMoreProps> = ({ loadingMoreBlocks, loadTriggerRef }) => {
  return (
    <div 
      ref={loadTriggerRef} 
      className="h-10 flex items-center justify-center my-4"
    >
      {loadingMoreBlocks && (
        <div className="flex flex-col items-center">
          <Loader2 className="h-6 w-6 animate-spin text-wonderwhiz-purple" />
          <p className="text-white/70 text-xs mt-1">Loading more content...</p>
        </div>
      )}
    </div>
  );
};

export default CurioLoadMore;
