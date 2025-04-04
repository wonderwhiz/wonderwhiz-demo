
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw, ImageIcon } from 'lucide-react';

interface ContextualImageProps {
  isFirstBlock: boolean;
  imageLoading: boolean;
  contextualImage: string | null;
  imageError: string | null;
  blockTitle: string;
  handleImageLoadError: () => void;
  handleRetryImage: () => void;
  getContextualImageStyle: () => string;
}

const ContextualImage: React.FC<ContextualImageProps> = ({
  isFirstBlock,
  imageLoading,
  contextualImage,
  imageError,
  blockTitle,
  handleImageLoadError,
  handleRetryImage,
  getContextualImageStyle,
}) => {
  if (!isFirstBlock) return null;
  
  if (imageLoading) {
    return (
      <motion.div 
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`${getContextualImageStyle()} flex items-center justify-center bg-gradient-to-r from-purple-900/30 to-indigo-900/30`}
      >
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 text-white/60 mb-2 animate-spin rounded-full border-2 border-dashed border-white/60" />
          <p className="text-white/80 text-sm">Creating illustration...</p>
          <div className="w-48 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-wonderwhiz-purple"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (contextualImage) {
    return (
      <motion.div
        key="image"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative group"
      >
        <img 
          src={contextualImage} 
          alt={`Illustration for ${blockTitle}`} 
          className={`${getContextualImageStyle()} object-cover w-full h-full`}
          loading="eager"
          onError={handleImageLoadError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
          <div className="text-xs bg-black/50 px-2 py-1 rounded-full text-white/90 backdrop-blur-sm">
            AI-generated illustration
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Only return a retry button if there was an error
  if (imageError) {
    return (
      <motion.div 
        key="error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden"
      />
    );
  }
  
  return null;
};

export default ContextualImage;
