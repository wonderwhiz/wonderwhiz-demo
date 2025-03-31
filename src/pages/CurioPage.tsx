
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import CurioSearch from '@/components/CurioSearch';
import CurioLoading from '@/components/CurioLoading';
import CurioBlockList from '@/components/CurioBlockList';
import { useCurioData } from '@/hooks/useCurioData';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';

const CurioPage: React.FC = () => {
  const { profileId, curioId } = useParams<{ profileId: string; curioId: string }>();
  const [animateBlocks, setAnimateBlocks] = useState(false);
  
  const {
    blocks,
    title,
    isLoading,
    hasMoreBlocks,
    loadingMoreBlocks,
    totalBlocksLoaded,
    initialLoadComplete,
    setInitialLoadComplete,
    searchQuery,
    setSearchQuery,
    loadMoreBlocks,
    handleToggleLike,
    handleToggleBookmark,
    handleSearch,
    clearSearch
  } = useCurioData(curioId, profileId);

  const {
    handleReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload
  } = useBlockInteractions(profileId);

  const [loadTriggerRef, isLoadTriggerVisible] = useIntersectionObserver(
    { rootMargin: '200px' },
    false
  );

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to top after initial blocks load
  useEffect(() => {
    if (blocks.length > 0 && !isLoading && !initialLoadComplete) {
      console.log('Initial blocks loaded, preparing to auto-scroll');
      setInitialLoadComplete(true);
      
      // Ensure blocks animate in sequence before scrolling
      setAnimateBlocks(true);
      
      // Scroll to top with a slight delay to allow animation to start
      if (scrollAreaRef.current) {
        console.log('Auto-scrolling to top');
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = 0;
          }
        }, 100);
      }
    }
  }, [blocks.length, isLoading, initialLoadComplete, setInitialLoadComplete]);

  // Load more blocks when the trigger element is visible
  useEffect(() => {
    if (isLoadTriggerVisible && hasMoreBlocks && !loadingMoreBlocks && !isLoading && initialLoadComplete) {
      console.log('Load trigger visible, loading more blocks');
      loadMoreBlocks();
    }
  }, [isLoadTriggerVisible, hasMoreBlocks, loadingMoreBlocks, isLoading, initialLoadComplete, loadMoreBlocks]);

  if (isLoading && blocks.length === 0) {
    return <CurioLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-20">
      <div className="container px-4 py-3 sm:py-5">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 text-center">{title}</h1>
        
        {/* Search component */}
        <CurioSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          isSearching={isLoading}
          totalBlocksLoaded={totalBlocksLoaded}
        />
        
        <Card className="bg-black/40 border-white/10 p-2 sm:p-4 md:p-6">
          <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-230px)]">
            {/* Content blocks list */}
            <CurioBlockList
              blocks={blocks}
              animateBlocks={animateBlocks}
              hasMoreBlocks={hasMoreBlocks}
              loadingMoreBlocks={loadingMoreBlocks}
              loadTriggerRef={loadTriggerRef}
              searchQuery={searchQuery}
              handleToggleLike={handleToggleLike}
              handleToggleBookmark={handleToggleBookmark}
              handleReply={handleReply}
              handleQuizCorrect={handleQuizCorrect}
              handleNewsRead={handleNewsRead}
              handleCreativeUpload={handleCreativeUpload}
              profileId={profileId}
            />
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default CurioPage;
