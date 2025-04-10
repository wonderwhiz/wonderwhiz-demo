
// Specialist utility functions

export const getSpecialistName = (specialistId: string): string => {
  const names: Record<string, string> = {
    nova: 'Nova',
    prism: 'Prism',
    spark: 'Spark',
    atlas: 'Atlas',
    pixel: 'Pixel',
    lotus: 'Lotus'
  };
  
  return names[specialistId] || 'Wonder Guide';
};

export const getSpecialistEmoji = (specialistId: string): string => {
  const emojis: Record<string, string> = {
    nova: '🚀',
    prism: '🔬',
    spark: '✨',
    atlas: '🗺️',
    pixel: '🖥️',
    lotus: '🌸'
  };
  
  return emojis[specialistId] || '🧠';
};

export const getSpecialistAvatarUrl = (specialistId: string): string => {
  // This would typically return actual avatar URLs
  return `/assets/specialists/${specialistId}.png`;
};

export const getSpecialistStyle = (specialistId: string) => {
  const styles: Record<string, { gradient: string, color: string }> = {
    nova: {
      gradient: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
      color: 'text-blue-400'
    },
    prism: {
      gradient: 'bg-gradient-to-br from-teal-500/10 to-green-500/10',
      color: 'text-teal-400'
    },
    spark: {
      gradient: 'bg-gradient-to-br from-pink-500/10 to-orange-500/10',
      color: 'text-pink-400'
    },
    atlas: {
      gradient: 'bg-gradient-to-br from-amber-500/10 to-red-500/10',
      color: 'text-amber-400'
    },
    pixel: {
      gradient: 'bg-gradient-to-br from-indigo-500/10 to-blue-500/10',
      color: 'text-indigo-400'
    },
    lotus: {
      gradient: 'bg-gradient-to-br from-green-500/10 to-teal-500/10',
      color: 'text-green-400'
    }
  };
  
  return styles[specialistId] || styles.nova;
};

export const getBlockTitle = (block: any): string => {
  if (!block || !block.type) return 'Wonder';
  
  switch (block.type) {
    case 'fact':
      return block.content?.title || 'Fascinating Fact';
    case 'funFact':
      return 'Fun Fact';
    case 'quiz':
      return 'Knowledge Check';
    case 'flashcard':
      return 'Concept Card';
    case 'creative':
      return 'Creative Challenge';
    case 'task':
      return 'Learning Task';
    case 'riddle':
      return 'Wonder Riddle';
    case 'news':
      return 'Latest Discovery';
    case 'activity':
      return 'Learning Activity';
    case 'mindfulness':
      return 'Reflection Moment';
    default:
      return 'Wonder Block';
  }
};

export const createWonderQuestions = (specialistId: string, blockType: string, blockContent: any): string[] => {
  const baseQuestions = [
    "What does this make you wonder about?",
    "How does this connect to other things you've learned?",
    "What's the most surprising thing about this?",
    "How might this be different in the future?"
  ];
  
  // Add more specific questions based on specialist and block type
  let specificQuestions: string[] = [];
  
  switch (specialistId) {
    case 'nova':
      specificQuestions = [
        "How does this compare to other discoveries throughout history?",
        "What do you think we'll discover next about this topic?"
      ];
      break;
    case 'prism':
      specificQuestions = [
        "How could you design an experiment to test this?",
        "What patterns do you notice in this scientific information?"
      ];
      break;
    case 'spark':
      specificQuestions = [
        "How could you express this idea through art or storytelling?",
        "What creative connections can you make to everyday life?"
      ];
      break;
    default:
      specificQuestions = [
        "What other questions do you have about this topic?",
        "How might this knowledge be useful in the real world?"
      ];
  }
  
  // Combine and select 3-4 questions
  const allQuestions = [...baseQuestions, ...specificQuestions];
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
};
