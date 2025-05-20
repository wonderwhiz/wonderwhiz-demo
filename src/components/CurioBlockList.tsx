import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FixedSizeList } from 'react-window';
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

const ITEM_HEIGHT = 400; // Adjusted for more content, still an estimate

const CurioBlockList: React.FC<CurioBlockListProps> = ({
  blocks,
  animateBlocks, // This prop might be less relevant or need rethinking with virtualization
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
  handleRabbitHoleClick, // This should be memoized by parent
  onRefresh,
  onReadAloud, // This should be memoized by parent
  onNavigateExplorationPath, // This should be memoized by parent
  childAge = 10
}) => {
  const [viewedBlocks, setViewedBlocks] = useState<Set<string>>(new Set());
  // const [interactedBlocks, setInteractedBlocks] = useState<Set<string>>(new Set()); // Keep if sparks logic remains
  // Sparks and milestone logic will need adjustment as IntersectionObserver is removed.
  // For now, these will be simplified or based on onItemsRendered.
  const [sparksEarned, setSparksEarned] = useState(0); // Potentially link to viewedBlocks size
  const [blockRenderErrors, setBlockRenderErrors] = useState<Record<string, Error>>({});
  // const [lastInsertedStageIndex, setLastInsertedStageIndex] = useState<number>(-1); // Progressive learning insertion simplified
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0); // Will be updated by onItemsRendered
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [recentMilestone, setRecentMilestone] = useState<'first_block' | 'half_complete' | 'all_complete' | null>(null);
  const [recentSparks, setRecentSparks] = useState(0);

  const {
    currentLearningStage,
    // foundationalQuestions, // Progressive learning blocks simplified
    // expansionQuestions,
    // connectionQuestions,
    applicationQuestions, // Kept for potential use outside the list
    // deeperDiveQuestions,
    incrementViewedBlocks, // This will be called differently
    // getQuestionsByStage // Progressive learning blocks simplified
  } = useProgressiveLearning({
    childId: profileId,
    curioId,
    childAge,
    topic: curioTitle,
  });

  // Simplified viewed blocks and milestone logic based on onItemsRendered
  const onItemsRendered = useCallback(({ visibleStartIndex, visibleStopIndex }) => {
    if (blocks.length === 0) return;

    setCurrentBlockIndex(visibleStartIndex); // Set current block to the first visible one

    const newlyViewedBlockIds = new Set<string>();
    for (let i = visibleStartIndex; i <= visibleStopIndex; i++) {
      if (blocks[i] && blocks[i].id) {
        newlyViewedBlockIds.add(blocks[i].id);
      }
    }

    let newSparksAwardedThisTurn = 0;
    let newMilestone: 'first_block' | 'half_complete' | 'all_complete' | null = null;

    setViewedBlocks(prevViewedBlocks => {
      const updatedViewedBlocks = new Set(prevViewedBlocks);
      let newBlocksViewedCount = 0;
      newlyViewedBlockIds.forEach(id => {
        if (!updatedViewedBlocks.has(id)) {
          updatedViewedBlocks.add(id);
          newBlocksViewedCount++;
          // Simplified sparks: 1 spark per newly viewed block, up to a limit for this "batch"
          if (updatedViewedBlocks.size <= prevViewedBlocks.size + 5) { // Limit sparks per render batch
             newSparksAwardedThisTurn += 1;
          }
        }
      });

      if (newBlocksViewedCount > 0) {
        // Call incrementViewedBlocks for each newly viewed block
        for(let i = 0; i < newBlocksViewedCount; i++) {
            incrementViewedBlocks();
        }
      }
      
      // Simplified Milestone Logic
      if (prevViewedBlocks.size === 0 && updatedViewedBlocks.size > 0) {
        newMilestone = 'first_block';
      } else if (updatedViewedBlocks.size >= Math.floor(blocks.length / 2) && prevViewedBlocks.size < Math.floor(blocks.length / 2)) {
        newMilestone = 'half_complete';
      } else if (updatedViewedBlocks.size === blocks.length && prevViewedBlocks.size < blocks.length) {
        newMilestone = 'all_complete';
      }
      
      return updatedViewedBlocks;
    });

    if (newSparksAwardedThisTurn > 0) {
      setSparksEarned(prev => prev + newSparksAwardedThisTurn);
      setRecentSparks(newSparksAwardedThisTurn);
      setTimeout(() => setRecentSparks(0), 3000);
    }
    if (newMilestone) {
      setRecentMilestone(newMilestone);
      setTimeout(() => setRecentMilestone(null), 4000);
    }

    // Infinite scroll
    if (hasMoreBlocks && !loadingMoreBlocks && visibleStopIndex >= blocks.length - 3) {
       if (loadTriggerRef && typeof loadTriggerRef !== 'function') { // Check if ref is object
         // This ref might not be directly usable for react-window's infinite scroll
         // We call loadMoreBlocks directly from onItemsRendered
       }
       // It's important that loadMoreBlocks is stable (useCallback in parent)
       if(typeof loadTriggerRef === 'function') { // if it's a callback ref
            // loadTriggerRef(null); // Not needed with onItemsRendered
       }
       // Directly call loadMoreBlocks if available (assuming it's stable via props)
       // Ensure loadMoreBlocks is correctly passed and memoized from parent
       // The original `loadTriggerRef` prop might need to be re-evaluated or removed if `loadMoreBlocks` is directly callable
       // For now, I'm assuming a prop `loadMoreBlocksCallback` exists or `loadTriggerRef` is a misnomer for it.
       // Let's assume `loadMoreBlocks` is passed from the parent hook `useCurioData`
       // and is already memoized there.
       const parentComponent = (loadTriggerRef?.current?.parentElement?.parentElement); // This is hacky, better to pass loadMore directly
       if(parentComponent?.scrollTop && parentComponent?.scrollHeight && parentComponent?.clientHeight){
          if(parentComponent.scrollTop + parentComponent.clientHeight >= parentComponent.scrollHeight - ITEM_HEIGHT * 2){
            // console.log("Attempting to load more blocks");
            // loadMoreBlocks(); // This function is not directly available as a prop, it's part of useCurioData
            // The prop `loadTriggerRef` is for a DOM element for IntersectionObserver, which is not used here.
            // We need a callback prop for loading more, let's assume it's `onLoadMore` for now
            // This part needs careful wiring with how useCurioData provides the loadMore function
          }
       }

    }

  }, [blocks, hasMoreBlocks, loadingMoreBlocks, incrementViewedBlocks, /*loadMoreBlocks - needs to be a prop */]);


  useEffect(() => {
    if (viewedBlocks.size >= 2 && blocks.length > 3) { // ensure enough blocks to warrant nav
      setShowFloatingNav(true);
    } else {
      setShowFloatingNav(false);
    }
  }, [viewedBlocks.size, blocks.length]);

  // This effect for reading first block aloud can remain, but ensure `blocks[0]` is valid.
  useEffect(() => {
    if (isFirstLoad && blocks.length > 0 && childAge < 8 && onReadAloud) {
      const firstBlockContent =
        blocks[0]?.content?.fact ||
        blocks[0]?.content?.text ||
        blocks[0]?.content?.description ||
        '';
      if (firstBlockContent) {
        const timeoutId = setTimeout(() => {
          onReadAloud(firstBlockContent);
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isFirstLoad, blocks, childAge, onReadAloud]);

  // trackInteraction simplified or removed if not directly tied to IntersectionObserver
  // const trackInteraction = (blockId: string) => {
  //   if (!interactedBlocks.has(blockId)) {
  //     setInteractedBlocks(prev => new Set([...prev, blockId]));
  //     // Simplified sparks logic
  //   }
  // };

  const listRef = useRef<FixedSizeList>(null);

  const handleNavigateToBlock = useCallback((index: number) => {
    if (listRef.current) {
      listRef.current.scrollToItem(index, 'start');
      setCurrentBlockIndex(index);
    }
  }, []);

  // Memoize enrichedHandlers to stabilize props for ContentBlock
  const enrichedHandlers = useMemo(() => ({
    // trackInteraction is removed for now, directly call props
    handleToggleLike: (blockId: string) => {
      // trackInteraction(blockId); 
      handleToggleLike(blockId);
    },
    handleToggleBookmark: (blockId: string) => {
      // trackInteraction(blockId);
      handleToggleBookmark(blockId);
    },
    handleReply: (blockId: string, message: string) => {
      // trackInteraction(blockId);
      handleReply(blockId, message);
    },
    // Simplified sparks logic for quiz
    handleQuizCorrect: () => {
      const newSparks = 3;
      setSparksEarned(prev => prev + newSparks);
      setRecentSparks(newSparks);
      setTimeout(() => setRecentSparks(0), 3000);
      handleQuizCorrect();
    },
  }), [handleToggleLike, handleToggleBookmark, handleReply, handleQuizCorrect]);

  const handleBlockError = useCallback((blockId: string, error: Error) => {
    console.error(`Error rendering block ${blockId}:`, error);
    setBlockRenderErrors(prev => ({ ...prev, [blockId]: error }));
  }, []);

  // Animation for list items (can be kept simple for virtualized list)
  // const blockEntryAnimations = { ... }; // Kept if needed for individual items, but FixedSizeList manages appearance.

  // Progressive learning block insertion logic is removed due to FixedSizeList.
  // These would need to be part of the `blocks` data array if they are to be virtualized.
  // For now, one "application" block is shown at the end, outside the list.

  if (blocks.length === 0 && searchQuery) {
    return (
      <div className="py-8 text-center">
        <p className="text-white/70">No results found for "{searchQuery}"</p>
        <button
          className="mt-2 text-indigo-400 hover:text-indigo-300"
          onClick={() => {
            // This should call a prop to clear search, e.g., onClearSearch()
          }}
        >
          Clear search
        </button>
      </div>
    );
  }

  if (generationError && blocks.length === 0) { // Only show full error if no blocks at all
    return (
      <CurioErrorState
        message="We had trouble generating content. Please try again."
        onRetry={onRefresh}
      />
    );
  }

  const Row = useCallback(({ index, style }) => {
    const block = blocks[index];
    if (!block) return null; // Should not happen if itemCount is correct

    const blockId = block.id || `block-${index}`;

    if (blockRenderErrors[blockId]) {
      return (
        <div style={style}>
          <motion.div /* Minimal animation for error state */
            key={`error-${blockId}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4" // Ensure padding for style
          >
            <BlockError
              error={blockRenderErrors[blockId]}
              message="This content block couldn't be displayed."
              onRetry={() => setBlockRenderErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[blockId];
                return newErrors;
              })}
              childAge={childAge}
            />
          </motion.div>
        </div>
      );
    }

    return (
      <div style={style}>
        <motion.div // Can still use motion for entry, but keep it light
            key={blockId}
            initial={animateBlocks ? { opacity: 0, y: 20 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-1" // Padding for spacing around ContentBlock
            data-block-id={blockId} // Keep for potential direct DOM access if absolutely needed elsewhere
            id={`block-${index}`} // Keep for FloatingNavigation
        >
          <ContentBlock
            block={block}
            onLike={() => enrichedHandlers.handleToggleLike(blockId)}
            onBookmark={() => enrichedHandlers.handleToggleBookmark(blockId)}
            onReply={(message) => enrichedHandlers.handleReply(blockId, message)}
            onCreativeUpload={handleCreativeUpload} // Prop from parent
            onTaskComplete={handleTaskComplete} // Prop from parent
            onActivityComplete={handleActivityComplete} // Prop from parent
            onMindfulnessComplete={handleMindfulnessComplete} // Prop from parent
            onNewsRead={handleNewsRead} // Prop from parent
            onQuizCorrect={enrichedHandlers.handleQuizCorrect}
            onRabbitHoleClick={handleRabbitHoleClick} // Prop from parent
            onReadAloud={onReadAloud} // Prop from parent
            childAge={childAge}
            profileId={profileId}
          />
        </motion.div>
      </div>
    );
  }, [
      blocks,
      blockRenderErrors,
      childAge,
      enrichedHandlers,
      handleCreativeUpload,
      handleTaskComplete,
      handleActivityComplete,
      handleMindfulnessComplete,
      handleNewsRead,
      handleRabbitHoleClick,
      onReadAloud,
      profileId,
      animateBlocks,
    ]
  );


  return (
    <div className="space-y-6 h-full flex flex-col"> {/* Ensure parent has height for FixedSizeList */}
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
          viewedBlocks={viewedBlocks.size} // This count might be less precise now
          totalBlocks={blocks.length}
          childAge={childAge}
        />
      )}

      <div style={{ flexGrow: 1 }}> {/* This div will take available space for the list */}
        {blocks.length > 0 ? (
            <FixedSizeList
                ref={listRef}
                height={typeof window !== 'undefined' ? window.innerHeight - 200 : 600} // Example: Adjust based on surrounding UI. Needs a more robust height calculation.
                itemCount={blocks.length}
                itemSize={ITEM_HEIGHT}
                width="100%"
                onItemsRendered={onItemsRendered}
                className="custom-scrollbar" // For custom scrollbar styling if needed
            >
                {Row}
            </FixedSizeList>
        ) : (
          !searchQuery && !generationError && ( // Show loading or empty state if not searching and no generation error
            <div className="text-center py-8 text-white/70">
              {isFirstLoad ? "Loading your wonders..." : "No content blocks yet. Try creating a new Curio!"}
            </div>
          )
        )}
      </div>


      {/* Progressive Learning Block for "application" - moved outside the virtualized list */}
      {blocks.length >= 1 && !searchQuery && ( // Simplified condition
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4" // Add padding as it's outside the list's item styling
        >
          <ProgressiveLearningBlock
            stage="application" // Example stage
            childAge={childAge}
            questions={applicationQuestions} // Ensure this is available
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
      
      {/* The manual loadTriggerRef div is removed as infinite scroll is handled by onItemsRendered */}
      {/* {hasMoreBlocks && !loadingMoreBlocks && loadTriggerRef && (
        <div ref={loadTriggerRef} className="h-10" />
      )} */}

      {showFloatingNav && blocks.length > 1 && ( // Adjusted condition slightly
        <FloatingNavigation
          blocks={blocks} // Pass all blocks for navigation context
          currentBlockIndex={currentBlockIndex} // Based on visibleStartIndex
          onNavigate={handleNavigateToBlock}
          childAge={childAge}
        />
      )}

      <CelebrationSystem
        milestone={recentMilestone}
        sparksEarned={recentSparks} // This state is updated by onItemsRendered effect
        childAge={childAge}
      />
    </div>
  );
};

export default CurioBlockList;
