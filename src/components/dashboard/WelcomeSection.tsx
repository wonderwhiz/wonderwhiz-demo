
import React from 'react';
import { motion } from 'framer-motion';
import SmartDashboard from './SmartDashboard';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-6 sm:py-8 px-4 sm:px-6"
    >
      <SmartDashboard
        childId={childId}
        childProfile={childProfile}
        curioSuggestions={curioSuggestions}
        isLoadingSuggestions={isLoadingSuggestions}
        onCurioSuggestionClick={handleCurioSuggestionClick}
        handleRefreshSuggestions={handleRefreshSuggestions}
        pastCurios={pastCurios}
      />
    </motion.div>
  );
};

export default WelcomeSection;
