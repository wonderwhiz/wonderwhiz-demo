import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  ThumbsUp,
  Bookmark,
  Share2,
  Sparkles,
  VolumeIcon,
  MessageCircle,
  ArrowRightCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';
import { ContentBlockType } from '@/types/curio';
import BlockInteractions from '@/components/content-blocks/BlockInteractions';
import EnhancedContentBlock from '@/components/content-blocks/EnhancedContentBlock';

export interface CurioContentProps {
  currentCurio: any;
  contentBlocks: any[];
  blockReplies: Record<string, any[]>;
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
  playText?: (text: string) => void; 
  childAge?: number;
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
  generationError,
  playText,
  childAge
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { interactionSize, interactionStyle } = useAgeAdaptation(childAge);

  const handleReplySubmit = (blockId: string) => {
    if (replyText.trim() && onReply) {
      onReply(blockId, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  const handleRabbitHoleClick = (question: string) => {
    onSetQuery(question);
    onRabbitHoleFollow(question);
  };

  const handleReadAloud = (text: string) => {
    if (playText) {
      playText(text);
    } else {
      toast.info('Read aloud feature coming soon!', {
        duration: 2000
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white font-nunito">{currentCurio?.title}</h2>
        <p className="text-sm text-white/70 mt-1 font-lato">{currentCurio?.query}</p>
      </motion.div>

      {contentBlocks && contentBlocks.length > 0 ? (
        contentBlocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <EnhancedContentBlock
              content={block.content.fact || block.content.question || block.content.description || 'No content available'}
              type={block.type}
              childAge={childAge}
            />
          </motion.div>
        ))
      ) : (
        <div className="text-center text-white/60 py-6">
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Generating content...</span>
            </div>
          ) : generationError ? (
            <p>Error generating content. Please try again.</p>
          ) : (
            <p>No content available.</p>
          )}
        </div>
      )}

      {hasMoreBlocks && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onLoadMore}
            disabled={loadingBlocks}
            className="bg-white/5 hover:bg-white/10 text-white"
          >
            {loadingBlocks ? (
              <div className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading More...
              </div>
            ) : (
              'Load More'
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CurioContent;
