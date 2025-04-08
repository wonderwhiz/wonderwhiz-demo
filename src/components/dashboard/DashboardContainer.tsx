
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import CurioContent from '@/components/dashboard/CurioContent';
import DiscoverySection from '@/components/dashboard/DiscoverySection';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { useCurioCreation } from '@/hooks/useCurioCreation';
import { useCurioData } from '@/hooks/useCurioData';
import { useBlockInteractionHandlers } from '@/hooks/useBlockInteractionHandlers';
import SearchBar from '@/components/dashboard/SearchBar';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import SmartDashboard from '@/components/dashboard/SmartDashboard';

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

  // Fetch profile and curios data
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

  // Handle curio creation
  const {
    query,
    setQuery,
    isGenerating,
    handleSubmitQuery,
    handleFollowRabbitHole,
    handleCurioSuggestionClick
  } = useCurioCreation(profileId, childProfile, setPastCurios, setChildProfile, setCurrentCurio);

  // Get content blocks for current curio
  const {
    blocks: contentBlocks,
    title: curioTitle,
    query: curioQuery,
    isLoading: isLoadingBlocks,
    isGeneratingContent,
    hasMoreBlocks,
    loadingMoreBlocks,
    loadMoreBlocks,
    totalBlocksLoaded,
    initialLoadComplete,
    searchQuery,
    setSearchQuery,
    handleToggleLike,
    handleToggleBookmark,
    handleSearch,
    clearSearch,
    isFirstLoad,
    generationError
  } = useCurioData(currentCurio?.id, profileId);

  // Block interaction handlers
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

  // Collect past queries to use for search suggestions
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  useEffect(() => {
    if (pastCurios && pastCurios.length > 0) {
      const queries = pastCurios
        .slice(0, 5)
        .map(curio => curio.query)
        .filter(Boolean);
      
      setRecentQueries(queries);
    }
  }, [pastCurios]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-pink"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-wonderwhiz-gradient flex w-full">
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
          <DashboardHeader childName={childProfile?.name || 'Explorer'} profileId={profileId} />
          
          <div className="flex-1 overflow-y-auto py-4 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="relative">
                <SearchBar 
                  query={query} 
                  setQuery={setQuery} 
                  handleSubmitQuery={handleSubmitQuery}
                  isGenerating={isGenerating || isGeneratingContent} 
                  recentQueries={recentQueries}
                />
              </div>
              
              <Card className="bg-white/5 border-white/10">
                {!currentCurio ? (
                  <WelcomeSection 
                    curioSuggestions={curioSuggestions}
                    isLoadingSuggestions={isLoadingSuggestions}
                    handleRefreshSuggestions={handleRefreshSuggestions}
                    handleCurioSuggestionClick={handleCurioSuggestionClick}
                    childProfile={childProfile}
                    pastCurios={pastCurios}
                    childId={profileId || ''}
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
                  />
                )}
              </Card>
              
              {childProfile && (
                <DiscoverySection 
                  childId={profileId || ''}
                  sparksBalance={childProfile.sparks_balance || 0}
                  onSparkEarned={handleSparkEarned}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardContainer;
