
/**
 * Task interface shared across task components
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  type: 'quiz' | 'read' | 'create' | 'explore';
  duration?: string;
  reward?: number;
}

/**
 * Child profile interface
 */
export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  interests?: string[];
  streakDays?: number;
  sparksBalance?: number;
  level?: number;
  avatarUrl?: string;
}

/**
 * Curio interface representing a curiosity/learning topic
 */
export interface Curio {
  id: string;
  title: string;
  query?: string;
  createdAt: string;
  childId: string;
}

/**
 * Content block interface for knowledge content
 */
export interface ContentBlock {
  id: string;
  curioId: string;
  specialistId: string;
  type: 'fact' | 'quiz' | 'creative' | 'activity' | 'news' | 'funFact' | 'mindfulness';
  content: any;
  liked: boolean;
  bookmarked: boolean;
  createdAt: string;
}

/**
 * Block interaction handlers interface
 */
export interface BlockInteractions {
  handleToggleLike: (blockId: string) => void;
  handleToggleBookmark: (blockId: string) => void;
  handleReply: (blockId: string, message: string) => void;
  handleQuizCorrect: () => void;
  handleNewsRead: () => void;
  handleCreativeUpload: () => void;
  handleTaskComplete: () => void;
  handleActivityComplete: () => void;
  handleMindfulnessComplete: () => void;
}
