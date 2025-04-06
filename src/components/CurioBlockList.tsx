
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import { ContentBlock as ContentBlockType } from '@/types/curio';
import { Lightbulb, Sparkles } from 'lucide-react';

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
      <div className="text-center py-12 text-white/80">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.2 
          }}
          className="relative mx-auto w-24 h-24 mb-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5BA3] to-[#FFD54F] rounded-full opacity-20 blur-xl animate-pulse-gentle"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <Lightbulb className="h-16 w-16 text-[#FFD54F] animate-float-gentle" />
          </div>
        </motion.div>
        <motion.h3 
          className="text-2xl font-semibold mb-3 font-nunito bg-clip-text text-transparent bg-gradient-to-r from-[#FFD54F] to-[#FF5BA3]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Generating content...
        </motion.h3>
        <motion.p 
          className="text-white/70 max-w-md mx-auto font-inter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your personalized discovery journey is being created. Hold tight for some amazing wonders!
        </motion.p>
      </div>
    );
  }

  if (blocks.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12 text-white/80">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
          className="relative mx-auto w-24 h-24 mb-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00E2FF] to-[#4A6FFF] rounded-full opacity-20 blur-xl"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <Lightbulb className="h-16 w-16 text-[#00E2FF]" />
          </div>
        </motion.div>
        <motion.h3 
          className="text-2xl font-semibold mb-3 font-nunito"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          No results found
        </motion.h3>
        <motion.p 
          className="text-white/70 max-w-md mx-auto font-inter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Try a different search term or clear the search to see all content.
        </motion.p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-5"
      variants={container}
      initial={animateBlocks ? "hidden" : false}
      animate={animateBlocks ? "show" : false}
    >
      {blocks.map((block, index) => (
        <motion.div
          key={block.id}
          className="relative group"
          variants={item}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100
          }}
        >
          {/* Decorative elements that appear on hover */}
          <AnimatePresence>
            {(index === 0 || index % 3 === 0) && (
              <motion.div
                className="absolute -left-8 top-1/2 transform -translate-y-1/2 hidden md:block"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-[#FFD54F] animate-sparkle" />
              </motion.div>
            )}
          </AnimatePresence>
          
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
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center mb-2">
                <motion.div 
                  className="w-3 h-3 bg-[#FF5BA3] rounded-full mr-1" 
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                <motion.div 
                  className="w-3 h-3 bg-[#4A6FFF] rounded-full mr-1" 
                  animate={{ 
                    y: [0, -8, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                <motion.div 
                  className="w-3 h-3 bg-[#00E2FF] rounded-full" 
                  animate={{ 
                    y: [0, -6, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.4,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </div>
              <p className="text-sm text-white/70 font-inter">Discovering more wonders...</p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CurioBlockList;
