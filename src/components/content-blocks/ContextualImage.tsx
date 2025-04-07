
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContextualImageProps {
  isFirstBlock: boolean;
  imageLoading: boolean;
  contextualImage: string | null;
  imageError: string | null;
  imageDescription: string | null;
  blockTitle: string;
  handleImageLoadError: () => void;
  handleRetryImage: () => void;
  getContextualImageStyle: (blockType: string) => string;
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
  // Add safe check to make sure we don't try to split undefined values
  const getSafeImageDescription = () => {
    if (!imageDescription) return ""; 
    return typeof imageDescription === 'string' ? imageDescription : "";
  };

  return (
    <AnimatePresence mode="wait">
      {imageLoading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative aspect-[16/9] w-full bg-gradient-to-r from-wonderwhiz-deep-purple/30 to-wonderwhiz-light-purple/40 rounded-lg overflow-hidden flex items-center justify-center"
        >
          <div className="flex flex-col items-center text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wonderwhiz-bright-pink mb-3"></div>
            <p className="text-white/80 text-sm px-4 font-nunito">Creating a magical picture just for you!</p>
          </div>
        </motion.div>
      )}

      {!imageLoading && contextualImage && (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-lg overflow-hidden shadow-glow-brand-cyan group"
        >
          <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-wonderwhiz-deep-purple/20">
            <motion.img
              src={contextualImage}
              alt={getSafeImageDescription() || blockTitle || "Image"}
              onError={handleImageLoadError}
              className="w-full h-full object-cover rounded-lg object-center transform transition-transform duration-700 ease-in-out group-hover:scale-105"
              initial={{ scale: 1.02, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <motion.div 
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wonderwhiz-deep-purple/90 via-wonderwhiz-deep-purple/60 to-transparent px-4 py-3"
            initial={{ y: 10, opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <p className="text-white text-xs md:text-sm italic font-inter">{getSafeImageDescription()}</p>
          </motion.div>
        </motion.div>
      )}

      {!imageLoading && !contextualImage && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative aspect-[16/9] w-full bg-gradient-to-r from-wonderwhiz-deep-purple/30 to-wonderwhiz-light-purple/40 rounded-lg overflow-hidden flex items-center justify-center p-4"
        >
          <div className="flex flex-col items-center text-center">
            <ImageIcon className="h-10 w-10 text-white/40 mb-3" />
            <p className="text-white/80 text-sm mb-3 font-inter">{imageError || "No image available"}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryImage}
              className="bg-wonderwhiz-bright-pink/20 border-wonderwhiz-bright-pink/40 text-white hover:bg-wonderwhiz-bright-pink/30"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextualImage;
