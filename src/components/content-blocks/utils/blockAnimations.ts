
import { motion } from 'framer-motion';

// Animation variants for entire blocks entering/exiting the viewport
export const blockVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

// Animation variants for content inside blocks
export const contentVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
};

// Block style utility based on content type
export const getBlockStyle = (type: string) => {
  switch (type) {
    case 'fact':
      return 'from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20 border-wonderwhiz-cyan/30 hover:from-wonderwhiz-cyan/30 hover:to-wonderwhiz-blue/30';
    case 'quiz':
      return 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 border-wonderwhiz-bright-pink/30 hover:from-wonderwhiz-bright-pink/30 hover:to-wonderwhiz-purple/30';
    case 'flashcard':
      return 'from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20 border-wonderwhiz-vibrant-yellow/30 hover:from-wonderwhiz-vibrant-yellow/30 hover:to-wonderwhiz-orange/30';
    case 'creative':
      return 'from-wonderwhiz-green/20 to-wonderwhiz-cyan/20 border-wonderwhiz-green/30 hover:from-wonderwhiz-green/30 hover:to-wonderwhiz-cyan/30';
    case 'task':
      return 'from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20 border-wonderwhiz-purple/30 hover:from-wonderwhiz-purple/30 hover:to-wonderwhiz-bright-pink/30';
    case 'riddle':
      return 'from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20 border-wonderwhiz-purple/30 hover:from-wonderwhiz-purple/30 hover:to-wonderwhiz-bright-pink/30';
    case 'funFact':
      return 'from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20 border-wonderwhiz-vibrant-yellow/30 hover:from-wonderwhiz-vibrant-yellow/30 hover:to-wonderwhiz-orange/30';
    case 'activity':
      return 'from-wonderwhiz-green/20 to-wonderwhiz-cyan/20 border-wonderwhiz-green/30 hover:from-wonderwhiz-green/30 hover:to-wonderwhiz-cyan/30';
    case 'mindfulness':
      return 'from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20 border-wonderwhiz-cyan/30 hover:from-wonderwhiz-cyan/30 hover:to-wonderwhiz-blue/30';
    case 'news':
      return 'from-wonderwhiz-blue-accent/20 to-wonderwhiz-cyan/20 border-wonderwhiz-blue-accent/30 hover:from-wonderwhiz-blue-accent/30 hover:to-wonderwhiz-cyan/30';
    default:
      return 'from-wonderwhiz-deep-purple/20 to-wonderwhiz-light-purple/20 border-wonderwhiz-light-purple/30 hover:from-wonderwhiz-deep-purple/30 hover:to-wonderwhiz-light-purple/30';
  }
};

// Enhanced success animation with additional effects
export const enhancedSuccessAnimation = {
  scale: [1, 1.08, 1],
  rotate: [0, 2, -2, 0],
  transition: { duration: 0.6, ease: "easeInOut" }
};

// Loading animation for lazy-loaded content
export const loadingAnimation = {
  opacity: [0.5, 1, 0.5],
  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
};

// Hover animation for interactive elements
export const hoverAnimation = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

// Tap animation for interactive elements
export const tapAnimation = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

// Error animation for invalid responses
export const errorAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.5 }
};

// Specialist entry animation
export const specialistEntryAnimation = {
  initial: { opacity: 0, scale: 0.9, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.3 } }
};
