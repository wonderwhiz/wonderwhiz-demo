
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import CurioSuggestion from '@/components/CurioSuggestion';

interface DynamicWonderSuggestionsProps {
  childId: string;
  suggestions: string[];
  childInterests?: string[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
  childAge?: number;
}

const DynamicWonderSuggestions: React.FC<DynamicWonderSuggestionsProps> = ({
  childId,
  suggestions = [],
  childInterests = [],
  isLoading = false,
  onSuggestionClick,
  childAge
}) => {
  const getAgeAppropriateLabel = () => {
    if (!childAge) return "Wonder Journeys";
    if (childAge < 6) return "Fun Discoveries";
    if (childAge < 10) return "Wonder Journeys";
    return "Explore & Learn";
  };

  return (
    <motion.div 
      className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-glow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-wonderwhiz-bright-pink/30 to-wonderwhiz-vibrant-yellow/30 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white font-nunito">
              {getAgeAppropriateLabel()}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {isLoading ? (
            // Loading skeleton state
            Array(4).fill(0).map((_, i) => (
              <Card key={`loading-${i}`} className="border-white/10 bg-white/5 animate-pulse">
                <CardContent className="p-4 h-24"></CardContent>
              </Card>
            ))
          ) : suggestions.length > 0 ? (
            // Display available suggestions
            suggestions.map((suggestion, index) => (
              <CurioSuggestion 
                key={`${suggestion}-${index}`} 
                suggestion={suggestion} 
                onClick={onSuggestionClick} 
                index={index} 
                directGenerate={true}
                profileId={childId}
              />
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-8 text-white/60">
              <p>No wonder suggestions available right now.</p>
              <p className="text-sm mt-2">Try refreshing or adding new interests to your profile!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DynamicWonderSuggestions;
