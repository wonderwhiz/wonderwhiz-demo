
export interface TaskProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  completed: boolean;
  type: 'quiz' | 'read' | 'explore' | 'create' | 'streak' | string;  // Added type property
  priority: 'high' | 'medium' | 'low' | string;  // Added priority property
  timeEstimate?: string;  // Optional timeEstimate property
  reward?: number;  // Optional reward property
}
