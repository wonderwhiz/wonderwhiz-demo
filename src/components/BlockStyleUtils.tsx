
export const getBackgroundColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'bg-gradient-to-br from-[#3D2A7D]/20 to-[#2A1B5D]/30';  // Primary purple
    case 1:
      return 'bg-gradient-to-br from-[#FF5BA3]/10 to-[#FF5BA3]/5';   // Pink
    case 2:
      return 'bg-gradient-to-br from-[#00E2FF]/10 to-[#00E2FF]/5';   // Cyan/Teal
    default:
      return 'bg-gradient-to-br from-[#3D2A7D]/20 to-[#2A1B5D]/30';
  }
};

export const getBorderColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'border-[#3D2A7D]/30';
    case 1:
      return 'border-[#FF5BA3]/20';
    case 2:
      return 'border-[#00E2FF]/20';
    default:
      return 'border-[#3D2A7D]/30';
  }
};

export const getTextColor = (): string => {
  return 'text-white/90';  // Slightly less intense white for better readability
};

export const getTextSize = (type: string): string => {
  switch (type) {
    case 'fact':
      return 'text-sm sm:text-base';  // Slightly larger for facts
    case 'quiz':
      return 'text-base sm:text-lg';  // Even larger for quizzes
    case 'creative':
      return 'text-sm sm:text-base';  // Consistent with facts
    default:
      return 'text-sm sm:text-base';
  }
};

export const getContextualImageStyle = (): string => {
  return 'rounded-xl overflow-hidden w-full h-40 sm:h-48 md:h-56 object-cover mb-4 bg-[#2A1B5D]/40 backdrop-blur-sm';
};
