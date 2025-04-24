
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ContentBlock from './ContentBlock';
import CurioErrorState from './curio/CurioErrorState';
import ExplorationProgress from './curio/ExplorationProgress';
import ExplorationBreadcrumb from './curio/ExplorationBreadcrumb';
import RelatedCurioPaths from './curio/RelatedCurioPaths';
import { BlockError } from './content-blocks/BlockError';
import { useProgressiveLearning } from '@/hooks/use-progressive-learning';
import ProgressiveLearningBlock from './content-blocks/ProgressiveLearningBlock';

interface CurioBlockListProps {
  blocks: any[];
  animateBlocks: boolean;
  hasMoreBlocks: boolean;
  loadingMoreBlocks: boolean;
  loadTriggerRef?: React.RefObject<HTMLDivElement>;
  searchQuery: string;
  profileId?: string;
  curioTitle?: string;
  curioId?: string;
  explorationPath?: {title: string, id?: string}[];
  isFirstLoad: boolean;
  generationError?: boolean;
  handleToggleLike: (blockId: string) => void;
  handleToggleBookmark: (blockId: string) => void;
  handleReply: (blockId: string, message: string) => void;
  handleQuizCorrect: () => void;
  handleNewsRead: () => void;
  handleCreativeUpload: () => void;
  handleTaskComplete?: () => void;
  handleActivityComplete?: () => void;
  handleMindfulnessComplete?: () => void;
  handleRabbitHoleClick: (question: string) => void;
  onRefresh?: () => void;
  onReadAloud?: (text: string) => void;
  onNavigateExplorationPath?: (index: number) => void;
  childAge?: number;
}

const CurioBlockList: React.FC<CurioBlockListProps> = ({
  blocks,
  animateBlocks,
  hasMoreBlocks,
  loadingMoreBlocks,
  loadTriggerRef,
  searchQuery,
  profileId,
  curioTitle = '',
  curioId,
  explorationPath = [],
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
  onNavigateExplorationPath,
  childAge = 10
}) => {
  const [viewedBlocks, setViewedBlocks] = useState<Set<string>>(new Set());
  const [interactedBlocks, setInteractedBlocks] = useState<Set<string>>(new Set());
  const [sparksEarned, setSparksEarned] = useState(0);
  const [blockRenderErrors, setBlockRenderErrors] = useState<Record<string, Error>>({});
  const [lastInsertedStageIndex, setLastInsertedStageIndex] = useState<number>(-1);
  
  const { 
    currentLearningStage,
    foundationalQuestions,
    expansionQuestions,
    connectionQuestions,
    applicationQuestions,
    deeperDiveQuestions,
    incrementViewedBlocks,
    getQuestionsByStage
  } = useProgressiveLearning({
    childId: profileId,
    curioId,
    childAge,
    topic: curioTitle
  });
  
  // Track which blocks have been viewed using Intersection Observer
  useEffect(() => {
    if (blocks.length === 0) return;
    
    const observers: IntersectionObserver[] = [];
    const blockElements = document.querySelectorAll('[data-block-id]');
    
    blockElements.forEach(element => {
      const blockId = element.getAttribute('data-block-id');
      if (!blockId || viewedBlocks.has(blockId)) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setViewedBlocks(prev => new Set([...prev, blockId]));
              observer.disconnect();
              
              // Track progressive learning
              incrementViewedBlocks();
              
              // Award a spark for the first 5 blocks viewed
              if (viewedBlocks.size < 5) {
                setSparksEarned(prev => prev + 1);
              }
            }
          });
        },
        { threshold: 0.6 }
      );
      
      observer.observe(element);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [blocks, viewedBlocks, incrementViewedBlocks]);
  
  // Track interactions
  const trackInteraction = (blockId: string) => {
    if (!interactedBlocks.has(blockId)) {
      setInteractedBlocks(prev => new Set([...prev, blockId]));
      
      // Award sparks for interactions
      if (interactedBlocks.size < 3) {
        setSparksEarned(prev => prev + 2);
      }
    }
  };
  
  // Enrich the block handlers to track interactions
  const enrichedHandlers = {
    handleToggleLike: (blockId: string) => {
      trackInteraction(blockId);
      handleToggleLike(blockId);
    },
    handleToggleBookmark: (blockId: string) => {
      trackInteraction(blockId);
      handleToggleBookmark(blockId);
    },
    handleReply: (blockId: string, message: string) => {
      trackInteraction(blockId);
      handleReply(blockId, message);
    },
    handleQuizCorrect: () => {
      setSparksEarned(prev => prev + 3);
      handleQuizCorrect();
    }
  };
  
  // Error boundary for block rendering
  const handleBlockError = (blockId: string, error: Error) => {
    console.error(`Error rendering block ${blockId}:`, error);
    setBlockRenderErrors(prev => ({
      ...prev,
      [blockId]: error
    }));
  };
  
  // Animation variants
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
        const timeoutId = setTimeout(() => {
          onReadAloud(firstBlockContent);
        }, 1000); // Small delay to let UI settle
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isFirstLoad, blocks, childAge, onReadAloud]);

  // Determine where to insert a progressive learning block
  const shouldInsertProgressiveBlock = (index: number) => {
    if (searchQuery) return false;
    
    // Insert at positions 2, 5, 8 - but only if not already inserted
    const insertPositions = [2, 5, 8];
    if (insertPositions.includes(index) && lastInsertedStageIndex < insertPositions.indexOf(index)) {
      setLastInsertedStageIndex(insertPositions.indexOf(index));
      return true;
    }
    
    return false;
  };

  // Get the learning stage for a specific block position
  const getStageForPosition = (position: number) => {
    if (position === 2) return 'foundational';
    if (position === 5) return 'expansion';
    if (position === 8) return 'deeper_dive';
    return 'foundational';
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
      {/* Exploration Breadcrumb Navigation */}
      {explorationPath.length > 0 && profileId && (
        <ExplorationBreadcrumb 
          paths={explorationPath} 
          profileId={profileId}
          onPathClick={onNavigateExplorationPath}
        />
      )}
      
      {/* Progress Tracker */}
      {blocks.length > 0 && !searchQuery && (
        <ExplorationProgress
          totalBlocks={blocks.length}
          viewedBlocks={viewedBlocks.size}
          interactedBlocks={interactedBlocks.size}
          sparksEarned={sparksEarned}
        />
      )}
      
      {/* Content Blocks with Progressive Learning */}
      {blocks.map((block, index) => {
        const blockId = block.id || `block-${index}`;
        
        // Progressive learning blocks
        const progressiveElements = [];
        
        if (shouldInsertProgressiveBlock(index)) {
          const stage = getStageForPosition(index);
          const questions = getQuestionsByStage(stage as any);
          
          progressiveElements.push(
            <motion.div 
              key={`progressive-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ProgressiveLearningBlock
                stage={stage as any}
                childAge={childAge}
                questions={questions}
                onQuestionClick={handleRabbitHoleClick}
              />
            </motion.div>
          );
        }
        
        // If this block has a rendering error, show error component instead
        if (blockRenderErrors[blockId]) {
          return (
            <React.Fragment key={`fragment-${blockId}`}>
              {progressiveElements}
              <motion.div 
                key={blockId} 
                custom={index}
                initial={animateBlocks ? "hidden" : "visible"}
                animate="visible"
                variants={blockEntryAnimations}
                data-block-id={blockId}
              >
                <BlockError 
                  error={blockRenderErrors[blockId]}
                  message="This content block couldn't be displayed."
                  onRetry={() => setBlockRenderErrors(prev => {
                    const newErrors = {...prev};
                    delete newErrors[blockId];
                    return newErrors;
                  })}
                  childAge={childAge}
                />
              </motion.div>
            </React.Fragment>
          );
        }
        
        return (
          <React.Fragment key={`fragment-${blockId}`}>
            {progressiveElements}
            <motion.div 
              key={blockId} 
              custom={index}
              initial={animateBlocks ? "hidden" : "visible"}
              animate="visible"
              variants={blockEntryAnimations}
              data-block-id={blockId}
            >
              <ContentBlock 
                block={block}
                onLike={() => enrichedHandlers.handleToggleLike(blockId)}
                onBookmark={() => enrichedHandlers.handleToggleBookmark(blockId)}
                onReply={(message) => enrichedHandlers.handleReply(blockId, message)}
                onCreativeUpload={handleCreativeUpload}
                onTaskComplete={handleTaskComplete}
                onActivityComplete={handleActivityComplete}
                onMindfulnessComplete={handleMindfulnessComplete}
                onNewsRead={handleNewsRead}
                onQuizCorrect={enrichedHandlers.handleQuizCorrect}
                onRabbitHoleClick={handleRabbitHoleClick}
                onReadAloud={onReadAloud}
                childAge={childAge}
                profileId={profileId}
              />
            </motion.div>
          </React.Fragment>
        );
      })}
      
      {/* Final progressive learning block for application stage */}
      {blocks.length >= 4 && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProgressiveLearningBlock
            stage="application"
            childAge={childAge}
            questions={applicationQuestions}
            onQuestionClick={handleRabbitHoleClick}
          />
        </motion.div>
      )}
      
      {/* Related exploration paths */}
      {blocks.length > 0 && !searchQuery && curioTitle && (
        <RelatedCurioPaths
          currentTopic={curioTitle}
          onPathSelect={handleRabbitHoleClick}
          childAge={childAge}
        />
      )}
      
      {/* Loading indicator */}
      {loadingMoreBlocks && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-white/50 text-sm">
            Loading more amazing content...
          </div>
        </div>
      )}
      
      {/* Infinite scroll trigger */}
      {hasMoreBlocks && !loadingMoreBlocks && loadTriggerRef && (
        <div ref={loadTriggerRef} className="h-10" />
      )}
    </div>
  );
};

export default CurioBlockList;
