
import React from 'react';
import { motion } from 'framer-motion';
import ContentBlock from './ContentBlock';
import CurioErrorState from './curio/CurioErrorState';

interface CurioBlockListProps {
  blocks: any[];
  animateBlocks: boolean;
  hasMoreBlocks: boolean;
  loadingMoreBlocks: boolean;
  loadTriggerRef?: React.RefObject<HTMLDivElement>;
  searchQuery: string;
  profileId?: string;
  isFirstLoad: boolean;
  generationError?: boolean;
  handleToggleLike: (blockId: string) => void;
  handleToggleBookmark: (blockId: string) => void;
  handleReply: (blockId: string, message: string) => void;
  handleQuizCorrect: () => void;
  handleNewsRead: () => void;
  handleCreativeUpload: () => void;
  handleTaskComplete: () => void;
  handleActivityComplete: () => void;
  handleMindfulnessComplete: () => void;
  handleRabbitHoleClick: (question: string) => void;
  onRefresh?: () => void;
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
  generationError,
  handleToggleLike,
  handleToggleBookmark,
  handleReply,
  handleQuizCorrect,
  handleNewsRead,
  handleCreativeUpload,
  handleTaskComplete,
  handleActivityComplete,
  handleMindfulnessComplete,
  handleRabbitHoleClick,
  onRefresh
}) => {
  const blockEntryAnimations = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  if (blocks.length === 0 && searchQuery) {
    return (
      <div className="py-8 text-center">
        <p className="text-white/70">No results found for "{searchQuery}"</p>
        <button 
          className="mt-2 text-indigo-400 hover:text-indigo-300"
          onClick={() => {
            // This would typically clear the search
          }}
        >
          Clear search
        </button>
      </div>
    );
  }

  if (generationError) {
    return (
      <CurioErrorState 
        message="We had trouble generating content. Please try again." 
        onRetry={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <motion.div 
          key={block.id} 
          custom={index}
          initial={animateBlocks ? "hidden" : "visible"}
          animate="visible"
          variants={blockEntryAnimations}
        >
          <ContentBlock 
            block={block}
            onLike={() => handleToggleLike(block.id)}
            onBookmark={() => handleToggleBookmark(block.id)}
            onReply={(message) => handleReply(block.id, message)}
            onCreativeUpload={handleCreativeUpload}
            onTaskComplete={handleTaskComplete}
            onActivityComplete={handleActivityComplete}
            onMindfulnessComplete={handleMindfulnessComplete}
            onNewsRead={handleNewsRead}
            onQuizCorrect={handleQuizCorrect}
            onRabbitHoleClick={handleRabbitHoleClick}
            profileId={profileId}
          />
        </motion.div>
      ))}
      
      {loadingMoreBlocks && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-white/50 text-sm">
            Loading more amazing content...
          </div>
        </div>
      )}
      
      {hasMoreBlocks && !loadingMoreBlocks && loadTriggerRef && (
        <div ref={loadTriggerRef} className="h-10" />
      )}
    </div>
  );
};

export default CurioBlockList;
