
export interface BlockInteractionsProps {
  id: string;
  liked?: boolean;
  bookmarked?: boolean;
  type: string;
  onToggleLike?: () => void;
  onToggleBookmark: () => void;
  setShowReplyForm?: (show: boolean) => void;
  onRabbitHoleClick?: (question: string) => void;
  relatedQuestions?: string[];
}

export interface FlashcardBlockProps {
  content: {
    front: string;
    back: string;
    hint?: string;
  };
  specialistId: string;
}

export interface CreativeBlockProps {
  content: {
    prompt: string;
    description?: string;
    guidelines?: string;
    examples?: string[];
  };
  specialistId: string;
  onCreativeUpload?: () => void;
  uploadFeedback?: string | null;
}

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
}

export interface RiddleBlockProps {
  content: {
    riddle: string;
    answer: string;
    question?: string;
    hint?: string;
  };
  specialistId: string;
}

export interface NewsBlockProps {
  content: {
    headline?: string;
    summary?: string;
    body?: string;
    source?: string;
    date?: string;
  };
  specialistId: string;
  onNewsRead?: () => void;
}

export interface ActivityBlockProps {
  content: {
    activity: string;
    title?: string;
    instructions?: string;
    steps?: string[];
  };
  specialistId: string;
  onActivityComplete?: () => void;
}

export interface MindfulnessBlockProps {
  content: {
    exercise: string;
    duration?: number;
    title?: string;
    instruction?: string;
  };
  specialistId: string;
  onMindfulnessComplete?: () => void;
}
