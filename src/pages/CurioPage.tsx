
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
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const CurioPage: React.FC = () => {
  const { profileId, curioId } = useParams<{ profileId: string; curioId: string }>();
  const [animateBlocks, setAnimateBlocks] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const isMobile = useIsMobile();
  
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
    clearSearch,
    isFirstLoad,
    addBlock
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

  const handleImageUpload = async (file: File) => {
    if (!curioId || !profileId) {
      toast.error("Unable to process image without proper context");
      return;
    }
    
    setIsUploadingImage(true);
    
    try {
      toast.info("Analyzing your image...", {
        duration: 5000,
      });
      
      // Create FormData to send the image
      const formData = new FormData();
      formData.append("image", file);
      formData.append("query", "What's in this image? Generate interesting facts for a child.");
      
      // Call the analyze-image function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-image`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to analyze image: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.block) {
        // Add the block to the current curio
        await addBlock({
          ...data.block,
          curio_id: curioId
        });
        
        toast.success("Image analyzed successfully!", {
          duration: 3000,
        });
        
        // Scroll to the top to see the new content
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = 0;
        }
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const [loadTriggerRef, isLoadTriggerVisible] = useIntersectionObserver(
    { rootMargin: '200px' },
    false
  );

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Effect for initial blocks loading and scrolling
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

  // Effect for infinite scroll
  useEffect(() => {
    if (isLoadTriggerVisible && hasMoreBlocks && !loadingMoreBlocks && !isLoading && initialLoadComplete) {
      console.log('Load trigger visible, loading more blocks');
      loadMoreBlocks();
    }
  }, [isLoadTriggerVisible, hasMoreBlocks, loadingMoreBlocks, isLoading, initialLoadComplete, loadMoreBlocks]);

  // Show loading indicator immediately on first page load
  if (isLoading && blocks.length === 0 && !isGeneratingContent) {
    return <CurioLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-20">
      <Helmet>
        <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
      </Helmet>
      
      <div className="container px-4 py-3 sm:py-5 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={title || 'loading'}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center flex-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {title || (
                <div className="flex justify-center items-center">
                  <Skeleton className="h-8 w-3/5 bg-white/10 rounded" />
                </div>
              )}
            </motion.h1>
          </AnimatePresence>
          
          <Link to={`/dashboard/${profileId}`}>
            <Button 
              className="bg-wonderwhiz-gold hover:bg-wonderwhiz-gold/90 text-wonderwhiz-dark rounded-full shadow-glow-gold p-2 sm:p-3"
              size="icon"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <CurioSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          isSearching={isLoading}
          totalBlocksLoaded={totalBlocksLoaded}
          onImageUpload={handleImageUpload}
        />
        
        {isUploadingImage && (
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
                Analyzing your image with AI...
              </p>
            </div>
          </motion.div>
        )}
        
        <Card className="bg-black/40 border-white/10 p-2 sm:p-4 md:p-6 overflow-hidden rounded-xl">
          <ScrollArea ref={scrollAreaRef} className={isMobile ? "h-[calc(100vh-200px)]" : "h-[calc(100vh-230px)]"}>
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
              isFirstLoad={isFirstLoad}
            />
          </ScrollArea>
        </Card>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <div dangerouslySetInnerHTML={{ 
          __html: '<elevenlabs-convai agent-id="zmQ4IMOTcaVnB64g8OYl"></elevenlabs-convai>'
        }} />
      </div>
    </div>
  );
};

export default CurioPage;
