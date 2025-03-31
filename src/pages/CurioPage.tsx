
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const CurioPage: React.FC = () => {
  const { profileId, curioId } = useParams<{ profileId: string; curioId: string }>();
  const [animateBlocks, setAnimateBlocks] = useState(false);
  
  const {
    blocks,
    title,
    isLoading,
    isGeneratingContent,
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

  const handleTaskComplete = async () => {
    if (!profileId) return;
    
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: { childId: profileId, amount: 8 }
      });
      
      toast.success("Task completed! +8 sparks", {
        position: 'top-center',
        classNames: {
          toast: 'bg-wonderwhiz-purple text-white'
        }
      });
    } catch (error) {
      console.error('Error handling task completion:', error);
    }
  };

  const handleActivityComplete = async () => {
    if (!profileId) return;
    
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: { childId: profileId, amount: 3 }
      });
      
      toast.success("Activity completed! +3 sparks", {
        position: 'top-center',
        classNames: {
          toast: 'bg-wonderwhiz-purple text-white'
        }
      });
    } catch (error) {
      console.error('Error handling activity completion:', error);
    }
  };

  const handleMindfulnessComplete = async () => {
    if (!profileId) return;
    
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: { childId: profileId, amount: 5 }
      });
      
      toast.success("Mindfulness exercise completed! +5 sparks", {
        position: 'top-center',
        classNames: {
          toast: 'bg-wonderwhiz-purple text-white'
        }
      });
    } catch (error) {
      console.error('Error handling mindfulness completion:', error);
    }
  };

  const [loadTriggerRef, isLoadTriggerVisible] = useIntersectionObserver(
    { rootMargin: '200px' },
    false
  );

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (blocks.length > 0 && !isLoading && !initialLoadComplete) {
      console.log('Initial blocks loaded, preparing to auto-scroll');
      setInitialLoadComplete(true);
      
      setAnimateBlocks(true);
      
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

  useEffect(() => {
    if (isLoadTriggerVisible && hasMoreBlocks && !loadingMoreBlocks && !isLoading && initialLoadComplete) {
      console.log('Load trigger visible, loading more blocks');
      loadMoreBlocks();
    }
  }, [isLoadTriggerVisible, hasMoreBlocks, loadingMoreBlocks, isLoading, initialLoadComplete, loadMoreBlocks]);

  useEffect(() => {
    return () => {
    };
  }, []);

  if (isLoading && blocks.length === 0) {
    return <CurioLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-20">
      <Helmet>
        <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
      </Helmet>
      
      <div className="container px-4 py-3 sm:py-5">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 text-center">
          {title || (
            <motion.div
              className="h-8 w-3/5 mx-auto bg-white/10 rounded animate-pulse"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            ></motion.div>
          )}
        </h1>
        
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
            {isGeneratingContent && (
              <motion.div 
                className="flex items-center justify-center py-4 mb-4 bg-purple-900/20 rounded-lg border border-purple-500/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center">
                  <div className="flex space-x-2 mb-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-wonderwhiz-purple"
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-white/80">
                    Generating amazing content for you...
                  </p>
                </div>
              </motion.div>
            )}
            
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
              handleTaskComplete={handleTaskComplete}
              handleActivityComplete={handleActivityComplete}
              handleMindfulnessComplete={handleMindfulnessComplete}
              profileId={profileId}
            />
          </ScrollArea>
        </Card>
      </div>

      {/* Floating container for ElevenLabs Convai widget */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/10 hover:border-wonderwhiz-purple/50 transition-all duration-300">
          <div dangerouslySetInnerHTML={{ 
            __html: '<elevenlabs-convai agent-id="zmQ4IMOTcaVnB64g8OYl"></elevenlabs-convai>'
          }} />
        </div>
      </div>
    </div>
  );
};

export default CurioPage;
