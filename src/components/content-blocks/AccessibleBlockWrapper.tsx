
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';
import { ContentBlockType } from '@/types/curio';

interface AccessibleBlockWrapperProps {
  children: React.ReactNode;
  childAge?: number;
  type: ContentBlockType;
  title?: string;
  specialist?: string;
  className?: string;
  updateHeight?: (height: number) => void;
  animationDelay?: number;
  accessibilityLabel?: string;
}

const AccessibleBlockWrapper: React.FC<AccessibleBlockWrapperProps> = ({
  children,
  childAge = 10,
  type,
  title = '',
  specialist = '',
  className = '',
  updateHeight,
  animationDelay = 0,
  accessibilityLabel,
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const { animationLevel, colorIntensity, spacing } = useAgeAdaptation(childAge);
  
  useEffect(() => {
    if (blockRef.current && updateHeight) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          updateHeight(entry.contentRect.height);
        }
      });
      
      resizeObserver.observe(blockRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [updateHeight]);
  
  // Get appropriate background based on block type and age
  const getBlockBackground = () => {
    const intensity = colorIntensity === 'vibrant' ? 'from-opacity-20 to-opacity-30' :
                     colorIntensity === 'moderate' ? 'from-opacity-10 to-opacity-20' :
                     'from-opacity-5 to-opacity-10';
                     
    switch (type) {
      case 'fact':
      case 'funFact':
        return `bg-gradient-to-br ${intensity} from-blue-500 to-purple-500`;
      case 'quiz':
        return `bg-gradient-to-br ${intensity} from-green-500 to-emerald-500`;
      case 'creative':
        return `bg-gradient-to-br ${intensity} from-pink-500 to-orange-500`;
      case 'mindfulness':
        return `bg-gradient-to-br ${intensity} from-indigo-500 to-sky-500`;
      case 'flashcard':
        return `bg-gradient-to-br ${intensity} from-amber-500 to-orange-500`;
      case 'activity':
      case 'task':
        return `bg-gradient-to-br ${intensity} from-green-500 to-teal-500`;
      case 'riddle':
        return `bg-gradient-to-br ${intensity} from-violet-500 to-fuchsia-500`;
      case 'news':
        return `bg-gradient-to-br ${intensity} from-sky-500 to-blue-500`;
      default:
        return `bg-gradient-to-br ${intensity} from-wonderwhiz-deep-purple to-wonderwhiz-light-purple`;
    }
  };
  
  // Animation settings based on age
  const getAnimationSettings = () => {
    if (animationLevel === 'high') {
      return {
        initial: { opacity: 0, y: 20, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.5, delay: animationDelay, ease: 'easeOut' }
      };
    } else if (animationLevel === 'medium') {
      return {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: animationDelay, ease: 'easeOut' }
      };
    } else {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3, delay: animationDelay }
      };
    }
  };

  const animationProps = getAnimationSettings();
  const blockBackground = getBlockBackground();
  
  // Accessibility label
  const ariaLabel = accessibilityLabel || 
    `${type} content${title ? `: ${title}` : ''}${specialist ? ` from ${specialist}` : ''}`;
  
  return (
    <motion.div
      ref={blockRef}
      className={`relative overflow-hidden mb-6 rounded-xl shadow-lg border border-white/10 ${blockBackground} ${spacing} ${className}`}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
};

export default AccessibleBlockWrapper;
