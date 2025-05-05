
export const getBackgroundColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'bg-gradient-to-br from-wonderwhiz-light-purple/80 to-wonderwhiz-deep-purple/90 hover:from-wonderwhiz-light-purple/90 hover:to-wonderwhiz-deep-purple/95 transition-all duration-300';
    case 1:
      return 'bg-gradient-to-br from-wonderwhiz-bright-pink/40 to-wonderwhiz-blue-accent/30 hover:from-wonderwhiz-bright-pink/50 hover:to-wonderwhiz-blue-accent/40 transition-all duration-300';
    case 2:
      return 'bg-gradient-to-br from-wonderwhiz-cyan/40 to-wonderwhiz-green/30 hover:from-wonderwhiz-cyan/50 hover:to-wonderwhiz-green/40 transition-all duration-300';
    case 3:
      return 'bg-gradient-to-br from-wonderwhiz-blue-accent/40 to-wonderwhiz-light-purple/50 hover:from-wonderwhiz-blue-accent/50 hover:to-wonderwhiz-light-purple/60 transition-all duration-300';
    case 4:
      return 'bg-gradient-to-br from-wonderwhiz-vibrant-yellow/40 to-wonderwhiz-orange/30 hover:from-wonderwhiz-vibrant-yellow/50 hover:to-wonderwhiz-orange/40 transition-all duration-300';
    default:
      return 'bg-gradient-to-br from-wonderwhiz-light-purple/80 to-wonderwhiz-deep-purple/90 hover:from-wonderwhiz-light-purple/90 hover:to-wonderwhiz-deep-purple/95 transition-all duration-300';
  }
};

export const getBorderColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'border-wonderwhiz-light-purple/60';
    case 1:
      return 'border-wonderwhiz-bright-pink/50';
    case 2:
      return 'border-wonderwhiz-cyan/50';
    case 3:
      return 'border-wonderwhiz-blue-accent/50';
    case 4:
      return 'border-wonderwhiz-vibrant-yellow/50';
    default:
      return 'border-wonderwhiz-light-purple/60';
  }
};

export const getTextColor = (): string => {
  return 'text-white';
};

// Added new utility to get color for block content based on type
export const getBlockTypeColor = (blockType: string): string => {
  switch (blockType) {
    case 'fact':
      return 'bg-gradient-to-r from-wonderwhiz-cyan/10 to-wonderwhiz-blue-accent/10 border-l-2 border-wonderwhiz-cyan/70';
    case 'quiz':
      return 'bg-gradient-to-r from-wonderwhiz-green/10 to-wonderwhiz-cyan/10 border-l-2 border-wonderwhiz-green/70';
    case 'flashcard':
      return 'bg-gradient-to-r from-wonderwhiz-blue-accent/10 to-wonderwhiz-cyan/10 border-l-2 border-wonderwhiz-blue-accent/70';
    case 'creative':
      return 'bg-gradient-to-r from-wonderwhiz-bright-pink/10 to-wonderwhiz-bright-pink/10 border-l-2 border-wonderwhiz-bright-pink/70';
    case 'task':
      return 'bg-gradient-to-r from-wonderwhiz-vibrant-yellow/10 to-wonderwhiz-orange/10 border-l-2 border-wonderwhiz-vibrant-yellow/70';
    case 'riddle':
      return 'bg-gradient-to-r from-wonderwhiz-light-purple/10 to-wonderwhiz-bright-pink/10 border-l-2 border-wonderwhiz-light-purple/70';
    case 'news':
      return 'bg-gradient-to-r from-wonderwhiz-blue-accent/10 to-wonderwhiz-cyan/10 border-l-2 border-wonderwhiz-blue-accent/70';
    case 'activity':
      return 'bg-gradient-to-r from-wonderwhiz-orange/10 to-wonderwhiz-vibrant-yellow/10 border-l-2 border-wonderwhiz-orange/70';
    case 'mindfulness':
      return 'bg-gradient-to-r from-wonderwhiz-cyan/10 to-wonderwhiz-green/10 border-l-2 border-wonderwhiz-cyan/70';
    case 'funFact':
      return 'bg-gradient-to-r from-wonderwhiz-vibrant-yellow/10 to-wonderwhiz-orange/10 border-l-2 border-wonderwhiz-vibrant-yellow/70';
    default:
      return 'bg-gradient-to-r from-wonderwhiz-light-purple/10 to-wonderwhiz-deep-purple/10 border-l-2 border-wonderwhiz-light-purple/70';
  }
};

export const getTextSize = (type: string): string => {
  switch (type) {
    case 'fact':
      return 'text-sm sm:text-base font-inter leading-relaxed tracking-wide';  // Facts with Inter font
    case 'quiz':
      return 'text-base sm:text-lg font-nunito leading-relaxed';  // Quizzes with Nunito font
    case 'creative':
      return 'text-sm sm:text-base font-inter leading-relaxed';  // Creative with Inter font
    case 'news':
      return 'text-sm sm:text-base font-inter leading-relaxed font-medium';  // News with Inter font
    default:
      return 'text-sm sm:text-base font-inter leading-relaxed';
  }
};

export const getContextualImageStyle = (): string => {
  return 'rounded-xl overflow-hidden w-full aspect-[16/9] h-auto sm:h-48 md:h-56 object-cover mb-4 bg-wonderwhiz-deep-purple/40 backdrop-blur-sm shadow-glow-brand-cyan transition-all duration-300 hover:shadow-glow-brand-pink';
};

// New utility functions for the personalized dashboard
export const getSpecialistColor = (specialistId: string): string => {
  switch (specialistId) {
    case 'nova':
      return 'from-wonderwhiz-blue-accent/30 to-wonderwhiz-light-purple/40';
    case 'spark':
      return 'from-wonderwhiz-bright-pink/30 to-wonderwhiz-orange/20';
    case 'prism':
      return 'from-wonderwhiz-vibrant-yellow/30 to-wonderwhiz-bright-pink/20';
    case 'pixel':
      return 'from-wonderwhiz-cyan/30 to-wonderwhiz-blue-accent/20';
    case 'atlas':
      return 'from-wonderwhiz-green/30 to-wonderwhiz-cyan/20';
    case 'lotus':
      return 'from-wonderwhiz-light-purple/30 to-wonderwhiz-blue-accent/20';
    default:
      return 'from-wonderwhiz-deep-purple/80 to-wonderwhiz-light-purple/90';
  }
};

export const getCardHoverEffect = (): string => {
  return 'transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-lg';
};

export const getAnimatedGradient = (): string => {
  return 'bg-gradient-to-r from-wonderwhiz-bright-pink via-wonderwhiz-vibrant-yellow to-wonderwhiz-cyan bg-[length:200%_auto] animate-shimmer';
};

// Add more utility functions for better animations and visual effects
export const getHoverAnimation = (blockType: string): string => {
  switch (blockType) {
    case 'fact':
      return 'hover:shadow-[0_0_15px_rgba(0,226,255,0.3)] hover:border-wonderwhiz-cyan/70 transition-all duration-300';
    case 'quiz':
      return 'hover:shadow-[0_0_15px_rgba(255,91,163,0.3)] hover:border-wonderwhiz-bright-pink/70 transition-all duration-300';
    case 'flashcard':
      return 'hover:shadow-[0_0_15px_rgba(74,111,255,0.3)] hover:border-wonderwhiz-blue-accent/70 transition-all duration-300';
    case 'creative':
      return 'hover:shadow-[0_0_15px_rgba(0,214,143,0.3)] hover:border-wonderwhiz-green/70 transition-all duration-300';
    case 'task':
      return 'hover:shadow-[0_0_15px_rgba(255,138,61,0.3)] hover:border-wonderwhiz-orange/70 transition-all duration-300';
    case 'news':
      return 'hover:shadow-[0_0_15px_rgba(0,226,255,0.3)] hover:border-wonderwhiz-cyan/70 transition-all duration-300';
    default:
      return 'hover:shadow-[0_0_15px_rgba(126,48,225,0.3)] hover:border-wonderwhiz-purple/70 transition-all duration-300';
  }
};
