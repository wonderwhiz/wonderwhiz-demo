
import React from 'react';
import UnifiedDashboard from './UnifiedDashboard';

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
      <UnifiedDashboard
        childId={childId}
        childProfile={childProfile}
        curioSuggestions={curioSuggestions}
        isLoadingSuggestions={isLoadingSuggestions}
        onCurioSuggestionClick={handleCurioSuggestionClick}
        handleRefreshSuggestions={handleRefreshSuggestions}
        pastCurios={pastCurios}
        query={query}
        setQuery={setQuery}
        handleSubmitQuery={handleSubmitQuery}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default WelcomeSection;
