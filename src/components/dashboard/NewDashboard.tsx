
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import { useCurioCreation } from '@/hooks/useCurioCreation';
import WonderCanvas from './WonderCanvas';
import '@/styles/animations.css';

const NewDashboard: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { streakDays } = useSparksSystem(profileId);
  
  const {
    childProfile,
    isLoading,
    pastCurios,
    isLoadingSuggestions,
    curioSuggestions,
    handleRefreshSuggestions
  } = useDashboardProfile(profileId);

  const {
    query,
    setQuery,
    isGenerating,
    handleSubmitQuery,
    handleCurioSuggestionClick
  } = useCurioCreation(profileId, childProfile, () => {}, () => {}, () => {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-deep-purple flex items-center justify-center">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-bright-pink animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-deep-purple/90 overflow-hidden">
      <Helmet>
        <title>WonderWhiz - Explore & Learn</title>
        <meta name="description" content="Explore topics, ask questions, and learn in a fun, interactive way with WonderWhiz." />
      </Helmet>
      
      <WonderCanvas
        childId={profileId || ''}
        childProfile={childProfile}
        curioSuggestions={curioSuggestions}
        pastCurios={pastCurios}
        query={query}
        setQuery={setQuery}
        handleSubmitQuery={handleSubmitQuery}
        isGenerating={isGenerating}
        onCurioSuggestionClick={handleCurioSuggestionClick}
        onRefreshSuggestions={handleRefreshSuggestions}
        sparksBalance={childProfile?.sparks_balance || 0}
        streakDays={streakDays}
      />
    </div>
  );
};

export default NewDashboard;
