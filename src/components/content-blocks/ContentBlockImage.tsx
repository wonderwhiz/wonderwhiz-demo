
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ContextualImage from './ContextualImage';
import { getContextualImage, checkImageCache } from './utils/imageUtils';
import { getContextualImageStyle } from '../BlockStyleUtils';

interface ContentBlockImageProps {
  blockId: string;
  isFirstBlock: boolean;
  specialistId: string;
  blockContent: any;
  narrativePosition?: 'beginning' | 'middle' | 'end';
}

const ContentBlockImage: React.FC<ContentBlockImageProps> = ({
  blockId,
  isFirstBlock,
  specialistId,
  blockContent,
  narrativePosition
}) => {
  const [contextualImage, setContextualImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string>("A magical adventure awaits!");
  const [imageRequestInProgress, setImageRequestInProgress] = useState(false);
  const [imageTimerId, setImageTimerId] = useState<number | null>(null);
  const [imageRequestId, setImageRequestId] = useState<string>(`img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const imageRetryCountRef = useRef(0);

  useEffect(() => {
    const loadCachedImage = async () => {
      if (!isFirstBlock || contextualImage || imageRequestInProgress) {
        return;
      }
      
      const cachedImage = checkImageCache(blockId);
      if (cachedImage) {
        console.log(`[${blockId}] Found cached image, using it immediately`);
        setContextualImage(cachedImage);
        return;
      } 
      
      console.log(`[${blockId}] No cached image found, proceeding silently`);
      tryGenerateImage();
    };
    
    if (isFirstBlock) {
      loadCachedImage();
    }
  }, [isFirstBlock, blockId, contextualImage, imageRequestInProgress]);
  
  const tryGenerateImage = useCallback(async () => {
    if (!isFirstBlock || contextualImage || imageLoading || imageRetryCountRef.current > 2) {
      return;
    }

    setImageLoading(true);
    setImageRequestInProgress(true);
    setImageError(null);
      
    const reqId = imageRequestId;
    console.log(`[${reqId}][${blockId}] Starting image generation`);
    
    const timerId = setTimeout(() => {
      console.log(`[${reqId}][${blockId}] Image generation taking longer than expected`);
      setImageTimerId(null);
    }, 5000) as unknown as number;
    
    setImageTimerId(timerId);
    
    const block = { id: blockId, content: blockContent, specialist_id: specialistId };
    const result = await getContextualImage(block, isFirstBlock, reqId, imageRetryCountRef);
    
    if (imageTimerId) {
      clearTimeout(imageTimerId);
      setImageTimerId(null);
    }
    
    setContextualImage(result.contextualImage);
    setImageError(result.imageError);
    setImageLoading(result.imageLoading);
    setImageRequestInProgress(result.imageRequestInProgress);
    setImageDescription(result.imageDescription || "A magical adventure awaits!");
    
    if (result.imageError) {
      imageRetryCountRef.current += 1;
      
      setImageLoading(false);
      setImageRequestInProgress(false);
    }
  }, [isFirstBlock, blockId, blockContent, specialistId, contextualImage, imageLoading, imageRequestId, imageTimerId]);
  
  const handleImageLoadError = () => {
    console.error(`[${blockId}] Image failed to load from data URL`);
    setImageError("Image failed to load");
    setContextualImage(null);
    
    setImageLoading(false);
    setImageRequestInProgress(false);
  };
  
  const handleRetryImage = () => {
    console.log(`[${blockId}] Manual image retry requested`);
    setContextualImage(null);
    setImageError(null);
    imageRetryCountRef.current = 0;
    setImageLoading(false);
    setImageRequestInProgress(false);
    setImageRequestId(`img-manual-retry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    
    setTimeout(() => {
      tryGenerateImage();
    }, 100);
  };

  if (!isFirstBlock) {
    return null;
  }

  return (
    <div className="mb-4 relative">
      <AnimatePresence mode="wait">
        <ContextualImage
          isFirstBlock={isFirstBlock}
          imageLoading={imageLoading}
          contextualImage={contextualImage}
          imageError={imageError}
          imageDescription={imageDescription}
          blockTitle={""}
          handleImageLoadError={handleImageLoadError}
          handleRetryImage={handleRetryImage}
          getContextualImageStyle={getContextualImageStyle}
          narrativePosition={narrativePosition}
        />
      </AnimatePresence>
    </div>
  );
};

export default ContentBlockImage;
