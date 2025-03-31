
export const getBackgroundColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'bg-white/5';
    case 1:
      return 'bg-wonderwhiz-purple/5';
    case 2:
      return 'bg-wonderwhiz-blue/5';
    default:
      return 'bg-white/5';
  }
};

export const getBorderColor = (colorVariant: number): string => {
  switch (colorVariant) {
    case 0:
      return 'border-white/10';
    case 1:
      return 'border-wonderwhiz-purple/15';
    case 2:
      return 'border-wonderwhiz-blue/15';
    default:
      return 'border-white/10';
  }
};

export const getTextColor = (): string => {
  return 'text-white';
};
