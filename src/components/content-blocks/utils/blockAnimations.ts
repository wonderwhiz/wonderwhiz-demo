
import { motion } from 'framer-motion';

export const blockVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const contentVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

export const successAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 0.5 }
};

export const getBlockStyle = (type: string) => {
  switch (type) {
    case 'fact':
      return 'from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20 border-wonderwhiz-cyan/30';
    case 'quiz':
      return 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 border-wonderwhiz-bright-pink/30';
    case 'flashcard':
      return 'from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20 border-wonderwhiz-vibrant-yellow/30';
    case 'creative':
      return 'from-wonderwhiz-green/20 to-wonderwhiz-cyan/20 border-wonderwhiz-green/30';
    default:
      return 'from-wonderwhiz-deep-purple/20 to-wonderwhiz-light-purple/20 border-wonderwhiz-light-purple/30';
  }
};
