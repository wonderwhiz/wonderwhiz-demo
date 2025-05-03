export const getBackgroundColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'bg-gradient-to-br from-[#3D2A7D]/50 to-[#2A1B5D]/60 hover:from-[#3D2A7D]/60 hover:to-[#2A1B5D]/70 transition-all duration-300';
    case 1:
      return 'bg-gradient-to-br from-[#FF5BA3]/40 to-[#4A6FFF]/30 hover:from-[#FF5BA3]/50 hover:to-[#4A6FFF]/40 transition-all duration-300';
    case 2:
      return 'bg-gradient-to-br from-[#00E2FF]/40 to-[#00D68F]/30 hover:from-[#00E2FF]/50 hover:to-[#00D68F]/40 transition-all duration-300';
    case 3:
      return 'bg-gradient-to-br from-[#4A6FFF]/40 to-[#3D2A7D]/50 hover:from-[#4A6FFF]/50 hover:to-[#3D2A7D]/60 transition-all duration-300';
    case 4:
      return 'bg-gradient-to-br from-[#FFD54F]/40 to-[#FF8A3D]/30 hover:from-[#FFD54F]/50 hover:to-[#FF8A3D]/40 transition-all duration-300';
    default:
      return 'bg-gradient-to-br from-[#3D2A7D]/50 to-[#2A1B5D]/60 hover:from-[#3D2A7D]/60 hover:to-[#2A1B5D]/70 transition-all duration-300';
  }
};

export const getBorderColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'border-[#3D2A7D]/60';
    case 1:
      return 'border-[#FF5BA3]/50';
    case 2:
      return 'border-[#00E2FF]/50';
    case 3:
      return 'border-[#4A6FFF]/50';
    case 4:
      return 'border-[#FFD54F]/50';
    default:
      return 'border-[#3D2A7D]/60';
  }
};

export const getTextColor = (): string => {
  return 'text-white';
};

// Added new utility to get color for block content based on type
export const getBlockTypeColor = (blockType: string): string => {
  switch (blockType) {
    case 'fact':
      return 'bg-gradient-to-r from-[#00E2FF]/10 to-[#4A6FFF]/10 border-l-2 border-[#00E2FF]/70';
    case 'quiz':
      return 'bg-gradient-to-r from-[#00D68F]/10 to-[#00E2FF]/10 border-l-2 border-[#00D68F]/70';
    case 'flashcard':
      return 'bg-gradient-to-r from-[#4A6FFF]/10 to-[#00E2FF]/10 border-l-2 border-[#4A6FFF]/70';
    case 'creative':
      return 'bg-gradient-to-r from-[#FF5BA3]/10 to-[#FF5BA3]/10 border-l-2 border-[#FF5BA3]/70';
    case 'task':
      return 'bg-gradient-to-r from-[#FFD54F]/10 to-[#FF8A3D]/10 border-l-2 border-[#FFD54F]/70';
    case 'riddle':
      return 'bg-gradient-to-r from-[#3D2A7D]/10 to-[#FF5BA3]/10 border-l-2 border-[#3D2A7D]/70';
    case 'news':
      return 'bg-gradient-to-r from-[#4A6FFF]/10 to-[#00E2FF]/10 border-l-2 border-[#4A6FFF]/70';
    case 'activity':
      return 'bg-gradient-to-r from-[#FF8A3D]/10 to-[#FFD54F]/10 border-l-2 border-[#FF8A3D]/70';
    case 'mindfulness':
      return 'bg-gradient-to-r from-[#00E2FF]/10 to-[#00D68F]/10 border-l-2 border-[#00E2FF]/70';
    case 'funFact':
      return 'bg-gradient-to-r from-[#FFD54F]/10 to-[#FF8A3D]/10 border-l-2 border-[#FFD54F]/70';
    default:
      return 'bg-gradient-to-r from-[#3D2A7D]/10 to-[#2A1B5D]/10 border-l-2 border-[#3D2A7D]/70';
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
      return 'from-[#4A6FFF]/30 to-[#3D2A7D]/40';
    case 'spark':
      return 'from-[#FF5BA3]/30 to-[#FF8A3D]/20';
    case 'prism':
      return 'from-[#FFD54F]/30 to-[#FF5BA3]/20';
    case 'pixel':
      return 'from-[#00E2FF]/30 to-[#4A6FFF]/20';
    case 'atlas':
      return 'from-[#00D68F]/30 to-[#00E2FF]/20';
    case 'lotus':
      return 'from-[#3D2A7D]/30 to-[#4A6FFF]/20';
    default:
      return 'from-[#2A1B5D]/40 to-[#3D2A7D]/50';
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
      return 'hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:border-indigo-400/70 transition-all duration-300';
    case 'quiz':
      return 'hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:border-emerald-400/70 transition-all duration-300';
    case 'flashcard':
      return 'hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:border-blue-400/70 transition-all duration-300';
    case 'creative':
      return 'hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:border-rose-400/70 transition-all duration-300';
    case 'task':
      return 'hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:border-amber-400/70 transition-all duration-300';
    case 'news':
      return 'hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:border-blue-400/70 transition-all duration-300';
    default:
      return 'hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:border-violet-400/70 transition-all duration-300';
  }
};
