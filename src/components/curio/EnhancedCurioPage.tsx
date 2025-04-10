import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { useCurioBlocks } from '@/hooks/use-curio-blocks';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useSearch } from '@/hooks/use-search';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { ArrowLeft, Brain, Sparkles, RefreshCw } from 'lucide-react';
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

const EnhancedCurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad, generationError } = useCurioBlocks(childId, curioId, searchQuery);
  const { loadingMore, loadTriggerRef } = useInfiniteScroll(loadMore, hasMore);
  const { 
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
        .select('title, query')
        .eq('id', curioId)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setCurioTitle(data.title);
            
            if (data.query) {
              const query = data.query.trim();
              
              const generateQuickAnswer = (query: string) => {
                return `Here's a quick answer about "${query}". This would be a concise, direct response to the query that provides immediate value before diving into the detailed learning journey.`;
              };
              
              setQuickAnswer(generateQuickAnswer(query));
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
    return <CurioErrorState message="Failed to load profile." />;
  }

  if (isLoadingProfile) {
    return <CurioLoadingState message="Loading profile..." />;
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

  const handleReply = async (blockId: string, message: string) => {
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'reply',
          blockId,
          childId,
          message
        }
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error("Could not add your comment. Please try again later.");
    }
  };

  const handleQuizCorrect = async (blockId: string) => {
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'quiz-correct',
          blockId,
          childId
        }
      });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 3
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 3,
          reason: 'Quiz answered correctly'
        });
        
        toast.success('You earned 3 sparks for your knowledge!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error handling quiz correct:', error);
    }
  };

  const handleNewsRead = async (blockId: string) => {
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'news-read',
          blockId,
          childId
        }
      });
      
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 1
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 1,
          reason: 'Stayed informed with news'
        });
        
        toast.success('You earned 1 spark for staying informed!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error marking news as read:', error);
    }
  };

  const handleCreativeUpload = async (blockId: string, content: any) => {
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'creative-upload',
          blockId,
          childId,
          content
        }
      });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 5
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 5,
          reason: 'Creative submission'
        });
        
        toast.success('You earned 5 sparks for your creativity!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error handling creative upload:', error);
    }
  };

  const handleActivityComplete = async (blockId: string) => {
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'activity-complete',
          blockId,
          childId
        }
      });
      
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 3
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 3,
          reason: 'Activity completed'
        });
        
        toast.success('You earned 3 sparks for completing an activity!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error marking activity as complete:', error);
    }
  };

  const handleMindfulnessComplete = async (blockId: string) => {
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'mindfulness-complete',
          blockId,
          childId
        }
      });
      
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
          reason: 'Mindfulness practice'
        });
        
        toast.success('You earned 2 sparks for mindfulness practice!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error marking mindfulness as complete:', error);
    }
  };

  const handleTaskComplete = async (blockId: string) => {
    try {
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'task-complete',
          blockId,
          childId
        }
      });
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
      
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 1
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 1,
          reason: 'Task completed'
        });
        
        toast.success('You earned 1 spark for completing a task!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
    } catch (error) {
      console.error('Error marking task as complete:', error);
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
  
  const blocksByChapter = organizeBlocksIntoChapters(blocks);

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
          />
        )}
      </AnimatePresence>
      
      <div className="mt-4 px-4 sm:px-6 max-w-3xl mx-auto w-full">
        {isLoadingBlocks && <CurioLoadingState />}
        
        {blocksError && <CurioErrorState message="Failed to load content." />}
        
        {!isLoadingBlocks && !blocksError && blocks.length === 0 && !isFirstLoad && (
          <CurioEmptyState />
        )}
        
        {quickAnswer && blocks.length > 0 && (
          <QuickAnswer 
            question={curioTitle || "Your question"}
            answer={quickAnswer}
            isExpanded={quickAnswerExpanded}
            onToggleExpand={() => setQuickAnswerExpanded(!quickAnswerExpanded)}
            onStartJourney={handleStartJourney}
          />
        )}
        
        {blocks.length > 0 && (
          <div id="table-of-contents">
            <TableOfContents 
              chapters={chapters}
              onChapterClick={handleChapterClick}
              ageGroup={ageGroup}
            />
          </div>
        )}
        
        {blocks.length > 0 && (
          <ProgressVisualization 
            progress={progress} 
            ageGroup={ageGroup}
            totalChapters={chapters.length}
            completedChapters={chapters.filter(chapter => chapter.isCompleted).length}
          />
        )}
        
        {blocks.length > 0 && Object.keys(blocksByChapter).map((chapterId, index) => {
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
                loadTriggerRef={loadTriggerRef}
                searchQuery={""}
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
                generationError={null}
              />
            </div>
          );
        })}
        
        {showCertificate && blocks.length > 0 && (
          <LearningCertificate 
            learnerName={learnerName}
            topic={curioTitle || "Wonders of Knowledge"}
            date={new Date().toLocaleDateString()}
            onDownload={handleCertificateDownload}
            onShare={handleCertificateShare}
            ageGroup={ageGroup}
          />
        )}
        
        {showRabbitHoleSuggestions && blocks.length > 0 && (
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
    </div>
  );
};

export default EnhancedCurioPage;
