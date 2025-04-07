
export const getBackgroundColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/50 hover:from-wonderwhiz-deep-purple/50 hover:to-wonderwhiz-light-purple/60 transition-all duration-300';  // Primary purples
    case 1:
      return 'bg-gradient-to-br from-wonderwhiz-bright-pink/30 to-wonderwhiz-blue-accent/20 hover:from-wonderwhiz-bright-pink/40 hover:to-wonderwhiz-blue-accent/30 transition-all duration-300';   // Pink to blue
    case 2:
      return 'bg-gradient-to-br from-wonderwhiz-cyan/30 to-wonderwhiz-green/20 hover:from-wonderwhiz-cyan/40 hover:to-wonderwhiz-green/30 transition-all duration-300';   // Cyan to green
    case 3:
      return 'bg-gradient-to-br from-wonderwhiz-blue-accent/30 to-wonderwhiz-deep-purple/40 hover:from-wonderwhiz-blue-accent/40 hover:to-wonderwhiz-deep-purple/50 transition-all duration-300';  // Blue to purple
    case 4:
      return 'bg-gradient-to-br from-wonderwhiz-vibrant-yellow/30 to-wonderwhiz-orange/20 hover:from-wonderwhiz-vibrant-yellow/40 hover:to-wonderwhiz-orange/30 transition-all duration-300';  // Yellow to orange
    default:
      return 'bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/50 hover:from-wonderwhiz-deep-purple/50 hover:to-wonderwhiz-light-purple/60 transition-all duration-300';
  }
};

export const getBorderColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'border-wonderwhiz-light-purple/50';
    case 1:
      return 'border-wonderwhiz-bright-pink/40';
    case 2:
      return 'border-wonderwhiz-cyan/40';
    case 3:
      return 'border-wonderwhiz-blue-accent/40';
    case 4:
      return 'border-wonderwhiz-vibrant-yellow/40';
    default:
      return 'border-wonderwhiz-light-purple/50';
  }
};

export const getTextColor = (): string => {
  return 'text-white/95';  // Bright text for better readability
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
