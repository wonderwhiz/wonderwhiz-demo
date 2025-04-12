
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CurioSuggestion from '@/components/CurioSuggestion';
import AppleDashboard from './AppleDashboard';
import PersonalizedDashboard from './PersonalizedDashboard';
import EnhancedPersonalizedDashboard from './EnhancedPersonalizedDashboard';

interface WelcomeViewProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  pastCurios: any[];
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  onRefreshSuggestions: () => void;
  isLoadingSuggestions: boolean;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  pastCurios,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  onCurioSuggestionClick,
  onRefreshSuggestions,
  isLoadingSuggestions
}) => {
  const [dashboardStyle, setDashboardStyle] = useState<'apple' | 'enhanced' | 'classic'>('apple');
  
  // Apple-inspired UI is now our default
  return (
    <div>
      <AppleDashboard 
        childId={childId}
        childProfile={childProfile}
        curioSuggestions={curioSuggestions}
        isLoadingSuggestions={isLoadingSuggestions}
        onCurioSuggestionClick={onCurioSuggestionClick}
        handleRefreshSuggestions={onRefreshSuggestions}
        pastCurios={pastCurios}
      />
    </div>
  );
};

export default WelcomeView;
