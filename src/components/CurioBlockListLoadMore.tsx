
import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface CurioBlockListLoadMoreProps {
  loadTriggerRef: React.RefObject<HTMLDivElement>;
  loadingMore: boolean;
}

const CurioBlockListLoadMore = ({ loadTriggerRef, loadingMore }: CurioBlockListLoadMoreProps) => {
  return (
    <div ref={loadTriggerRef} className="h-16 sm:h-20 w-full flex items-center justify-center">
      {loadingMore && (
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center mb-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 sm:w-3 sm:h-3 bg-wonderwhiz-bright-pink rounded-full mr-1" 
                animate={{ 
                  y: [-6, 0],
                  scale: [1.2, 1]
                }}
                initial={{ 
                  y: 0,
                  scale: 1 
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <p className="text-xs sm:text-sm text-white/70 font-inter">Discovering more wonders...</p>
        </motion.div>
      )}
    </div>
  );
};

export default CurioBlockListLoadMore;
