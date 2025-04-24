
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ArrowRight, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';
import AccessibleBlockWrapper from './AccessibleBlockWrapper';
import EnhancedBlockInteractions from './EnhancedBlockInteractions';
import { getSpecialistInfo } from '@/utils/specialists';

interface EnhancedFactBlockProps {
  id: string;
  fact: string;
  title?: string;
  source?: string;
  imageUrl?: string;
  specialistId: string;
  blockId?: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onReadAloud?: (text: string) => void;
  onRabbitHoleClick?: (question: string) => void;
  updateHeight?: (height: number) => void;
  childAge?: number;
  liked?: boolean;
  bookmarked?: boolean;
  relatedQuestions?: string[];
  funFact?: boolean;
}

const EnhancedFactBlock: React.FC<EnhancedFactBlockProps> = ({
  id,
  fact,
  title,
  source,
  imageUrl,
  specialistId,
  blockId,
  onLike,
  onBookmark,
  onReply,
  onReadAloud,
  onRabbitHoleClick,
  updateHeight,
  childAge = 10,
  liked = false,
  bookmarked = false,
  relatedQuestions = [],
  funFact = false
}) => {
  const [expandedImage, setExpandedImage] = useState(false);
  const { 
    textSize, 
    headingSize,
    visualAids 
  } = useAgeAdaptation(childAge);
  
  const specialist = getSpecialistInfo(specialistId);
  
  // Generate a suitable title if none provided
  const displayTitle = title || (funFact ? "Did You Know?" : "Interesting Fact");
  
  // Clean and format text for reading aloud
  const getReadableText = () => {
    let text = `${displayTitle}. ${fact}`;
    if (source) text += ` Source: ${source}`;
    return text;
  };
  
  const readableText = getReadableText();
  
  // Show image based on age preference
  const shouldShowImage = imageUrl && (childAge <= 10 || visualAids !== 'minimal');
  
  return (
    <AccessibleBlockWrapper
      childAge={childAge}
      type={funFact ? "funFact" : "fact"}
      title={displayTitle}
      specialist={specialistId}
      updateHeight={updateHeight}
      accessibilityLabel={`${funFact ? 'Fun fact' : 'Fact'}: ${displayTitle}`}
    >
      <div className="p-5">
        {/* Header with Title */}
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-white font-medium ${headingSize} flex items-center`}>
            {funFact && childAge <= 8 && <span className="mr-2">✨</span>}
            {displayTitle}
            {funFact && childAge > 8 && <Info className="ml-2 h-4 w-4 text-wonderwhiz-bright-pink" />}
          </h3>
        </div>
        
        {/* Image (if available and age-appropriate) */}
        {shouldShowImage && (
          <div className="mb-4">
            <div 
              className={`relative rounded-lg overflow-hidden cursor-pointer ${
                expandedImage ? 'h-auto max-h-96' : 'h-48'
              }`}
              onClick={() => setExpandedImage(!expandedImage)}
            >
              <img 
                src={imageUrl} 
                alt={title || "Fact illustration"} 
                className={`w-full h-full object-cover transition-all duration-300 ${
                  expandedImage ? 'object-contain' : 'object-cover'
                }`}
              />
              <div className="absolute bottom-0 right-0 bg-black/50 p-1 rounded-tl-lg">
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        )}
        
        {/* Fact Content */}
        <div className={`${textSize} text-white/90 mb-3 whitespace-pre-wrap`}>
          {fact}
        </div>
        
        {/* Source (if available) */}
        {source && (
          <div className="mt-3 text-xs text-white/60 flex items-center">
            <span className="mr-1">Source:</span>
            <span className="text-wonderwhiz-cyan hover:underline cursor-pointer">
              {source}
            </span>
            <ExternalLink className="h-3 w-3 ml-1 inline" />
          </div>
        )}
        
        {/* Block Interactions */}
        <EnhancedBlockInteractions
          id={id}
          liked={liked}
          bookmarked={bookmarked}
          type={funFact ? "funFact" : "fact"}
          onToggleLike={onLike}
          onToggleBookmark={onBookmark}
          onReply={onReply}
          onRabbitHoleClick={onRabbitHoleClick}
          onReadAloud={onReadAloud ? () => onReadAloud(readableText) : undefined}
          readableContent={readableText}
          relatedQuestions={relatedQuestions}
          childAge={childAge}
        />
      </div>
    </AccessibleBlockWrapper>
  );
};

export default EnhancedFactBlock;
