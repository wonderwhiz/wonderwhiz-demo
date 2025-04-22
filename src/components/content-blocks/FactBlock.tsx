
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Volume2, VolumeX } from 'lucide-react';
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
}

const FactBlock: React.FC<FactBlockProps> = ({
  fact,
  title,
  specialistId,
  rabbitHoles = [],
  onRabbitHoleClick,
  onReadAloud,
  isFunFact = false,
  childAge = 10
}) => {
  const [isReading, setIsReading] = useState(false);
  const specialist = getSpecialistInfo?.(specialistId) || { name: specialistId, color: 'purple' };
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
  
  // Determine if we should show reading controls
  const showReadAloud = !!onReadAloud && (childAge <= 9 || childAge === undefined);

  return (
    <motion.div
      className={blockContainer({ type: blockType, childAge: getAgeVariant() })}
      variants={blockVariants}
      initial="initial"
      animate="animate"
      exit="exit"
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
        
        {/* Text to speech control for younger children */}
        {showReadAloud && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReadAloud}
              disabled={isReading}
              className="bg-white/5 hover:bg-white/10 text-white"
            >
              {isReading ? (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  <span>Reading...</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  <span>Read Aloud</span>
                </>
              )}
            </Button>
          </div>
        )}
        
        {/* Rabbit hole questions for further exploration */}
        {rabbitHoles && rabbitHoles.length > 0 && onRabbitHoleClick && (
          <div className="mt-4 space-y-2">
            <h4 className={`${childAge && childAge <= 7 ? 'text-base' : 'text-sm'} font-medium text-white/70`}>
              Want to learn more?
            </h4>
            
            <div className="space-y-2">
              {rabbitHoles.map((question, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center"
                  onClick={() => onRabbitHoleClick(question)}
                >
                  <MessageSquare className="h-4 w-4 text-wonderwhiz-cyan mr-2 flex-shrink-0" />
                  <span className={`${childAge && childAge <= 7 ? 'text-base' : 'text-sm'} text-white/80`}>
                    {question}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
        
        {/* Attribution to specialist */}
        <div className="mt-2 text-right">
          <span className={`text-xs text-${specialist.color}-400`}>— {specialist.name}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FactBlock;
