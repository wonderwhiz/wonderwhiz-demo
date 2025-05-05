
import React from 'react';
import WelcomeView from './WelcomeView';
import DiscoverySection from './DiscoverySection';
import SmartDashboard from './SmartDashboard';
import { Toaster } from '@/components/ui/toaster';
import { useEnhancedBlockInteractions } from '@/hooks/useEnhancedBlockInteractions';

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
  const {
    handleLike,
    handleBookmark,
    handleReply,
    handleReadAloud,
    likedBlocks,
    bookmarkedBlocks
  } = useEnhancedBlockInteractions(childId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-light-purple to-wonderwhiz-light-purple pb-16">
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
        
        {/* SmartDashboard with proper WonderWhiz styling */}
        <SmartDashboard
          childId={childId}
          childProfile={childProfile}
          curioSuggestions={curioSuggestions}
          isLoadingSuggestions={isLoadingSuggestions}
          onCurioSuggestionClick={handleCurioSuggestionClick}
          handleRefreshSuggestions={handleRefreshSuggestions}
          pastCurios={pastCurios}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onReply={handleReply}
          onReadAloud={handleReadAloud}
          likedBlocks={likedBlocks}
          bookmarkedBlocks={bookmarkedBlocks}
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
      
      {/* Add Toaster for notifications */}
      <Toaster />
    </div>
  );
};

export default WelcomeSection;
