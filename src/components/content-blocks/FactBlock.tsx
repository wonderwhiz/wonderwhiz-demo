
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Volume2, VolumeX, ThumbsUp, Bookmark, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blockContainer } from './utils/blockStyles';
import { getSpecialistInfo } from '@/utils/specialists';
import { blockVariants, contentVariants } from './utils/blockAnimations';
import { toast } from 'sonner';

interface FactBlockProps {
  fact: string;
  title?: string;
  specialistId: string;
  rabbitHoles?: string[];
  onRabbitHoleClick?: (question: string) => void;
  onReadAloud?: (text: string) => void;
  isFunFact?: boolean;
  childAge?: number;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: () => void;
  liked?: boolean;
  bookmarked?: boolean;
}

const FactBlock: React.FC<FactBlockProps> = ({
  fact,
  title,
  specialistId,
  rabbitHoles = [],
  onRabbitHoleClick,
  onReadAloud,
  isFunFact = false,
  childAge = 10,
  onLike,
  onBookmark,
  onReply,
  liked = false,
  bookmarked = false
}) => {
  const [isReading, setIsReading] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  
  const specialist = getSpecialistInfo?.(specialistId) || { 
    name: specialistId, 
    fallbackColor: 'bg-wonderwhiz-purple',
    fallbackInitial: 'S',
    avatar: '',
    title: ''
  };
  
  const blockType = isFunFact ? 'funFact' : 'fact';
  
  // Choose age-appropriate variant for styling
  const getAgeVariant = () => {
    if (childAge <= 7) return 'young';
    if (childAge >= 12) return 'older';
    return 'middle';
  };
  
  // Handle text-to-speech
  const handleReadAloud = () => {
    if (onReadAloud && fact) {
      const textToRead = `${title ? title + ". " : ""}${fact}`;
      onReadAloud(textToRead);
      setIsReading(true);
      
      // Show a toast notification
      toast.success('Reading content aloud...', {
        position: 'bottom-right',
        duration: 3000,
      });
      
      // In a real implementation, we would listen for the end of the speech
      // For now, just simulate it with a timeout
      setTimeout(() => {
        setIsReading(false);
      }, fact.length * 80); // Rough estimate of reading time
    }
  };

  // Handle like button click
  const handleLikeClick = () => {
    if (onLike) {
      setIsLiked(!isLiked);
      onLike();
      
      if (!isLiked) {
        toast.success('Content liked!', {
          position: 'bottom-right',
          duration: 2000,
        });
      }
    }
  };
  
  // Handle bookmark button click
  const handleBookmarkClick = () => {
    if (onBookmark) {
      setIsBookmarked(!isBookmarked);
      onBookmark();
      
      if (!isBookmarked) {
        toast.success('Content saved!', {
          position: 'bottom-right',
          duration: 2000,
        });
      } else {
        toast.success('Removed from saved items', {
          position: 'bottom-right',
          duration: 2000,
        });
      }
    }
  };
  
  // Get block-specific styling
  const getBlockGradient = () => {
    if (isFunFact) {
      return 'bg-gradient-to-br from-wonderwhiz-vibrant-yellow/30 via-wonderwhiz-orange/20 to-transparent';
    }
    return 'bg-gradient-to-br from-wonderwhiz-cyan/30 via-wonderwhiz-blue-accent/20 to-transparent';
  };
  
  const getBlockGlow = () => {
    if (isFunFact) {
      return '0 6px 25px -2px rgba(0,0,0,0.25), 0 0 20px -3px rgba(255,213,79,0.3)';
    }
    return '0 6px 25px -2px rgba(0,0,0,0.25), 0 0 20px -3px rgba(0,226,255,0.3)';
  };
  
  // Determine if we should show reading controls
  const showReadAloud = !!onReadAloud && (childAge <= 9 || childAge === undefined);

  // Get specialist color for text
  const getSpecialistTextColor = () => {
    switch (specialistId) {
      case 'nova': return 'text-wonderwhiz-cyan';
      case 'spark': return 'text-wonderwhiz-vibrant-yellow';
      case 'prism': return 'text-wonderwhiz-bright-pink'; 
      case 'pixel': return 'text-wonderwhiz-cyan';
      case 'atlas': return 'text-wonderwhiz-orange';
      case 'lotus': return 'text-wonderwhiz-green';
      case 'whizzy': return 'text-wonderwhiz-purple';
      default: return 'text-wonderwhiz-purple';
    }
  };

  const buttonAnimationVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className={`rounded-xl border border-white/15 hover:border-white/25 ${getBlockGradient()} p-5 shadow-xl relative overflow-hidden`}
      style={{ boxShadow: getBlockGlow() }}
      variants={blockVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        variants={contentVariants}
        className="space-y-3"
      >
        {title && (
          <h3 className={`${childAge && childAge <= 7 ? 'text-xl' : 'text-lg'} font-bold text-white`}>
            {title}
          </h3>
        )}
        
        <p className={`${childAge && childAge <= 7 ? 'text-lg' : 'text-base'} leading-relaxed text-white/90`}>
          {fact}
        </p>
        
        {/* Rabbit hole questions styled as yellow buttons with emoji */}
        {rabbitHoles && rabbitHoles.length > 0 && onRabbitHoleClick && (
          <div className="mt-4 space-y-2">
            {rabbitHoles.map((question, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left px-4 py-3 rounded-lg bg-wonderwhiz-deep-purple/40 hover:bg-wonderwhiz-deep-purple/50 flex items-center border border-wonderwhiz-vibrant-yellow/30 transition-all shadow-lg"
                onClick={() => onRabbitHoleClick(question)}
              >
                <span className="mr-2 text-wonderwhiz-vibrant-yellow">✨</span>
                <span className={`${childAge && childAge <= 7 ? 'text-base' : 'text-sm'} text-white/95`}>
                  {question}
                </span>
              </motion.button>
            ))}
          </div>
        )}
        
        {/* Bottom interaction buttons */}
        <div className="flex justify-between pt-3 mt-3 border-t border-white/15">
          <div className="flex items-center space-x-2">
            <motion.div
              variants={buttonAnimationVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeClick}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isLiked ? 'bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink' : 'text-white/70 hover:text-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/10'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                <span>Like</span>
              </Button>
            </motion.div>
            
            <motion.div
              variants={buttonAnimationVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmarkClick}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isBookmarked ? 'bg-wonderwhiz-vibrant-yellow/20 text-wonderwhiz-vibrant-yellow' : 'text-white/70 hover:text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10'
                }`}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                <span>Save</span>
              </Button>
            </motion.div>
            
            <motion.div
              variants={buttonAnimationVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onReply}
                className="px-4 py-2 rounded-lg text-white/70 hover:text-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/10 transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>Reply</span>
              </Button>
            </motion.div>
          </div>
          
          {/* Read aloud button */}
          {showReadAloud && (
            <motion.div
              variants={buttonAnimationVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReadAloud}
                disabled={isReading}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isReading ? 'bg-wonderwhiz-purple/20 text-wonderwhiz-purple' : 'text-white/70 hover:text-wonderwhiz-purple hover:bg-wonderwhiz-purple/10'
                }`}
              >
                {isReading ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    <span>Read aloud</span>
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
        
        {/* Attribution to specialist */}
        <div className="mt-2 text-right">
          <span className={`text-xs ${getSpecialistTextColor()}`}>— {specialist.name}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FactBlock;
