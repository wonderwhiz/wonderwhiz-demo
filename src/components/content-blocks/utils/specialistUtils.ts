
// Specialist profiles for the app
export const getSpecialistName = (specialistId: string): string => {
  switch (specialistId) {
    case 'nova':
      return 'Nova, Space Expert';
    case 'spark':
      return 'Spark, Creative Genius';
    case 'prism':
      return 'Prism, Science Whiz';
    case 'pixel':
      return 'Pixel, Tech Guru';
    case 'atlas':
      return 'Atlas, History Buff';
    case 'lotus':
      return 'Lotus, Nature Guide';
    default:
      return 'WonderWhiz Specialist';
  }
};

export const getSpecialistEmoji = (specialistId: string): string => {
  switch (specialistId) {
    case 'nova':
      return '🚀';
    case 'spark':
      return '✨';
    case 'prism':
      return '🔬';
    case 'pixel':
      return '💻';
    case 'atlas':
      return '🗺️';
    case 'lotus':
      return '🌿';
    default:
      return '🧠';
  }
};

export const getBlockTitle = (block: any): string => {
  switch (block.type) {
    case 'fact':
      return 'Amazing Fact';
    case 'quiz':
      return 'Brain Teaser';
    case 'flashcard':
      return 'Knowledge Card';
    case 'creative':
      return 'Creative Challenge';
    case 'task':
      return 'Learning Adventure';
    case 'riddle':
      return 'Mind Puzzle';
    case 'news':
      return 'Discovery News';
    case 'activity':
      return 'Hands-On Activity';
    case 'mindfulness':
      return 'Mindful Moment';
    case 'funFact':
      return 'Fun Trivia';
    default:
      return 'Wonder Discovery';
  }
};

export const getSpecialistStyle = (specialistId: string): { gradient: string, accent: string } => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'bg-gradient-to-br from-blue-600/10 to-indigo-700/10',
        accent: 'border-l-blue-500'
      };
    case 'spark':
      return {
        gradient: 'bg-gradient-to-br from-pink-600/10 to-rose-700/10',
        accent: 'border-l-pink-500'
      };
    case 'prism':
      return {
        gradient: 'bg-gradient-to-br from-amber-500/10 to-yellow-600/10',
        accent: 'border-l-amber-400'
      };
    case 'pixel':
      return {
        gradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10',
        accent: 'border-l-cyan-400'
      };
    case 'atlas':
      return {
        gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/10',
        accent: 'border-l-emerald-400'
      };
    case 'lotus':
      return {
        gradient: 'bg-gradient-to-br from-purple-500/10 to-violet-600/10',
        accent: 'border-l-purple-400'
      };
    default:
      return {
        gradient: 'bg-gradient-to-br from-gray-600/10 to-slate-700/10',
        accent: 'border-l-gray-400'
      };
  }
};
