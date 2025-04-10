
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
import { ContentBlock as CurioContentBlock, ContentBlockType } from '@/types/curio';

interface ContentBlock {
  id: string;
  type: ContentBlockType;
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

export type ChapterIconType = 
  | 'introduction' 
  | 'exploration' 
  | 'understanding' 
  | 'challenge' 
  | 'creation' 
  | 'reflection' 
  | 'nextSteps';

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
        loadTriggerRef={undefined}
        searchQuery={""}
        profileId={profileId}
        isFirstLoad={true}
        handleToggleLike={onToggleLike}
        handleToggleBookmark={onToggleBookmark}
        handleReply={onReply}
        handleQuizCorrect={onQuizCorrect}
        handleNewsRead={onNewsRead}
        handleCreativeUpload={onCreativeUpload}
        handleTaskComplete={() => {}} 
        handleActivityComplete={() => {}}
        handleMindfulnessComplete={() => {}}
        handleRabbitHoleClick={onRabbitHoleFollow}
        generationError={generationError}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default CurioContent;
