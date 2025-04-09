
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import AppleDashboard from './AppleDashboard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      // Fallback - attempt to find a text input if the ref isn't working
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }
  };
  
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
