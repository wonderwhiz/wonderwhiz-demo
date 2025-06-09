
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Sparkles, Wand2, Camera, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useWonderSuggestions } from '@/hooks/use-wonder-suggestions';

interface MagicalSearchBarProps {
  onSearch: (query: string) => void;
  childProfile?: any;
  isLoading?: boolean;
  placeholder?: string;
  onImageCapture?: (file: File) => void;
  showSuggestions?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MagicalSearchBar: React.FC<MagicalSearchBarProps> = ({
  onSearch,
  childProfile,
  isLoading = false,
  placeholder = "What makes you wonder today?",
  onImageCapture,
  showSuggestions = true,
  size = 'lg'
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize the child data to prevent unnecessary re-renders
  const childData = React.useMemo(() => ({
    childId: childProfile?.id,
    childAge: childProfile?.age || 10,
    childInterests: childProfile?.interests || []
  }), [childProfile?.id, childProfile?.age, childProfile?.interests]);

  const { 
    suggestions, 
    isLoading: isLoadingSuggestions, 
    refresh: refreshSuggestions 
  } = useWonderSuggestions({
    ...childData,
    retryCount
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setShowSuggestionsList(false);
    }
  }, [query, onSearch]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestionsList(false);
  }, [onSearch]);

  const handleRefreshSuggestions = useCallback(() => {
    setRetryCount(prev => prev + 1);
    refreshSuggestions();
  }, [refreshSuggestions]);

  const handleFocus = useCallback(() => {
    if (showSuggestions) {
      setShowSuggestionsList(true);
    }
  }, [showSuggestions]);

  const handleBlur = useCallback(() => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestionsList(false), 200);
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageCapture) {
      onImageCapture(file);
    }
  }, [onImageCapture]);

  const sizeClasses = {
    sm: 'text-sm py-2 pl-10 pr-12',
    md: 'text-base py-3 pl-12 pr-14',
    lg: 'text-lg py-4 pl-12 pr-16'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-5 w-5'
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 ${iconSizes[size]}`} />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`${sizeClasses[size]} bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-wonderwhiz-bright-pink focus:ring-wonderwhiz-bright-pink/20 rounded-xl`}
            disabled={isLoading}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {onImageCapture && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim() || isLoading}
              className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 h-8"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-t-2 border-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showSuggestionsList && showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
          >
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1 mb-2">
                <span className="text-sm text-white/70">Wonder suggestions</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshSuggestions}
                  disabled={isLoadingSuggestions}
                  className="text-white/70 hover:text-white hover:bg-white/10 h-6 px-2"
                >
                  <Wand2 className="h-3 w-3" />
                </Button>
              </div>
              
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-white/90 hover:bg-white/10 rounded-md transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagicalSearchBar;
