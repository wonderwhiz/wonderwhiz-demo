
export const getBackgroundColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-wonderwhiz-light-purple/40';  // Primary purples
    case 1:
      return 'bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-blue-accent/10';   // Pink to blue
    case 2:
      return 'bg-gradient-to-br from-wonderwhiz-cyan/20 to-wonderwhiz-green/10';   // Cyan to green
    case 3:
      return 'bg-gradient-to-br from-wonderwhiz-blue-accent/20 to-wonderwhiz-deep-purple/30';  // Blue to purple
    case 4:
      return 'bg-gradient-to-br from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/10';  // Yellow to orange
    default:
      return 'bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-wonderwhiz-light-purple/40';
  }
};

export const getBorderColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'border-wonderwhiz-light-purple/40';
    case 1:
      return 'border-wonderwhiz-bright-pink/30';
    case 2:
      return 'border-wonderwhiz-cyan/30';
    case 3:
      return 'border-wonderwhiz-blue-accent/30';
    case 4:
      return 'border-wonderwhiz-vibrant-yellow/30';
    default:
      return 'border-wonderwhiz-light-purple/40';
  }
};

export const getTextColor = (): string => {
  return 'text-white/95';  // Bright text for better readability
};

export const getTextSize = (type: string): string => {
  switch (type) {
    case 'fact':
      return 'text-sm sm:text-base font-inter';  // Facts with Inter font
    case 'quiz':
      return 'text-base sm:text-lg font-nunito';  // Quizzes with Nunito font
    case 'creative':
      return 'text-sm sm:text-base font-inter';  // Creative with Inter font
    case 'news':
      return 'text-sm sm:text-base font-inter';  // News with Inter font
    default:
      return 'text-sm sm:text-base font-inter';
  }
};

export const getContextualImageStyle = (): string => {
  return 'rounded-xl overflow-hidden w-full h-40 sm:h-48 md:h-56 object-cover mb-4 bg-wonderwhiz-deep-purple/40 backdrop-blur-sm shadow-glow-brand-cyan';
};
