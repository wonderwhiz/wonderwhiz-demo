
export interface SpecialistInfo {
  id: string;
  name: string;
  title: string;
  avatar: string;
  fallbackColor: string;
  fallbackInitial: string;
  accentColor: string;
  personality?: string;
  specialty?: string[];
  voiceId?: string;
  description?: string;
}

export const getSpecialistInfo = (specialistId: string = 'whizzy'): SpecialistInfo => {
  const specialists: Record<string, SpecialistInfo> = {
    nova: {
      id: 'nova',
      name: 'Nova',
      title: 'Space Expert',
      avatar: '/specialists/nova-avatar.png',
      fallbackColor: 'bg-blue-600',
      fallbackInitial: 'N',
      accentColor: 'blue',
      personality: 'curious and enthusiastic',
      specialty: ['astronomy', 'space', 'physics'],
      voiceId: 'nova',
      description: 'Nova loves all things related to space and the cosmos. She can answer questions about stars, planets, and the mysteries of the universe.'
    },
    spark: {
      id: 'spark',
      name: 'Spark',
      title: 'Creative Genius',
      avatar: '/specialists/spark-avatar.png',
      fallbackColor: 'bg-yellow-500',
      fallbackInitial: 'S',
      accentColor: 'yellow',
      personality: 'playful and imaginative',
      specialty: ['art', 'music', 'creative writing', 'crafts'],
      voiceId: 'spark',
      description: 'Spark is bursting with creative energy! They love helping with art projects, music, and any kind of creative exploration.'
    },
    prism: {
      id: 'prism',
      name: 'Prism',
      title: 'Science Wizard',
      avatar: '/specialists/prism-avatar.png',
      fallbackColor: 'bg-green-600',
      fallbackInitial: 'P',
      accentColor: 'green',
      personality: 'analytical and inquisitive',
      specialty: ['biology', 'chemistry', 'experiments', 'natural sciences'],
      voiceId: 'prism',
      description: 'Prism is passionate about discovering how things work through experiments and observation. They love explaining scientific concepts in fun ways.'
    },
    whizzy: {
      id: 'whizzy',
      name: 'Whizzy',
      title: 'Learning Guide',
      avatar: '/specialists/whizzy-avatar.png',
      fallbackColor: 'bg-purple-600',
      fallbackInitial: 'W',
      accentColor: 'purple',
      personality: 'friendly and encouraging',
      specialty: ['general knowledge', 'learning strategies', 'education'],
      voiceId: 'whizzy',
      description: 'Whizzy is your friendly learning companion who can help with a wide range of topics and is always ready to support your educational journey.'
    },
    lotus: {
      id: 'lotus',
      name: 'Lotus',
      title: 'Nature Guide',
      avatar: '/specialists/lotus-avatar.png',
      fallbackColor: 'bg-green-700',
      fallbackInitial: 'L',
      accentColor: 'emerald',
      personality: 'calm and observant',
      specialty: ['nature', 'plants', 'animals', 'ecology', 'environment'],
      voiceId: 'lotus',
      description: 'Lotus has a deep connection with the natural world and enjoys sharing knowledge about plants, animals, and how to care for our planet.'
    },
    atlas: {
      id: 'atlas',
      name: 'Atlas',
      title: 'History Explorer',
      avatar: '/specialists/atlas-avatar.png',
      fallbackColor: 'bg-amber-700',
      fallbackInitial: 'A',
      accentColor: 'amber',
      personality: 'wise and storytelling',
      specialty: ['history', 'geography', 'cultures', 'world events'],
      voiceId: 'atlas',
      description: 'Atlas loves taking learners on journeys through time to explore historical events, different cultures, and the geography of our world.'
    },
    pixel: {
      id: 'pixel',
      name: 'Pixel',
      title: 'Tech Guru',
      avatar: '/specialists/pixel-avatar.png',
      fallbackColor: 'bg-indigo-600',
      fallbackInitial: 'P',
      accentColor: 'indigo',
      personality: 'energetic and tech-savvy',
      specialty: ['technology', 'coding', 'computers', 'digital skills'],
      voiceId: 'pixel',
      description: 'Pixel is all about technology and how things work in the digital world. They make complicated tech concepts fun and easy to understand.'
    }
  };

  return specialists[specialistId] || specialists.whizzy;
};

// Function to match a topic to the most relevant specialist
export const getSpecialistForTopic = (topic: string): SpecialistInfo => {
  const topicLower = topic.toLowerCase();
  
  const topicMap: Record<string, string> = {
    // Space and Physics
    'space': 'nova',
    'planet': 'nova',
    'star': 'nova',
    'galaxy': 'nova',
    'universe': 'nova',
    'astronaut': 'nova',
    'rocket': 'nova',
    'physics': 'nova',
    
    // Art and Creativity
    'art': 'spark',
    'music': 'spark',
    'paint': 'spark',
    'draw': 'spark',
    'craft': 'spark',
    'creat': 'spark',
    'story': 'spark',
    'song': 'spark',
    'instrument': 'spark',
    
    // Science
    'science': 'prism',
    'experiment': 'prism',
    'chemistry': 'prism',
    'lab': 'prism',
    'element': 'prism',
    'reaction': 'prism',
    'molecule': 'prism',
    
    // Nature
    'nature': 'lotus',
    'plant': 'lotus',
    'animal': 'lotus',
    'tree': 'lotus',
    'flower': 'lotus',
    'garden': 'lotus',
    'environment': 'lotus',
    'biology': 'lotus',
    'ecosystem': 'lotus',
    
    // History and Geography
    'history': 'atlas',
    'geography': 'atlas',
    'map': 'atlas',
    'country': 'atlas',
    'ancient': 'atlas',
    'war': 'atlas',
    'culture': 'atlas',
    'civilization': 'atlas',
    'explorer': 'atlas',
    
    // Technology
    'tech': 'pixel',
    'code': 'pixel',
    'program': 'pixel',
    'computer': 'pixel',
    'software': 'pixel',
    'internet': 'pixel',
    'digital': 'pixel',
    'robot': 'pixel',
    'app': 'pixel',
  };
  
  // Check if any keywords in our map match the topic
  for (const keyword in topicMap) {
    if (topicLower.includes(keyword)) {
      return getSpecialistInfo(topicMap[keyword]);
    }
  }
  
  // Default to Whizzy for general topics
  return getSpecialistInfo('whizzy');
};
