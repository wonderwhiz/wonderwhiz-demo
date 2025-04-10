
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
  onCreativeUpload?: () => void;
  uploadFeedback?: string | null;
  curioId?: string;
}

export interface TaskBlockProps extends BaseBlockProps {
  content: {
    title: string;
    description: string;
    task?: string;
    reward?: string | number;
    steps?: string[];
  };
  onTaskComplete?: () => void;
}

export interface RiddleBlockProps extends BaseBlockProps {
  content: {
    question: string;
    riddle?: string;
    answer: string;
    hint?: string;
  };
}

export interface NewsBlockProps extends BaseBlockProps {
  content: {
    headline: string;
    summary: string;
    body?: string;
    source: string;
    date?: string;
  };
  onNewsRead?: () => void;
}

export interface ActivityBlockProps extends BaseBlockProps {
  content: {
    title: string;
    activity?: string;
    instructions: string;
    steps?: string[];
  };
  onActivityComplete?: () => void;
}

export interface MindfulnessBlockProps extends BaseBlockProps {
  content: {
    title: string;
    exercise?: string;
    instruction: string;
    duration: number;
  };
  onMindfulnessComplete?: () => void;
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
