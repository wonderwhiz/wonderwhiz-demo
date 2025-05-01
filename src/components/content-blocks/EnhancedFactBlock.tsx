
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ArrowRight, ExternalLink, ImageIcon, Lightbulb, ThumbsUp, Bookmark, MessageCircle, Volume2 } from 'lucide-react';
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
  
  const getBlockGradient = () => {
    if (funFact) {
      return 'bg-gradient-to-br from-wonderwhiz-deep-purple/60 via-wonderwhiz-deep-purple/80 to-wonderwhiz-deep-purple/90';
    }
    return 'bg-gradient-to-br from-wonderwhiz-deep-purple/60 via-wonderwhiz-deep-purple/80 to-wonderwhiz-deep-purple/90';
  };
  
  const getBlockGlow = () => {
    if (funFact) {
      return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(255,213,79,0.15)';
    }
    return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(0,226,255,0.15)';
  };

  // Add a subtle animation for the fact content
  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.2 } }
  };
  
  return (
    <AccessibleBlockWrapper
      childAge={childAge}
      type={funFact ? "funFact" : "fact"}
      title={displayTitle}
      specialist={specialistId}
      updateHeight={updateHeight}
      accessibilityLabel={`${funFact ? 'Fun fact' : 'Fact'}: ${displayTitle}`}
    >
      <div 
        className={`p-5 relative ${getBlockGradient()} border border-white/10 hover:border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
        style={{ boxShadow: getBlockGlow() }}
      >
        {/* Header with Title */}
        <div className="flex justify-between items-center mb-4">
          <motion.h3 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-white font-medium ${headingSize} flex items-center font-nunito`}
          >
            {funFact && childAge <= 8 ? <span className="mr-2 text-xl">✨</span> : 
             funFact ? <Lightbulb className="mr-2 h-5 w-5 text-wonderwhiz-vibrant-yellow" /> :
             <Info className="mr-2 h-5 w-5 text-wonderwhiz-cyan" />}
            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
              {displayTitle}
            </span>
          </motion.h3>
          
          {/* Add a specialist indicator for older children */}
          {childAge > 8 && specialist && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30">
                {specialist.avatar && (
                  <img 
                    src={specialist.avatar} 
                    alt={specialist.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="text-xs text-white/70">{specialist.name}</span>
            </div>
          )}
        </div>
        
        {/* Image (if available and age-appropriate) */}
        {shouldShowImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-5"
          >
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
              <div className="absolute bottom-0 right-0 bg-black/50 p-1.5 rounded-tl-lg">
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
              
              {/* Add a "click to expand" hint for younger children */}
              {childAge <= 8 && !expandedImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                    Click to see more!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Fact Content */}
        <motion.div
          variants={contentVariants}
          initial="initial"
          animate="animate" 
          className={`${textSize} text-white/95 mb-5 whitespace-pre-wrap font-nunito leading-relaxed`}
        >
          {fact}
        </motion.div>
        
        {/* Source (if available) */}
        {source && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-xs text-white/70 flex items-center"
          >
            <span className="mr-1">Source:</span>
            <span className="text-wonderwhiz-cyan hover:underline cursor-pointer">
              {source}
            </span>
            <ExternalLink className="h-3 w-3 ml-1 inline" />
          </motion.div>
        )}
        
        {/* Related Questions */}
        {relatedQuestions && relatedQuestions.length > 0 && (
          <div className="mt-4 space-y-2">
            {relatedQuestions.map((question, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left px-4 py-3 rounded-lg bg-wonderwhiz-deep-purple/30 hover:bg-wonderwhiz-deep-purple/40 flex items-center border border-yellow-300/20 transition-all"
                onClick={() => onRabbitHoleClick?.(question)}
              >
                <span className="mr-2 text-yellow-300">✨</span>
                <span className={`${childAge && childAge <= 7 ? 'text-base' : 'text-sm'} text-white/90`}>
                  {question}
                </span>
              </motion.button>
            ))}
          </div>
        )}
        
        {/* Interactive buttons at the bottom */}
        <div className="flex justify-between pt-3 mt-3 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={`px-4 py-2 rounded-lg ${liked ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white/90 hover:bg-white/10'}`}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              <span>Like</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookmark}
              className={`px-4 py-2 rounded-lg ${bookmarked ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white/90 hover:bg-white/10'}`}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              <span>Save</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply?.("")}
              className="px-4 py-2 rounded-lg text-white/70 hover:text-white/90 hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>Reply</span>
            </Button>
          </div>
          
          {/* Read aloud button */}
          {onReadAloud && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReadAloud?.(readableText)}
              className="px-4 py-2 rounded-lg text-white/70 hover:text-white/90 hover:bg-white/10"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              <span>Read aloud</span>
            </Button>
          )}
        </div>
      </div>
    </AccessibleBlockWrapper>
  );
};

export default EnhancedFactBlock;
