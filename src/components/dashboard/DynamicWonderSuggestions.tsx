
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { useWonderSuggestions } from '@/hooks/use-wonder-suggestions';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { toast } from 'sonner';

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
    refresh,
    error,
    source
  } = useWonderSuggestions({
    childId,
    childAge,
    childInterests
  });

  const { handleToggleBookmark } = useBlockInteractions(childId);

  const handleRefresh = () => {
    refresh();
    toast.info("Refreshing wonder suggestions...");
  };

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
            onClick={handleRefresh}
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
        
        {error && !isLoading && suggestions.length === 0 && (
          <div className="bg-white/5 border border-red-500/30 rounded-lg p-4 mt-3">
            <p className="text-white/70 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-red-400" />
              <span>
                Couldn't load new suggestions. Using default wonders instead.
              </span>
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Try Again
            </Button>
          </div>
        )}
        
        {source === 'fallback' && !isLoading && !error && (
          <div className="mt-4">
            <p className="text-white/60 text-xs text-center">
              Using local suggestions while we prepare more personalized wonders for you!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicWonderSuggestions;
