
export const getSpecialistStyle = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
        introPhrase: 'Did you know...',
        tone: 'soft wonder'
      };
    case 'spark':
      return {
        gradient: 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-300',
        introPhrase: 'Let\'s find out!',
        tone: 'energetic'
      };
    case 'prism':
      return {
        gradient: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
        introPhrase: 'Imagine this...',
        tone: 'dreamy'
      };
    case 'lotus':
      return {
        gradient: 'bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300',
        introPhrase: 'Take a breath...',
        tone: 'gentle mindfulness'
      };
    case 'pixel':
      return {
        gradient: 'bg-gradient-to-r from-blue-300 via-blue-400 to-teal-400',
        introPhrase: 'According to the latest research...',
        tone: 'snappy & newsy'
      };
    case 'atlas':
      return {
        gradient: 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-400',
        introPhrase: 'Here\'s a mission for you...',
        tone: 'exploratory'
      };
    default:
      return {
        gradient: 'bg-gradient-to-r from-gray-400 to-gray-300',
        introPhrase: 'Let\'s explore...',
        tone: 'friendly'
      };
  }
};

export const getBlockTitle = (block: any) => {
  // Safely access content properties
  const content = block?.content || {};
  
  switch (block?.type) {
    case 'fact':
    case 'funFact':
      return content.fact ? `${content.fact.split('.')[0]}.` : 'Interesting fact';
    case 'quiz':
      return content.question || 'Quiz question';
    case 'flashcard':
      return content.front || 'Flashcard';
    case 'creative':
      return content.prompt ? `${content.prompt.split('.')[0]}.` : 'Creative prompt';
    case 'task':
      return content.task ? `${content.task.split('.')[0]}.` : 'Task';
    case 'riddle':
      return content.riddle ? `${content.riddle.split('?')[0]}?` : 'Riddle';
    case 'news':
      return content.headline || 'News headline';
    case 'activity':
      return content.activity ? `${content.activity.split('.')[0]}.` : 'Activity';
    case 'mindfulness':
      return content.exercise ? `${content.exercise.split('.')[0]}.` : 'Mindfulness exercise';
    default:
      return 'Content block';
  }
};
