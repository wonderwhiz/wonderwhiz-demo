
import React from 'react';
import WelcomeView from './WelcomeView';
import DiscoverySection from './DiscoverySection';

interface WelcomeSectionProps {
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  handleRefreshSuggestions: () => void;
  handleCurioSuggestionClick: (suggestion: string) => void;
  childProfile: any;
  pastCurios: any[];
  childId: string;
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  curioSuggestions,
  isLoadingSuggestions,
  handleRefreshSuggestions,
  handleCurioSuggestionClick,
  childProfile,
  pastCurios,
  childId,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 pb-16">
      <div className="px-4 pb-8 max-w-7xl mx-auto">
        <WelcomeView
          childId={childId}
          childProfile={childProfile}
          curioSuggestions={curioSuggestions}
          pastCurios={pastCurios}
          query={query}
          setQuery={setQuery}
          handleSubmitQuery={handleSubmitQuery}
          isGenerating={isGenerating}
          onCurioSuggestionClick={handleCurioSuggestionClick}
          onRefreshSuggestions={handleRefreshSuggestions}
          isLoadingSuggestions={isLoadingSuggestions}
        />
        
        {/* Integrated discovery section with improved visuals */}
        <DiscoverySection 
          childId={childId} 
          sparksBalance={childProfile?.sparks_balance || 0}
          onSparkEarned={(amount) => {
            console.log(`Earned ${amount} sparks`);
          }}
        />
      </div>
    </div>
  );
};

export default WelcomeSection;
