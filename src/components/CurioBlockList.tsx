
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import CurioLoadMore from '@/components/CurioLoadMore';
import { ContentBlock as ContentBlockType } from '@/types/curio';

interface CurioBlockListProps {
  blocks: ContentBlockType[];
  animateBlocks: boolean;
  hasMoreBlocks: boolean;
  loadingMoreBlocks: boolean;
  loadTriggerRef: React.RefObject<HTMLDivElement>;
  searchQuery: string;
  handleToggleLike: (blockId: string) => void;
  handleToggleBookmark: (blockId: string) => void;
  handleReply: (blockId: string, message: string) => void;
  handleQuizCorrect: () => void;
  handleNewsRead: () => void;
  handleCreativeUpload: () => void;
  profileId?: string;
}

const CurioBlockList: React.FC<CurioBlockListProps> = ({
  blocks,
  animateBlocks,
  hasMoreBlocks,
  loadingMoreBlocks,
  loadTriggerRef,
  searchQuery,
  handleToggleLike,
  handleToggleBookmark,
  handleReply,
  handleQuizCorrect,
  handleNewsRead,
  handleCreativeUpload,
  profileId,
}) => {
  // Animation variants for sequential loading
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Animation variants for blocks
  const blockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="space-y-4 px-1"
        variants={containerVariants}
        initial="hidden"
        animate={animateBlocks ? "visible" : "hidden"}
      >
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            variants={blockVariants}
          >
            <ContentBlock
              block={block}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              onReply={handleReply}
              colorVariant={parseInt(block.id.charAt(0), 16) % 3}
              userId={profileId}
              childProfileId={profileId}
              onQuizCorrect={handleQuizCorrect}
              onNewsRead={handleNewsRead}
              onCreativeUpload={handleCreativeUpload}
            />
          </motion.div>
        ))}
        
        {/* Intersection observer trigger element */}
        {(hasMoreBlocks && !searchQuery) && (
          <CurioLoadMore 
            loadingMoreBlocks={loadingMoreBlocks} 
            loadTriggerRef={loadTriggerRef} 
          />
        )}
        
        {(!hasMoreBlocks && blocks.length > 0) && (
          <p className="text-center text-white/50 text-xs py-4">
            {searchQuery ? 'End of search results' : 'You\'ve reached the end of this curio!'}
          </p>
        )}
        
        {(blocks.length === 0) && (
          <div className="text-center py-8">
            <p className="text-white/70">No content blocks found.</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CurioBlockList;
