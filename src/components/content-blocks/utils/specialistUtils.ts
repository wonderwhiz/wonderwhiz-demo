
export const getSpecialistName = (specialistId: string): string => {
  switch (specialistId) {
    case 'nova': return 'Nova';
    case 'spark': return 'Spark';
    case 'prism': return 'Prism';
    case 'pixel': return 'Pixel';
    case 'atlas': return 'Atlas';
    case 'lotus': return 'Lotus';
    default: return 'Wonder Guide';
  }
};

export const getSpecialistAvatarUrl = (specialistId: string): string => {
  switch (specialistId) {
    case 'nova': return '/assets/specialists/nova-avatar.png';
    case 'spark': return '/assets/specialists/spark-avatar.png';
    case 'prism': return '/assets/specialists/prism-avatar.png';
    case 'pixel': return '/assets/specialists/pixel-avatar.png';
    case 'atlas': return '/assets/specialists/atlas-avatar.png';
    case 'lotus': return '/assets/specialists/lotus-avatar.png';
    default: return '/assets/specialists/default-avatar.png';
  }
};

export const getSpecialistStyle = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'bg-gradient-to-r from-blue-600/10 to-indigo-700/10',
        color: 'text-blue-400'
      };
    case 'spark':
      return {
        gradient: 'bg-gradient-to-r from-orange-500/10 to-pink-600/10',
        color: 'text-pink-400'
      };
    case 'prism':
      return {
        gradient: 'bg-gradient-to-r from-green-500/10 to-teal-600/10',
        color: 'text-teal-400'
      };
    case 'pixel':
      return {
        gradient: 'bg-gradient-to-r from-purple-500/10 to-violet-600/10',
        color: 'text-violet-400'
      };
    case 'atlas':
      return {
        gradient: 'bg-gradient-to-r from-amber-500/10 to-yellow-600/10',
        color: 'text-amber-400'
      };
    case 'lotus':
      return {
        gradient: 'bg-gradient-to-r from-emerald-500/10 to-green-600/10',
        color: 'text-emerald-400'
      };
    default:
      return {
        gradient: 'bg-gradient-to-r from-blue-600/10 to-indigo-700/10',
        color: 'text-indigo-400'
      };
  }
};

export const getBlockTitle = (block: any): string => {
  switch (block.type) {
    case 'fact': return block.content?.title || 'Fascinating Fact';
    case 'funFact': return 'Fun Fact';
    case 'quiz': return 'Quiz Challenge';
    case 'flashcard': return 'Knowledge Card';
    case 'creative': return 'Creative Challenge';
    case 'task': return 'Wonder Task';
    case 'riddle': return 'Brain Teaser';
    case 'news': return 'Wonder News';
    case 'activity': return 'Fun Activity';
    case 'mindfulness': return 'Mindful Moment';
    default: return 'Wonder Block';
  }
};
