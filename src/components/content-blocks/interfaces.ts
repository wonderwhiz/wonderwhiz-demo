
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
