
import { ContentBlockType } from '@/types/curio';

export const getContentGradient = (type: ContentBlockType, specialistId: string) => {
  const gradients = {
    fact: 'from-indigo-600/40 via-blue-500/30 to-transparent',
    quiz: 'from-pink-600/40 via-rose-500/30 to-transparent',
    flashcard: 'from-amber-500/40 via-orange-500/30 to-transparent',
    creative: 'from-emerald-600/40 via-teal-500/30 to-transparent',
    task: 'from-orange-600/40 via-amber-500/30 to-transparent',
    news: 'from-sky-600/40 via-blue-500/30 to-transparent',
    riddle: 'from-violet-600/40 via-purple-500/30 to-transparent',
    funFact: 'from-yellow-500/40 via-amber-500/30 to-transparent',
    activity: 'from-teal-600/40 via-emerald-500/30 to-transparent',
    mindfulness: 'from-purple-600/40 via-violet-500/30 to-transparent'
  };

  return gradients[type] || 'from-indigo-600/40 via-blue-500/30 to-transparent';
};

export const getSpecialistAccent = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'from-blue-600/40 via-indigo-600/30 to-transparent',
        border: 'border-blue-600/40',
        accent: 'text-blue-300'
      };
    case 'spark':
      return {
        gradient: 'from-amber-500/40 via-orange-500/30 to-transparent',
        border: 'border-amber-500/40',
        accent: 'text-amber-300'
      };
    case 'prism':
      return {
        gradient: 'from-violet-600/40 via-purple-600/30 to-transparent',
        border: 'border-violet-500/40',
        accent: 'text-violet-300'
      };
    case 'pixel':
      return {
        gradient: 'from-cyan-500/40 via-blue-500/30 to-transparent',
        border: 'border-cyan-500/40',
        accent: 'text-cyan-300'
      };
    case 'atlas':
      return {
        gradient: 'from-emerald-600/40 via-green-600/30 to-transparent',
        border: 'border-emerald-500/40',
        accent: 'text-emerald-300'
      };
    case 'lotus':
      return {
        gradient: 'from-pink-600/40 via-rose-600/30 to-transparent',
        border: 'border-pink-500/40',
        accent: 'text-pink-300'
      };
    default:
      return {
        gradient: 'from-purple-600/40 via-indigo-600/30 to-transparent',
        border: 'border-purple-500/40',
        accent: 'text-purple-300'
      };
  };
};
