
import { ContentBlockType } from '@/types/curio';

export const getContentGradient = (type: ContentBlockType, specialistId: string) => {
  const gradients = {
    fact: 'from-indigo-600/30 via-blue-500/20 to-transparent',
    quiz: 'from-pink-600/30 via-rose-500/20 to-transparent',
    flashcard: 'from-amber-500/30 via-orange-500/20 to-transparent',
    creative: 'from-emerald-600/30 via-teal-500/20 to-transparent',
    task: 'from-orange-600/30 via-amber-500/20 to-transparent',
    news: 'from-sky-600/30 via-blue-500/20 to-transparent',
    riddle: 'from-violet-600/30 via-purple-500/20 to-transparent',
    funFact: 'from-yellow-500/30 via-amber-500/20 to-transparent',
    activity: 'from-teal-600/30 via-emerald-500/20 to-transparent',
    mindfulness: 'from-purple-600/30 via-violet-500/20 to-transparent'
  };

  return gradients[type] || 'from-indigo-600/30 via-blue-500/20 to-transparent';
};

export const getSpecialistAccent = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'from-blue-600/30 via-indigo-600/20 to-transparent',
        border: 'border-blue-600/30',
        accent: 'text-blue-400'
      };
    case 'spark':
      return {
        gradient: 'from-amber-500/30 via-orange-500/20 to-transparent',
        border: 'border-amber-500/30',
        accent: 'text-amber-400'
      };
    case 'prism':
      return {
        gradient: 'from-violet-600/30 via-purple-600/20 to-transparent',
        border: 'border-violet-500/30',
        accent: 'text-violet-400'
      };
    case 'pixel':
      return {
        gradient: 'from-cyan-500/30 via-blue-500/20 to-transparent',
        border: 'border-cyan-500/30',
        accent: 'text-cyan-400'
      };
    case 'atlas':
      return {
        gradient: 'from-emerald-600/30 via-green-600/20 to-transparent',
        border: 'border-emerald-500/30',
        accent: 'text-emerald-400'
      };
    case 'lotus':
      return {
        gradient: 'from-pink-600/30 via-rose-600/20 to-transparent',
        border: 'border-pink-500/30',
        accent: 'text-pink-400'
      };
    default:
      return {
        gradient: 'from-purple-600/30 via-indigo-600/20 to-transparent',
        border: 'border-purple-500/30',
        accent: 'text-purple-400'
      };
  };
};

