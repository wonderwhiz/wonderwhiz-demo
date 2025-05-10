import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import CurioContent from '@/components/dashboard/CurioContent';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { useCurioCreation } from '@/hooks/useCurioCreation';
import { useCurioData } from '@/hooks/useCurioData';
import { useBlockInteractionHandlers } from '@/hooks/useBlockInteractionHandlers';
import TalkToWhizzy from '@/components/curio/TalkToWhizzy';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';
import VoiceInputButton from '@/components/curio/VoiceInputButton';
import DashboardControls from '@/components/dashboard/DashboardControls';
import ConsolidatedDashboard from '@/components/dashboard/ConsolidatedDashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEnhancedBlockInteractions } from '@/hooks/useEnhancedBlockInteractions';

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
  const [processingImage, setProcessingImage] = useState(false);

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

  // Use enhanced block interactions for improved visual feedback and animations
  const {
    handleLike,
    handleBookmark,
    handleReply,
    handleReadAloud,
    likedBlocks,
    bookmarkedBlocks,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleActivityComplete,
    handleMindfulnessComplete,
    handleTaskComplete,
    loadingStates
  } = useEnhancedBlockInteractions(profileId);

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
    generationError,
    triggerContentGeneration
  } = useCurioData(currentCurio?.id, profileId);

  const {
    blockReplies,
    handleBlockReply,
    handleQuizCorrect: baseHandleQuizCorrect,
    handleNewsRead: baseHandleNewsRead,
    handleCreativeUpload: baseHandleCreativeUpload,
    handleSparkEarned
  } = useBlockInteractionHandlers(profileId, childProfile, setChildProfile, contentBlocks);

  // Create wrapper functions that adapt the function signatures
  const handleCreativeUploadWrapper = (blockId: string) => {
    if (handleCreativeUpload) {
      return handleCreativeUpload(blockId);
    }
    return baseHandleCreativeUpload(blockId);
  };

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

  // Handle image uploads
  const handleImageCapture = async (file: File) => {
    if (!profileId || processingImage) return;
    
    setProcessingImage(true);
    
    try {
      toast.loading("Analyzing your image with AI...");
      
      // Create a FormData object to send the image
      const formData = new FormData();
      formData.append('image', file);
      
      // Call the analyze-image edge function
      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: formData,
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.block) {
        toast.dismiss();
        toast.success(data.feedback || "Image analyzed successfully!");
        
        // Create a new curio based on the image analysis
        const imageDescription = data.block.content.fact.split('.')[0] + ".";
        const curioTitle = `About my ${file.name.split('.')[0]}`;
        
        // Create the curio in the database
        const { data: newCurio, error: curioError } = await supabase
          .from('curios')
          .insert({
            child_id: profileId,
            query: `Tell me about ${file.name.split('.')[0]}`,
            title: curioTitle
          })
          .select()
          .single();
          
        if (curioError) throw curioError;
        
        // Add the block to the curio
        if (newCurio) {
          const { error: blockError } = await supabase
            .from('content_blocks')
            .insert({
              ...data.block,
              curio_id: newCurio.id
            });
            
          if (blockError) throw blockError;
          
          // Add the curio to the list of past curios
          setPastCurios(prev => [newCurio, ...prev]);
          
          // Set the current curio to the new one
          setCurrentCurio(newCurio);
          
          // Award sparks for uploading an image
          try {
            await supabase.functions.invoke('increment-sparks-balance', {
              body: JSON.stringify({
                profileId: profileId,
                amount: 3
              })
            });
            
            if (childProfile && setChildProfile) {
              setChildProfile({
                ...childProfile,
                sparks_balance: (childProfile.sparks_balance || 0) + 3
              });
            }
            
            toast.success('You earned 3 sparks for your creative exploration!', {
              duration: 3000,
              position: 'bottom-right'
            });
          } catch (err) {
            console.error('Error awarding sparks for image upload:', err);
          }
        }
      } else {
        throw new Error('No analysis result returned');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.dismiss();
      toast.error("Sorry, we couldn't analyze your image. Please try again.");
    } finally {
      setProcessingImage(false);
    }
  };

  // Use the logic from the local function but call the one from useCurioCreation
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
        <DashboardControls
          childName={childProfile?.name || 'Explorer'}
          childId={profileId || ''}
          sparksBalance={childProfile?.sparks_balance || 0}
          streakDays={streakDays}
          query={query}
          setQuery={setQuery}
          handleSubmitQuery={handleSubmitQuery}
          isGenerating={isGenerating || isGeneratingContent || processingImage}
          onImageCapture={handleImageCapture}
        />
        
        <div className="flex-1 overflow-y-auto">
          {!currentCurio ? (
            <ConsolidatedDashboard
              childId={profileId || ''}
              childProfile={childProfile}
              curioSuggestions={curioSuggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              onCurioSuggestionClick={handleSuggestionClick}
              handleRefreshSuggestions={handleRefreshSuggestions}
              pastCurios={pastCurios}
              sparksBalance={childProfile?.sparks_balance || 0}
              streakDays={streakDays}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onReply={handleReply}
              onReadAloud={handleReadAloud}
              likedBlocks={likedBlocks}
              bookmarkedBlocks={bookmarkedBlocks}
            />
          ) : (
            <div className="max-w-5xl mx-auto space-y-6 p-4">
              <Card className="bg-wonderwhiz-purple/50 backdrop-blur-sm border-white/10 flex-grow relative overflow-hidden shadow-xl rounded-xl">
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
                  onQuizCorrect={handleQuizCorrect || baseHandleQuizCorrect}
                  onNewsRead={handleNewsRead || baseHandleNewsRead}
                  onCreativeUpload={handleCreativeUploadWrapper}
                  generationError={generationError}
                  playText={playText}
                  childAge={childAge}
                  triggerGeneration={triggerContentGeneration}
                />
              </Card>
            </div>
          )}
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
