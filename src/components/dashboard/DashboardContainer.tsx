
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import SimplifiedHeader from '@/components/dashboard/SimplifiedHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import CurioContent from '@/components/dashboard/CurioContent';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { useCurioCreation } from '@/hooks/useCurioCreation';
import { useCurioData } from '@/hooks/useCurioData';
import { useBlockInteractionHandlers } from '@/hooks/useBlockInteractionHandlers';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import { ContentBlock as CurioContentBlock, ContentBlockType } from '@/types/curio';

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

interface ContentBlock {
  id: string;
  type: ContentBlockType;
  specialist_id: string;
  content: any;
  liked: boolean;
  bookmarked: boolean;
  curio_id?: string;
  learningContext?: {
    sequencePosition: number;
    totalBlocks: number;
    cognitiveLevel: string;
    timeOfDay: string;
    recommendedPacing: string;
  };
}

const DashboardContainer = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [currentCurio, setCurrentCurio] = useState<Curio | null>(null);
  const { streakDays } = useSparksSystem(profileId);

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

  const {
    query,
    setQuery,
    isGenerating,
    handleSubmitQuery,
    handleFollowRabbitHole,
    handleCurioSuggestionClick
  } = useCurioCreation(profileId, childProfile, setPastCurios, setChildProfile, setCurrentCurio);

  const {
    blocks: curioBlocks,
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

  const contentBlocks: ContentBlock[] = curioBlocks.map((block: CurioContentBlock) => ({
    ...block,
    type: block.type as ContentBlockType,
  }));

  const {
    blockReplies,
    handleBlockReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleSparkEarned
  } = useBlockInteractionHandlers(profileId, childProfile, setChildProfile, contentBlocks);

  const handleLoadCurio = (curio: Curio) => {
    setCurrentCurio(curio);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-deep-purple flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-bright-pink"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
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
        <SimplifiedHeader 
          childName={childProfile?.name || 'Explorer'} 
          sparksBalance={childProfile?.sparks_balance || 0}
          streakDays={childProfile?.streak_days || 0}
        />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6 p-4">
            <Card className="bg-white/5 border-white/10 flex-grow relative overflow-hidden">
              {!currentCurio ? (
                <WelcomeSection 
                  curioSuggestions={curioSuggestions}
                  isLoadingSuggestions={isLoadingSuggestions}
                  handleRefreshSuggestions={handleRefreshSuggestions}
                  handleCurioSuggestionClick={handleCurioSuggestionClick}
                  childProfile={childProfile}
                  pastCurios={pastCurios}
                  childId={profileId || ''}
                  query={query}
                  setQuery={setQuery}
                  handleSubmitQuery={handleSubmitQuery}
                  isGenerating={isGenerating || isGeneratingContent}
                />
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
                  onRefresh={() => {
                    if (currentCurio && currentCurio.id) {
                      // Implement refresh logic if needed
                    }
                  }}
                />
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardContainer;
