import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
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
import { toast } from 'sonner';

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

const DashboardContainer = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [currentCurio, setCurrentCurio] = useState<Curio | null>(null);
  const { streakDays } = useSparksSystem(profileId);
  const [ageGroup, setAgeGroup] = useState<'5-7' | '8-11' | '12-16'>('8-11');
  const [childAge, setChildAge] = useState<number>(10);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const {
    childProfile,
    setChildProfile,
    isLoading,
    pastCurios,
    setPastCurios,
    isLoadingSuggestions,
    curioSuggestions,
    handleRefreshSuggestions
  } = useDashboardProfile(profileId);

  const { playText, isPlaying, stopPlaying } = useElevenLabsVoice();

  const {
    query,
    setQuery,
    isGenerating,
    handleSubmitQuery,
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
    setCurrentCurio(null);
    curioCreationSuggestionClick(suggestion);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-deep-purple flex items-center justify-center">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-bright-pink animate-spin"></div>
      </div>
    );
  }

  const handleSubmitQuery = async () => {
    if (query.trim() === '') {
      toast.error("Please enter a query first");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          title: query,
          query: query,
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      if (newCurio) {
        toast.success("New exploration created!");
        setCurrentCurio(null); // Force reset current curio
        
        // Redirect to the new curio page
        navigate(`/curio/${profileId}/${newCurio.id}`);
        
        // Add to pastCurios if needed
        if (setPastCurios) {
          setPastCurios(prev => [
            { id: newCurio.id, title: query, query, created_at: new Date().toISOString() },
            ...prev
          ]);
        }
      }
    } catch (error) {
      console.error("Error creating curio:", error);
      toast.error("Failed to create new exploration");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshSuggestions = async () => {
    if (isLoadingSuggestions) return;
    
    try {
      setIsLoadingSuggestions(true);
      toast.loading("Generating fresh suggestions...");
      
      // Call the edge function to get new suggestions
      const { data, error } = await supabase.functions.invoke('generate-curio-suggestions', {
        body: JSON.stringify({
          childProfile,
          forceRefresh: true, // Add this parameter to force new suggestions
          timestamp: Date.now() // Add timestamp to prevent caching
        })
      });
      
      if (error) throw error;
      
      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        setCurioSuggestions(data.suggestions);
        toast.success("Fresh suggestions loaded!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error refreshing suggestions:", error);
      toast.error("Could not refresh suggestions");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

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
                  <WelcomeSection 
                    curioSuggestions={curioSuggestions}
                    isLoadingSuggestions={isLoadingSuggestions}
                    handleRefreshSuggestions={handleRefreshSuggestions}
                    handleCurioSuggestionClick={handleSuggestionClick}
                    childProfile={childProfile}
                    pastCurios={pastCurios}
                    childId={profileId || ''}
                    query={query}
                    setQuery={setQuery}
                    handleSubmitQuery={handleSubmitQuery}
                    isGenerating={isGenerating || isGeneratingContent}
                  />
                  
                  <IntelligentSuggestions
                    childId={profileId || ''}
                    childProfile={childProfile}
                    onSuggestionClick={handleSuggestionClick}
                    pastCurios={pastCurios}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <KnowledgeJourney 
                      childId={profileId || ''}
                      childProfile={childProfile}
                      onTopicClick={handleSuggestionClick}
                    />
                    <DiscoverySection 
                      childId={profileId || ''} 
                      sparksBalance={childProfile?.sparks_balance || 0}
                      onSparkEarned={(amount) => {
                        if (childProfile && setChildProfile) {
                          setChildProfile({
                            ...childProfile,
                            sparks_balance: (childProfile.sparks_balance || 0) + amount
                          });
                        }
                      }}
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
                  onReply={(blockId, message) => handleBlockReply(blockId, message)} 
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
