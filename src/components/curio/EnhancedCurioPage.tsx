import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { useCurioBlocks } from '@/hooks/use-curio-blocks';
import { useSearch } from '@/hooks/use-search';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { useDynamicContentGeneration } from '@/hooks/use-dynamic-content-generation';
import { Chapter } from '@/types/Chapter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import QuickAnswer from '@/components/curio/QuickAnswer';
import { TableOfContents } from '@/components/curio/TableOfContents';
import ProgressVisualization from '@/components/curio/ProgressVisualization';
import ChapterHeader from '@/components/curio/ChapterHeader';
import LearningCertificate from '@/components/curio/LearningCertificate';
import RabbitHoleSuggestions from '@/components/content-blocks/RabbitHoleSuggestions';
import CurioBlockList from '@/components/CurioBlockList';

const EnhancedCurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string; curioId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad, generationError } = useCurioBlocks(childId, curioId, searchQuery);
  const { generateContent, isGenerating } = useDynamicContentGeneration();
  
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
        
        navigate(`/enhanced-curio/${childId}/${newCurio.id}`);
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast.error("Could not create new exploration. Please try again later.");
    }
  };

  const blocksByChapter = organizeBlocksIntoChapters(blocks);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-900">
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
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
          {curioTitle && !isLoadingBlocks && !searchQuery && (
            <QuickAnswer 
              question={curioTitle}
              isExpanded={quickAnswerExpanded}
              onToggleExpand={() => setQuickAnswerExpanded(!quickAnswerExpanded)}
              onStartJourney={handleStartJourney}
              childId={childId}
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
                    loadTriggerRef={loadTriggerRef}
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
      </main>
    </div>
  );
};

export default EnhancedCurioPage;
