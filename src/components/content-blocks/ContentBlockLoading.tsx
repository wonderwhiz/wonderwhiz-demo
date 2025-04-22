
import React from 'react';
import { motion } from 'framer-motion';

interface ContentBlockLoadingProps {
  childAge?: number;
}

const ContentBlockLoading: React.FC<ContentBlockLoadingProps> = ({ childAge = 10 }) => {
  const getMessage = () => {
    if (childAge <= 7) {
      return "Getting your amazing content ready...";
    } else if (childAge <= 11) {
      return "Loading your content...";
    }
    return "Loading content...";
  };

  return (
    <motion.div
      className="p-6 rounded-lg bg-black/20 border border-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="mt-4 text-white/60 text-center">{getMessage()}</div>
    </motion.div>
  );
};

export default ContentBlockLoading;
