
export const getBackgroundColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'bg-gradient-to-br from-white/5 to-white/10';  // Softer neutral
    case 1:
      return 'bg-gradient-to-br from-wonderwhiz-purple/5 to-wonderwhiz-purple/10';  // Softer purple
    case 2:
      return 'bg-gradient-to-br from-wonderwhiz-blue/5 to-wonderwhiz-blue/10';  // Softer blue
    default:
      return 'bg-gradient-to-br from-white/5 to-white/10';
  }
};

export const getBorderColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'border-white/5';
    case 1:
      return 'border-wonderwhiz-purple/10';
    case 2:
      return 'border-wonderwhiz-blue/10';
    default:
      return 'border-white/5';
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
  return 'rounded-lg overflow-hidden w-full h-40 sm:h-48 md:h-56 object-cover mb-4 bg-gray-800/40';
};
