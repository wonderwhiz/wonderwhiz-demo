
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import CurioContent from '@/components/dashboard/CurioContent';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { useCurioCreation } from '@/hooks/useCurioCreation';
import { useCurioData } from '@/hooks/useCurioData';
import { useBlockInteractionHandlers } from '@/hooks/useBlockInteractionHandlers';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import TalkToWhizzy from '@/components/curio/TalkToWhizzy';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';
import VoiceInputButton from '@/components/curio/VoiceInputButton';
import IntelligentSuggestions from '@/components/dashboard/IntelligentSuggestions';
import KnowledgeJourney from '@/components/dashboard/KnowledgeJourney';
import DiscoverySection from '@/components/dashboard/DiscoverySection';
import ChildDashboardTasks from '@/components/ChildDashboardTasks';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

const DashboardContainer = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [currentCurio, setCurrentCurio] = useState<Curio | null>(null);
  const { streakDays } = useSparksSystem(profileId);
  const [ageGroup, setAgeGroup] = useState<'5-7' | '8-11' | '12-16'>('8-11');
  const [childAge, setChildAge] = useState<number>(10);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCreatingCurio, setIsCreatingCurio] = useState(false);
  const [lastCreatedQuery, setLastCreatedQuery] = useState<string>(''); // Track last created query

  const {
    childProfile,
    setChildProfile,
    isLoading,
    pastCurios,
    setPastCurios,
    isLoadingSuggestions,
    setIsLoadingSuggestions,
    curioSuggestions,
    setCurioSuggestions,
    handleRefreshSuggestions: refreshSuggestions
  } = useDashboardProfile(profileId);

  const { playText, isPlaying, stopPlaying } = useElevenLabsVoice();

  const {
    query,
    setQuery,
    isGenerating,
    setIsGenerating,
    handleSubmitQuery: submitQuery,
    handleFollowRabbitHole,
    handleCurioSuggestionClick: curioCreationSuggestionClick
  } = useCurioCreation(profileId, childProfile, setPastCurios, setChildProfile, setCurrentCurio);

  const {
    blocks: contentBlocks,
    isLoading: isLoadingBlocks,
    isGeneratingContent,
    hasMoreBlocks,
    loadingMoreBlocks,
    loadMoreBlocks,
    totalBlocksLoaded,
    handleToggleLike,
    handleToggleBookmark,
    handleSearch,
    clearSearch,
    isFirstLoad,
    generationError
  } = useCurioData(currentCurio?.id, profileId);

  const {
    blockReplies,
    handleBlockReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleSparkEarned
  } = useBlockInteractionHandlers(profileId, childProfile, setChildProfile, contentBlocks);

  useEffect(() => {
    if (childProfile?.age) {
      const age = typeof childProfile.age === 'string' 
        ? parseInt(childProfile.age, 10) 
        : childProfile.age;
      
      setChildAge(age);
        
      if (age >= 5 && age <= 7) {
        setAgeGroup('5-7');
      } else if (age >= 8 && age <= 11) {
        setAgeGroup('8-11');
      } else {
        setAgeGroup('12-16');
      }
    }
  }, [childProfile]);

  const handleLoadCurio = (curio: Curio) => {
    setCurrentCurio(curio);
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript.trim()) {
      setQuery(transcript);
      setIsVoiceActive(false);
      
      setTimeout(() => {
        handleSubmitQuery();
      }, 300);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isCreatingCurio) return;
    
    // Clear any previous query to avoid confusion
    setQuery(suggestion);
    setCurrentCurio(null);
    
    // Let the UI update first, then submit
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
  };

  const handleSubmitQuery = async () => {
    if (query.trim() === '' || isCreatingCurio) {
      if (query.trim() === '') {
        toast.error("Please enter a question first");
      }
      return;
    }
    
    // Prevent re-submitting the same query back-to-back
    if (lastCreatedQuery === query.trim()) {
      toast.info("You're already exploring this topic!");
      return;
    }
    
    setIsCreatingCurio(true);
    setIsGenerating(true);
    setLastCreatedQuery(query.trim());
    
    try {
      // Show a loading toast
      toast.loading("Creating your adventure...", {
        id: "creating-curio",
        duration: 5000
      });
      
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          title: query,
          query: query,
        })
        .select()
        .single();
      
      if (error) throw error;

      if (newCurio) {
        toast.success("New exploration created!", {
          id: "creating-curio"
        });
        
        // Add to pastCurios
        if (setPastCurios) {
          setPastCurios(prev => [
            { id: newCurio.id, title: query, query, created_at: new Date().toISOString() },
            ...prev
          ]);
        }
        
        // Redirect to the new curio page
        navigate(`/curio/${profileId}/${newCurio.id}`);
      }
    } catch (error) {
      console.error("Error creating curio:", error);
      toast.error("Couldn't create your adventure. Let's try again!", {
        id: "creating-curio"
      });
      setLastCreatedQuery(''); // Reset on error to allow retrying
    } finally {
      setIsGenerating(false);
      setIsCreatingCurio(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-deep-purple flex items-center justify-center">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-bright-pink animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-deep-purple/90">
      <Helmet>
        <title>WonderWhiz - Explore & Learn</title>
        <meta name="description" content="Explore topics, ask questions, and learn in a fun, interactive way with WonderWhiz." />
      </Helmet>
      
      <DashboardSidebar 
        childId={profileId || ''} 
        sparksBalance={childProfile?.sparks_balance || 0}
        pastCurios={pastCurios}
        currentCurioId={currentCurio?.id}
        onCurioSelect={handleLoadCurio}
      />
      
      <main className="flex-1 flex flex-col min-h-screen relative">
        <DashboardHeader 
          childName={childProfile?.name || 'Explorer'} 
          profileId={profileId}
          streakDays={streakDays}
          childAge={childAge}
        />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6 p-4">
            <Card className="bg-wonderwhiz-purple/50 backdrop-blur-sm border-white/10 flex-grow relative overflow-hidden shadow-xl rounded-xl">
              {!currentCurio ? (
                <div className="p-6 space-y-8">
                  {profileId && (
                    <div className="mb-6">
                      <ChildDashboardTasks 
                        childId={profileId} 
                        onSparkEarned={handleSparkEarned}
                      />
                    </div>
                  )}
                  
                  <WelcomeSection 
                    curioSuggestions={curioSuggestions}
                    isLoadingSuggestions={isLoadingSuggestions}
                    handleRefreshSuggestions={refreshSuggestions}
                    handleCurioSuggestionClick={handleSuggestionClick}
                    childProfile={childProfile}
                    pastCurios={pastCurios}
                    childId={profileId || ''}
                    query={query}
                    setQuery={setQuery}
                    handleSubmitQuery={handleSubmitQuery}
                    isGenerating={isGenerating || isGeneratingContent || isCreatingCurio}
                  />
                  
                  <div className="grid grid-cols-1 gap-6">
                    <IntelligentSuggestions
                      childId={profileId || ''}
                      childProfile={childProfile}
                      onSuggestionClick={handleSuggestionClick}
                      pastCurios={pastCurios}
                    />
                  </div>
                </div>
              ) : (
                <CurioContent
                  currentCurio={currentCurio}
                  contentBlocks={contentBlocks}
                  blockReplies={blockReplies}
                  isGenerating={isGeneratingContent}
                  loadingBlocks={loadingMoreBlocks}
                  visibleBlocksCount={totalBlocksLoaded}
                  profileId={profileId}
                  onLoadMore={loadMoreBlocks}
                  hasMoreBlocks={hasMoreBlocks}
                  onToggleLike={handleToggleLike}
                  onToggleBookmark={handleToggleBookmark}
                  onReply={handleBlockReply}
                  onSetQuery={setQuery}
                  onRabbitHoleFollow={handleFollowRabbitHole}
                  onQuizCorrect={handleQuizCorrect}
                  onNewsRead={handleNewsRead}
                  onCreativeUpload={handleCreativeUpload}
                  generationError={generationError}
                  playText={playText}
                  childAge={childAge}
                />
              )}
            </Card>
          </div>
        </div>
        
        <VoiceInputButton 
          isActive={isVoiceActive}
          onToggle={setIsVoiceActive}
          onTranscript={handleVoiceTranscript}
          childAge={childAge}
        />
        
        {profileId && (
          <TalkToWhizzy 
            childId={profileId}
            curioTitle={currentCurio?.title}
            ageGroup={ageGroup}
            onNewQuestionGenerated={handleFollowRabbitHole}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardContainer;
