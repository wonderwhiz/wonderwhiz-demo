
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentBlock from './ContentBlock';
import CurioErrorState from './curio/CurioErrorState';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
  onReadAloud?: (text: string) => void; // For voice readout
  childAge?: number; // For age adaptation
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
  onRefresh,
  onReadAloud,
  childAge = 10
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

  // Auto-read first block for young children on first load
  useEffect(() => {
    if (isFirstLoad && blocks.length > 0 && childAge < 8 && onReadAloud) {
      // For very young children, automatically read the first content block
      const firstBlockContent = blocks[0]?.content?.fact || 
                               blocks[0]?.content?.text || 
                               blocks[0]?.content?.description || '';
      
      if (firstBlockContent) {
        setTimeout(() => {
          onReadAloud(firstBlockContent);
        }, 1000); // Small delay to let UI settle
      }
    }
  }, [isFirstLoad, blocks, childAge, onReadAloud]);

  if (blocks.length === 0 && searchQuery) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-8 text-center"
      >
        <p className="text-white/70 mb-4">No results found for "{searchQuery}"</p>
        <Button 
          variant="outline"
          className="text-indigo-400 hover:text-indigo-300 border-indigo-400/40"
          onClick={() => {
            // This would typically clear the search
            window.history.back();
          }}
        >
          Go Back
        </Button>
      </motion.div>
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

  if (blocks.length === 0 && !loadingMoreBlocks) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-12 text-center"
      >
        <p className="text-white/70 mb-6">Let's find something interesting for you!</p>
        <Button
          variant="default"
          onClick={onRefresh}
          className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-purple/90"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Explore Knowledge
        </Button>
      </motion.div>
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
            onReadAloud={onReadAloud}
            childAge={childAge}
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
