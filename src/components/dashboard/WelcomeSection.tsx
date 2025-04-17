
import React from 'react';
import WelcomeView from './WelcomeView';
import { toast } from 'sonner';

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
  const handleSuggestionClickWithFeedback = (suggestion: string) => {
    if (isGenerating) {
      toast.info("Already creating your adventure! Please wait a moment...");
      return;
    }
    
    console.log(`Suggestion clicked: ${suggestion}`);
    handleCurioSuggestionClick(suggestion);
  };
  
  const handleSubmitWithValidation = () => {
    if (isGenerating) {
      toast.info("Please wait while we create your adventure!");
      return;
    }
    
    if (!query.trim()) {
      toast.error("Please tell me what you want to learn about!");
      return;
    }
    
    console.log(`Submit clicked for query: ${query}`);
    handleSubmitQuery();
  };

  return (
    <div>
      <WelcomeView
        childId={childId}
        childProfile={childProfile}
        curioSuggestions={curioSuggestions.slice(0, 4)} // Limit to just 4 suggestions to reduce clutter
        pastCurios={pastCurios}
        query={query}
        setQuery={setQuery}
        handleSubmitQuery={handleSubmitWithValidation}
        isGenerating={isGenerating}
        onCurioSuggestionClick={handleSuggestionClickWithFeedback}
        onRefreshSuggestions={handleRefreshSuggestions}
        isLoadingSuggestions={isLoadingSuggestions}
      />
    </div>
  );
};

export default WelcomeSection;
