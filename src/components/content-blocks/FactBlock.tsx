
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Volume2, VolumeX, ThumbsUp, Bookmark, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blockContainer } from './utils/blockStyles';
import { getSpecialistInfo } from '@/utils/specialists';
import { blockVariants, contentVariants } from './utils/blockAnimations';

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
  const specialist = getSpecialistInfo?.(specialistId) || { 
    name: specialistId, 
    fallbackColor: 'bg-purple-600',
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
      
      // In a real implementation, we would listen for the end of the speech
      // For now, just simulate it with a timeout
      setTimeout(() => {
        setIsReading(false);
      }, fact.length * 80); // Rough estimate of reading time
    }
  };
  
  // Get block-specific styling
  const getBlockGradient = () => {
    if (isFunFact) {
      return 'bg-gradient-to-br from-yellow-500/30 via-amber-500/20 to-transparent';
    }
    return 'bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-transparent';
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
      case 'nova': return 'text-blue-400';
      case 'spark': return 'text-amber-400';
      case 'prism': return 'text-purple-400'; 
      case 'pixel': return 'text-cyan-400';
      case 'atlas': return 'text-amber-600';
      case 'lotus': return 'text-emerald-400';
      case 'whizzy': return 'text-purple-400';
      default: return 'text-purple-400';
    }
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
                className="w-full text-left px-4 py-3 rounded-lg bg-wonderwhiz-deep-purple/40 hover:bg-wonderwhiz-deep-purple/50 flex items-center border border-yellow-300/30 transition-all shadow-lg"
                onClick={() => onRabbitHoleClick(question)}
              >
                <span className="mr-2 text-yellow-300">✨</span>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={`px-4 py-2 rounded-lg ${liked ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white/95 hover:bg-white/15'}`}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              <span>Like</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookmark}
              className={`px-4 py-2 rounded-lg ${bookmarked ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white/95 hover:bg-white/15'}`}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              <span>Save</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onReply}
              className="px-4 py-2 rounded-lg text-white/70 hover:text-white/95 hover:bg-white/15"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>Reply</span>
            </Button>
          </div>
          
          {/* Read aloud button */}
          {showReadAloud && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReadAloud}
              disabled={isReading}
              className="px-4 py-2 rounded-lg text-white/70 hover:text-white/95 hover:bg-white/15"
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
