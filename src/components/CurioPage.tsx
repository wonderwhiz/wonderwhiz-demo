import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { useCurioBlocks } from '@/hooks/use-curio-blocks';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useSearch } from '@/hooks/use-search';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import RabbitHoleSuggestions from '@/components/content-blocks/RabbitHoleSuggestions';
import CurioPageHeader from '@/components/curio/CurioPageHeader';
import CurioPageInsights from '@/components/curio/CurioPageInsights';
import CurioSearchBar from '@/components/curio/CurioSearchBar';
import CurioLoadingState from '@/components/curio/CurioLoadingState';
import CurioEmptyState from '@/components/curio/CurioEmptyState';
import CurioErrorState from '@/components/curio/CurioErrorState';
import CurioBlockList from '@/components/CurioBlockList';
import QuickAnswer from '@/components/curio/QuickAnswer';
import { TableOfContents } from '@/components/curio/TableOfContents';
import ProgressVisualization from '@/components/curio/ProgressVisualization';
import LearningCertificate from '@/components/curio/LearningCertificate';
import ChapterHeader from '@/components/curio/ChapterHeader';
import IllustratedContentBlock from '@/components/content-blocks/IllustratedContentBlock';
import CurioSearchNoMore from '@/components/curio/CurioSearchNoMore';
import CurioNoMore from '@/components/curio/CurioNoMore';
import CurioLoadMore from '@/components/curio/CurioLoadMore';
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
  
  const { 
    handleToggleLike,
    handleToggleBookmark,
    handleReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleActivityComplete,
    handleMindfulnessComplete,
    handleTaskComplete,
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
          <CurioPageHeader
            curioTitle={curioTitle}
            handleBackToDashboard={handleBackToDashboard}
            handleToggleInsights={handleToggleInsights}
            handleRefresh={handleRefresh}
            refreshing={refreshing}
            showInsights={showInsights}
          />
          
          <CurioPageInsights
            difficulty={difficulty}
            blockCount={blockCount}
            learningSummary={learningSummary}
            showInsights={showInsights}
            handleToggleInsights={handleToggleInsights}
          />
          
          <CurioSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        </div>
      </motion.div>

      <div className="flex-grow overflow-y-auto relative">
        <div className="max-w-3xl mx-auto py-6 sm:py-8 px-2 sm:px-0">
          {isFirstLoad && !searchQuery && !isLoadingBlocks && blocks.length === 0 && (
            <CurioLoadingState />
          )}

          {searchQuery && isLoadingBlocks && (
            <CurioLoadingState />
          )}

          {searchQuery && blocksError && (
            <CurioErrorState />
          )}

          {searchQuery && blocks.length === 0 && !isLoadingBlocks && !blocksError && (
            <CurioEmptyState />
          )}

          {!searchQuery && isLoadingBlocks && (
            <CurioLoadingState />
          )}

          {!searchQuery && blocksError && (
            <CurioErrorState />
          )}

          {!searchQuery && blocks.length === 0 && !isLoadingBlocks && !blocksError && !isFirstLoad && (
            <CurioEmptyState />
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
            <CurioSearchNoMore />
          )}

          {blocks.length > 0 && !searchQuery && !hasMore && blocks.length > 0 && (
            <CurioNoMore />
          )}

          {hasMore && blocks.length > 0 && (
            <CurioLoadMore loadTriggerRef={loadTriggerRef} loadingMore={loadingMore} />
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
