
import { CardProps } from '@/types/CardProps';
import { ConstellationNode, ConstellationEdge } from '@/types/ConstellationTypes';
import { TaskProps } from '@/types/TaskProps';

// Sample Cards
export const sampleCards: CardProps[] = [
  {
    id: 'card1',
    title: 'Exploring Space',
    description: 'Discover the wonders of our universe',
    difficulty: 'easy',
    category: 'space',
    icon: 'rocket',
    content: 'Space is an incredibly vast and mysterious place filled with stars, planets, galaxies, and countless other celestial objects. Our solar system is just a tiny part of the Milky Way galaxy, which itself is one of billions of galaxies in the observable universe.',
    backgroundColor: '#1a2151',
    relevanceScore: 95,
    relatedTopics: ['Planets', 'Stars', 'Galaxies', 'Black Holes'],
    emotionalTone: 'excited'
  },
  {
    id: 'card2',
    title: 'Ocean Depths',
    description: 'Dive into the mysteries of the deep sea',
    difficulty: 'medium',
    category: 'ocean',
    icon: 'anchor',
    content: 'The ocean covers more than 70% of our planet, yet we have explored less than 5% of it. The deepest parts of our oceans reach depths of over 36,000 feet, where pressure is crushing and strange bioluminescent creatures have evolved to survive in total darkness.',
    backgroundColor: '#0a3b5c',
    relevanceScore: 88,
    relatedTopics: ['Marine Life', 'Ocean Trenches', 'Coral Reefs', 'Tides'],
    emotionalTone: 'curious'
  },
  {
    id: 'card3',
    title: 'Dinosaur Era',
    description: 'Travel back to the time of giant reptiles',
    difficulty: 'hard',
    category: 'history',
    icon: 'bones',
    content: 'Dinosaurs ruled the Earth for over 165 million years, from the Triassic period around 230 million years ago through the Jurassic period and until the end of the Cretaceous period around 65 million years ago. They came in all shapes and sizes, from tiny creatures no bigger than chickens to massive titans over 100 feet long.',
    backgroundColor: '#4c3012',
    relevanceScore: 92,
    relatedTopics: ['Fossils', 'Extinction Events', 'Paleontology', 'Ancient Earth'],
    emotionalTone: 'playful'
  }
];

// Constellation Nodes
export const constellationNodes: ConstellationNode[] = [
  {
    id: 'node1',
    label: 'Astronomy',
    x: 100,
    y: 100,
    size: 30,
    color: '#5D3FD3',
    title: 'Astronomy Concepts'
  },
  {
    id: 'node2',
    label: 'Physics',
    x: 250,
    y: 150,
    size: 25,
    color: '#4361EE',
    title: 'Physics Principles'
  },
  {
    id: 'node3',
    label: 'Biology',
    x: 150,
    y: 250,
    size: 28,
    color: '#3A86FF',
    title: 'Biology Concepts'
  }
];

// Constellation Edges
export const constellationEdges: ConstellationEdge[] = [
  {
    source: 'node1',
    target: 'node2',
    weight: 3,
    strength: 0.7
  },
  {
    source: 'node2',
    target: 'node3',
    weight: 2,
    strength: 0.5
  },
  {
    source: 'node3',
    target: 'node1',
    weight: 1,
    strength: 0.3
  }
];

// Sample Tasks
export const sampleTasks: TaskProps[] = [
  {
    id: 'task1',
    title: 'Learn about constellations',
    description: 'Explore the patterns in the night sky',
    difficulty: 'easy',
    category: 'astronomy',
    points: 10,
    completed: false,
    type: 'read',
    priority: 'medium',
    timeEstimate: '10 minutes',
    reward: 5
  },
  {
    id: 'task2',
    title: 'Complete the solar system quiz',
    description: 'Test your knowledge about our planetary neighbors',
    difficulty: 'medium',
    category: 'astronomy',
    points: 15,
    completed: false,
    type: 'quiz',
    priority: 'high',
    timeEstimate: '15 minutes',
    reward: 10
  },
  {
    id: 'task3',
    title: 'Create a model of an atom',
    description: 'Use your creativity to build a visual representation',
    difficulty: 'hard',
    category: 'physics',
    points: 20,
    completed: false,
    type: 'create',
    priority: 'low',
    timeEstimate: '30 minutes',
    reward: 15
  }
];
