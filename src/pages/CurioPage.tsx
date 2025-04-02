
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurioData } from '@/hooks/useCurioData';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, X, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CurioBlockList from '@/components/CurioBlockList';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useToast } from '@/hooks/use-toast';
import { useSparksSystem } from '@/hooks/useSparksSystem';

const CurioPage = () => {
  const { curioId } = useParams<{ curioId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profileId } = JSON.parse(localStorage.getItem('wonderwhiz_user') || '{"profileId":""}');
  
  // Block interactions hook
  const { 
    handleToggleLike,
    handleToggleBookmark,
    handleReply,
    handleQuizCorrect, 
    handleNewsRead, 
    handleCreativeUpload,
    handleTaskComplete,
    handleActivityComplete,
    handleMindfulnessComplete
  } = useBlockInteractions(profileId);
  
  // Get Sparks System hooks
  const { 
    streakDays
  } = useSparksSystem(profileId);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Refs
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Get curio data
  const {
    blocks,
    title,
    isLoading,
    hasMoreBlocks,
    loadMoreBlocks,
    loadingMoreBlocks,
    handleSearch: setNewQuery,
    clearSearch: refreshCurio,
    isFirstLoad
  } = useCurioData(curioId, profileId);
  
  // Intersection observer for infinite loading
  const [loadRef, isVisible] = useIntersectionObserver({});
  
  // Load more blocks when scrolled to bottom
  const loadMoreHandler = useCallback(() => {
    if (isVisible && hasMoreBlocks && !loadingMoreBlocks && !isLoading) {
      loadMoreBlocks();
    }
  }, [isVisible, hasMoreBlocks, loadingMoreBlocks, loadMoreBlocks, isLoading]);
  
  useEffect(() => {
    loadMoreHandler();
  }, [loadMoreHandler]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setNewQuery(searchQuery);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    refreshCurio();
  };
  
  // Handle rabbit hole follow
  const handleRabbitHoleFollow = (question: string) => {
    setNewQuery(question);
    toast({
      title: "New question explored",
      description: `Now exploring: "${question}"`,
      duration: 3000
    });
  };
  
  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 bg-gray-700/30 rounded w-1/2 animate-pulse" />
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 bg-gray-700/30 rounded-full animate-pulse" />
                <div className="ml-2">
                  <div className="h-4 bg-gray-700/30 rounded w-24 animate-pulse" />
                  <div className="h-3 bg-gray-700/30 rounded w-32 mt-1 animate-pulse" />
                </div>
              </div>
              <div className="h-32 bg-gray-700/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  const error = null; // We'll handle error state separately in the useCurioData hook
  
  // If error, show error message
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
        
        <div className="p-6 rounded-lg bg-red-950/30 border border-red-800/50">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Curio</h3>
          <p className="text-white/70">{error}</p>
          
          <Button className="mt-6" onClick={refreshCurio}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">{title || 'Exploring Curio'}</h1>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search within this curio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-10 pr-10 bg-gray-900/50 border-gray-700 focus:border-wonderwhiz-purple/50 focus:ring-wonderwhiz-purple/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Content blocks */}
      <CurioBlockList
        blocks={blocks}
        animateBlocks={!isLoading}
        hasMoreBlocks={hasMoreBlocks}
        loadingMoreBlocks={loadingMoreBlocks}
        loadTriggerRef={loadRef}
        searchQuery={searchQuery}
        handleToggleLike={handleToggleLike}
        handleToggleBookmark={handleToggleBookmark}
        handleReply={handleReply}
        onRabbitHoleClick={handleRabbitHoleFollow}
        onQuizCorrect={handleQuizCorrect}
        onNewsRead={handleNewsRead}
        onCreativeUpload={handleCreativeUpload}
        onTaskComplete={handleTaskComplete}
        onActivityComplete={handleActivityComplete}
        onMindfulnessComplete={handleMindfulnessComplete}
        profileId={profileId}
        isFirstLoad={isFirstLoad}
      />
      
      {/* Loading more indicator */}
      {loadingMoreBlocks && (
        <div className="text-center py-6">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-wonderwhiz-purple/60" />
          <p className="text-sm text-gray-400 mt-2">Loading more content...</p>
        </div>
      )}
      
      {/* Invisible load more trigger */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
};

export default CurioPage;
