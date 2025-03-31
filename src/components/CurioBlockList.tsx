
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
  // Container animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  // Block animation variants with different entrance effects based on block type
  const getBlockVariants = (block: ContentBlockType, index: number) => {
    // Base animation
    const baseVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          duration: 0.7,
          delay: index * 0.08,
          damping: 12
        }
      }
    };

    // Add special animations based on block type
    switch(block.type) {
      case 'quiz':
        return {
          ...baseVariants,
          visible: {
            ...baseVariants.visible,
            transition: {
              ...baseVariants.visible.transition,
              type: "spring",
              stiffness: 100,
            }
          }
        };
      case 'flashcard':
        return {
          ...baseVariants,
          hidden: { opacity: 0, rotateY: 90 },
          visible: { 
            opacity: 1, 
            rotateY: 0,
            transition: {
              ...baseVariants.visible.transition,
              type: "spring",
            }
          }
        };
      case 'creative':
        return {
          ...baseVariants,
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
              ...baseVariants.visible.transition,
              type: "spring",
            }
          }
        };
      default:
        return baseVariants;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="space-y-5 px-1"
        variants={containerVariants}
        initial="hidden"
        animate={animateBlocks ? "visible" : "hidden"}
      >
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <motion.div
              key={block.id}
              className="block-container"
              variants={getBlockVariants(block, index)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
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
          ))
        ) : (
          <motion.div
            className="text-center py-12 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {searchQuery ? (
              <>
                <motion.div 
                  className="text-wonderwhiz-purple/80 text-5xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔍
                </motion.div>
                <h3 className="text-white text-xl font-medium">No results found</h3>
                <p className="text-white/60 mt-2">
                  We couldn't find any content matching "{searchQuery}"
                </p>
              </>
            ) : (
              <>
                <motion.div 
                  className="text-wonderwhiz-purple/80 text-5xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
                <h3 className="text-white text-xl font-medium">No content blocks yet</h3>
                <p className="text-white/60 mt-2">
                  Start exploring by asking a question above!
                </p>
              </>
            )}
          </motion.div>
        )}
        
        {/* Intersection observer trigger element */}
        {(hasMoreBlocks && !searchQuery && blocks.length > 0) && (
          <CurioLoadMore 
            loadingMoreBlocks={loadingMoreBlocks} 
            loadTriggerRef={loadTriggerRef} 
          />
        )}
        
        {(!hasMoreBlocks && blocks.length > 0) && (
          <motion.div 
            className="text-center py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="mx-auto text-3xl mb-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🎉
            </motion.div>
            <p className="text-white/70 text-sm">
              {searchQuery ? 'End of search results' : 'You\'ve reached the end of this curio!'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CurioBlockList;
