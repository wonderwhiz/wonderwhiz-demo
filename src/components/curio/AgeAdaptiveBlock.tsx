
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { blockVariants, contentVariants } from '../content-blocks/utils/blockAnimations';
import { getSpecialistIconClass } from '../content-blocks/utils/blockStyles';

interface AgeAdaptiveBlockProps {
  children?: React.ReactNode;
  content: React.ReactNode;
  title: string;
  type: string;
  ageGroup: '5-7' | '8-11' | '12-16';
  specialist: string;
  onInteract?: () => void;
  interactionLabel?: string;
  className?: string;
}

const AgeAdaptiveBlock: React.FC<AgeAdaptiveBlockProps> = ({
  children,
  content,
  title,
  type,
  ageGroup,
  specialist,
  onInteract,
  interactionLabel = 'Interact',
  className = ''
}) => {
  // Get visual style based on age group
  const getVisualStyle = () => {
    switch (ageGroup) {
      case '5-7':
        return {
          padding: 'p-5',
          titleSize: 'text-xl',
          contentSize: 'text-lg leading-relaxed',
          borderWidth: 'border-2',
          roundness: 'rounded-2xl',
          buttonSize: 'text-base py-2.5',
          animation: true
        };
      case '8-11':
        return {
          padding: 'p-4',
          titleSize: 'text-lg',
          contentSize: 'text-base leading-relaxed',
          borderWidth: 'border',
          roundness: 'rounded-xl',
          buttonSize: 'text-sm py-2',
          animation: true
        };
      case '12-16':
        return {
          padding: 'p-4',
          titleSize: 'text-base font-medium',
          contentSize: 'text-sm leading-relaxed',
          borderWidth: 'border',
          roundness: 'rounded-lg',
          buttonSize: 'text-xs py-1.5',
          animation: false
        };
    }
  };
  
  // Get block background based on type
  const getBlockBackground = () => {
    switch (type) {
      case 'fact':
      case 'funFact':
        return 'bg-gradient-to-br from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20 border-wonderwhiz-cyan/30';
      case 'quiz':
        return 'bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 border-wonderwhiz-bright-pink/30';
      case 'creative':
        return 'bg-gradient-to-br from-wonderwhiz-green/20 to-wonderwhiz-cyan/20 border-wonderwhiz-green/30';
      case 'activity':
        return 'bg-gradient-to-br from-wonderwhiz-green/20 to-wonderwhiz-cyan/20 border-wonderwhiz-green/30';
      case 'mindfulness':
        return 'bg-gradient-to-br from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20 border-wonderwhiz-cyan/30';
      case 'flashcard':
        return 'bg-gradient-to-br from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20 border-wonderwhiz-vibrant-yellow/30';
      case 'news':
        return 'bg-gradient-to-br from-wonderwhiz-blue-accent/20 to-wonderwhiz-cyan/20 border-wonderwhiz-blue-accent/30';
      default:
        return 'bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-blue/20 border-white/10';
    }
  };
  
  // Get specialist text color class
  const specialistColorClass = getSpecialistIconClass(specialist);
  
  const style = getVisualStyle();
  const background = getBlockBackground();
  
  // Animation based on age group
  const useAnimations = style.animation;

  return (
    <motion.div
      className={`${background} ${style.borderWidth} ${style.roundness} ${style.padding} shadow-lg ${className}`}
      variants={useAnimations ? blockVariants : undefined}
      initial={useAnimations ? "initial" : undefined}
      animate={useAnimations ? "animate" : undefined}
      exit={useAnimations ? "exit" : undefined}
    >
      {title && (
        <motion.h3 
          className={`${style.titleSize} text-white mb-2.5`}
          variants={useAnimations ? contentVariants : undefined}
        >
          {title}
        </motion.h3>
      )}
      
      <motion.div 
        className={`${style.contentSize} text-white/90`}
        variants={useAnimations ? contentVariants : undefined}
      >
        {content}
      </motion.div>
      
      {onInteract && (
        <div className="mt-4 flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={onInteract}
            className={`bg-white/10 hover:bg-white/20 text-white ${style.buttonSize}`}
          >
            {interactionLabel}
          </Button>
        </div>
      )}
      
      {children}
      
      <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
        <div className="text-xs text-white/50">
          <span className={`font-medium ${specialistColorClass}`}>{specialist}</span> specialist
        </div>
        
        {ageGroup === '5-7' && (
          <div className="text-xs text-white/50">
            {/* Simplistic icon that would appeal to younger children */}
            <span className="text-wonderwhiz-vibrant-yellow">★★★</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AgeAdaptiveBlock;
