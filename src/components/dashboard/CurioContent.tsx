
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import CurioLoading from '@/components/CurioLoading';
import CurioLoadMore from '@/components/CurioLoadMore';
import RabbitHoleSuggestions from '@/components/content-blocks/RabbitHoleSuggestions';
import { AlertCircle, RefreshCw, Sparkles, Brain, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentBlock {
  id: string;
  type: 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness';
  specialist_id: string;
  content: any;
  liked: boolean;
  bookmarked: boolean;
  learningContext?: {
    sequencePosition: number;
    totalBlocks: number;
    cognitiveLevel: string;
    timeOfDay: string;
    recommendedPacing: string;
  };
}

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
}

interface Curio {
  id: string;
  title: string;
  query: string;
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
  onRefresh?: () => void;
  generationError?: string | null;
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
  onCreativeUpload,
  onRefresh,
  generationError
}) => {
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [showMentalBreak, setShowMentalBreak] = useState(false);
  
  // Mental break timer
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(10);
  
  // Use memoization to avoid unnecessary re-renders
  const visibleBlocks = useMemo(() => {
    if (!contentBlocks) return [];
    return contentBlocks.slice(0, visibleBlocksCount);
  }, [contentBlocks, visibleBlocksCount]);

  // Extract subject topics from the blocks to use for rabbit hole suggestions
  const specialistIds = useMemo(() => {
    const specialists = contentBlocks?.map(block => block.specialist_id) || [];
    return [...new Set(specialists)];
  }, [contentBlocks]);

  // Determine if user has scrolled to the end
  const hasReachedEnd = !isGenerating && !hasMoreBlocks && visibleBlocks.length > 0;
  
  // Get the narrative arc and learning path
  const learningPath = useMemo(() => {
    if (!visibleBlocks || visibleBlocks.length === 0) return [];
    
    // Extract a simplified learning path from the blocks
    return visibleBlocks.map((block, index) => ({
      position: index + 1,
      type: block.type,
      specialist: block.specialist_id,
      cognitiveLevel: block.learningContext?.cognitiveLevel || 
                     (index === 0 ? "introductory" : 
                      index === visibleBlocks.length - 1 ? "reflective" : "developmental"),
      title: block.type === 'quiz' ? 
             'Brain Teaser' : 
             block.type === 'fact' || block.type === 'funFact' ? 
             'Amazing Fact' :
             block.type === 'creative' ? 
             'Creative Challenge' :
             block.type === 'mindfulness' ? 
             'Mindful Moment' :
             'Learning Activity'
    }));
  }, [visibleBlocks]);
  
  // Check if we need a mental break after intensive blocks
  const needsMentalBreak = useMemo(() => {
    if (!visibleBlocks || visibleBlocks.length < 3) return false;
    
    // Count how many intensive blocks (quiz, flashcard) in a row
    let intensiveCount = 0;
    for (let i = 0; i < visibleBlocks.length; i++) {
      const blockType = visibleBlocks[i].type;
      if (blockType === 'quiz' || blockType === 'flashcard') {
        intensiveCount++;
      } else {
        intensiveCount = 0;
      }
      
      // If we have 2 or more intensive blocks in a row and haven't shown a break yet
      if (intensiveCount >= 2 && !showMentalBreak) {
        return true;
      }
    }
    
    return false;
  }, [visibleBlocks, showMentalBreak]);
  
  // Handle showing mental break
  const handleShowMentalBreak = () => {
    setShowMentalBreak(true);
    
    // Start countdown timer
    const timer = setInterval(() => {
      setBreakTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            setShowMentalBreak(false);
            setBreakTimeRemaining(10);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Show mental break if needed
  React.useEffect(() => {
    if (needsMentalBreak && !showMentalBreak) {
      const timeout = setTimeout(() => {
        handleShowMentalBreak();
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [needsMentalBreak, showMentalBreak]);

  if (!currentCurio) {
    return null;
  }

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCurio.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left text-white font-nunito">
                {currentCurio.title}
              </h1>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLearningPath(!showLearningPath)}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {showLearningPath ? "Hide Learning Path" : "Show Learning Path"}
              </Button>
            </motion.div>
            
            {/* Learning Path Visualization */}
            <AnimatePresence>
              {showLearningPath && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <h3 className="text-white text-lg font-medium mb-3 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-wonderwhiz-gold" />
                      Your Learning Journey
                    </h3>
                    
                    <div className="relative">
                      {/* Path line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-wonderwhiz-bright-pink via-wonderwhiz-vibrant-yellow to-wonderwhiz-cyan" />
                      
                      {/* Learning steps */}
                      <div className="space-y-3 pl-12 relative">
                        {learningPath.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                          >
                            {/* Step marker */}
                            <div className="absolute left-[-24px] w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30">
                              <span className="text-white text-xs font-bold">{step.position}</span>
                            </div>
                            
                            {/* Step content */}
                            <div className="flex items-center">
                              <div 
                                className={`px-3 py-1 rounded-full text-xs ${
                                  step.cognitiveLevel === "introductory" ? "bg-emerald-500/20 text-emerald-200" :
                                  step.cognitiveLevel === "reflective" ? "bg-purple-500/20 text-purple-200" :
                                  "bg-blue-500/20 text-blue-200"
                                }`}
                              >
                                {step.cognitiveLevel === "introductory" ? "Foundation" :
                                 step.cognitiveLevel === "reflective" ? "Reflection" :
                                 "Exploration"}
                              </div>
                              <span className="ml-2 text-white/90 text-sm">{step.title}</span>
                              <span className="ml-auto text-white/60 text-xs">
                                {step.specialist === "nova" ? "Discovery Expert" :
                                 step.specialist === "spark" ? "Science Whiz" :
                                 step.specialist === "prism" ? "Creative Genius" :
                                 step.specialist === "pixel" ? "Tech Guru" :
                                 step.specialist === "atlas" ? "History Buff" :
                                 "Wellbeing Guide"}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mental Break Overlay */}
            <AnimatePresence>
              {showMentalBreak && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                >
                  <div className="bg-gradient-to-br from-wonderwhiz-deep-purple to-indigo-900 p-6 rounded-xl max-w-md text-center shadow-xl border border-white/20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10 }}
                      className="w-16 h-16 bg-wonderwhiz-gold/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Sparkles className="w-8 h-8 text-wonderwhiz-gold" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">Quick Brain Break!</h3>
                    <p className="text-white/80 mb-4">
                      Take a moment to relax your mind. Close your eyes, take a deep breath, and let your thoughts settle.
                    </p>
                    
                    <div className="w-full bg-white/10 h-2 rounded-full mb-2">
                      <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: `${(breakTimeRemaining / 10) * 100}%` }}
                        className="bg-wonderwhiz-gold h-full rounded-full"
                      />
                    </div>
                    
                    <p className="text-white/60 text-sm">
                      {breakTimeRemaining} seconds remaining
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error state */}
            {generationError && (
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
            )}

            {/* Curio content blocks */}
            <div className="space-y-6 sm:space-y-8">
              {/* Show loading state when no blocks and generating */}
              {visibleBlocks.length === 0 && isGenerating && (
                <div className="flex flex-col items-center justify-center">
                  <CurioLoading />
                </div>
              )}

              {/* Empty state with intelligence-driven suggestions */}
              {visibleBlocks.length === 0 && !isGenerating && !generationError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <div className="relative mx-auto w-20 h-20 mb-4">
                    <div className="absolute inset-0 bg-wonderwhiz-bright-pink/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative flex items-center justify-center h-full">
                      <Lightbulb className="h-12 w-12 text-wonderwhiz-gold" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">Start Your Wonder Journey</h3>
                  <p className="text-white/70 max-w-md mx-auto">
                    Ask any question to begin exploring amazing facts and activities just for you!
                  </p>
                </motion.div>
              )}

              {/* Render visible blocks */}
              <AnimatePresence initial={false}>
                {visibleBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + (index * 0.1),
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    className="block-container overflow-visible"
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
                      userId={profileId}
                      childProfileId={profileId}
                      isFirstBlock={index === 0}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Show "still generating" message */}
              {visibleBlocks.length > 0 && isGenerating && !generationError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center mt-8 space-y-3"
                >
                  <div className="bg-wonderwhiz-gold/20 px-4 py-2 rounded-full flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-wonderwhiz-gold border-t-transparent rounded-full" />
                    <span className="text-wonderwhiz-gold text-sm">Still creating magic for you...</span>
                  </div>
                  <p className="text-white/70 text-sm text-center">
                    Our specialists are working on more amazing content!
                  </p>
                </motion.div>
              )}

              {/* Load more button - Only show when not initially loading and there are more blocks */}
              {!isGenerating && hasMoreBlocks && visibleBlocks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CurioLoadMore 
                    loadingMoreBlocks={loadingBlocks} 
                    loadTriggerRef={null}
                  />
                </motion.div>
              )}
              
              {/* Show rabbit hole suggestions when user reaches the end */}
              {hasReachedEnd && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <RabbitHoleSuggestions
                    curioTitle={currentCurio.title}
                    profileId={profileId}
                    onSuggestionClick={onRabbitHoleFollow}
                    specialistIds={specialistIds}
                  />
                </motion.div>
              )}
              
              {/* End of curio indicator */}
              {hasReachedEnd && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center py-8"
                >
                  <div className="w-12 h-12 rounded-full bg-wonderwhiz-deep-purple/80 flex items-center justify-center mb-3 shadow-glow-brand-gold">
                    <Sparkles className="h-6 w-6 text-wonderwhiz-gold" />
                  </div>
                  <h3 className="text-white text-lg font-medium">You've reached the end!</h3>
                  <p className="text-white/70 text-sm mt-1">
                    Ask another question to keep exploring
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CurioContent;
