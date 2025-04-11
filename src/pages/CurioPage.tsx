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
import InteractiveImageBlock from '@/components/content-blocks/InteractiveImageBlock';
import TalkToWhizzy from '@/components/curio/TalkToWhizzy';
import { Chapter } from '@/types/Chapter';
import { useCurioChapters } from '@/hooks/useCurioChapters';

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
    handleTaskComplete
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
  const [chapters, setChapters] = useState<Chapter[]>(useCurioChapters());
  const [activeChapter, setActiveChapter] = useState('introduction');
  const [progress, setProgress] = useState(0);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  const [learnerName, setLearnerName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [ageGroup, setAgeGroup] = useState<'5-7' | '8-11' | '12-16'>('8-11');
  
  const blocksProcessedRef = useRef(false);
  const chaptersUpdatedRef = useRef(false);

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
        .select('title, query')
        .eq('id', curioId)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setCurioTitle(data.title);
            
            if (data.query) {
              if (data.query.toLowerCase().includes('paneer')) {
                setQuickAnswer("Paneer is a fresh cheese commonly used in Indian cuisine. It's made by curdling milk with lemon juice, vinegar, or other food acids, then draining and pressing the curds to form a firm cheese that holds its shape. Unlike many cheeses, paneer doesn't melt when heated, making it perfect for curries and grilled dishes.");
              } else {
                setQuickAnswer(`Here's a quick answer to "${data.query}". This would typically be a concise response that directly addresses the question before diving into the detailed learning journey.`);
              }
            }
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
    if (blocks.length > 0 && !blocksProcessedRef.current) {
      blocksProcessedRef.current = true;
      
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
    if (blocks.length > 0 && !chaptersUpdatedRef.current) {
      chaptersUpdatedRef.current = true;
      
      const updatedChapters: Chapter[] = [...chapters];
      
      if (blocks.some(block => block.type === 'fact' || block.type === 'funFact')) {
        updatedChapters[0].isCompleted = true;
      }
      
      if (blocks.filter(block => block.type === 'fact' || block.type === 'funFact' || block.type === 'news').length > 2) {
        updatedChapters[1].isCompleted = true;
      }
      
      if (blocks.filter(block => block.type === 'fact' || block.type === 'funFact').length > 3) {
        updatedChapters[2].isCompleted = true;
      }
      
      if (blocks.some(block => block.type === 'quiz')) {
        updatedChapters[3].isCompleted = true;
      }
      
      if (blocks.some(block => block.type === 'creative' || block.type === 'activity')) {
        updatedChapters[4].isCompleted = true;
      }
      
      if (blocks.some(block => block.type === 'mindfulness')) {
        updatedChapters[5].isCompleted = true;
      }
      
      if (showRabbitHoleSuggestions) {
        updatedChapters[6].isCompleted = true;
      }
      
      setChapters(updatedChapters);
      
      const completedChapters = updatedChapters.filter(chapter => chapter.isCompleted).length;
      const progressPercentage = (completedChapters / updatedChapters.length) * 100;
      setProgress(progressPercentage);
      
      if (progressPercentage >= 85 && !showCertificate) {
        setShowCertificate(true);
        setLearnerName(childProfile?.name || 'Wonder Explorer');
      }
    }
  }, [blocks, showRabbitHoleSuggestions, chapters, childProfile]);

  useEffect(() => {
    if (blocks.length === 0) {
      blocksProcessedRef.current = false;
      chaptersUpdatedRef.current = false;
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

  const handleClearSearch = () => {
    setSearchQuery('');
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
  
  const blocksByChapter = organizeBlocksIntoChapters(blocks);

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
  
  const handleChapterClick = (chapterId: string) => {
    setActiveChapter(chapterId);
    
    setChapters(prev => prev.map(chapter => ({
      ...chapter,
      isActive: chapter.id === chapterId
    })));
    
    document.getElementById(`chapter-${chapterId}`)?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };
  
  const handleStartJourney = () => {
    setIsJourneyStarted(true);
    setQuickAnswerExpanded(false);
    
    document.getElementById('table-of-contents')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  const handleCertificateDownload = () => {
    toast.success("Certificate downloaded successfully!");
  };
  
  const handleCertificateShare = () => {
    toast.success("Certificate shared successfully!");
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

  return (
    <div className="flex flex-col h-full">
      <CurioPageHeader 
        curioTitle={curioTitle} 
        handleBackToDashboard={handleBackToDashboard}
        handleToggleInsights={handleToggleInsights}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        showInsights={showInsights}
      />

      <AnimatePresence>
        {showInsights && (
          <CurioPageInsights
            difficulty={difficulty}
            blockCount={blockCount}
            learningSummary={learningSummary}
            showInsights={showInsights}
            handleToggleInsights={handleToggleInsights}
          />
        )}
      </AnimatePresence>
      
      <div className="mt-4 px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <CurioSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        {isLoadingBlocks && <CurioLoadingState />}
        
        {blocksError && <CurioErrorState message="Failed to load content." />}
        
        {!isLoadingBlocks && !blocksError && blocks.length === 0 && !isFirstLoad && (
          <CurioEmptyState />
        )}

        {curioTitle && !isLoadingBlocks && !searchQuery && (
          <QuickAnswer 
            question={curioTitle}
            isExpanded={quickAnswerExpanded}
            onToggleExpand={() => setQuickAnswerExpanded(!quickAnswerExpanded)}
            onStartJourney={handleStartJourney}
            childId={childId}
          />
        )}

        {curioTitle && !isLoadingBlocks && !searchQuery && (
          <InteractiveImageBlock
            topic={curioTitle}
            childId={childId}
            childAge={childProfile?.age ? Number(childProfile.age) : 10}
            onShare={() => {
              toast.success('Image shared with your learning journey!');
            }}
          />
        )}
        
        {blocks.length > 0 && !searchQuery && (
          <div id="table-of-contents">
            <TableOfContents 
              chapters={chapters}
              onChapterClick={handleChapterClick}
              ageGroup={ageGroup}
            />
          </div>
        )}
        
        {blocks.length > 0 && !searchQuery && (
          <ProgressVisualization 
            progress={progress} 
            ageGroup={ageGroup}
            totalChapters={chapters.length}
            completedChapters={chapters.filter(chapter => chapter.isCompleted).length}
          />
        )}

        {showCertificate && !searchQuery && blocks.length > 0 && (
          <LearningCertificate
            learnerName={learnerName}
            topic={curioTitle || 'Knowledge Exploration'}
            date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            onDownload={handleCertificateDownload}
            onShare={handleCertificateShare}
            ageGroup={ageGroup}
          />
        )}

        {blocks.length > 0 && !searchQuery ? (
          Object.keys(blocksByChapter).map((chapterId, index) => {
            const chapterBlocks = blocksByChapter[chapterId];
            if (!chapterBlocks || chapterBlocks.length === 0) return null;
            
            const chapterInfo = chapters.find(ch => ch.id === chapterId);
            if (!chapterInfo) return null;
            
            return (
              <div key={chapterId} id={`chapter-${chapterId}`}>
                <ChapterHeader 
                  chapterId={chapterId}
                  title={chapterInfo.title}
                  description={chapterInfo.description}
                  index={index}
                  totalChapters={chapters.length}
                />
                
                <CurioBlockList
                  blocks={chapterBlocks}
                  animateBlocks={animateBlocks}
                  hasMoreBlocks={false}
                  loadingMoreBlocks={false}
                  searchQuery=""
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
                />
              </div>
            );
          })
        ) : (
          blocks.length > 0 && (
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
          )
        )}

        {showRabbitHoleSuggestions && blocks.length > 0 && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <RabbitHoleSuggestions
              curioTitle={curioTitle || ''}
              profileId={childId}
              onSuggestionClick={handleRabbitHoleClick}
              specialistIds={specialistIds}
            />
          </motion.div>
        )}
      </div>

      <TalkToWhizzy 
        childId={childId}
        curioTitle={curioTitle || undefined}
        ageGroup={ageGroup}
        onNewQuestionGenerated={handleRabbitHoleClick}
      />
    </div>
  );
};

export default CurioPage;
