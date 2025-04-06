
import React from 'react';
import { motion } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import { ContentBlock as ContentBlockType } from '@/types/curio';
import { Lightbulb } from 'lucide-react';

interface CurioBlockListProps {
  blocks: ContentBlockType[];
  animateBlocks: boolean;
  hasMoreBlocks: boolean;
  loadingMoreBlocks: boolean;
  loadTriggerRef: React.RefObject<HTMLDivElement>;
  searchQuery: string;
  profileId?: string;
  isFirstLoad: boolean;
  handleToggleLike: (blockId: string) => void;
  handleToggleBookmark: (blockId: string) => void;
  handleReply: (blockId: string, message: string) => void;
  handleQuizCorrect: (blockId: string) => void;
  handleNewsRead: (blockId: string) => void;
  handleCreativeUpload: (blockId: string) => void;
  handleTaskComplete: () => void;
  handleActivityComplete: () => void;
  handleMindfulnessComplete: () => void;
  handleRabbitHoleClick: (question: string) => void;
}

const CurioBlockList: React.FC<CurioBlockListProps> = ({
  blocks,
  animateBlocks,
  hasMoreBlocks,
  loadingMoreBlocks,
  loadTriggerRef,
  searchQuery,
  profileId,
  isFirstLoad,
  handleToggleLike,
  handleToggleBookmark,
  handleReply,
  handleQuizCorrect,
  handleNewsRead,
  handleCreativeUpload,
  handleTaskComplete,
  handleActivityComplete,
  handleMindfulnessComplete,
  handleRabbitHoleClick
}) => {
  if (blocks.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-8 text-white/70">
        <Lightbulb className="h-12 w-12 mx-auto mb-3 text-wonderwhiz-gold/70" />
        <h3 className="text-xl font-semibold mb-2">Generating content...</h3>
        <p>Your personalized content is being created. Please wait a moment.</p>
      </div>
    );
  }

  if (blocks.length === 0 && searchQuery) {
    return (
      <div className="text-center py-8 text-white/70">
        <Lightbulb className="h-12 w-12 mx-auto mb-3 text-wonderwhiz-gold/70" />
        <h3 className="text-xl font-semibold mb-2">No results found</h3>
        <p>Try a different search term or clear the search to see all content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <motion.div
          key={block.id}
          initial={animateBlocks ? { opacity: 0, y: 20 } : false}
          animate={animateBlocks ? { opacity: 1, y: 0 } : false}
          transition={{
            delay: Math.min(index * 0.1, 0.5),
            duration: 0.3,
          }}
        >
          <ContentBlock
            block={block}
            onToggleLike={() => handleToggleLike(block.id)}
            onToggleBookmark={() => handleToggleBookmark(block.id)}
            onReply={(message) => handleReply(block.id, message)}
            onQuizCorrect={() => handleQuizCorrect(block.id)}
            onNewsRead={() => handleNewsRead(block.id)}
            onCreativeUpload={() => handleCreativeUpload(block.id)}
            onTaskComplete={handleTaskComplete}
            onActivityComplete={handleActivityComplete}
            onMindfulnessComplete={handleMindfulnessComplete}
            onRabbitHoleFollow={handleRabbitHoleClick}
            isFirstBlock={index === 0}
            colorVariant={index % 3}
            userId={profileId}
            childProfileId={profileId}
          />
        </motion.div>
      ))}

      {hasMoreBlocks && (
        <div ref={loadTriggerRef} className="h-20 w-full flex items-center justify-center">
          {loadingMoreBlocks && (
            <div className="flex flex-col items-center">
              <div className="animate-bounce flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-wonderwhiz-purple/60 rounded-full mr-1" />
                <div className="w-2 h-2 bg-wonderwhiz-purple/60 rounded-full mr-1 animate-pulse" />
                <div className="w-1 h-1 bg-wonderwhiz-purple/60 rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-white/50">Loading more wonders...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurioBlockList;
