
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface CurioBlockListLoadMoreProps {
  loadTriggerRef: React.RefObject<HTMLDivElement>;
  loadingMore: boolean;
}

const CurioBlockListLoadMore: React.FC<CurioBlockListLoadMoreProps> = ({ 
  loadTriggerRef, 
  loadingMore 
}) => {
  return (
    <div ref={loadTriggerRef} className="py-8 flex justify-center">
      {loadingMore ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center"
        >
          <Loader2 className="w-5 h-5 text-white/60 animate-spin mr-2" />
          <span className="text-white/60 text-sm">Loading more wonders...</span>
        </motion.div>
      ) : (
        <div className="h-6"></div>
      )}
    </div>
  );
};

export default CurioBlockListLoadMore;
