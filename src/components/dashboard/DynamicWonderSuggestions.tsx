
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useWonderSuggestions } from '@/hooks/use-wonder-suggestions';

interface DynamicWonderSuggestionsProps {
  childId: string;
  childInterests?: string[];
  childAge?: number;
  isLoading?: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const DynamicWonderSuggestions: React.FC<DynamicWonderSuggestionsProps> = ({
  childId,
  childInterests = ["science", "nature", "space"],
  childAge = 10,
  onSuggestionClick
}) => {
  const { 
    suggestions, 
    isLoading, 
    refresh 
  } = useWonderSuggestions({
    childId,
    childAge,
    childInterests
  });

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900/70 to-purple-900/70 border-white/10 shadow-lg overflow-hidden backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-xl flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-wonderwhiz-vibrant-yellow" />
            Discover New Wonders
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {isLoading ? (
            // Loading shimmer effect
            Array(6).fill(null).map((_, index) => (
              <div
                key={`shimmer-${index}`}
                className="bg-white/5 border border-white/10 rounded-lg p-4 h-24 animate-pulse"
              />
            ))
          ) : (
            suggestions.map((suggestion, index) => (
              <motion.div
                key={`suggestion-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 cursor-pointer transition-colors h-full flex items-center"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <p className="text-white">{suggestion}</p>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicWonderSuggestions;
