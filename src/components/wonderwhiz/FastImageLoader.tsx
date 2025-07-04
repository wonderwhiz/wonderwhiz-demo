import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Zap, Sparkles } from 'lucide-react';

interface FastImageLoaderProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  childAge?: number;
}

const FastImageLoader: React.FC<FastImageLoaderProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  childAge = 10
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);
  
  const isYoungChild = childAge <= 8;

  // Preload image for faster display
  useEffect(() => {
    const img = new window.Image();
    
    const handleLoad = () => {
      setImageState('loaded');
    };
    
    const handleError = () => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        // Try fallback image
        const fallbackImg = new window.Image();
        fallbackImg.onload = handleLoad;
        fallbackImg.onerror = () => setImageState('error');
        fallbackImg.src = fallbackSrc;
      } else {
        setImageState('error');
      }
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = currentSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentSrc, fallbackSrc]);

  if (imageState === 'loading') {
    return (
      <motion.div 
        className={`${className} bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 rounded-2xl flex items-center justify-center relative overflow-hidden`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Animated loading background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-100, 300] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="text-center text-white/80 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
          <p className={`font-medium ${isYoungChild ? 'text-base' : 'text-sm'}`}>
            {isYoungChild ? "🎨 Getting picture ready..." : "Loading image..."}
          </p>
        </div>
      </motion.div>
    );
  }

  if (imageState === 'error') {
    return (
      <motion.div 
        className={`${className} bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 rounded-2xl flex items-center justify-center`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center text-white/80">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Image className="h-8 w-8" />
          </motion.div>
          <h3 className={`font-bold mb-2 ${isYoungChild ? 'text-lg' : 'text-base'}`}>
            {isYoungChild ? "🖼️ Learning Picture" : "Visual Content"}
          </h3>
          <p className={`${isYoungChild ? 'text-base' : 'text-sm'}`}>
            {isYoungChild ? "Imagine something amazing here!" : "Image placeholder"}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.img
      src={currentSrc}
      alt={alt}
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      loading="lazy"
    />
  );
};

export default FastImageLoader;