
import { ContentBlockType } from '@/types/curio';

export const getContentGradient = (type: ContentBlockType, specialistId: string) => {
  const gradients = {
    fact: 'from-[#00E2FF]/40 via-[#4A6FFF]/30 to-transparent',
    quiz: 'from-[#FF5BA3]/40 via-[#FF5BA3]/30 to-transparent',
    flashcard: 'from-[#FFD54F]/40 via-[#FF8A3D]/30 to-transparent',
    creative: 'from-[#00D68F]/40 via-[#00D68F]/30 to-transparent',
    task: 'from-[#FF8A3D]/40 via-[#FFD54F]/30 to-transparent',
    news: 'from-[#4A6FFF]/40 via-[#00E2FF]/30 to-transparent',
    riddle: 'from-[#3D2A7D]/40 via-[#FF5BA3]/30 to-transparent',
    funFact: 'from-[#FFD54F]/40 via-[#FF8A3D]/30 to-transparent',
    activity: 'from-[#00D68F]/40 via-[#00E2FF]/30 to-transparent',
    mindfulness: 'from-[#3D2A7D]/40 via-[#4A6FFF]/30 to-transparent'
  };

  return gradients[type] || 'from-[#4A6FFF]/40 via-[#00E2FF]/30 to-transparent';
};

export const getSpecialistAccent = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'from-[#4A6FFF]/40 via-[#00E2FF]/30 to-transparent',
        border: 'border-[#4A6FFF]/40',
        accent: 'text-[#00E2FF]'
      };
    case 'spark':
      return {
        gradient: 'from-[#FFD54F]/40 via-[#FF8A3D]/30 to-transparent',
        border: 'border-[#FFD54F]/40',
        accent: 'text-[#FFD54F]'
      };
    case 'prism':
      return {
        gradient: 'from-[#3D2A7D]/40 via-[#FF5BA3]/30 to-transparent',
        border: 'border-[#3D2A7D]/40',
        accent: 'text-[#FF5BA3]'
      };
    case 'pixel':
      return {
        gradient: 'from-[#00E2FF]/40 via-[#4A6FFF]/30 to-transparent',
        border: 'border-[#00E2FF]/40',
        accent: 'text-[#00E2FF]'
      };
    case 'atlas':
      return {
        gradient: 'from-[#00D68F]/40 via-[#00D68F]/30 to-transparent',
        border: 'border-[#00D68F]/40',
        accent: 'text-[#00D68F]'
      };
    case 'lotus':
      return {
        gradient: 'from-[#FF5BA3]/40 via-[#3D2A7D]/30 to-transparent',
        border: 'border-[#FF5BA3]/40',
        accent: 'text-[#FF5BA3]'
      };
    default:
      return {
        gradient: 'from-[#3D2A7D]/40 via-[#2A1B5D]/30 to-transparent',
        border: 'border-[#3D2A7D]/40',
        accent: 'text-[#FF5BA3]'
      };
  };
};
