
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import CurioSuggestion from '@/components/CurioSuggestion';
import PersonalizedDashboard from './PersonalizedDashboard';

interface WelcomeSectionProps {
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  childProfile?: any;
  pastCurios?: any[];
  childId: string;
  handleRefreshSuggestions: () => void;
  handleCurioSuggestionClick: (suggestion: string) => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  curioSuggestions,
  isLoadingSuggestions,
  childProfile,
  pastCurios = [],
  childId,
  handleRefreshSuggestions,
  handleCurioSuggestionClick
}) => {
  // Use the enhanced personalized dashboard if we have the required data
  const hasEnoughData = childProfile && (
    childProfile.interests?.length > 0 || 
    pastCurios.length > 0 || 
    childProfile.streak_days > 0
  );

  return (
    <div className="py-6 sm:py-8">
      {hasEnoughData ? (
        <PersonalizedDashboard
          childId={childId}
          childProfile={childProfile}
          curioSuggestions={curioSuggestions}
          isLoadingSuggestions={isLoadingSuggestions}
          onCurioSuggestionClick={handleCurioSuggestionClick}
          handleRefreshSuggestions={handleRefreshSuggestions}
          pastCurios={pastCurios}
        />
      ) : (
        // Fall back to simple welcome section if we don't have enough data
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }} 
            className="mb-6"
          >
            <WonderWhizLogo className="h-20 sm:h-24 mx-auto" />
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Welcome to WonderWhiz!</h1>
          <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 px-4">
            What are you curious about today? Type your question above!
          </p>
          
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-lg font-medium text-white mr-2">Suggestions for you</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-wonderwhiz-gold transition-colors" 
              onClick={handleRefreshSuggestions} 
              disabled={isLoadingSuggestions}
            >
              <motion.div 
                animate={isLoadingSuggestions ? { rotate: 360 } : {}} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                className={isLoadingSuggestions ? "animate-spin" : ""}
              >
                <RefreshCw className="h-5 w-5" />
              </motion.div>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-3 sm:px-4">
            {curioSuggestions.map((suggestion, index) => (
              <CurioSuggestion 
                key={`${suggestion}-${index}`} 
                suggestion={suggestion} 
                onClick={handleCurioSuggestionClick} 
                index={index} 
                directGenerate={true} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;
