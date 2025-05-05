
import { ContentBlockType } from '@/types/curio';

export const getContentGradient = (type: ContentBlockType, specialistId: string) => {
  const gradients = {
    fact: 'from-wonderwhiz-cyan/40 via-wonderwhiz-blue-accent/30 to-transparent',
    quiz: 'from-wonderwhiz-bright-pink/40 via-wonderwhiz-bright-pink/30 to-transparent',
    flashcard: 'from-wonderwhiz-vibrant-yellow/40 via-wonderwhiz-orange/30 to-transparent',
    creative: 'from-wonderwhiz-green/40 via-wonderwhiz-green/30 to-transparent',
    task: 'from-wonderwhiz-orange/40 via-wonderwhiz-vibrant-yellow/30 to-transparent',
    news: 'from-wonderwhiz-blue-accent/40 via-wonderwhiz-cyan/30 to-transparent',
    riddle: 'from-wonderwhiz-light-purple/40 via-wonderwhiz-bright-pink/30 to-transparent',
    funFact: 'from-wonderwhiz-vibrant-yellow/40 via-wonderwhiz-orange/30 to-transparent',
    activity: 'from-wonderwhiz-green/40 via-wonderwhiz-cyan/30 to-transparent',
    mindfulness: 'from-wonderwhiz-light-purple/40 via-wonderwhiz-blue-accent/30 to-transparent'
  };

  return gradients[type] || 'from-wonderwhiz-blue-accent/40 via-wonderwhiz-cyan/30 to-transparent';
};

export const getSpecialistAccent = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'from-wonderwhiz-blue-accent/40 via-wonderwhiz-cyan/30 to-transparent',
        border: 'border-wonderwhiz-blue-accent/40',
        accent: 'text-wonderwhiz-cyan'
      };
    case 'spark':
      return {
        gradient: 'from-wonderwhiz-vibrant-yellow/40 via-wonderwhiz-orange/30 to-transparent',
        border: 'border-wonderwhiz-vibrant-yellow/40',
        accent: 'text-wonderwhiz-vibrant-yellow'
      };
    case 'prism':
      return {
        gradient: 'from-wonderwhiz-light-purple/40 via-wonderwhiz-bright-pink/30 to-transparent',
        border: 'border-wonderwhiz-light-purple/40',
        accent: 'text-wonderwhiz-bright-pink'
      };
    case 'pixel':
      return {
        gradient: 'from-wonderwhiz-cyan/40 via-wonderwhiz-blue-accent/30 to-transparent',
        border: 'border-wonderwhiz-cyan/40',
        accent: 'text-wonderwhiz-cyan'
      };
    case 'atlas':
      return {
        gradient: 'from-wonderwhiz-green/40 via-wonderwhiz-green/30 to-transparent',
        border: 'border-wonderwhiz-green/40',
        accent: 'text-wonderwhiz-green'
      };
    case 'lotus':
      return {
        gradient: 'from-wonderwhiz-bright-pink/40 via-wonderwhiz-light-purple/30 to-transparent',
        border: 'border-wonderwhiz-bright-pink/40',
        accent: 'text-wonderwhiz-bright-pink'
      };
    default:
      return {
        gradient: 'from-wonderwhiz-light-purple/40 via-wonderwhiz-deep-purple/30 to-transparent',
        border: 'border-wonderwhiz-light-purple/40',
        accent: 'text-wonderwhiz-bright-pink'
      };
  };
};
