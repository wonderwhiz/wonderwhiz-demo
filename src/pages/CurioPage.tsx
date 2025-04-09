
import React, { useState, useEffect } from 'react';
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
import CurioBlockList from '@/components/CurioBlockList';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { Search, ArrowLeft, Sparkles, RefreshCw, Braces, MessageCircle, Brain, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurioData } from '@/hooks/useCurioData';
import confetti from 'canvas-confetti';
import RabbitHoleSuggestions from '@/components/content-blocks/RabbitHoleSuggestions';
import CurioPageHeader from '@/components/curio/CurioPageHeader';
import CurioPageInsights from '@/components/curio/CurioPageInsights';
import CurioSearchBar from '@/components/curio/CurioSearchBar';
import CurioLoadingState from '@/components/curio/CurioLoadingState';
import CurioEmptyState from '@/components/curio/CurioEmptyState';
import CurioErrorState from '@/components/curio/CurioErrorState';

const CurioPage: React.FC = () => {
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

  // Navigation guard
  useEffect(() => {
    if (user && !childId) {
      navigate('/profiles');
    }
  }, [user, childId, navigate]);

  // Fetch curio title
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

  // Celebration effect when content loads
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

  // Turn off animations after initial load
  useEffect(() => {
    if (blocks.length > 0) {
      setTimeout(() => {
        setAnimateBlocks(false);
      }, 1000);
    }
  }, [blocks]);

  // Extract block metadata and insights
  useEffect(() => {
    if (blocks.length > 0) {
      // Collect specialist types
      const specialists = blocks.map(block => block.specialist_id);
      const uniqueSpecialists = Array.from(new Set(specialists));
      setSpecialistIds(uniqueSpecialists);
      
      // Count blocks
      setBlockCount(blocks.length);
      
      // Determine difficulty level
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
      
      // Generate topic summary
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

  // Detect scroll position for showing rabbit hole suggestions
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

  // Handle profile loading error
  if (profileError) {
    return <CurioErrorState message="Failed to load profile." />;
  }

  // Handle loading state
  if (isLoadingProfile) {
    return <CurioLoadingState message="Loading profile..." />;
  }

  // Handle user interactions
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
      {/* Header */}
      <CurioPageHeader 
        curioTitle={curioTitle} 
        handleBackToDashboard={handleBackToDashboard}
        handleToggleInsights={handleToggleInsights}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        showInsights={showInsights}
      />

      {/* Insights Panel */}
      <AnimatePresence>
        {showInsights && (
          <CurioPageInsights
            difficulty={difficulty}
            blockCount={blockCount}
            learningSummary={learningSummary}
          />
        )}
      </AnimatePresence>
      
      {/* Search Bar */}
      <div className="mt-4 px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <CurioSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto relative">
        <div className="max-w-3xl mx-auto py-6 sm:py-8 px-2 sm:px-0">
          {/* Loading States */}
          {isLoadingBlocks && <CurioLoadingState />}
          
          {/* Error State */}
          {blocksError && <CurioErrorState message="Failed to load content." />}
          
          {/* Empty State */}
          {!isLoadingBlocks && !blocksError && blocks.length === 0 && !isFirstLoad && (
            <CurioEmptyState />
          )}

          {/* Content Blocks */}
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

          {/* Rabbit Hole Suggestions */}
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
    </div>
  );
};

export default CurioPage;
