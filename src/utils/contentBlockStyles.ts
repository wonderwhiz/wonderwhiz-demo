
import { ContentBlockType } from '@/types/curio';

export const getContentGradient = (type: ContentBlockType, specialistId: string) => {
  const gradients = {
    fact: 'from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20',
    quiz: 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20',
    flashcard: 'from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20',
    creative: 'from-wonderwhiz-green/20 to-wonderwhiz-cyan/20',
    task: 'from-wonderwhiz-orange/20 to-wonderwhiz-vibrant-yellow/20',
    news: 'from-wonderwhiz-blue-accent/20 to-wonderwhiz-cyan/20',
    riddle: 'from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20',
    funFact: 'from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20',
    activity: 'from-wonderwhiz-green/20 to-wonderwhiz-cyan/20',
    mindfulness: 'from-wonderwhiz-purple/20 to-wonderwhiz-blue/20'
  };

  return gradients[type] || 'from-wonderwhiz-purple/20 to-wonderwhiz-blue/20';
};

export const getSpecialistAccent = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
        border: 'border-blue-600/20',
        accent: 'text-blue-400'
      };
    case 'spark':
      return {
        gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
        border: 'border-amber-500/20',
        accent: 'text-amber-400'
      };
    case 'prism':
      return {
        gradient: 'from-violet-600/20 via-purple-600/10 to-transparent',
        border: 'border-violet-500/20',
        accent: 'text-violet-400'
      };
    case 'pixel':
      return {
        gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
        border: 'border-cyan-500/20',
        accent: 'text-cyan-400'
      };
    case 'atlas':
      return {
        gradient: 'from-emerald-600/20 via-green-600/10 to-transparent',
        border: 'border-emerald-500/20',
        accent: 'text-emerald-400'
      };
    case 'lotus':
      return {
        gradient: 'from-pink-600/20 via-rose-600/10 to-transparent',
        border: 'border-pink-500/20',
        accent: 'text-pink-400'
      };
    default:
      return {
        gradient: 'from-purple-600/20 via-indigo-600/10 to-transparent',
        border: 'border-purple-500/20',
        accent: 'text-purple-400'
      };
  };
};

