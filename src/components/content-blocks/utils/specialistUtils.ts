
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

// Determine which specialists are relevant for specific topics
export const getRelevantSpecialists = (topic: string): string[] => {
  const topicLower = topic.toLowerCase();
  
  // Bollywood-specific specialist assignments
  if (topicLower.includes('bollywood') || topicLower.includes('india') || topicLower.includes('film') || topicLower.includes('movie')) {
    return ['spark', 'atlas', 'lotus']; // Creative, history, and culture experts
  }
  
  // Afghanistan-specific specialist assignments
  if (topicLower.includes('afghanistan') || topicLower.includes('dangerous place')) {
    return ['atlas', 'prism', 'pixel']; // History, science, and tech experts
  }
  
  // Space-specific specialist assignments
  if (topicLower.includes('space') || topicLower.includes('jupiter') || topicLower.includes('planet')) {
    return ['nova', 'prism', 'pixel']; // Space, science, and tech experts
  }
  
  // Animal-specific specialist assignments
  if (topicLower.includes('animal') || topicLower.includes('wildlife') || topicLower.includes('nature')) {
    return ['lotus', 'prism', 'nova']; // Nature, science, and space experts
  }
  
  // Technology-specific specialist assignments
  if (topicLower.includes('robot') || topicLower.includes('tech') || topicLower.includes('computer')) {
    return ['pixel', 'spark', 'nova']; // Tech, creative, and space experts
  }
  
  // Art-specific specialist assignments
  if (topicLower.includes('art') || topicLower.includes('music') || topicLower.includes('creat')) {
    return ['spark', 'lotus', 'atlas']; // Creative, mindfulness, and history experts
  }
  
  // History-specific specialist assignments
  if (topicLower.includes('history') || topicLower.includes('war') || topicLower.includes('ancient')) {
    return ['atlas', 'nova', 'prism']; // History, space, and science experts
  }
  
  // If no specific topic is detected, return all specialists
  return ['nova', 'spark', 'prism', 'pixel', 'atlas', 'lotus'];
};

// Generate topic-specific content suggestions
export const getTopicSuggestions = (topic: string): string[] => {
  const topicLower = topic.toLowerCase();
  
  // Bollywood-specific suggestions
  if (topicLower.includes('bollywood') || topicLower.includes('india') || topicLower.includes('film') || topicLower.includes('movie')) {
    return [
      "What makes Bollywood dance sequences so unique?",
      "How has Bollywood influenced global cinema?",
      "What are the most iconic Bollywood films of all time?",
      "How do Bollywood movies reflect Indian culture?"
    ];
  }
  
  // Afghanistan-specific suggestions
  if (topicLower.includes('afghanistan') || topicLower.includes('dangerous place')) {
    return [
      "How has Afghanistan's geography contributed to its challenges?",
      "What cultural treasures exist in Afghanistan despite the dangers?",
      "How are technological innovations helping make Afghanistan safer?",
      "What historical factors have shaped Afghanistan's current situation?"
    ];
  }
  
  // Space-specific suggestions
  if (topicLower.includes('space') || topicLower.includes('jupiter') || topicLower.includes('planet')) {
    return [
      "What makes Jupiter's atmosphere so colorful and dynamic?",
      "How do Jupiter's moons differ from Earth's moon?",
      "Could humans ever visit or live near Jupiter?",
      "What have space probes taught us about Jupiter?"
    ];
  }
  
  // Animal-specific suggestions
  if (topicLower.includes('animal') || topicLower.includes('wildlife')) {
    return [
      "What are the most unique animal adaptations?",
      "How do animals communicate with each other?",
      "What are the most endangered animals today?",
      "How do animals navigate their environments?"
    ];
  }
  
  // Robot-specific suggestions
  if (topicLower.includes('robot') || topicLower.includes('tech')) {
    return [
      "How are robots helping solve real-world problems?",
      "What's the difference between robots and AI?",
      "How might robots change our daily lives in the future?",
      "What ethical questions do advanced robots raise?"
    ];
  }
  
  // Generic suggestions for any topic
  return [
    `What's the most surprising fact about ${topic}?`,
    `How might ${topic} change in the next 10 years?`,
    `What's the connection between ${topic} and everyday life?`,
    `What scientific discoveries relate to ${topic}?`
  ];
};

// Get the most appropriate specialist for a specific topic and block type
export const getAppropriateSpecialist = (topic: string, blockType: string): string => {
  const topicLower = topic.toLowerCase();
  
  // Match specialists to block types and topics
  if (blockType === 'quiz' || blockType === 'flashcard') {
    // Science and fact-based content
    if (topicLower.includes('space') || topicLower.includes('planet')) return 'nova';
    if (topicLower.includes('animal') || topicLower.includes('nature')) return 'lotus';
    if (topicLower.includes('history') || topicLower.includes('war')) return 'atlas';
    if (topicLower.includes('tech') || topicLower.includes('robot')) return 'pixel';
    return 'prism';
  }
  
  if (blockType === 'creative' || blockType === 'activity') {
    // Creative content
    if (topicLower.includes('bollywood') || topicLower.includes('art')) return 'spark';
    if (topicLower.includes('tech') || topicLower.includes('robot')) return 'pixel';
    return 'spark';
  }
  
  if (blockType === 'mindfulness') {
    return 'lotus';
  }
  
  if (blockType === 'news') {
    // News content
    if (topicLower.includes('space') || topicLower.includes('planet')) return 'nova';
    if (topicLower.includes('history') || topicLower.includes('war')) return 'atlas';
    if (topicLower.includes('tech') || topicLower.includes('robot')) return 'pixel';
    return 'prism';
  }
  
  // For other block types, use topic-based matching
  if (topicLower.includes('bollywood') || topicLower.includes('art')) return 'spark';
  if (topicLower.includes('afghanistan') || topicLower.includes('history')) return 'atlas';
  if (topicLower.includes('space') || topicLower.includes('planet')) return 'nova';
  if (topicLower.includes('animal') || topicLower.includes('nature')) return 'lotus';
  if (topicLower.includes('tech') || topicLower.includes('robot')) return 'pixel';
  if (topicLower.includes('science')) return 'prism';
  
  // Default to a random specialist if no match
  const allSpecialists = ['nova', 'spark', 'prism', 'pixel', 'atlas', 'lotus'];
  return allSpecialists[Math.floor(Math.random() * allSpecialists.length)];
};

// Format a topic for display
export const formatTopicForDisplay = (topic: string): string => {
  if (!topic) return "this topic";
  
  // Clean up the topic
  let cleanTopic = topic.trim();
  
  // Remove common prefixes
  cleanTopic = cleanTopic.replace(/^what is |^how does |^why is |^where is |^when is |^who is /i, '');
  
  // If topic ends with a question mark, remove it
  cleanTopic = cleanTopic.replace(/\?$/, '');
  
  // Capitalize first letter
  cleanTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
  
  return cleanTopic;
};
