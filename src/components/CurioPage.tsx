import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { useCurioBlocks } from '@/hooks/use-curio-blocks';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useSearch } from '@/hooks/use-search';
import { getBackgroundColor } from '@/components/BlockStyleUtils';
import CurioBlockList from '@/components/CurioBlockList';
import CurioBlockListLoading from '@/components/CurioBlockListLoading';
import CurioBlockListEmpty from '@/components/CurioBlockListEmpty';
import CurioBlockListError from '@/components/CurioBlockListError';
import CurioBlockListLoadMore from '@/components/CurioBlockListLoadMore';
import CurioBlockListNoMore from '@/components/CurioBlockListNoMore';
import CurioBlockListSearchEmpty from '@/components/CurioBlockListSearchEmpty';
import CurioBlockListSearchError from '@/components/CurioBlockListSearchError';
import CurioBlockListSearchLoading from '@/components/CurioBlockListSearchLoading';
import CurioBlockListSearchNoMore from '@/components/CurioBlockListSearchNoMore';
import CurioBlockListWelcome from '@/components/CurioBlockListWelcome';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { Search, ArrowLeft, Sparkles, RefreshCw, Braces, MessageCircle, Brain, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurioData } from '@/hooks/useCurioData';
import confetti from 'canvas-confetti';
import RabbitHoleSuggestions from '@/components/content-blocks/RabbitHoleSuggestions';
import { Chapter } from '@/types/Chapter';

const DEFAULT_CHAPTERS: Chapter[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    description: 'Discover the basics',
    icon: 'introduction',
    isCompleted: false,
    isActive: true
  },
  {
    id: 'exploration',
    title: 'Exploration',
    description: 'Dive deeper',
    icon: 'exploration',
    isCompleted: false,
    isActive: false
  },
  {
    id: 'understanding',
    title: 'Understanding',
    description: 'Make connections',
    icon: 'understanding',
    isCompleted: false,
    isActive: false
  },
  {
    id: 'challenge',
    title: 'Challenge',
    description: 'Test your knowledge',
    icon: 'challenge',
    isCompleted: false,
    isActive: false
  },
  {
    id: 'creation',
    title: 'Creation',
    description: 'Apply what you learned',
    icon: 'creation',
    isCompleted: false, 
    isActive: false
  },
  {
    id: 'reflection',
    title: 'Reflection',
    description: 'Think and connect',
    icon: 'reflection',
    isCompleted: false,
    isActive: false
  },
  {
    id: 'nextSteps',
    title: 'Next Steps',
    description: 'Continue exploring',
    icon: 'nextSteps',
    isCompleted: false,
    isActive: false
  }
];

const CurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad, generationError } = useCurioBlocks(childId, curioId, searchQuery);
  const { loadingMore, loadTriggerRef } = useInfiniteScroll(loadMore, hasMore);
  
  // Destructure the interaction handlers from useBlockInteractions
  const { 
    handleToggleLike,
    handleToggleBookmark,
    handleReply: handleMessageReply,
    handleQuizCorrect: handleQuizSuccess,
    handleNewsRead: handleNewsWasRead,
    handleCreativeUpload: handleCreativeSubmission,
    handleActivityComplete: handleActivityFinished,
    handleMindfulnessComplete: handleMindfulnessFinished,
    handleTaskComplete: handleTaskFinished
  } = useBlockInteractions(childId);

  const [animateBlocks, setAnimateBlocks] = useState(true);
  const [curioTitle, setCurioTitle] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [blockCount, setBlockCount] = useState(0);
  const [learningSummary, setLearningSummary] = useState('');
  const [specialistIds, setSpecialistIds] = useState<string[]>([]);
  const [showRabbitHoleSuggestions, setShowRabbitHoleSuggestions] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  
  const [quickAnswer, setQuickAnswer] = useState<string>('');
  const [quickAnswerExpanded, setQuickAnswerExpanded] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>(DEFAULT_CHAPTERS);
  const [activeChapter, setActiveChapter] = useState('introduction');
  const [progress, setProgress] = useState(0);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  const [learnerName, setLearnerName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [ageGroup, setAgeGroup] = useState<'5-7' | '8-11' | '12-16'>('8-11');
  
  const blocksProcessedRef = useRef(false);
  const chaptersUpdatedRef = useRef(false);

  // Wrapper functions to prevent redeclaration errors
  const handleReply = (blockId: string, message: string) => {
    handleMessageReply(blockId, message);
  };
  
  const handleQuizCorrect = (blockId: string) => {
    handleQuizSuccess(blockId);
  };
  
  const handleNewsRead = (blockId: string) => {
    handleNewsWasRead(blockId);
  };
  
  const handleCreativeUpload = (blockId: string, content: any) => {
    handleCreativeSubmission(blockId, content);
  };
  
  const handleActivityComplete = (blockId: string) => {
    handleActivityFinished(blockId);
  };
  
  const handleMindfulnessComplete = (blockId: string) => {
    handleMindfulnessFinished(blockId);
  };
  
  const handleTaskComplete = (blockId: string) => {
    handleTaskFinished(blockId);
  };

  const organizeBlocksIntoChapters = (blocks: any[]) => {
    if (!blocks.length) return {};
    
    const chapterMap: Record<string, any[]> = {
      introduction: [],
      exploration: [],
      understanding: [],
      challenge: [],
      creation: [],
      reflection: [],
      nextSteps: []
    };
    
    blocks.forEach(block => {
      if (block.type === 'quiz') {
        chapterMap.challenge.push(block);
      } else if (block.type === 'fact' || block.type === 'funFact') {
        if (chapterMap.introduction.length < 2) {
          chapterMap.introduction.push(block);
        } else if (chapterMap.understanding.length < 3) {
          chapterMap.understanding.push(block);
        } else {
          chapterMap.exploration.push(block);
        }
      } else if (block.type === 'creative' || block.type === 'activity') {
        chapterMap.creation.push(block);
      } else if (block.type === 'mindfulness') {
        chapterMap.reflection.push(block);
      } else {
        chapterMap.exploration.push(block);
      }
    });
    
    return chapterMap;
  };

  useEffect(() => {
    if (childProfile?.age) {
      const age = typeof childProfile.age === 'string' 
        ? parseInt(childProfile.age, 10) 
        : childProfile.age;
        
      if (age >= 5 && age <= 7) {
        setAgeGroup('5-7');
      } else if (age >= 8 && age <= 11) {
        setAgeGroup('8-11');
      } else {
        setAgeGroup('12-16');
      }
    }
  }, [childProfile]);

  useEffect(() => {
    if (user && !childId) {
      navigate('/profiles');
    }
  }, [user, childId, navigate]);

  useEffect(() => {
    if (curioId) {
      supabase
        .from('curios')
        .select('title')
        .eq('id', curioId)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setCurioTitle(data.title);
          }
        });
    }
  }, [curioId]);

  useEffect(() => {
    if (blocks.length > 0 && isFirstLoad) {
      setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 1000,
          colors: ['#8b5cf6', '#d946ef', '#3b82f6']
        });
      }, 800);
    }
  }, [blocks.length, isFirstLoad]);

  useEffect(() => {
    if (blocks.length > 0) {
      setTimeout(() => {
        setAnimateBlocks(false);
      }, 1000);
    }
  }, [blocks]);

  useEffect(() => {
    if (blocks.length > 0) {
      const specialists = blocks.map(block => block.specialist_id);
      const uniqueSpecialists = Array.from(new Set(specialists));
      setSpecialistIds(uniqueSpecialists);
      
      setBlockCount(blocks.length);
      
      const hasQuiz = blocks.some(block => block.type === 'quiz');
      const hasCreative = blocks.some(block => block.type === 'creative');
      const hasMindfulness = blocks.some(block => block.type === 'mindfulness');
      
      if (hasQuiz && hasCreative && hasMindfulness) {
        setDifficulty('advanced');
      } else if (hasQuiz || hasCreative) {
        setDifficulty('medium');
      } else {
        setDifficulty('beginner');
      }
      
      const topics = new Set(blocks.map(block => block.specialist_id));
      const topicList = Array.from(topics).map(topic => {
        switch(topic) {
          case 'nova': return 'space';
          case 'spark': return 'creativity';
          case 'prism': return 'science';
          case 'pixel': return 'technology';
          case 'atlas': return 'history';
          case 'lotus': return 'nature';
          default: return 'general knowledge';
        }
      });
      
      if (topicList.length > 0) {
        setLearningSummary(`This curio explores ${topicList.join(', ')}.`);
      }
    }
  }, [blocks]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition + windowHeight > documentHeight * 0.75) {
        setHasScrolledToBottom(true);
        if (blocks.length > 0 && !hasScrolledToBottom) {
          setShowRabbitHoleSuggestions(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blocks.length, hasScrolledToBottom]);

  if (profileError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/80">Failed to load profile.</p>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/80">Loading profile...</p>
      </div>
    );
  }

  const handleToggleLike = async (blockId: string) => {
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'like',
          blockId,
          childId
        }
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Could not like this wonder. Please try again later.");
    }
  };

  const handleToggleBookmark = async (blockId: string) => {
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'bookmark',
          blockId,
          childId
        }
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error("Could not bookmark this wonder. Please try again later.");
    }
  };

  const handleRabbitHoleClick = async (question: string) => {
    if (!childId) return;
    
    try {
      toast.loading("Creating new exploration...");
      
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: childId,
          title: question,
          query: question,
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      if (newCurio) {
        toast.success("New exploration created!");
        
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: childId,
              amount: 2
            })
          });
          
          await supabase.from('sparks_transactions').insert({
            child_id: childId,
            amount: 2,
            reason: 'Following curiosity'
          });
          
          toast.success('You earned 2 sparks for exploring your curiosity!', {
            icon: '✨',
            position: 'bottom-right',
            duration: 3000
          });
        } catch (err) {
          console.error('Error awarding sparks:', err);
        }
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        navigate(`/curio/${childId}/${newCurio.id}`);
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast.error("Could not create new exploration. Please try again later.");
    }
  };
  
  const handleBackToDashboard = () => {
    navigate(`/dashboard/${childId}`);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };
  
  const handleToggleInsights = () => {
    setShowInsights(!showInsights);
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div 
        className="py-4 sm:py-6 px-4 sm:px-6 bg-gradient-to-r from-wonderwhiz-deep-purple/80 to-wonderwhiz-deep-purple/60 border-b border-white/10 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToDashboard}
                className="mb-2 text-white/70 hover:text-white -ml-2 group transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Dashboard</span>
              </Button>
              
              {curioTitle && (
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {curioTitle}
                </h1>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleInsights}
                  className="text-white/90 border-white/20 hover:bg-white/10 bg-white/5 flex items-center backdrop-blur-md"
                >
                  <Brain className="w-4 h-4 mr-1.5 text-wonderwhiz-bright-pink" />
                  <span>Learning Insights</span>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  title="Refresh content"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </motion.div>
            </div>
          </div>
          
          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-3 sm:p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-md p-2 sm:p-3 flex flex-col items-center justify-center">
                    <div className="text-xs text-white/60 mb-1">Learning Level</div>
                    <div className="text-white font-medium capitalize flex items-center">
                      <Brain className="h-4 w-4 mr-1.5 text-wonderwhiz-bright-pink" />
                      {difficulty}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-md p-2 sm:p-3 flex flex-col items-center justify-center">
                    <div className="text-xs text-white/60 mb-1">Content Blocks</div>
                    <div className="text-white font-medium flex items-center">
                      <Braces className="h-4 w-4 mr-1.5 text-wonderwhiz-cyan" />
                      {blockCount} blocks
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-md p-2 sm:p-3 flex flex-col items-center justify-center">
                    <div className="text-xs text-white/60 mb-1">Questions</div>
                    <div className="text-white font-medium flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1.5 text-wonderwhiz-vibrant-yellow" />
                      Unlimited
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 text-white/80 text-xs bg-white/5 p-2 rounded-md">
                  {learningSummary || "Learning summary will appear once content is generated."}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-grow group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search within this exploration..."
                  className="pl-9 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40 font-inter transition-all duration-300 focus:bg-white/15 focus:border-white/30 focus:ring-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple font-medium rounded-full"
                >
                  Search
                </Button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>

      <div className="flex-grow overflow-y-auto relative">
        <div className="max-w-3xl mx-auto py-6 sm:py-8 px-2 sm:px-0">
          {isFirstLoad && !searchQuery && !isLoadingBlocks && blocks.length === 0 && (
            <CurioBlockListWelcome childProfile={childProfile} />
          )}

          {searchQuery && isLoadingBlocks && (
            <CurioBlockListSearchLoading />
          )}

          {searchQuery && blocksError && (
            <CurioBlockListSearchError />
          )}

          {searchQuery && blocks.length === 0 && !isLoadingBlocks && !blocksError && (
            <CurioBlockListSearchEmpty />
          )}

          {!searchQuery && isLoadingBlocks && (
            <CurioBlockListLoading />
          )}

          {!searchQuery && blocksError && (
            <CurioBlockListError />
          )}

          {!searchQuery && blocks.length === 0 && !isLoadingBlocks && !blocksError && !isFirstLoad && (
            <CurioBlockListEmpty />
          )}

          {blocks.length > 0 || generationError ? (
            <CurioBlockList
              blocks={blocks}
              animateBlocks={animateBlocks}
              hasMoreBlocks={hasMore}
              loadingMoreBlocks={loadingMore}
              loadTriggerRef={loadTriggerRef}
              searchQuery={searchQuery}
              profileId={childId}
              isFirstLoad={isFirstLoad}
              handleToggleLike={handleToggleLike}
              handleToggleBookmark={handleToggleBookmark}
              handleReply={handleReply}
              handleQuizCorrect={handleQuizCorrect}
              handleNewsRead={handleNewsRead}
              handleCreativeUpload={handleCreativeUpload}
              handleTaskComplete={handleTaskComplete}
              handleActivityComplete={handleActivityComplete}
              handleMindfulnessComplete={handleMindfulnessComplete}
              handleRabbitHoleClick={handleRabbitHoleClick}
              generationError={generationError}
              onRefresh={handleRefresh}
            />
          ) : null}

          {blocks.length > 0 && searchQuery && !hasMore && blocks.length > 0 && (
            <CurioBlockListSearchNoMore />
          )}

          {blocks.length > 0 && !searchQuery && !hasMore && blocks.length > 0 && (
            <CurioBlockListNoMore />
          )}

          {hasMore && blocks.length > 0 && (
            <CurioBlockListLoadMore loadTriggerRef={loadTriggerRef} loadingMore={loadingMore} />
          )}

          {showRabbitHoleSuggestions && blocks.length > 0 && !searchQuery && !hasMore && (
            <RabbitHoleSuggestions
              curioTitle={curioTitle || ''}
              profileId={childId}
              onSuggestionClick={handleRabbitHoleClick}
              specialistIds={specialistIds}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CurioPage;
