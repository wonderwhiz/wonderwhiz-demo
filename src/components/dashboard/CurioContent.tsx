
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import CurioLoading from '@/components/CurioLoading';
import CurioLoadMore from '@/components/CurioLoadMore';
import { Sparkles } from 'lucide-react';

interface ContentBlock {
  id: string;
  type: 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness';
  specialist_id: string;
  content: any;
  liked: boolean;
  bookmarked: boolean;
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
  onCreativeUpload
}) => {
  // Use memoization to avoid unnecessary re-renders
  const visibleBlocks = useMemo(() => {
    if (!contentBlocks) return [];
    return contentBlocks.slice(0, visibleBlocksCount);
  }, [contentBlocks, visibleBlocksCount]);

  if (!currentCurio) {
    return null;
  }

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCurio.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-white font-nunito"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {currentCurio.title}
            </motion.h1>

            {/* Curio content blocks */}
            <div className="space-y-6 sm:space-y-8">
              {/* Show loading state when no blocks and generating */}
              {visibleBlocks.length === 0 && isGenerating && (
                <div className="flex flex-col items-center justify-center">
                  <CurioLoading />
                </div>
              )}

              {/* Render visible blocks */}
              <AnimatePresence initial={false}>
                {visibleBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + (index * 0.1),
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    className="block-container overflow-visible"
                  >
                    <ContentBlock
                      block={block}
                      onToggleLike={() => onToggleLike(block.id)}
                      onToggleBookmark={() => onToggleBookmark(block.id)}
                      onReply={(message) => onReply(block.id, message)}
                      onSetQuery={onSetQuery}
                      onRabbitHoleFollow={onRabbitHoleFollow}
                      onQuizCorrect={() => onQuizCorrect(block.id)}
                      onNewsRead={() => onNewsRead(block.id)}
                      onCreativeUpload={() => onCreativeUpload(block.id)}
                      profileId={profileId}
                      replies={blockReplies[block.id] || []}
                      isFirstBlock={index === 0}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Show "still generating" message */}
              {visibleBlocks.length > 0 && isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center mt-8 space-y-3"
                >
                  <div className="bg-wonderwhiz-gold/20 px-4 py-2 rounded-full flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-wonderwhiz-gold border-t-transparent rounded-full" />
                    <span className="text-wonderwhiz-gold text-sm">Still creating magic for you...</span>
                  </div>
                  <p className="text-white/70 text-sm text-center">
                    Our specialists are working on more amazing content!
                  </p>
                </motion.div>
              )}

              {/* Load more button - Only show when not initially loading and there are more blocks */}
              {!isGenerating && hasMoreBlocks && visibleBlocks.length > 0 && (
                <CurioLoadMore 
                  onLoadMore={onLoadMore} 
                  loading={loadingBlocks} 
                />
              )}
              
              {/* End of curio indicator */}
              {!isGenerating && !hasMoreBlocks && visibleBlocks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center py-8"
                >
                  <div className="w-12 h-12 rounded-full bg-wonderwhiz-deep-purple/80 flex items-center justify-center mb-3 shadow-glow-brand-gold">
                    <Sparkles className="h-6 w-6 text-wonderwhiz-gold" />
                  </div>
                  <h3 className="text-white text-lg font-medium">You've reached the end!</h3>
                  <p className="text-white/70 text-sm mt-1">
                    Ask another question to keep exploring
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CurioContent;
