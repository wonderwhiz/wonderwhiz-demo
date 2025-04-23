
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { useWonderSuggestions } from '@/hooks/use-wonder-suggestions';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [retryCount, setRetryCount] = useState(0);
  const [refreshClicked, setRefreshClicked] = useState(false);
  
  const { 
    suggestions, 
    isLoading, 
    refresh,
    error,
    source
  } = useWonderSuggestions({
    childId,
    childAge,
    childInterests,
    retryCount
  });

  const { handleToggleBookmark } = useBlockInteractions(childId);

  const handleRefresh = () => {
    setRefreshClicked(true);
    setRetryCount(prev => prev + 1);
    refresh();
    toast.info("Refreshing wonder suggestions...");
    
    // Reset after 5 seconds
    setTimeout(() => {
      setRefreshClicked(false);
    }, 5000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Add tracking analytics - in a real app this would help improve suggestions
    console.log(`Wonder suggestion clicked: ${suggestion}`);
    
    // Show a toast when a wonder is selected
    toast.success(childAge < 8 ? 
      "Great choice! Let's explore!" : 
      "Excellent choice! Exploring this wonder...", 
      { duration: 2000 }
    );
    
    onSuggestionClick(suggestion);
  };

  // Enhanced gradients based on the source of suggestions
  const getCardGradient = () => {
    if (error) {
      return "bg-gradient-to-br from-red-900/70 to-orange-900/70";
    }
    
    switch(source) {
      case 'api':
        return "bg-gradient-to-br from-indigo-900/70 to-purple-900/70"; // Best quality
      case 'fallback':
        return "bg-gradient-to-br from-purple-900/70 to-indigo-800/70"; // Server fallback
      case 'client-fallback':
        return "bg-gradient-to-br from-blue-900/70 to-purple-800/70"; // Local fallback
      default:
        return "bg-gradient-to-br from-indigo-900/70 to-purple-900/70";
    }
  };

  return (
    <Card className={`${getCardGradient()} border-white/10 shadow-lg overflow-hidden backdrop-blur-sm`}>
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
            className={`text-white/70 hover:text-white hover:bg-white/10 transition-all ${
              refreshClicked ? 'bg-white/10' : ''
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {isLoading ? (
            // Enhanced loading shimmer effect
            Array(6).fill(null).map((_, index) => (
              <div
                key={`shimmer-${index}`}
                className="relative overflow-hidden"
              >
                <Skeleton 
                  className="h-24 w-full bg-white/5 border border-white/10 rounded-lg"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              </div>
            ))
          ) : (
            suggestions.map((suggestion, index) => (
              <motion.div
                key={`suggestion-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 cursor-pointer transition-all h-full flex items-center backdrop-blur-sm shadow-md"
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
                {error.message && (
                  <span className="block mt-1 text-xs text-white/50">
                    Error: {error.message}
                  </span>
                )}
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
        
        {(source === 'fallback' || source === 'client-fallback') && !isLoading && !error && (
          <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <p className="text-white/60 text-xs flex items-center justify-center">
              <Sparkles className="h-3 w-3 mr-1 text-wonderwhiz-vibrant-yellow/70" />
              Using {source === 'client-fallback' ? 'local' : 'AI-generated'} suggestions while we prepare more personalized wonders!
              <Button 
                variant="link" 
                size="sm" 
                onClick={handleRefresh}
                className="text-wonderwhiz-bright-pink text-xs ml-1 h-auto p-0"
              >
                <RefreshCw className="h-2.5 w-2.5 mr-1" />
                Retry
              </Button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicWonderSuggestions;
