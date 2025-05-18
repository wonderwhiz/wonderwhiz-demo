
// Create the file if it doesn't exist
export type ContentBlockType = 
  | 'fact'
  | 'quiz'
  | 'flashcard'
  | 'creative'
  | 'task'
  | 'riddle'
  | 'funFact'
  | 'activity'
  | 'news' 
  | 'mindfulness';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  specialist_id: string;
  content: Record<string, any>;
  created_at?: string;
  curio_id?: string;
}

/**
 * Type guard to check if a string is a valid ContentBlockType
 */
export function isValidContentBlockType(type: string): type is ContentBlockType {
  const validTypes: readonly string[] = [
    'fact', 
    'quiz', 
    'flashcard', 
    'creative', 
    'task', 
    'riddle', 
    'funFact', 
    'activity', 
    'news',
    'mindfulness'
  ];
  
  return validTypes.includes(type);
}
