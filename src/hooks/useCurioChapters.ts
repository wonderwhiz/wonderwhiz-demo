
import { Chapter } from '@/types/Chapter';

export const useCurioChapters = (): Chapter[] => {
  const DEFAULT_CHAPTERS: Chapter[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      description: 'Discover the basics',
      icon: 'introduction',
      isCompleted: false,
      isActive: true
    },
    {
      id: 'exploration',
      title: 'Exploration',
      description: 'Dive deeper',
      icon: 'exploration',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'understanding',
      title: 'Understanding',
      description: 'Make connections',
      icon: 'understanding',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'challenge',
      title: 'Challenge',
      description: 'Test your knowledge',
      icon: 'challenge',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'creation',
      title: 'Creation',
      description: 'Apply what you learned',
      icon: 'creation',
      isCompleted: false, 
      isActive: false
    },
    {
      id: 'reflection',
      title: 'Reflection',
      description: 'Think and connect',
      icon: 'reflection',
      isCompleted: false,
      isActive: false
    },
    {
      id: 'nextSteps',
      title: 'Next Steps',
      description: 'Continue exploring',
      icon: 'nextSteps',
      isCompleted: false,
      isActive: false
    }
  ];
  
  return DEFAULT_CHAPTERS;
};
