
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { User, Settings, Sparkles, Rocket, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const CurioPage: React.FC = () => {
  const { profileId, curioId } = useParams<{ profileId: string; curioId: string }>();
  const [animateBlocks, setAnimateBlocks] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showFloatingElements, setShowFloatingElements] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
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
          toast: 'bg-[#3D2A7D] text-white'
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
          toast: 'bg-[#3D2A7D] text-white'
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
          toast: 'bg-[#3D2A7D] text-white'
        }
      });
    } catch (error) {
      console.error('Error handling mindfulness completion:', error);
    }
  };

  const handleRabbitHoleClick = async (question: string) => {
    if (!profileId) return;
    
    try {
      toast.loading("Creating new exploration...", {
        id: "create-curio",
        duration: 3000
      });
      
      // Create a new curio based on the rabbit hole question
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          title: question,
          query: question,
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      if (newCurio) {
        toast.success("New exploration created!", {
          id: "create-curio"
        });
        
        // Navigate to the new curio
        navigate(`/curio/${profileId}/${newCurio.id}`);
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast.error("Could not create new exploration", {
        id: "create-curio"
      });
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
        
        toast.success(data.feedback || "Image analyzed successfully!", {
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

  // Toggle floating elements when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        const scrollTop = scrollAreaRef.current.scrollTop;
        setShowFloatingElements(scrollTop < 100);
      }
    };

    if (scrollAreaRef.current) {
      scrollAreaRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollAreaRef]);

  // Show loading indicator immediately on first page load
  if (isLoading && blocks.length === 0 && !isGeneratingContent) {
    return <CurioLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2A1B5D] via-[#3D2A7D] to-[#2A1B5D] pb-6 sm:pb-10 md:pb-20 relative overflow-hidden">
      <Helmet>
        <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
      </Helmet>
      
      {/* Floating Background Elements */}
      {showFloatingElements && (
        <>
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-[#FFD54F] rounded-full opacity-70"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          <motion.div
            className="absolute w-20 h-20 sm:w-40 sm:h-40 rounded-full bg-gradient-to-r from-[#FF5BA3]/10 to-[#4A6FFF]/10 blur-3xl"
            style={{ top: '10%', right: '5%' }}
            animate={{
              translateY: [0, -20, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-32 h-32 sm:w-60 sm:h-60 rounded-full bg-gradient-to-r from-[#00E2FF]/10 to-[#FF8A3D]/10 blur-3xl"
            style={{ bottom: '10%', left: '5%' }}
            animate={{
              translateY: [0, 20, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 18, repeat: Infinity }}
          />
        </>
      )}
      
      <div className="container px-3 sm:px-4 py-3 sm:py-5 max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          {isMobile && (
            <Link to={`/dashboard/${profileId}`} className="mr-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          <AnimatePresence mode="wait">
            <motion.h1 
              key={title || 'loading'}
              className="text-lg sm:text-xl md:text-3xl font-bold text-white flex-1 font-nunito truncate"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {title || (
                <div className="flex justify-center items-center">
                  <Skeleton className="h-6 sm:h-8 w-3/5 bg-white/10 rounded" />
                </div>
              )}
            </motion.h1>
          </AnimatePresence>
          
          <div className="flex gap-2">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <Link to={`/dashboard/${profileId}`}>
                <Button 
                  className="bg-[#FFD54F] hover:bg-[#FFD54F]/90 text-[#2A1B5D] rounded-full shadow-[0_0_15px_rgba(255,213,79,0.4)] p-2 sm:p-3"
                  size="icon"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </motion.div>
            
            {!isMobile && (
              <motion.div
                initial={{ scale: 0, rotate: 20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.5 }}
              >
                <Button 
                  className="bg-[#00E2FF] hover:bg-[#00E2FF]/90 text-[#2A1B5D] rounded-full shadow-[0_0_15px_rgba(0,226,255,0.4)] p-2 sm:p-3"
                  size="icon"
                >
                  <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </motion.div>
            )}
          </div>
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
            className="flex items-center justify-center py-3 sm:py-4 mb-3 sm:mb-4 bg-[#3D2A7D]/50 rounded-lg border border-[#FF5BA3]/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <div className="flex space-x-2 mb-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FF5BA3]"
                    animate={{
                      y: [0, -8, 0],
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
              <p className="text-xs sm:text-sm text-white/80 font-inter">
                Analyzing your image with AI...
              </p>
            </div>
          </motion.div>
        )}
        
        <Card className="bg-[#2A1B5D]/60 border-white/5 p-2 sm:p-4 md:p-6 overflow-hidden rounded-xl backdrop-blur-sm shadow-lg">
          <ScrollArea ref={scrollAreaRef} className={isMobile ? "h-[calc(100vh-160px)]" : "h-[calc(100vh-230px)]"}>
            {isGeneratingContent && (
              <motion.div 
                className="flex items-center justify-center py-3 sm:py-4 mb-3 sm:mb-4 bg-[#3D2A7D]/50 rounded-lg border border-[#FF5BA3]/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center">
                  <div className="flex space-x-2 mb-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FF5BA3]"
                        animate={{
                          y: [0, -8, 0],
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
                  <p className="text-xs sm:text-sm text-white/80 font-inter">
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
              handleRabbitHoleClick={handleRabbitHoleClick}
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
