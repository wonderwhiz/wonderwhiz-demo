
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import { SidebarProvider } from '@/components/ui/sidebar';
import FloatingElements from '@/components/FloatingElements';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SearchBar from '@/components/dashboard/SearchBar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import CurioContent from '@/components/dashboard/CurioContent';
import DiscoverySection from '@/components/dashboard/DiscoverySection';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { useCurioCreation } from '@/hooks/useCurioCreation';
import { useCurioData } from '@/hooks/useCurioData';
import { useBlockInteractionHandlers } from '@/hooks/useBlockInteractionHandlers';

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
    isFirstLoad
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
                <FloatingElements type="stars" density="low" className="absolute inset-0 pointer-events-none opacity-50" />
                <SearchBar 
                  query={query} 
                  setQuery={setQuery} 
                  handleSubmitQuery={handleSubmitQuery}
                  isGenerating={isGenerating || isGeneratingContent} 
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
      
      <style>
        {`
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
          height: 120px;
          cursor: pointer;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .flip-card:hover .flip-card-inner, .flip-card:focus .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @media (max-width: 640px) {
          .flip-card {
            height: 100px;
          }
        }
        `}
      </style>
    </SidebarProvider>
  );
};

export default DashboardContainer;
