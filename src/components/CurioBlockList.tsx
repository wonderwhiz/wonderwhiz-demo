import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ContentBlock from './ContentBlock';
import CurioErrorState from './curio/CurioErrorState';
import ExplorationProgress from './curio/ExplorationProgress';
import ExplorationBreadcrumb from './curio/ExplorationBreadcrumb';
import RelatedCurioPaths from './curio/RelatedCurioPaths';
import { BlockError } from './content-blocks/BlockError';
import { useProgressiveLearning } from '@/hooks/use-progressive-learning';
import ProgressiveLearningBlock from './content-blocks/ProgressiveLearningBlock';
import LearningProgressIndicator from './curio/LearningProgressIndicator';
import FloatingNavigation from './curio/FloatingNavigation';
import CelebrationSystem from './curio/CelebrationSystem';

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
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [recentMilestone, setRecentMilestone] = useState<'first_block' | 'half_complete' | 'all_complete' | null>(null);
  const [recentSparks, setRecentSparks] = useState(0);
  const celebrationShownForThisSession = useRef<boolean>(false);
  
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
  
  useEffect(() => {
    if (blocks.length === 0) return;
    
    const observers: IntersectionObserver[] = [];
    const blockElements = document.querySelectorAll('[data-block-id]');
    
    blockElements.forEach((element, elementIndex) => {
      const blockId = element.getAttribute('data-block-id');
      if (!blockId || viewedBlocks.has(blockId)) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setViewedBlocks(prev => new Set([...prev, blockId]));
              observer.disconnect();
              
              incrementViewedBlocks();
              
              setCurrentBlockIndex(elementIndex);
              
              // Only award sparks for the first 3 blocks viewed
              if (viewedBlocks.size < 3) {
                const newSparks = 1;
                setSparksEarned(prev => prev + newSparks);
                setRecentSparks(newSparks);
                setTimeout(() => setRecentSparks(0), 3000);
              }
              
              // Only trigger milestone celebrations if we haven't shown one yet in this session
              if (!celebrationShownForThisSession.current) {
                if (viewedBlocks.size === 0) {
                  setRecentMilestone('first_block');
                  setTimeout(() => setRecentMilestone(null), 4000);
                  celebrationShownForThisSession.current = true;
                } else if (viewedBlocks.size === Math.floor(blocks.length / 2) - 1) {
                  setRecentMilestone('half_complete');
                  setTimeout(() => setRecentMilestone(null), 4000);
                  celebrationShownForThisSession.current = true;
                } else if (viewedBlocks.size === blocks.length - 1) {
                  setRecentMilestone('all_complete');
                  setTimeout(() => setRecentMilestone(null), 4000);
                  celebrationShownForThisSession.current = true;
                }
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
  
  useEffect(() => {
    if (viewedBlocks.size >= 2) {
      setShowFloatingNav(true);
    }
  }, [viewedBlocks.size]);
  
  useEffect(() => {
    if (isFirstLoad && blocks.length > 0 && childAge < 8 && onReadAloud) {
      const firstBlockContent = blocks[0]?.content?.fact || 
                              blocks[0]?.content?.text || 
                              blocks[0]?.content?.description || '';
      
      if (firstBlockContent) {
        const timeoutId = setTimeout(() => {
          onReadAloud(firstBlockContent);
        }, 1000);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isFirstLoad, blocks, childAge, onReadAloud]);
  
  const trackInteraction = (blockId: string) => {
    if (!interactedBlocks.has(blockId)) {
      setInteractedBlocks(prev => new Set([...prev, blockId]));
      
      // Only award sparks for the first 2 interactions
      if (interactedBlocks.size < 2) {
        const newSparks = 2;
        setSparksEarned(prev => prev + newSparks);
        setRecentSparks(newSparks);
        setTimeout(() => setRecentSparks(0), 3000);
      }
    }
  };
  
  const handleNavigateToBlock = (index: number) => {
    setCurrentBlockIndex(index);
    const blockElement = document.getElementById(`block-${index}`);
    if (blockElement) {
      blockElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
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
      const newSparks = 3;
      setSparksEarned(prev => prev + newSparks);
      setRecentSparks(newSparks);
      setTimeout(() => setRecentSparks(0), 3000);
      handleQuizCorrect();
    }
  };
  
  const handleBlockError = (blockId: string, error: Error) => {
    console.error(`Error rendering block ${blockId}:`, error);
    setBlockRenderErrors(prev => ({
      ...prev,
      [blockId]: error
    }));
  };
  
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

  const shouldInsertProgressiveBlock = (index: number) => {
    if (searchQuery) return false;
    
    const insertPositions = [2, 5, 8];
    if (insertPositions.includes(index) && lastInsertedStageIndex < insertPositions.indexOf(index)) {
      setLastInsertedStageIndex(insertPositions.indexOf(index));
      return true;
    }
    
    return false;
  };

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
      {explorationPath.length > 0 && profileId && (
        <ExplorationBreadcrumb 
          paths={explorationPath} 
          profileId={profileId}
          onPathClick={onNavigateExplorationPath}
        />
      )}
      
      {blocks.length > 0 && !searchQuery && (
        <LearningProgressIndicator
          currentStage={currentLearningStage}
          viewedBlocks={viewedBlocks.size}
          totalBlocks={blocks.length}
          childAge={childAge}
        />
      )}
      
      {blocks.map((block, index) => {
        const blockId = block.id || `block-${index}`;
        
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
                id={`block-${index}`}
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
              id={`block-${index}`}
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
      
      {blocks.length > 0 && !searchQuery && curioTitle && (
        <RelatedCurioPaths
          currentTopic={curioTitle}
          onPathSelect={handleRabbitHoleClick}
          childAge={childAge}
        />
      )}
      
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
      
      {showFloatingNav && blocks.length > 3 && !searchQuery && (
        <FloatingNavigation
          blocks={blocks}
          currentBlockIndex={currentBlockIndex}
          onNavigate={handleNavigateToBlock}
          childAge={childAge}
        />
      )}
      
      <CelebrationSystem
        milestone={recentMilestone}
        sparksEarned={recentSparks}
        childAge={childAge}
      />
    </div>
  );
};

export default CurioBlockList;
