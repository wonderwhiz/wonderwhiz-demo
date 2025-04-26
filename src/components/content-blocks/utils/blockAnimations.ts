
import { type Variants } from 'framer-motion';
import { ContentBlockType } from '@/types/curio';
import { blockContainer } from './blockStyles';

export const blockVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

export const contentVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.2
    }
  },
  exit: { opacity: 0, y: -10 }
};

// Add the missing getBlockStyle function
export const getBlockStyle = (type: ContentBlockType, specialistId: string, childAge?: number) => {
  // Determine age variant
  const ageVariant = childAge 
    ? childAge <= 7 
      ? 'young' 
      : childAge >= 12 
        ? 'older' 
        : 'middle'
    : 'middle';
  
  return blockContainer({ 
    type, 
    childAge: ageVariant, 
    interactive: true 
  });
};
