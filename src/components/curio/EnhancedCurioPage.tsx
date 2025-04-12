
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { useCurioBlocks } from '@/hooks/use-curio-blocks';
import { useSearch } from '@/hooks/use-search';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import CurioBlockList from '@/components/CurioBlockList';
import CurioPageSearch from '@/components/curio/CurioPageSearch';
import CurioLoadingState from '@/components/curio/CurioLoadingState';
import CurioErrorState from '@/components/curio/CurioErrorState';
import RabbitHoleSuggestions from '@/components/content-blocks/RabbitHoleSuggestions';
import InteractiveImageBlock from '@/components/content-blocks/InteractiveImageBlock';
import TalkToWhizzy from '@/components/curio/TalkToWhizzy';
import QuickAnswer from '@/components/curio/QuickAnswer';

const EnhancedCurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad, generationError } = useCurioBlocks(childId, curioId, searchQuery);
  
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
  const [showPersonalizedMessage, setShowPersonalizedMessage] = useState(false);
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [specialistIds, setSpecialistIds] = useState<string[]>([]);
  const [showRabbitHoleSuggestions, setShowRabbitHoleSuggestions] = useState(false);
  const [quickAnswerExpanded, setQuickAnswerExpanded] = useState(false);
  
  const loadTriggerRef = useRef<HTMLDivElement>(null);

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
      
      const specialists = blocks.map(block => block.specialist_id);
      const uniqueSpecialists = Array.from(new Set(specialists));
      setSpecialistIds(uniqueSpecialists);
    }
  }, [blocks]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition + windowHeight > documentHeight * 0.75) {
        if (blocks.length > 0) {
          setShowRabbitHoleSuggestions(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blocks.length]);

  if (profileError) {
    return <CurioErrorState message="Failed to load profile." />;
  }

  if (isLoadingProfile) {
    return <CurioLoadingState message="Loading profile..." />;
  }

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${childId}`);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
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
          
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          navigate(`/curio/${childId}/${newCurio.id}`);
        } catch (err) {
          console.error('Error awarding sparks:', err);
        }
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast.error("Could not create new exploration. Please try again later.");
    }
  };

  const handleStartJourney = () => {
    setQuickAnswerExpanded(false);
    window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' });
  };

  const handleToggleLikeWrapper = (blockId: string) => {
    if (handleToggleLike) handleToggleLike(blockId);
  };
  
  const handleToggleBookmarkWrapper = (blockId: string) => {
    if (handleToggleBookmark) handleToggleBookmark(blockId);
  };
  
  const handleReplyWrapper = (blockId: string, message: string) => {
    if (handleReply) handleReply(blockId, message);
  };
  
  const handleQuizCorrectWrapper = (blockId: string) => {
    if (handleQuizCorrect) handleQuizCorrect(blockId);
  };
  
  const handleNewsReadWrapper = (blockId: string) => {
    if (handleNewsRead) handleNewsRead(blockId);
  };
  
  const handleCreativeUploadWrapper = (blockId: string, content: any = null) => {
    if (handleCreativeUpload) handleCreativeUpload(blockId, content);
  };
  
  const handleActivityCompleteWrapper = (blockId: string) => {
    if (handleActivityComplete) handleActivityComplete(blockId);
  };
  
  const handleMindfulnessCompleteWrapper = (blockId: string) => {
    if (handleMindfulnessComplete) handleMindfulnessComplete(blockId);
  };
  
  const handleTaskCompleteWrapper = (blockId: string) => {
    if (handleTaskComplete) handleTaskComplete(blockId);
  };

  if (profileError) {
    return <CurioErrorState message="Failed to load profile." />;
  }

  if (isLoadingProfile) {
    return <CurioLoadingState message="Loading profile..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 overflow-hidden">
      <CurioPageSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleBackToDashboard={handleBackToDashboard}
      />
      
      <main className="flex-grow py-6 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {curioTitle && (
            <motion.h1
              className="text-2xl sm:text-3xl font-bold text-white mb-5 text-center sm:text-left font-nunito"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {curioTitle}
            </motion.h1>
          )}
          
          {curioTitle && !searchQuery && (
            <div className="mb-6">
              <QuickAnswer 
                question={curioTitle}
                isExpanded={quickAnswerExpanded}
                onToggleExpand={() => setQuickAnswerExpanded(!quickAnswerExpanded)}
                onStartJourney={handleStartJourney}
                childId={childId || ''}
              />
            </div>
          )}
          
          {curioTitle && !searchQuery && (
            <div className="mb-6">
              <InteractiveImageBlock
                topic={curioTitle}
                childId={childId || ''}
                childAge={childProfile?.age ? Number(childProfile.age) : 10}
                onShare={() => {
                  toast.success('Image shared with your learning journey!');
                }}
              />
            </div>
          )}
          
          {isLoadingBlocks && <CurioLoadingState />}
          
          {blocksError && <CurioErrorState message="Failed to load content." />}
          
          {blocks.length > 0 && (
            <CurioBlockList
              blocks={blocks}
              animateBlocks={animateBlocks}
              hasMoreBlocks={hasMore}
              loadingMoreBlocks={false}
              loadTriggerRef={loadTriggerRef}
              searchQuery={searchQuery}
              profileId={childId || ''}
              isFirstLoad={isFirstLoad}
              handleToggleLike={(blockId) => handleToggleLikeWrapper(blockId)}
              handleToggleBookmark={(blockId) => handleToggleBookmarkWrapper(blockId)}
              handleReply={(blockId, message) => handleReplyWrapper(blockId, message)}
              handleQuizCorrect={() => blocks.length > 0 ? handleQuizCorrectWrapper(blocks[0].id) : undefined}
              handleNewsRead={() => blocks.length > 0 ? handleNewsReadWrapper(blocks[0].id) : undefined}
              handleCreativeUpload={() => blocks.length > 0 ? handleCreativeUploadWrapper(blocks[0].id) : undefined}
              handleTaskComplete={() => blocks.length > 0 ? handleTaskCompleteWrapper(blocks[0].id) : undefined}
              handleActivityComplete={() => blocks.length > 0 ? handleActivityCompleteWrapper(blocks[0].id) : undefined}
              handleMindfulnessComplete={() => blocks.length > 0 ? handleMindfulnessCompleteWrapper(blocks[0].id) : undefined}
              handleRabbitHoleClick={handleRabbitHoleClick}
              generationError={!!generationError}
              onRefresh={handleRefresh}
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
                profileId={childId || ''}
                onSuggestionClick={handleRabbitHoleClick}
                specialistIds={specialistIds}
              />
            </motion.div>
          )}
          
          <div ref={loadTriggerRef} className="h-20" />
        </div>
      </main>

      <TalkToWhizzy 
        childId={childId || ''}
        curioTitle={curioTitle || undefined}
        ageGroup={childProfile?.age >= 12 ? '12-16' : childProfile?.age >= 8 ? '8-11' : '5-7'}
        onNewQuestionGenerated={handleRabbitHoleClick}
      />
    </div>
  );
};

export default EnhancedCurioPage;
