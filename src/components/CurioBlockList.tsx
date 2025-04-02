import React, { useState, useEffect } from 'react';
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
  onRabbitHoleClick: (question: string) => void;
  onQuizCorrect?: () => void;
  onNewsRead?: () => void;
  onCreativeUpload?: () => void;
  onTaskComplete?: () => void;
  onActivityComplete?: () => void;
  onMindfulnessComplete?: () => void;
  profileId?: string;
  isFirstLoad?: boolean;
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
  onRabbitHoleClick,
  onQuizCorrect,
  onNewsRead,
  onCreativeUpload,
  onTaskComplete,
  onActivityComplete,
  onMindfulnessComplete,
  profileId,
  isFirstLoad = false,
}) => {
  const [renderedBlocks, setRenderedBlocks] = useState<ContentBlockType[]>([]);
  
  useEffect(() => {
    if (blocks.length === 0) {
      setRenderedBlocks([]);
      return;
    }
    
    if (blocks.length > 0 && renderedBlocks.length === 0) {
      setRenderedBlocks([blocks[0]]);
      
      if (blocks.length > 1) {
        const timer = setTimeout(() => {
          setRenderedBlocks(blocks);
        }, 300);
        return () => clearTimeout(timer);
      }
    } else if (blocks.length !== renderedBlocks.length) {
      setRenderedBlocks(blocks);
    }
  }, [blocks, renderedBlocks.length]);
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const getBlockVariants = (block: ContentBlockType, index: number) => {
    const baseVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          duration: 0.6,
          delay: index * 0.07,
          damping: 14
        }
      }
    };

    switch(block.type) {
      case 'quiz':
        return {
          ...baseVariants,
          visible: {
            ...baseVariants.visible,
            transition: {
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
      case 'task':
        return {
          ...baseVariants,
          hidden: { opacity: 0, x: -20 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: {
              ...baseVariants.visible.transition,
              type: "spring",
            }
          }
        };
      case 'activity':
        return {
          ...baseVariants,
          hidden: { opacity: 0, x: 20 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: {
              ...baseVariants.visible.transition,
              type: "spring",
            }
          }
        };
      case 'mindfulness':
        return {
          ...baseVariants,
          hidden: { opacity: 0, scale: 0.9, y: 10 },
          visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
              ...baseVariants.visible.transition,
              type: "spring",
            }
          }
        };
      case 'riddle':
        return {
          ...baseVariants,
          hidden: { opacity: 0, rotate: -2 },
          visible: { 
            opacity: 1, 
            rotate: 0,
            transition: {
              ...baseVariants.visible.transition,
              type: "spring",
            }
          }
        };
      case 'news':
        return {
          ...baseVariants,
          hidden: { opacity: 0, y: -20, scale: 0.95 },
          visible: { 
            opacity: 1, 
            y: 0,
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

  const emptyStateVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const renderEmptyState = () => (
    <motion.div
      className="text-center py-12 px-4"
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
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
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="space-y-5 px-1"
        variants={containerVariants}
        initial="hidden"
        animate={animateBlocks ? "visible" : "hidden"}
      >
        {renderedBlocks.length > 0 ? (
          renderedBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              className="block-container"
              variants={getBlockVariants(block, index)}
              whileHover={{ 
                scale: 1.01, 
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transition: { duration: 0.2 } 
              }}
            >
              <ContentBlock
                block={block}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
                onReply={handleReply}
                colorVariant={parseInt(block.id.charAt(0), 16) % 3}
                userId={profileId}
                childProfileId={profileId}
                onQuizCorrect={onQuizCorrect}
                onNewsRead={onNewsRead}
                onCreativeUpload={onCreativeUpload}
                onTaskComplete={onTaskComplete}
                onActivityComplete={onActivityComplete}
                onMindfulnessComplete={onMindfulnessComplete}
                isFirstBlock={index === 0}
                onRabbitHoleClick={onRabbitHoleClick}
              />
            </motion.div>
          ))
        ) : (
          renderEmptyState()
        )}
        
        {(hasMoreBlocks && !searchQuery && renderedBlocks.length > 0) && (
          <CurioLoadMore 
            loadingMoreBlocks={loadingMoreBlocks} 
            loadTriggerRef={loadTriggerRef} 
          />
        )}
        
        {(!hasMoreBlocks && renderedBlocks.length > 0) && (
          <motion.div 
            className="text-center py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="mx-auto text-3xl mb-2"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
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
