
import React from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface CurioLoadMoreProps {
  loadingMoreBlocks: boolean;
  loadTriggerRef: React.RefObject<HTMLDivElement>;
}

const CurioLoadMore: React.FC<CurioLoadMoreProps> = ({ loadingMoreBlocks, loadTriggerRef }) => {
  return (
    <div 
      ref={loadTriggerRef} 
      className="h-16 flex items-center justify-center my-4"
    >
      {loadingMoreBlocks ? (
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-7 w-7 text-wonderwhiz-purple" />
          </motion.div>
          <motion.p 
            className="text-white/70 text-sm mt-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading more wonders...
          </motion.p>
        </motion.div>
      ) : (
        <motion.div 
          className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="h-6 w-6 text-wonderwhiz-gold" />
          </motion.div>
          <p className="text-white/70 text-xs mt-1">
            Scroll for more content
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CurioLoadMore;
