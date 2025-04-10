
// Common props that all block components should have
export interface BaseBlockProps {
  specialistId: string;
  updateHeight?: (height: number) => void;
}

export interface FlashcardBlockProps extends BaseBlockProps {
  content: {
    front: string;
    back: string;
    hint?: string;
  };
}

export interface CreativeBlockProps extends BaseBlockProps {
  content: {
    prompt: string;
    description?: string;
    guidelines?: string;
    examples?: any[];
  };
  onCreativeUpload?: (fileUrl?: string) => void;
  uploadFeedback?: string | null;
  curioId?: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
}

export interface TaskBlockProps extends BaseBlockProps {
  content: {
    task: string;
    reward: string | number;
    title?: string;
    description?: string;
    steps?: string[];
  };
  onTaskComplete?: () => void;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
}

export interface RiddleBlockProps extends BaseBlockProps {
  content: {
    riddle: string;
    answer: string;
    question?: string;
    hint?: string;
  };
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
}

export interface NewsBlockProps extends BaseBlockProps {
  content: {
    headline: string;
    summary: string;
    body?: string;
    source: string;
    date?: string;
    imageUrl?: string;
  };
  onNewsRead?: () => void;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
}

export interface ActivityBlockProps extends BaseBlockProps {
  content: {
    activity: string;
    title?: string;
    instructions?: string;
    steps?: string[];
    materials?: string[];
  };
  onActivityComplete?: () => void;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
}

export interface MindfulnessBlockProps extends BaseBlockProps {
  content: {
    exercise: string;
    duration: number;
    title?: string;
    instruction?: string;
    audioUrl?: string;
  };
  onMindfulnessComplete?: () => void;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
}

export interface BlockInteractionsProps {
  id: string;
  liked: boolean;
  bookmarked: boolean;
  type: string;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  setShowReplyForm: React.Dispatch<React.SetStateAction<boolean>>;
  onRabbitHoleClick?: (question: string) => void;
  relatedQuestions?: string[];
}

export interface CurioPageHeaderProps {
  curioTitle: string | null;
  childProfile?: any;
  handleBackToDashboard: () => void;
  handleToggleInsights?: () => void;
  handleRefresh?: () => void;
  refreshing?: boolean;
  showInsights?: boolean;
}

export interface CurioPageInsightsProps {
  difficulty: string;
  blockCount: number;
  learningSummary: string;
  showInsights?: boolean;
  handleToggleInsights?: () => void;
}
