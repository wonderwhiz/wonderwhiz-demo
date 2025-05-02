
import { ContentBlockType } from '@/types/curio';
import { Dispatch, SetStateAction } from 'react';

export interface BlockInteractionsProps {
  id: string;
  liked: boolean;
  bookmarked: boolean;
  type: string | ContentBlockType;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  setShowReplyForm?: Dispatch<SetStateAction<boolean>>;
  onReply?: (message: string) => void;
  onRabbitHoleClick?: (question: string) => void;
  relatedQuestions: string[];
  childAge?: number;
}

export interface BlockHeaderProps {
  type: string;
  specialistId: string;
  childAge?: number;
  title?: string;
}

export interface BlockContentProps {
  children: React.ReactNode;
  className?: string;
  childAge?: number;
}

export interface BlockFooterProps {
  children: React.ReactNode;
  className?: string;
}

// Added ActivityBlockProps interface
export interface ActivityBlockProps {
  content: {
    activity?: string;
    instructions?: string;
    steps?: string[];
    materials?: string[];
    timeEstimate?: number;
    title?: string;
  };
  specialistId: string;
  onActivityComplete?: () => void;
  updateHeight?: (height: number) => void;
  childAge?: number;
}

// Added CreativeBlockProps interface
export interface CreativeBlockProps {
  content: {
    prompt: string;
    description?: string;
    guidelines?: string | string[];
    examples?: string[];
  };
  specialistId: string;
  onCreativeUpload?: () => void;
  uploadFeedback?: string;
  updateHeight?: (height: number) => void;
  curioId?: string;
  childAge?: number;
}

// Added FlashcardBlockProps interface
export interface FlashcardBlockProps {
  content: {
    front: string;
    back: string;
    hint?: string;
    topic?: string;
  };
  specialistId: string;
  updateHeight?: (height: number) => void;
  childAge?: number;
}

// Added MindfulnessBlockProps interface
export interface MindfulnessBlockProps {
  content: {
    exercise?: string;
    instruction?: string;
    duration?: number;
    benefits?: string[];
    title?: string;
  };
  specialistId: string;
  onMindfulnessComplete?: () => void;
  updateHeight?: (height: number) => void;
  childAge?: number;
}

// Added QuizBlockProps interface
export interface QuizBlockProps {
  question: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  specialistId: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onCorrectAnswer?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  onQuizCorrect?: () => void;
  updateHeight?: (height: number) => void;
  childAge?: number;
  blockId?: string;
}

// Added TaskBlockProps interface
export interface TaskBlockProps {
  content: {
    task: string;
    reward?: string;
    title?: string;
    description?: string;
    steps?: string[];
  };
  specialistId: string;
  onTaskComplete?: () => void;
  updateHeight?: (height: number) => void;
  childAge?: number;
}
