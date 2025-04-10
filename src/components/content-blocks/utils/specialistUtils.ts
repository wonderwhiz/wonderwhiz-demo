
export const getSpecialistStyle = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'bg-gradient-to-r from-blue-900 to-purple-900',
        textColor: 'text-blue-100',
        borderColor: 'border-blue-500',
        icon: '🚀'
      };
    case 'spark':
      return {
        gradient: 'bg-gradient-to-r from-amber-900 to-pink-900',
        textColor: 'text-amber-100',
        borderColor: 'border-pink-500',
        icon: '✨'
      };
    case 'prism':
      return {
        gradient: 'bg-gradient-to-r from-emerald-900 to-cyan-900',
        textColor: 'text-emerald-100',
        borderColor: 'border-emerald-500',
        icon: '🔬'
      };
    case 'atlas':
      return {
        gradient: 'bg-gradient-to-r from-stone-900 to-amber-900',
        textColor: 'text-stone-100',
        borderColor: 'border-amber-500',
        icon: '🗺️'
      };
    case 'pixel':
      return {
        gradient: 'bg-gradient-to-r from-slate-900 to-cyan-900',
        textColor: 'text-slate-100',
        borderColor: 'border-cyan-500',
        icon: '💻'
      };
    case 'lotus':
      return {
        gradient: 'bg-gradient-to-r from-green-900 to-teal-900',
        textColor: 'text-green-100',
        borderColor: 'border-teal-500',
        icon: '🌿'
      };
    default:
      return {
        gradient: 'bg-gradient-to-r from-indigo-900 to-purple-900',
        textColor: 'text-indigo-100',
        borderColor: 'border-indigo-500',
        icon: '🔮'
      };
  }
};

export const getSpecialistName = (specialistId: string) => {
  switch (specialistId) {
    case 'nova': return 'Nova';
    case 'spark': return 'Spark';
    case 'prism': return 'Prism';
    case 'atlas': return 'Atlas';
    case 'pixel': return 'Pixel';
    case 'lotus': return 'Lotus';
    default: return 'Wonder Specialist';
  }
};

export const getSpecialistEmoji = (specialistId: string) => {
  switch (specialistId) {
    case 'nova': return '🚀';
    case 'spark': return '✨';
    case 'prism': return '🔬';
    case 'atlas': return '🗺️';
    case 'pixel': return '💻';
    case 'lotus': return '🌿';
    default: return '🔮';
  }
};

export const getSpecialistTitle = (specialistId: string) => {
  switch (specialistId) {
    case 'nova': return 'Space Expert';
    case 'spark': return 'Creative Genius';
    case 'prism': return 'Science Whiz';
    case 'atlas': return 'History Guide';
    case 'pixel': return 'Technology Guru';
    case 'lotus': return 'Nature Explorer';
    default: return 'Wonder Specialist';
  }
};

export const getSpecialistAvatarUrl = (specialistId: string) => {
  return `/specialists/${specialistId}.png`;
};

export const getBlockTitle = (block: any) => {
  switch (block.type) {
    case 'fact': return block.content.title || 'Fascinating Fact';
    case 'funFact': return 'Fun Fact';
    case 'quiz': return 'Quick Quiz';
    case 'creative': return block.content.title || 'Creative Challenge';
    case 'flashcard': return 'Knowledge Card';
    case 'task': return block.content.title || 'Wonder Task';
    case 'riddle': return 'Brain Teaser';
    case 'news': return block.content.headline || 'Wonder News';
    case 'activity': return block.content.title || 'Hands-On Activity';
    case 'mindfulness': return block.content.title || 'Mindfulness Moment';
    default: return 'Wonder Block';
  }
};

export const createWonderQuestions = (specialistId: string, blockType: string, blockContent: any) => {
  // Generate 3 wonder questions based on specialist, block type and content
  const defaultQuestions = [
    "What's the most surprising thing about this?",
    "How does this connect to everyday life?",
    "What would happen if this changed dramatically?"
  ];

  // Generate more specific questions based on content if available
  if (blockType === 'fact' && blockContent?.fact) {
    const fact = blockContent.fact;
    if (fact.includes("dinosaur") || fact.includes("extinct")) {
      return [
        "What other prehistoric creatures existed alongside dinosaurs?",
        "How do scientists know what dinosaurs looked like?",
        "What if dinosaurs never went extinct?"
      ];
    } else if (fact.includes("space") || fact.includes("planet") || fact.includes("star")) {
      return [
        "Are there other planets like Earth in our galaxy?",
        "How do astronauts live in space?",
        "What would it take to travel to another star system?"
      ];
    }
  }

  // Return default questions if no specific ones were generated
  return defaultQuestions;
};
