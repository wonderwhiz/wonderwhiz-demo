
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

interface ContentBlock {
  id: string;
  type: 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness';
  specialist_id: string;
  content: any;
  liked: boolean;
  bookmarked: boolean;
}

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
}

interface CurioContentProps {
  currentCurio: Curio | null;
  contentBlocks: ContentBlock[];
  blockReplies: Record<string, BlockReply[]>;
  isGenerating: boolean;
  loadingBlocks: boolean;
  visibleBlocksCount: number;
  profileId?: string;
  onLoadMore: () => void;
  hasMoreBlocks: boolean;
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onSetQuery: (query: string) => void;
  onRabbitHoleFollow: (question: string) => void;
  onQuizCorrect: (blockId: string) => void;
  onNewsRead: (blockId: string) => void;
  onCreativeUpload: (blockId: string) => void;
}

const CurioContent: React.FC<CurioContentProps> = ({
  currentCurio,
  contentBlocks,
  blockReplies,
  isGenerating,
  loadingBlocks,
  visibleBlocksCount,
  profileId,
  onLoadMore,
  hasMoreBlocks,
  onToggleLike,
  onToggleBookmark,
  onReply,
  onSetQuery,
  onRabbitHoleFollow,
  onQuizCorrect,
  onNewsRead,
  onCreativeUpload
}) => {
  const feedEndRef = useRef<HTMLDivElement>(null);
  const [renderedBlocks, setRenderedBlocks] = useState<ContentBlock[]>([]);
  const [imageGenerationRequested, setImageGenerationRequested] = useState<boolean>(false);
  
  // Performance optimization: Only render a max number of blocks at once
  const MAX_VISIBLE_BLOCKS = 10;
  
  // Progressive rendering with immediate first block for better UX
  useEffect(() => {
    if (contentBlocks.length === 0) {
      setRenderedBlocks([]);
      return;
    }
    
    // Always render the first block immediately for instant feedback
    if (contentBlocks.length > 0 && renderedBlocks.length === 0) {
      console.log("Immediately rendering first block for fast initial display");
      setRenderedBlocks([contentBlocks[0]]);
      
      // Then add the rest of the initial blocks quickly
      if (contentBlocks.length > 1) {
        const timer = setTimeout(() => {
          console.log(`Rendering all visible blocks after initial display`);
          // Limit number of rendered blocks for performance
          setRenderedBlocks(contentBlocks.slice(0, MAX_VISIBLE_BLOCKS));
        }, 50); // Very short delay for the rest
        return () => clearTimeout(timer);
      }
    } else {
      // Fast update when blocks change but not on initial render
      // Only render the visible blocks for performance
      setRenderedBlocks(contentBlocks.slice(0, Math.min(contentBlocks.length, MAX_VISIBLE_BLOCKS)));
    }
  }, [contentBlocks, renderedBlocks.length]);

  // Request image generation for first block only once
  useEffect(() => {
    if (contentBlocks.length > 0 && !imageGenerationRequested) {
      console.log("Setting image generation flag for first block");
      setImageGenerationRequested(true);
    }
  }, [contentBlocks, imageGenerationRequested]);
  
  // Set up infinite scroll with improved configuration
  const observerTarget = useInfiniteScroll({
    loadMore: onLoadMore,
    isLoading: loadingBlocks,
    hasMore: hasMoreBlocks,
    threshold: 0.2, // Start loading earlier
    rootMargin: '400px', // Load much earlier for smoother experience
    delayMs: 50, // Faster response time
  });

  // Memoize block replies to prevent unnecessary re-renders
  const memoizedReplies = useMemo(() => blockReplies, [blockReplies]);

  if (!currentCurio) return null;

  // Calculate a unique but consistent color variant for each block based on index and block type
  const getColorVariant = (index: number, blockType: string) => {
    const typeMultiplier = {
      'fact': 0,
      'quiz': 1,
      'flashcard': 2,
      'creative': 3,
      'task': 4,
      'riddle': 0,
      'funFact': 1,
      'activity': 2,
      'news': 3,
      'mindfulness': 4
    };
    
    // Get multiplier based on block type or default to 0
    const multiplier = (blockType in typeMultiplier) ? typeMultiplier[blockType as keyof typeof typeMultiplier] : 0;
    
    // Create a more varied pattern using both index and block type
    // This gives us 5 different color variants (0-4)
    return (index + multiplier) % 5;
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {(isGenerating || loadingBlocks) && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2 }}
            className="p-3 mb-4 bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-light-purple/30 backdrop-blur-sm rounded-lg border border-wonderwhiz-bright-pink/30 flex items-center"
          >
            <motion.div 
              className="mr-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <div className="rounded-full h-5 w-5 border-t-2 border-r-2 border-wonderwhiz-bright-pink"></div>
            </motion.div>
            <p className="text-white text-sm font-nunito">
              {isGenerating ? "Generating your personalized content with amazing facts..." : "Loading more fascinating content..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 px-3 sm:px-4 pt-4 font-nunito animate-in fade-in-50 duration-500">{currentCurio.title}</h2>
      <div className="space-y-5 px-3 sm:px-4 pb-6">
        {renderedBlocks.map((block, index) => (
          <motion.div 
            key={block.id} 
            className="space-y-2" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ 
              delay: Math.min(index * 0.05, 0.2), // Cap the delay for smoother loading
              duration: 0.3
            }}
          >
            <ContentBlock 
              block={block} 
              onToggleLike={() => onToggleLike(block.id)} 
              onToggleBookmark={() => onToggleBookmark(block.id)} 
              onReply={(message) => onReply(block.id, message)} 
              onSetQuery={onSetQuery} 
              onRabbitHoleFollow={onRabbitHoleFollow} 
              onQuizCorrect={() => onQuizCorrect(block.id)} 
              onNewsRead={() => onNewsRead(block.id)} 
              onCreativeUpload={() => onCreativeUpload(block.id)} 
              colorVariant={getColorVariant(index, block.type)} 
              userId={profileId} 
              childProfileId={profileId} 
              isFirstBlock={index === 0} // Always generate image for first block
              curioId={currentCurio.id}
            />
            
            {memoizedReplies[block.id] && memoizedReplies[block.id].length > 0 && (
              <div className="pl-3 sm:pl-4 border-l-2 border-white/20 ml-3 sm:ml-4">
                {memoizedReplies[block.id].map(reply => (
                  <div 
                    key={reply.id}
                    className={`mb-3 ${reply.from_user ? 'ml-auto' : ''}`}
                  >
                    <div className={`
                      p-3
                      rounded-lg
                      max-w-[85%]
                      ${reply.from_user 
                        ? 'bg-wonderwhiz-bright-pink/30 ml-auto' 
                        : 'bg-wonderwhiz-deep-purple/40'
                      }
                    `}>
                      <p className="text-white text-sm font-inter">{reply.content}</p>
                      <div className="text-xs text-white/50 mt-1">
                        {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Invisible loading sentinel for infinite scroll - positioned earlier for preloading */}
        {hasMoreBlocks && <div ref={observerTarget} className="h-20 w-full" />}
        
        {/* Loading indicator shown when fetching more blocks */}
        {loadingBlocks && hasMoreBlocks && (
          <div className="h-10 flex items-center justify-center text-white/50 text-sm">
            <div className="animate-pulse flex items-center space-x-2">
              <motion.div 
                className="w-3 h-3 bg-wonderwhiz-bright-pink/60 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div 
                className="w-3 h-3 bg-wonderwhiz-cyan/60 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div 
                className="w-3 h-3 bg-wonderwhiz-vibrant-yellow/60 rounded-full" 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
              <span className="ml-2">Loading more content...</span>
            </div>
          </div>
        )}
      </div>
      
      <div ref={feedEndRef} />
    </div>
  );
};

export default CurioContent;
