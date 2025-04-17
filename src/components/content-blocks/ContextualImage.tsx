
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Image as ImageIcon, Sparkles, Telescope, Rocket } from 'lucide-react';
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
  narrativePosition?: 'beginning' | 'middle' | 'end';
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
  narrativePosition
}) => {
  // Add safe check to make sure we don't try to split undefined values
  const getSafeImageDescription = () => {
    if (!imageDescription) return ""; 
    return typeof imageDescription === 'string' ? imageDescription : "";
  };
  
  // Add special animation effects based on narrative position
  const getPositionAnimation = () => {
    switch(narrativePosition) {
      case 'beginning':
        return { scale: [1.05, 1], opacity: [0, 1], transition: { duration: 0.7 } };
      case 'middle':
        return { y: [20, 0], opacity: [0, 1], transition: { duration: 0.5 } };
      case 'end':
        return { 
          scale: [0.98, 1.02, 1], 
          opacity: [0, 1], 
          transition: { duration: 0.8, times: [0, 0.7, 1] } 
        };
      default:
        return { opacity: [0, 1], transition: { duration: 0.5 } };
    }
  };

  // Determine if image is about a specific topic based on descriptions or titles
  const isTopicRelated = (topic: string) => {
    const description = getSafeImageDescription().toLowerCase();
    const title = blockTitle.toLowerCase();
    return description.includes(topic) || title.includes(topic);
  };

  // Check if the image is space-related
  const isSpaceRelated = () => {
    return isTopicRelated('space') || isTopicRelated('planet') || 
           isTopicRelated('cosmos') || isTopicRelated('galaxy') ||
           isTopicRelated('star') || isTopicRelated('universe');
  };

  // Check if the image is ocean-related
  const isOceanRelated = () => {
    return isTopicRelated('ocean') || isTopicRelated('sea') || 
           isTopicRelated('marine') || isTopicRelated('underwater') ||
           isTopicRelated('water') || isTopicRelated('fish');
  };

  // Determine if image is a fallback from Unsplash
  const isFallbackImage = () => {
    return contextualImage?.includes('unsplash.com') || 
           contextualImage?.includes('placeholder');
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
            <p className="text-white/80 text-sm px-4 font-nunito">
              {isSpaceRelated() 
                ? "Creating an astronomical wonder just for you!" 
                : isOceanRelated()
                  ? "Diving deep to create an underwater scene for you!"
                  : "Creating a magical picture just for you!"}
            </p>
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
              animate={getPositionAnimation()}
            />
            
            {/* Add dynamic particles for space-related images */}
            {isSpaceRelated() && (
              <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                  className="absolute h-2 w-2 rounded-full bg-white/80 blur-[1px]"
                  animate={{ 
                    x: ['-10%', '110%'], 
                    y: ['10%', '50%', '30%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "linear"
                  }}
                />
                <motion.div 
                  className="absolute h-1 w-1 rounded-full bg-wonderwhiz-vibrant-yellow/90 blur-[1px]"
                  animate={{ 
                    x: ['100%', '30%', '-10%'], 
                    y: ['80%', '40%', '60%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "linear",
                    delay: 1
                  }}
                />
              </div>
            )}
            
            {/* Add bubble animations for ocean-related images */}
            {isOceanRelated() && (
              <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                  className="absolute h-3 w-3 rounded-full bg-white/40 blur-[1px]"
                  animate={{ 
                    x: ['10%', '15%', '10%'], 
                    y: ['90%', '0%'],
                    opacity: [0.3, 0.7, 0]
                  }}
                  transition={{ 
                    duration: 7, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute h-2 w-2 rounded-full bg-white/50 blur-[1px]"
                  animate={{ 
                    x: ['50%', '45%', '50%'], 
                    y: ['90%', '0%'],
                    opacity: [0.2, 0.6, 0]
                  }}
                  transition={{ 
                    duration: 9, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
                <motion.div 
                  className="absolute h-1.5 w-1.5 rounded-full bg-white/60 blur-[1px]"
                  animate={{ 
                    x: ['70%', '75%', '70%'], 
                    y: ['90%', '0%'],
                    opacity: [0.3, 0.7, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: 2
                  }}
                />
              </div>
            )}
          </div>
          <motion.div 
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wonderwhiz-deep-purple/90 via-wonderwhiz-deep-purple/60 to-transparent px-4 py-3"
            initial={{ y: 10, opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="flex items-center">
              {isSpaceRelated() && (
                <Telescope className="mr-2 h-4 w-4 text-wonderwhiz-gold flex-shrink-0" />
              )}
              {isOceanRelated() && (
                <Sparkles className="mr-2 h-4 w-4 text-blue-400 flex-shrink-0" />
              )}
              <p className="text-white text-xs md:text-sm italic font-inter">
                {getSafeImageDescription()}
                {isFallbackImage() && <span className="text-xs text-white/60"> (Reference image)</span>}
              </p>
            </div>
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
            {isSpaceRelated() ? (
              <Rocket className="h-10 w-10 text-white/40 mb-3" />
            ) : (
              <ImageIcon className="h-10 w-10 text-white/40 mb-3" />
            )}
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
