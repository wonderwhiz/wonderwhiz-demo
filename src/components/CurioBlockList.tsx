
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import { ContentBlock as ContentBlockType } from '@/types/curio';
import { AlertCircle, Lightbulb, RefreshCw, Sparkles, Brain, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import CurioBlockListLoadMore from './CurioBlockListLoadMore';
import confetti from 'canvas-confetti';

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
  generationError?: string | null;
  onRefresh?: () => void;
}

const CurioBlockList: React.FC<CurioBlockListProps> = ({
  blocks = [], 
  animateBlocks,
  hasMoreBlocks,
  loadingMoreBlocks,
  loadTriggerRef,
  searchQuery = '', 
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
  handleRabbitHoleClick,
  generationError,
  onRefresh
}) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Show initial confetti when blocks load for the first time
    if (blocks.length > 0 && isFirstLoad) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#10b981', '#3b82f6', '#ec4899', '#f59e0b'],
          disableForReducedMotion: true
        });
      }, 800);
    }
  }, [blocks.length, isFirstLoad]);

  // Safety check for blocks array
  const safeBlocks = Array.isArray(blocks) ? blocks : [];
  
  // Display error if there is one
  if (generationError) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/40"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 text-white">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p className="text-center sm:text-left flex-grow">{generationError}</p>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="border-white/20 hover:bg-white/10 flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Try Again</span>
            </Button>
          )}
        </div>
      </motion.div>
    );
  }
  
  if (safeBlocks.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-8 sm:py-12 text-white/80">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.2 
          }}
          className="relative mx-auto w-16 h-16 sm:w-24 sm:h-24 mb-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full opacity-20 blur-xl animate-pulse-gentle"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <Lightbulb className="h-10 w-10 sm:h-16 sm:w-16 text-wonderwhiz-vibrant-yellow animate-float-gentle" />
          </div>
        </motion.div>
        <motion.h3 
          className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 font-nunito bg-clip-text text-transparent bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Creating your learning journey...
        </motion.h3>
        <motion.p 
          className="text-white/70 max-w-md mx-auto font-inter text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your personalized discovery is being crafted just for you. Get ready to expand your knowledge!
        </motion.p>
      </div>
    );
  }

  if (safeBlocks.length === 0 && searchQuery) {
    return (
      <div className="text-center py-8 sm:py-12 text-white/80">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
          className="relative mx-auto w-16 h-16 sm:w-24 sm:h-24 mb-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-cyan to-wonderwhiz-blue-accent rounded-full opacity-20 blur-xl"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <Lightbulb className="h-10 w-10 sm:h-16 sm:h-16 text-wonderwhiz-cyan" />
          </div>
        </motion.div>
        <motion.h3 
          className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 font-nunito"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          No results found
        </motion.h3>
        <motion.p 
          className="text-white/70 max-w-md mx-auto font-inter text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Try a different search term or clear the search to see all content.
        </motion.p>
      </div>
    );
  }

  // Block organization by type for better cognitive flow
  const organizeBlocksByType = (blocks: ContentBlockType[]) => {
    // Group blocks by types for better learning flow
    const typeOrder = ['fact', 'quiz', 'activity', 'creative', 'mindfulness'];
    
    // Sort blocks to ensure we have a good mix but maintain some coherent order
    const sortedBlocks = [...blocks];
    
    // Ensure essential block types appear first (fact should be the first one)
    const firstFactIndex = sortedBlocks.findIndex(block => block.type === 'fact');
    if (firstFactIndex > 0) {
      const firstFact = sortedBlocks[firstFactIndex];
      sortedBlocks.splice(firstFactIndex, 1);
      sortedBlocks.unshift(firstFact);
    }
    
    // Make sure we don't have too many of the same block types in a row
    for (let i = 1; i < sortedBlocks.length - 1; i++) {
      if (sortedBlocks[i].type === sortedBlocks[i-1].type && 
          i+1 < sortedBlocks.length && 
          sortedBlocks[i].type !== sortedBlocks[i+1].type) {
        // Swap to avoid 3 in a row
        const temp = sortedBlocks[i];
        sortedBlocks[i] = sortedBlocks[i+1];
        sortedBlocks[i+1] = temp;
      }
    }
    
    return sortedBlocks;
  };
  
  const organizedBlocks = organizeBlocksByType(safeBlocks);

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

  // Get appropriate icon for block type
  const getBlockIcon = (type: string) => {
    switch(type) {
      case 'fact': return <Lightbulb className="w-4 h-4 text-wonderwhiz-vibrant-yellow" />;
      case 'quiz': return <Brain className="w-4 h-4 text-emerald-400" />;
      case 'activity': 
      case 'creative': return <Sparkles className="w-4 h-4 text-wonderwhiz-bright-pink" />;
      default: return <BookOpen className="w-4 h-4 text-wonderwhiz-gold" />;
    }
  };

  return (
    <motion.div 
      className="space-y-4 sm:space-y-5 px-2 sm:px-0"
      variants={container}
      initial={animateBlocks ? "hidden" : false}
      animate={animateBlocks ? "show" : false}
    >
      {organizedBlocks.map((block, index) => (
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
          {!isMobile && (index === 0 || index % 3 === 0) && (
            <AnimatePresence>
              <motion.div
                className="absolute -left-6 sm:-left-8 top-1/2 transform -translate-y-1/2 hidden md:block"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                {getBlockIcon(block.type)}
              </motion.div>
            </AnimatePresence>
          )}
          
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
            colorVariant={index % 5}
            userId={profileId}
            childProfileId={profileId}
          />
        </motion.div>
      ))}

      {hasMoreBlocks && (
        <CurioBlockListLoadMore 
          loadTriggerRef={loadTriggerRef} 
          loadingMore={loadingMoreBlocks} 
        />
      )}
    </motion.div>
  );
};

export default CurioBlockList;
