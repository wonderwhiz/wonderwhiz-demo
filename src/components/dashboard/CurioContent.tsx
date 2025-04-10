
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import CurioLoading from '@/components/CurioLoading';
import { AlertCircle, RefreshCw, Sparkles, Brain, BookOpen, Lightbulb, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RabbitHoleSuggestions from '@/components/content-blocks/RabbitHoleSuggestions';
import TableOfContents from '@/components/curio/TableOfContents';
import ChapterHeader from '@/components/curio/ChapterHeader';
import QuickAnswer from '@/components/curio/QuickAnswer';
import LearningCertificate from '@/components/curio/LearningCertificate';
import { ChapterIconType } from '@/components/curio/TableOfContents';

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

interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: ChapterIconType;
  blocks: ContentBlock[];
  isCompleted: boolean;
  isActive: boolean;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAnswerExpanded, setQuickAnswerExpanded] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState('');
  const [ageGroup, setAgeGroup] = useState<'5-7' | '8-11' | '12-16'>('8-11');
  const [completedJourney, setCompletedJourney] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);
  
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

  // Determine age group based on profile data
  useEffect(() => {
    const getAgeGroup = async () => {
      if (!profileId) return;
      
      try {
        // This is a simplified approach. In a real implementation, you would fetch the profile data
        // and determine the age group based on the child's age.
        setAgeGroup('8-11');
      } catch (error) {
        console.error('Error fetching age group:', error);
      }
    };
    
    getAgeGroup();
  }, [profileId]);

  // Organize blocks into chapters
  useEffect(() => {
    if (visibleBlocks.length === 0) return;
    
    // Define default chapters
    const defaultChapters: Chapter[] = [
      {
        id: 'introduction',
        title: 'Introduction',
        description: 'Discover the basics',
        icon: 'introduction',
        blocks: [],
        isCompleted: false,
        isActive: true
      },
      {
        id: 'exploration',
        title: 'Exploration',
        description: 'Dive deeper',
        icon: 'exploration',
        blocks: [],
        isCompleted: false,
        isActive: false
      },
      {
        id: 'understanding',
        title: 'Understanding',
        description: 'Make connections',
        icon: 'understanding',
        blocks: [],
        isCompleted: false,
        isActive: false
      },
      {
        id: 'challenge',
        title: 'Challenge',
        description: 'Test your knowledge',
        icon: 'challenge',
        blocks: [],
        isCompleted: false,
        isActive: false
      },
      {
        id: 'creation',
        title: 'Creation',
        description: 'Apply what you learned',
        icon: 'creation',
        blocks: [],
        isCompleted: false,
        isActive: false
      },
      {
        id: 'reflection',
        title: 'Reflection',
        description: 'Think and connect',
        icon: 'reflection',
        blocks: [],
        isCompleted: false,
        isActive: false
      },
      {
        id: 'nextSteps',
        title: 'Next Steps',
        description: 'Continue exploring',
        icon: 'nextSteps',
        blocks: [],
        isCompleted: false,
        isActive: false
      }
    ];
    
    // Assign blocks to chapters based on type
    visibleBlocks.forEach(block => {
      if (block.type === 'fact' || block.type === 'funFact') {
        // First few facts go to introduction
        if (defaultChapters[0].blocks.length < 2) {
          defaultChapters[0].blocks.push(block);
        }
        // Next few facts go to understanding
        else if (defaultChapters[2].blocks.length < 2) {
          defaultChapters[2].blocks.push(block);
        }
        // Rest go to exploration
        else {
          defaultChapters[1].blocks.push(block);
        }
      } else if (block.type === 'quiz') {
        defaultChapters[3].blocks.push(block);
      } else if (block.type === 'creative' || block.type === 'activity') {
        defaultChapters[4].blocks.push(block);
      } else if (block.type === 'mindfulness') {
        defaultChapters[5].blocks.push(block);
      } else {
        // Default to exploration for other types
        defaultChapters[1].blocks.push(block);
      }
    });
    
    // Filter out empty chapters
    const nonEmptyChapters = defaultChapters.filter(chapter => chapter.blocks.length > 0);
    
    // Always include next steps if we have content
    if (nonEmptyChapters.length > 0) {
      const nextStepsChapter = defaultChapters.find(c => c.id === 'nextSteps');
      if (nextStepsChapter && !nonEmptyChapters.includes(nextStepsChapter)) {
        nonEmptyChapters.push(nextStepsChapter);
      }
    }
    
    // Set active chapter to the first one if none is set
    if (!activeChapter && nonEmptyChapters.length > 0) {
      setActiveChapter(nonEmptyChapters[0].id);
      nonEmptyChapters[0].isActive = true;
    } else {
      // Update active state based on activeChapter
      nonEmptyChapters.forEach(chapter => {
        chapter.isActive = chapter.id === activeChapter;
      });
    }
    
    setChapters(nonEmptyChapters);
  }, [visibleBlocks, activeChapter]);

  // Mark chapter as completed when all blocks in it have been interacted with
  // In a real implementation, you would track interactions with blocks
  useEffect(() => {
    if (chapters.length === 0) return;
    
    // Simulate completed chapters - in a real implementation this would be based on user interactions
    const updatedChapters = chapters.map((chapter, index) => {
      // Mark all chapters before the active one as completed
      return {
        ...chapter,
        isCompleted: chapters.findIndex(c => c.id === activeChapter) > index
      };
    });
    
    setChapters(updatedChapters);
    
    // Check if all chapters are completed except next steps
    const allCompleted = updatedChapters
      .filter(c => c.id !== 'nextSteps')
      .every(c => c.isCompleted);
      
    setCompletedJourney(allCompleted && updatedChapters.length > 1);
  }, [activeChapter, chapters]);

  // Determine if user has reached the end
  const hasReachedEnd = !isGenerating && !hasMoreBlocks && visibleBlocks.length > 0;
  
  // Generate quick answer
  const quickAnswer = useMemo(() => {
    if (!currentCurio?.query) return "";
    return `${currentCurio.title} involves fascinating concepts you'll explore in this journey. You'll discover key facts, understand the principles, and engage with fun activities to deepen your knowledge.`;
  }, [currentCurio]);

  // Handle chapter selection
  const handleChapterClick = (chapterId: string) => {
    setActiveChapter(chapterId);
    
    // Find the first block in this chapter and scroll to it
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter && chapter.blocks.length > 0) {
      const firstBlockId = chapter.blocks[0].id;
      const element = document.getElementById(`block-${firstBlockId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Use the existing onSetQuery function to perform the search
    onSetQuery(searchQuery);
    setSearchQuery('');
  };

  // Start learning journey
  const handleStartJourney = () => {
    setJourneyStarted(true);
    setQuickAnswerExpanded(false);
    
    // Scroll to the table of contents
    setTimeout(() => {
      const element = document.getElementById('table-of-contents');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Certificate handlers
  const handleCertificateDownload = () => {
    // In a real implementation, this would download the certificate
    console.log('Downloading certificate...');
  };

  const handleCertificateShare = () => {
    // In a real implementation, this would share the certificate
    console.log('Sharing certificate...');
  };

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
            
            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="text"
                  placeholder="Ask another question or search within this topic..."
                  className="pl-9 pr-12 py-6 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40 font-inter transition-all duration-300 focus:bg-white/15"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="absolute right-16 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-wonderwhiz-deep-purple"
                  size="sm"
                >
                  Search
                </Button>
              </div>
            </motion.form>
            
            {/* Quick Answer */}
            {quickAnswer && !journeyStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <QuickAnswer
                  question={currentCurio.title}
                  answer={quickAnswer}
                  isExpanded={quickAnswerExpanded}
                  onToggleExpand={() => setQuickAnswerExpanded(!quickAnswerExpanded)}
                  onStartJourney={handleStartJourney}
                />
              </motion.div>
            )}
            
            {/* Learning Path Visualization */}
            <AnimatePresence>
              {showLearningPath && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
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
                        {chapters.map((chapter, index) => (
                          <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                          >
                            {/* Step marker */}
                            <div className="absolute left-[-24px] w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30">
                              <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>
                            
                            {/* Step content */}
                            <div className="flex items-center">
                              <div 
                                className={`px-3 py-1 rounded-full text-xs ${
                                  chapter.isCompleted ? "bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink" :
                                  chapter.isActive ? "bg-wonderwhiz-vibrant-yellow/20 text-wonderwhiz-vibrant-yellow" :
                                  "bg-white/10 text-white/60"
                                }`}
                              >
                                {chapter.title}
                              </div>
                              <span className="ml-2 text-white/90 text-sm">{chapter.description}</span>
                              <span className="ml-auto text-white/60 text-xs">
                                {chapter.blocks.length} blocks
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

            {/* Table of Contents */}
            {journeyStarted && chapters.length > 0 && (
              <div id="table-of-contents" className="mb-8">
                <TableOfContents 
                  chapters={chapters} 
                  onChapterClick={handleChapterClick}
                  ageGroup={ageGroup}
                />
              </div>
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

              {/* Render content by chapters if journeyStarted */}
              {journeyStarted && chapters.length > 0 ? (
                chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.id} id={`chapter-${chapter.id}`} className="mb-10">
                    {chapter.blocks.length > 0 && (
                      <>
                        <ChapterHeader
                          chapterId={chapter.id}
                          title={chapter.title}
                          description={chapter.description}
                          index={chapterIndex}
                          totalChapters={chapters.length}
                        />
                        
                        <div className="space-y-6 pl-3 border-l-2 border-white/10">
                          {chapter.blocks.map((block, blockIndex) => (
                            <motion.div
                              key={block.id}
                              id={`block-${block.id}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 0.1 + (blockIndex * 0.05)
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
                                userId={profileId}
                                childProfileId={profileId}
                                isFirstBlock={blockIndex === 0 && chapterIndex === 0}
                                colorVariant={chapterIndex % 5}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* Next Steps chapter - show rabbit hole suggestions */}
                    {chapter.id === 'nextSteps' && chapter.isActive && hasReachedEnd && (
                      <div className="mt-6">
                        <RabbitHoleSuggestions
                          curioTitle={currentCurio.title}
                          profileId={profileId}
                          onSuggestionClick={onRabbitHoleFollow}
                          specialistIds={specialistIds}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Original rendering when journey not started
                visibleBlocks.map((block, index) => (
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
                ))
              )}
              
              {/* Learning Certificate */}
              {completedJourney && journeyStarted && hasReachedEnd && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <LearningCertificate
                    learnerName={profileId ? "Wonder Explorer" : "Wonder Explorer"}
                    topic={currentCurio.title}
                    date={new Date().toLocaleDateString()}
                    onDownload={handleCertificateDownload}
                    onShare={handleCertificateShare}
                    ageGroup={ageGroup}
                  />
                </motion.div>
              )}

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
              {!isGenerating && hasMoreBlocks && visibleBlocks.length > 0 && !journeyStarted && (
                <div className="flex justify-center py-4">
                  <Button 
                    onClick={onLoadMore} 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                    disabled={loadingBlocks}
                  >
                    {loadingBlocks ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Load More</span>
                    )}
                  </Button>
                </div>
              )}
              
              {/* Show rabbit hole suggestions when user reaches the end and journey not started */}
              {hasReachedEnd && !journeyStarted && (
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
              {hasReachedEnd && !journeyStarted && (
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
