
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextualImageProps {
  isFirstBlock: boolean;
  imageLoading: boolean;
  contextualImage: string | null;
  imageError: string | null;
  imageDescription: string;
  blockTitle: string;
  handleImageLoadError: () => void;
  handleRetryImage: () => void;
  getContextualImageStyle: (error: boolean) => string;
}

const ContextualImage: React.FC<ContextualImageProps> = ({
  isFirstBlock,
  imageLoading,
  contextualImage,
  imageError,
  imageDescription,
  blockTitle,
  handleImageLoadError,
  handleRetryImage,
  getContextualImageStyle,
}) => {
  if (!isFirstBlock) return null;

  return (
    <AnimatePresence mode="wait">
      {imageLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`w-full h-48 sm:h-56 md:h-64 rounded-lg flex flex-col items-center justify-center ${getContextualImageStyle(false)}`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full border-4 border-t-wonderwhiz-pink border-r-wonderwhiz-pink border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-0 w-8 h-8 rounded-full border-4 border-t-transparent border-r-transparent border-b-wonderwhiz-purple border-l-wonderwhiz-purple animate-spin"></div>
            </div>
            <p className="text-white text-sm animate-pulse">Creating a magical picture just for you...</p>
          </div>
        </motion.div>
      ) : imageError ? (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`w-full h-48 sm:h-56 md:h-64 rounded-lg flex flex-col items-center justify-center text-center px-4 ${getContextualImageStyle(true)}`}
        >
          <div className="space-y-3 max-w-md">
            <div className="flex justify-center">
              <motion.div 
                className="text-white text-opacity-90"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 2.5 
                }}
              >
                <div className="flex items-center justify-center bg-wonderwhiz-purple bg-opacity-30 w-16 h-16 rounded-full">
                  <span className="text-3xl">✨</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-medium text-white mb-1">{imageDescription}</h4>
              <p className="text-white text-opacity-80 text-sm">
                Use your amazing imagination to picture this while you learn about {blockTitle.toLowerCase()}!
              </p>
            </motion.div>
          </div>
        </motion.div>
      ) : contextualImage ? (
        <motion.div
          key="image"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden"
        >
          <img
            src={contextualImage}
            alt={imageDescription}
            className="w-full h-full object-cover"
            onError={handleImageLoadError}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p className="text-white text-xs text-center">{imageDescription}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="placeholder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`w-full h-48 sm:h-56 md:h-64 rounded-lg flex flex-col items-center justify-center ${getContextualImageStyle(false)}`}
        >
          <div className="space-y-3 text-center px-4">
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1.05 }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 2 
              }}
            >
              <span className="text-4xl">✨</span>
            </motion.div>
            <h4 className="text-lg font-medium text-white">{imageDescription}</h4>
            <p className="text-white text-opacity-70 text-sm">
              Imagine all the wonderful things you'll learn about {blockTitle.toLowerCase()}!
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextualImage;
