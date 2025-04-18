
import { CardProps } from '@/types/CardProps';
import { ConstellationNode, ConstellationEdge } from '@/types/ConstellationTypes';
import { TaskProps } from '@/types/TaskProps';

export const sampleCards: CardProps[] = [
  {
    id: '1',
    title: 'Explore Space',
    description: 'Learn about planets and stars',
    difficulty: 'easy',
    category: 'science',
    icon: 'rocket'
  },
  {
    id: '2', 
    title: 'Ocean Adventures',
    description: 'Discover marine life',
    difficulty: 'medium', 
    category: 'nature',
    icon: 'waves'
  },
  {
    id: '3',
    title: 'Ancient Civilizations',
    description: 'Travel through history',
    difficulty: 'hard',
    category: 'history', 
    icon: 'pyramid'
  }
];

export const constellationNodes: ConstellationNode[] = [
  {
    id: 'node1',
    label: 'Curiosity',
    x: 0,
    y: 0,
    size: 20,
    color: '#FF6B6B'
  },
  {
    id: 'node2', 
    label: 'Learning',
    x: 100,
    y: 100,
    size: 15,
    color: '#4ECDC4'
  }
];

export const constellationEdges: ConstellationEdge[] = [
  {
    source: 'node1',
    target: 'node2',
    weight: 1
  }
];

export const sampleTasks: TaskProps[] = [
  {
    id: 'task1',
    title: 'Daily Reading Challenge',
    description: 'Read for 30 minutes',
    difficulty: 'easy',
    category: 'learning',
    points: 50,
    completed: false
  },
  {
    id: 'task2',
    title: 'Science Experiment',
    description: 'Complete a simple science experiment',
    difficulty: 'medium', 
    category: 'science',
    points: 100,
    completed: false
  }
];
