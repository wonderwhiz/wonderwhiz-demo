
import React from 'react';
import AppleDashboard from './AppleDashboard';

interface WelcomeSectionProps {
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  handleRefreshSuggestions: () => void;
  handleCurioSuggestionClick: (suggestion: string) => void;
  childProfile: any;
  pastCurios: any[];
  childId: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  curioSuggestions,
  isLoadingSuggestions,
  handleRefreshSuggestions,
  handleCurioSuggestionClick,
  childProfile,
  pastCurios,
  childId
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 pb-16">
      {/* Main dashboard content */}
      <AppleDashboard
        childId={childId}
        childProfile={childProfile}
        curioSuggestions={curioSuggestions}
        isLoadingSuggestions={isLoadingSuggestions}
        onCurioSuggestionClick={handleCurioSuggestionClick}
        handleRefreshSuggestions={handleRefreshSuggestions}
        pastCurios={pastCurios}
      />
    </div>
  );
};

export default WelcomeSection;
