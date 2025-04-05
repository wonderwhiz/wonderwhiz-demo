
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Sparkles, Stars, Lightbulb } from 'lucide-react';

interface ContextualImageProps {
  isFirstBlock: boolean;
  imageLoading: boolean;
  contextualImage: string | null;
  imageError: string | null;
  imageDescription: string;
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
  imageDescription,
  blockTitle,
  handleImageLoadError,
  handleRetryImage,
  getContextualImageStyle,
}) => {
  if (!isFirstBlock) return null;
  
  // Get a random icon for the placeholder
  const getRandomIcon = () => {
    const icons = [
      <Sparkles className="h-6 w-6 text-wonderwhiz-gold" />,
      <Stars className="h-6 w-6 text-wonderwhiz-gold" />,
      <Lightbulb className="h-6 w-6 text-wonderwhiz-gold" />
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };
  
  // Get a fun prompt for the child's imagination
  const getImaginePrompt = () => {
    const prompts = [
      "Use your amazing imagination to bring this to life!",
      "Close your eyes and picture it in your mind!",
      "What do you think this would look like?",
      "Imagine all the colors and shapes!",
      "Your imagination is the most magical tool!"
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  };
  
  if (imageLoading) {
    return (
      <motion.div 
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative ${getContextualImageStyle()} flex items-center justify-center aspect-video rounded-lg bg-gradient-to-r from-purple-900/30 to-indigo-900/30 overflow-hidden`}
      >
        <div className="flex flex-col items-center max-w-[90%] text-center">
          <div className="h-8 w-8 text-white/60 mb-2 animate-spin rounded-full border-2 border-dashed border-white/60" />
          <p className="text-white/90 text-sm font-medium mb-1">Creating a magical illustration...</p>
          <p className="text-white/70 text-xs">{imageDescription}</p>
          <div className="w-48 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-wonderwhiz-purple"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
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
        className="relative group aspect-video rounded-lg overflow-hidden"
      >
        <img 
          src={contextualImage} 
          alt={`Illustration for ${blockTitle}`} 
          className={`${getContextualImageStyle()} object-cover w-full h-full`}
          loading="eager"
          onError={handleImageLoadError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
          <div className="text-xs bg-black/50 px-3 py-1.5 rounded-full text-white/90 backdrop-blur-sm max-w-[90%] text-center">
            {imageDescription}
          </div>
        </div>
      </motion.div>
    );
  }
  
  // When we have imageError but don't want to show errors to kids, show a child-friendly message
  if (imageError) {
    return (
      <motion.div 
        key="friendly-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`${getContextualImageStyle()} p-4 flex items-center justify-center bg-gradient-to-r from-purple-700/20 to-indigo-700/20 rounded-lg border border-purple-500/20 aspect-video overflow-hidden`}
      >
        <div className="flex flex-col items-center text-center max-w-[90%]">
          <div className="bg-white/10 p-2 rounded-full mb-3 animate-pulse">
            {getRandomIcon()}
          </div>
          <motion.p 
            className="text-white/90 text-sm font-medium mb-2"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {imageDescription}
          </motion.p>
          <motion.p 
            className="text-white/60 text-xs"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {getImaginePrompt()}
          </motion.p>
        </div>
      </motion.div>
    );
  }
  
  // No error or image - show a friendly placeholder
  return (
    <motion.div 
      key="friendly-placeholder"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`${getContextualImageStyle()} p-4 flex items-center justify-center bg-gradient-to-r from-purple-700/20 to-indigo-700/20 rounded-lg border border-purple-500/20 aspect-video overflow-hidden`}
    >
      <div className="flex flex-col items-center text-center max-w-[90%]">
        <div className="bg-white/10 p-2 rounded-full mb-3">
          <Sparkles className="h-6 w-6 text-wonderwhiz-gold" />
        </div>
        <motion.p 
          className="text-white/90 text-sm font-medium mb-2"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {imageDescription}
        </motion.p>
        <motion.p 
          className="text-white/60 text-xs"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {getImaginePrompt()}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ContextualImage;
