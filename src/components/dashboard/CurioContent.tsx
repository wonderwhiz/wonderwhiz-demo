
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, Sparkles, Star } from 'lucide-react';
import CurioBlockList from '@/components/CurioBlockList';
import InteractiveSearchBar from '@/components/dashboard/SearchBar';
import QuickAnswer from '@/components/curio/QuickAnswer';
import { TableOfContents } from '@/components/curio/TableOfContents';
import ProgressVisualization from '@/components/curio/ProgressVisualization';
import IllustratedContentBlock from '@/components/content-blocks/IllustratedContentBlock';
import { ContentBlock as CurioContentBlock } from '@/types/curio';

interface ContentBlock {
  id: string;
  type: 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness';
  specialist_id: string;
  content: any;
  liked: boolean;
  bookmarked: boolean;
  curio_id?: string;
  learningContext?: {
    sequencePosition: number;
    totalBlocks: number;
    cognitiveLevel: string;
    timeOfDay: string;
    recommendedPacing: string;
  };
}

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
}

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

interface CurioContentProps {
  currentCurio: Curio | null;
  contentBlocks: ContentBlock[];
  blockReplies: Record<string, BlockReply[]>;
  isGenerating: boolean;
  loadingBlocks: boolean;
  visibleBlocksCount: number;
  profileId?: string;
  onLoadMore: () => void;
  hasMoreBlocks: boolean;
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onSetQuery: (query: string) => void;
  onRabbitHoleFollow: (question: string) => void;
  onQuizCorrect: (blockId: string) => void;
  onNewsRead: (blockId: string) => void;
  onCreativeUpload: (blockId: string) => void;
  onRefresh?: () => void;
  generationError?: string | null;
}

// Define the ChapterIconType here instead of importing it
export type ChapterIconType = 
  | 'introduction' 
  | 'exploration' 
  | 'understanding' 
  | 'challenge' 
  | 'creation' 
  | 'reflection' 
  | 'nextSteps';

// Define a local Chapter interface
interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: ChapterIconType;
  blocks: ContentBlock[];
  isCompleted: boolean;
  isActive: boolean;
}

const CurioContent: React.FC<CurioContentProps> = ({
  currentCurio,
  contentBlocks,
  blockReplies,
  isGenerating,
  loadingBlocks,
  visibleBlocksCount,
  profileId,
  onLoadMore,
  hasMoreBlocks,
  onToggleLike,
  onToggleBookmark,
  onReply,
  onSetQuery,
  onRabbitHoleFollow,
  onQuizCorrect,
  onNewsRead,
  onCreativeUpload,
  onRefresh,
  generationError
}) => {
  // Convert ContentBlock[] to CurioContentBlock[] by adding curio_id if missing
  const convertedBlocks: CurioContentBlock[] = contentBlocks.map(block => ({
    ...block,
    curio_id: block.curio_id || currentCurio?.id || ''
  }));

  return (
    <div className="space-y-6">
      {currentCurio && (
        <h3 className="text-xl font-semibold">{currentCurio.title}</h3>
      )}
      
      <CurioBlockList
        blocks={convertedBlocks}
        animateBlocks={true}
        hasMoreBlocks={hasMoreBlocks}
        loadingMoreBlocks={loadingBlocks}
        searchQuery={""}
        profileId={profileId}
        isFirstLoad={true}
        handleToggleLike={onToggleLike}
        handleToggleBookmark={onToggleBookmark}
        handleReply={onReply}
        handleQuizCorrect={onQuizCorrect}
        handleNewsRead={onNewsRead}
        handleCreativeUpload={onCreativeUpload}
        handleRabbitHoleClick={onRabbitHoleFollow}
        generationError={generationError}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default CurioContent;
