
// Specialist identifiers and information
export const specialists = {
  nova: {
    name: 'Nova',
    emoji: '🚀',
    expertise: ['space', 'astronomy', 'physics', 'technology', 'science fiction'],
    description: 'Space and astronomy expert who loves exploring the cosmos'
  },
  spark: {
    name: 'Spark',
    emoji: '✨',
    expertise: ['creativity', 'art', 'design', 'expression', 'imagination', 'music', 'film', 'bollywood'],
    description: 'Creative genius who inspires artistic expression'
  },
  prism: {
    name: 'Prism',
    emoji: '🔬',
    expertise: ['science', 'chemistry', 'biology', 'experiments', 'nature', 'food science', 'medicine'],
    description: 'Science whiz who reveals how things work through experiments'
  },
  pixel: {
    name: 'Pixel',
    emoji: '💻',
    expertise: ['technology', 'computers', 'programming', 'digital', 'robotics', 'ai', 'gadgets'],
    description: 'Tech guru who navigates the digital universe'
  },
  atlas: {
    name: 'Atlas',
    emoji: '🗺️',
    expertise: ['history', 'geography', 'culture', 'civilizations', 'traditions', 'archaeology', 'world events'],
    description: 'History buff who travels through time and across the world'
  },
  lotus: {
    name: 'Lotus',
    emoji: '🌿',
    expertise: ['nature', 'environment', 'mindfulness', 'wellness', 'ecology', 'animals', 'plants', 'meditation'],
    description: 'Nature guide who connects mindfulness to our environment'
  }
};

export const getSpecialistName = (specialistId: string): string => {
  return specialists[specialistId as keyof typeof specialists]?.name || 'Specialist';
};

export const getSpecialistEmoji = (specialistId: string): string => {
  return specialists[specialistId as keyof typeof specialists]?.emoji || '🧠';
};

export const getSpecialistDescription = (specialistId: string): string => {
  return specialists[specialistId as keyof typeof specialists]?.description || 'Knowledge expert';
};

// Get specialist style information for UI components
export const getSpecialistStyle = (specialistId: string): { gradient: string, color: string, bgColor: string } => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'bg-gradient-to-br from-blue-500/10 to-indigo-600/10',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10'
      };
    case 'spark':
      return {
        gradient: 'bg-gradient-to-br from-pink-500/10 to-rose-600/10',
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/10'
      };
    case 'prism':
      return {
        gradient: 'bg-gradient-to-br from-amber-500/10 to-yellow-600/10',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10'
      };
    case 'pixel':
      return {
        gradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10'
      };
    case 'atlas':
      return {
        gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/10',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10'
      };
    case 'lotus':
      return {
        gradient: 'bg-gradient-to-br from-purple-500/10 to-violet-600/10',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10'
      };
    default:
      return {
        gradient: 'bg-gradient-to-br from-gray-500/10 to-slate-600/10',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/10'
      };
  }
};

// Get a formatted title for a block based on its content and specialist
export const getBlockTitle = (block: any): string => {
  if (!block) return 'Fascinating Discovery';
  
  const specialist = block.specialist_id || 'prism';
  
  // Block type specific titles
  switch (block.type) {
    case 'fact':
    case 'funFact':
      return specialist === 'nova' ? 'Cosmic Discovery' :
             specialist === 'spark' ? 'Creative Insight' :
             specialist === 'prism' ? 'Amazing Fact' :
             specialist === 'pixel' ? 'Tech Revelation' :
             specialist === 'atlas' ? 'Historical Treasure' :
             specialist === 'lotus' ? 'Natural Wonder' :
             'Fascinating Discovery';
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
      return 'Learning Activity';
    case 'mindfulness':
      return 'Mindful Moment';
    default:
      return 'Wonder Discovery';
  }
};

// Generate topic-specific suggestions for further exploration
export const getTopicSuggestions = (topic: string): string[] => {
  if (!topic) return [
    "What's the most surprising fact about this?",
    "Why is this important to understand?",
    "How does this connect to creativity?",
    "Where can we find this in the natural world?"
  ];
  
  const cleanTopic = topic.replace(/[?!.,;:]/g, '').trim();
  
  // Topic-specific suggestions
  if (cleanTopic.toLowerCase().includes('afghanistan')) {
    return [
      `What makes ${cleanTopic} unique compared to other regions?`,
      `How has the history of ${cleanTopic} shaped today's challenges?`,
      `What can we learn from the culture of ${cleanTopic}?`,
      `How does geography affect daily life in ${cleanTopic}?`
    ];
  }
  
  if (cleanTopic.toLowerCase().includes('bollywood') || 
      cleanTopic.toLowerCase().includes('film') || 
      cleanTopic.toLowerCase().includes('movie')) {
    return [
      `What's the most surprising fact about ${cleanTopic}?`,
      `How might ${cleanTopic} change in the next 10 years?`,
      `What's the connection between ${cleanTopic} and everyday life?`,
      `What scientific discoveries relate to ${cleanTopic}?`
    ];
  }
  
  if (cleanTopic.toLowerCase().includes('space') || 
      cleanTopic.toLowerCase().includes('planet') || 
      cleanTopic.toLowerCase().includes('star') || 
      cleanTopic.toLowerCase().includes('cosmos')) {
    return [
      `What's the biggest mystery about ${cleanTopic}?`,
      `How do scientists study ${cleanTopic}?`,
      `What would happen if ${cleanTopic} suddenly changed?`,
      `How does ${cleanTopic} affect life on Earth?`
    ];
  }
  
  // Default suggestions that incorporate the topic
  return [
    `What's the most surprising fact about ${cleanTopic}?`,
    `Why is ${cleanTopic} important to understand?`,
    `How ${cleanTopic} connects to creativity`,
    `${cleanTopic} in the natural world`
  ];
};

// Get relevant specialist for a given topic
export const getRelevantSpecialist = (topic: string): string => {
  if (!topic) return 'prism'; // Default to Prism for science if no topic
  
  const topicLower = topic.toLowerCase();
  
  // Space-related topics
  if (
    topicLower.includes('space') || 
    topicLower.includes('planet') || 
    topicLower.includes('star') || 
    topicLower.includes('universe') || 
    topicLower.includes('galaxy') || 
    topicLower.includes('cosmos') ||
    topicLower.includes('orbit') ||
    topicLower.includes('astronaut')
  ) {
    return 'nova';
  }
  
  // Creative and arts-related topics
  if (
    topicLower.includes('art') || 
    topicLower.includes('music') || 
    topicLower.includes('dance') || 
    topicLower.includes('painting') || 
    topicLower.includes('drawing') || 
    topicLower.includes('bollywood') || 
    topicLower.includes('movie') || 
    topicLower.includes('film') || 
    topicLower.includes('creativity') ||
    topicLower.includes('design') ||
    topicLower.includes('fashion')
  ) {
    return 'spark';
  }
  
  // Science-related topics
  if (
    topicLower.includes('science') || 
    topicLower.includes('chemistry') || 
    topicLower.includes('biology') || 
    topicLower.includes('experiment') || 
    topicLower.includes('molecule') || 
    topicLower.includes('element') || 
    topicLower.includes('reaction') ||
    topicLower.includes('physics') ||
    topicLower.includes('spicy') ||
    topicLower.includes('food science') ||
    topicLower.includes('taste')
  ) {
    return 'prism';
  }
  
  // Technology-related topics
  if (
    topicLower.includes('tech') || 
    topicLower.includes('computer') || 
    topicLower.includes('digital') || 
    topicLower.includes('robot') || 
    topicLower.includes('programming') || 
    topicLower.includes('internet') || 
    topicLower.includes('app') ||
    topicLower.includes('gadget') ||
    topicLower.includes('artificial intelligence') ||
    topicLower.includes('ai')
  ) {
    return 'pixel';
  }
  
  // History and geography-related topics
  if (
    topicLower.includes('history') || 
    topicLower.includes('geography') || 
    topicLower.includes('civilization') || 
    topicLower.includes('culture') || 
    topicLower.includes('country') || 
    topicLower.includes('war') || 
    topicLower.includes('ancient') ||
    topicLower.includes('explorer') ||
    topicLower.includes('afghanistan') ||
    topicLower.includes('india')
  ) {
    return 'atlas';
  }
  
  // Nature and wellness-related topics
  if (
    topicLower.includes('nature') || 
    topicLower.includes('environment') || 
    topicLower.includes('ecology') || 
    topicLower.includes('animal') || 
    topicLower.includes('plant') || 
    topicLower.includes('wildlife') || 
    topicLower.includes('meditation') ||
    topicLower.includes('mindfulness') ||
    topicLower.includes('wellness') ||
    topicLower.includes('health')
  ) {
    return 'lotus';
  }
  
  // For food-related topics that aren't specifically science
  if (
    topicLower.includes('food') && 
    !topicLower.includes('science') && 
    !topicLower.includes('spicy') && 
    !topicLower.includes('chemistry')
  ) {
    return 'lotus'; // Food as a general topic might be more about enjoyment and wellness
  }
  
  // Default to Prism for general knowledge queries
  return 'prism';
};

// Get multiple relevant specialists for a topic, in order of relevance
export const getRelevantSpecialists = (topic: string, count: number = 3): string[] => {
  if (!topic) return ['prism', 'nova', 'spark']; // Default set if no topic
  
  const topicLower = topic.toLowerCase();
  const allSpecialists = Object.keys(specialists);
  const scoreMap: Record<string, number> = {};
  
  // Initialize scores
  allSpecialists.forEach(id => {
    scoreMap[id] = 0;
  });
  
  // Score each specialist based on keyword matches
  allSpecialists.forEach(id => {
    const expert = specialists[id as keyof typeof specialists];
    expert.expertise.forEach(keyword => {
      if (topicLower.includes(keyword)) {
        scoreMap[id] += 2; // Direct match
      }
    });
    
    // Give points for certain topic categories
    if (id === 'nova' && (
      topicLower.includes('space') || 
      topicLower.includes('planet') || 
      topicLower.includes('star') ||
      topicLower.includes('universe')
    )) {
      scoreMap[id] += 5;
    }
    
    if (id === 'spark' && (
      topicLower.includes('art') || 
      topicLower.includes('creativity') || 
      topicLower.includes('bollywood') ||
      topicLower.includes('film') ||
      topicLower.includes('music')
    )) {
      scoreMap[id] += 5;
    }
    
    if (id === 'prism' && (
      topicLower.includes('science') || 
      topicLower.includes('experiment') || 
      topicLower.includes('chemistry') ||
      topicLower.includes('spicy') ||
      topicLower.includes('molecule')
    )) {
      scoreMap[id] += 5;
    }
    
    if (id === 'pixel' && (
      topicLower.includes('tech') || 
      topicLower.includes('computer') || 
      topicLower.includes('robot') ||
      topicLower.includes('digital') ||
      topicLower.includes('programming')
    )) {
      scoreMap[id] += 5;
    }
    
    if (id === 'atlas' && (
      topicLower.includes('history') || 
      topicLower.includes('geography') || 
      topicLower.includes('culture') ||
      topicLower.includes('afghanistan') ||
      topicLower.includes('country')
    )) {
      scoreMap[id] += 5;
    }
    
    if (id === 'lotus' && (
      topicLower.includes('nature') || 
      topicLower.includes('environment') || 
      topicLower.includes('animal') ||
      topicLower.includes('wellness') ||
      topicLower.includes('mindfulness')
    )) {
      scoreMap[id] += 5;
    }
  });
  
  // Sort specialists by score and return top 'count'
  return Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
    .slice(0, count);
};
