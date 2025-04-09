import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import { ContentBlock as ContentBlockType } from '@/types/curio';
import { AlertCircle, Lightbulb, RefreshCw, Sparkles, Brain, BookOpen, Flame, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import CurioBlockListLoadMore from './CurioBlockListLoadMore';
import confetti from 'canvas-confetti';
import { getNarrativeTheme } from './content-blocks/utils/narrativeUtils';
import NarrativeProgress from './NarrativeProgress';

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
  
  // Get the narrative theme for this content sequence
  const narrativeTheme = getNarrativeTheme(safeBlocks);
  
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

  // Organize blocks for narrative flow - keeping our cognitive progression
  const organizeBlocksForNarrative = (blocks: ContentBlockType[]) => {
    // We'll keep the existing organization but enhance it with narrative sequencing
    
    // First, ensure the first block is a fact/funFact that directly answers the question
    const firstFactIndex = blocks.findIndex(block => block.type === 'fact' || block.type === 'funFact');
    if (firstFactIndex > 0) {
      const firstFact = blocks[firstFactIndex];
      blocks.splice(firstFactIndex, 1);
      blocks.unshift(firstFact);
    }
    
    // Ensure narrative flow: introduction → exploration → reflection
    const sortedBlocks = [...blocks];
    
    // Make sure mindfulness/reflection blocks appear near the end
    const mindfulnessIndex = sortedBlocks.findIndex(block => block.type === 'mindfulness');
    if (mindfulnessIndex > -1 && mindfulnessIndex < sortedBlocks.length - 3) {
      const mindfulnessBlock = sortedBlocks[mindfulnessIndex];
      sortedBlocks.splice(mindfulnessIndex, 1);
      
      // Place near the end but not the very last
      const insertPosition = Math.max(sortedBlocks.length - 2, 2);
      sortedBlocks.splice(insertPosition, 0, mindfulnessBlock);
    }
    
    // Make sure creative blocks appear in the middle for application
    const creativeIndices = sortedBlocks.reduce((indices, block, index) => {
      if (block.type === 'creative') indices.push(index);
      return indices;
    }, [] as number[]);
    
    if (creativeIndices.length > 1) {
      // Keep only one creative block in the first half, move others to middle
      const firstCreative = sortedBlocks[creativeIndices[0]];
      const otherCreatives = creativeIndices.slice(1).map(idx => sortedBlocks[idx]);
      
      // Remove all but first creative
      for (let i = creativeIndices.length - 1; i > 0; i--) {
        sortedBlocks.splice(creativeIndices[i], 1);
      }
      
      // Place others in the middle
      const middlePosition = Math.floor(sortedBlocks.length / 2);
      otherCreatives.forEach((block, idx) => {
        sortedBlocks.splice(middlePosition + idx, 0, block);
      });
    }
    
    return sortedBlocks;
  };
  
  const narrativeBlocks = organizeBlocksForNarrative(safeBlocks);

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

  // Get appropriate icon for block type with better visual cues
  const getBlockIcon = (type: string) => {
    switch(type) {
      case 'fact': 
      case 'funFact': return <Lightbulb className="w-4 h-4 text-wonderwhiz-vibrant-yellow" />;
      case 'quiz': return <Brain className="w-4 h-4 text-emerald-400" />;
      case 'activity': return <Zap className="w-4 h-4 text-wonderwhiz-cyan" />;
      case 'creative': return <Sparkles className="w-4 h-4 text-wonderwhiz-bright-pink" />;
      case 'mindfulness': return <Flame className="w-4 h-4 text-wonderwhiz-gold" />;
      default: return <BookOpen className="w-4 h-4 text-wonderwhiz-gold" />;
    }
  };

  // Add meta-learning badge to help children understand their learning path
  const getBlockTypeName = (type: string) => {
    switch(type) {
      case 'fact': 
      case 'funFact': return "Amazing Discovery";
      case 'quiz': return "Brain Challenge";
      case 'activity': return "Hands-on Learning";
      case 'creative': return "Creative Thinking";
      case 'mindfulness': return "Mindful Reflection";
      case 'task': return "Learning Task";
      default: return "Knowledge Block";
    }
  };

  return (
    <motion.div 
      className="space-y-4 sm:space-y-5 px-2 sm:px-0"
      variants={container}
      initial={animateBlocks ? "hidden" : false}
      animate={animateBlocks ? "show" : false}
    >
      {/* Narrative progress indicator */}
      {narrativeBlocks.length > 2 && (
        <NarrativeProgress 
          totalBlocks={narrativeBlocks.length} 
          theme={narrativeTheme} 
        />
      )}
      
      {narrativeBlocks.map((block, index) => (
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
          {/* Learning type indicator for meta-learning */}
          {!isMobile && (
            <AnimatePresence>
              <motion.div
                className="absolute -left-6 sm:-left-10 top-1/2 transform -translate-y-1/2 hidden md:flex flex-col items-center"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {getBlockIcon(block.type)}
                <span className="text-white/50 text-[10px] mt-1 writing-mode-vertical whitespace-nowrap transform -rotate-90 origin-center translate-y-6">
                  {getBlockTypeName(block.type)}
                </span>
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
            totalBlocks={narrativeBlocks.length}
            sequencePosition={index}
            previousBlock={index > 0 ? narrativeBlocks[index - 1] : undefined}
            nextBlock={index < narrativeBlocks.length - 1 ? narrativeBlocks[index + 1] : undefined}
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
