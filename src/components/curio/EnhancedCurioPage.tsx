
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { useCurioBlocks } from '@/hooks/use-curio-blocks';
import { useSearch } from '@/hooks/use-search';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import CurioPageHeader from '@/components/curio/CurioPageHeader';
import EnhancedCurioContent from '@/components/curio/EnhancedCurioContent';
import CurioLoadingState from '@/components/curio/CurioLoadingState';
import CurioErrorState from '@/components/curio/CurioErrorState';

const EnhancedCurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad, generationError, setBlocks } = useCurioBlocks(childId, curioId, searchQuery);
  const { playText, isLoading: isVoiceLoading, stopPlaying } = useElevenLabsVoice();
  
  const { 
    handleToggleLike,
    handleToggleBookmark,
    handleReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleActivityComplete,
    handleMindfulnessComplete,
    handleTaskComplete
  } = useBlockInteractions(childId);

  const [animateBlocks, setAnimateBlocks] = useState(true);
  const [curioTitle, setCurioTitle] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [explorationDepth, setExplorationDepth] = useState(0);
  const [explorationPath, setExplorationPath] = useState<string[]>([]);
  const [childAge, setChildAge] = useState(10);
  const [isCreatingRabbitHole, setIsCreatingRabbitHole] = useState(false);
  
  const loadTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && !childId) {
      navigate('/profiles');
    }
  }, [user, childId, navigate]);

  useEffect(() => {
    if (childProfile?.age) {
      const age = typeof childProfile.age === 'string' 
        ? parseInt(childProfile.age, 10) 
        : childProfile.age;
      setChildAge(age);
    }
  }, [childProfile]);

  useEffect(() => {
    if (curioId) {
      supabase
        .from('curios')
        .select('title, query')
        .eq('id', curioId)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setCurioTitle(data.title);
            setExplorationPath([data.title]);
            setExplorationDepth(1);
            
            // If no blocks are loaded after a reasonable time, attempt to generate content
            if (blocks.length === 0 && !isLoadingBlocks) {
              // This is a placeholder for content generation logic
              console.log("No blocks found for this curio");
              
              // For very young children, show a friendly message
              if (childAge < 8) {
                toast.info("I'm creating something special for you! Please wait...", {
                  duration: 4000
                });
              }
            }
          }
        });
    }
  }, [curioId, blocks.length, isLoadingBlocks, childAge]);

  useEffect(() => {
    if (blocks.length > 0 && isFirstLoad) {
      setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 1000,
          colors: ['#8b5cf6', '#d946ef', '#3b82f6']
        });
      }, 800);
    }
  }, [blocks.length, isFirstLoad]);

  useEffect(() => {
    if (blocks.length > 0) {
      setTimeout(() => {
        setAnimateBlocks(false);
      }, 1000);
    }
  }, [blocks]);

  // Add this debugging useEffect to log when blocks change
  useEffect(() => {
    console.log("Current blocks:", blocks);
  }, [blocks]);

  if (profileError) {
    return <CurioErrorState message="Failed to load profile." />;
  }

  if (isLoadingProfile) {
    return <CurioLoadingState message="Loading profile..." />;
  }
  
  const handleBackToDashboard = () => {
    navigate(`/dashboard/${childId}`);
  };
  
  const handleToggleInsights = () => {
    setShowInsights(!showInsights);
  };
  
  const handleRabbitHoleClick = async (question: string) => {
    if (!childId || isCreatingRabbitHole) return;
    
    try {
      setIsCreatingRabbitHole(true);
      toast.loading("Creating new exploration...", {
        id: "rabbit-hole-creation"
      });
      
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: childId,
          title: question,
          query: question,
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      if (newCurio) {
        toast.success("New exploration created!", {
          id: "rabbit-hole-creation"
        });
        
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: childId,
              amount: 2
            })
          });
          
          setExplorationPath(prev => [...prev, question]);
          setExplorationDepth(prev => prev + 1);
          
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          // Navigate after a brief delay to allow toast to be seen
          setTimeout(() => {
            navigate(`/curio/${childId}/${newCurio.id}`);
          }, 500);
        } catch (err) {
          console.error('Error awarding sparks:', err);
        }
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast.error("Could not create new exploration. Let's try again!", {
        id: "rabbit-hole-creation"
      });
    } finally {
      setIsCreatingRabbitHole(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript) {
      handleRabbitHoleClick(transcript);
    }
  };

  const handlePlayContent = (text: string, specialistId: string) => {
    if (text && playText) {
      playText(text, specialistId);
      
      if (childAge < 8) {
        toast.success("Reading to you!");
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  const handleProcessReply = (blockId: string, message: string) => {
    if (!blockId || !message) return;
    
    toast.loading("Sending your reply...");
    
    handleReply(blockId, message)
      .then((success) => {
        if (success) {
          toast.success("Reply sent successfully!");
        }
      })
      .catch((err) => {
        console.error("Error processing reply:", err);
        toast.error("Failed to send reply. Please try again.");
      });
  };

  // Special case for empty curio with no blocks
  if (!isLoadingBlocks && blocks.length === 0 && curioTitle) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
        <CurioPageHeader
          curioTitle={curioTitle}
          handleBackToDashboard={handleBackToDashboard}
          handleToggleInsights={handleToggleInsights}
          handleRefresh={handleRefresh}
          refreshing={refreshing}
          showInsights={showInsights}
          childName={childProfile?.name}
        />
        
        <div className="flex-grow flex flex-col items-center justify-center px-4 py-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">
              {childAge < 8 ? "Making magic for you!" : "Creating your exploration..."}
            </h2>
            
            <p className="text-white/80 mb-6">
              {childAge < 8 
                ? "I'm working on something amazing! Let's wait just a moment." 
                : "We're preparing your content. This shouldn't take long."}
            </p>
            
            <div className="w-full max-w-xs mx-auto bg-white/10 rounded-full h-3 mb-8">
              <div className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple h-3 rounded-full animate-pulse"></div>
            </div>
            
            <button
              onClick={handleBackToDashboard}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white font-semibold"
            >
              Go back to dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
      <CurioPageHeader
        curioTitle={curioTitle}
        handleBackToDashboard={handleBackToDashboard}
        handleToggleInsights={handleToggleInsights}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        showInsights={showInsights}
        childName={childProfile?.name}
      />
      
      {isLoadingBlocks && blocks.length === 0 ? (
        <CurioLoadingState message={childAge < 8 ? "Creating something amazing for you!" : "Loading content..."} />
      ) : blocksError ? (
        <CurioErrorState message="Failed to load content." onRetry={handleRefresh} />
      ) : blocks.length === 0 ? (
        <CurioErrorState message="No content blocks found. Try refreshing or creating a new exploration." onRetry={handleRefresh} />
      ) : (
        <EnhancedCurioContent
          title={curioTitle || "Exploring Knowledge"}
          blocks={blocks}
          onSearch={(query) => {
            setSearchQuery(query);
            handleSearch({ preventDefault: () => {} } as React.FormEvent);
          }}
          onVoiceCapture={handleVoiceInput}
          onImageCapture={(file) => {
            toast.success("Image received! Analyzing...");
            // Implement image analysis logic here
          }}
          onLike={handleToggleLike}
          onBookmark={handleToggleBookmark}
          onReply={handleProcessReply}
          onReadAloud={handlePlayContent}
          onExplore={() => toast.info("Explore feature coming soon!")}
          onRabbitHoleClick={handleRabbitHoleClick}
          childAge={childAge}
          childId={childId}
        />
      )}
    </div>
  );
};

export default EnhancedCurioPage;
