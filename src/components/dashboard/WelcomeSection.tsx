
import React from 'react';
import WelcomeView from './WelcomeView';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950">
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
    </div>
  );
};

export default WelcomeSection;
