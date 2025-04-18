
export interface CardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: string;
  content: string;  // Added content property
  backgroundColor: string;  // Added backgroundColor property
  relevanceScore: number;  // Added relevanceScore property
  relatedTopics: string[];  // Added relatedTopics property
  emotionalTone: 'neutral' | 'excited' | 'calm' | 'curious' | 'playful';  // Added emotionalTone property
}
