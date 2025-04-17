
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
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Navbar from '@/components/Navbar';
import CurioPageHeader from '@/components/curio/CurioPageHeader';
import EnhancedCurioContent from '@/components/curio/EnhancedCurioContent';
import CurioLoadingState from '@/components/curio/CurioLoadingState';
import CurioErrorState from '@/components/curio/CurioErrorState';
import { useIsMobile } from '@/hooks/use-mobile';
import TalkToWhizzy from '@/components/curio/TalkToWhizzy';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const EnhancedCurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad, generationError } = useCurioBlocks(childId, curioId, searchQuery);
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
  const [manualRefreshAttempted, setManualRefreshAttempted] = useState(false);
  const [contentGenerationFailed, setContentGenerationFailed] = useState(false);
  const [isLoadingPlaceholder, setIsLoadingPlaceholder] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  
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
          }
        });
    }
  }, [curioId]);

  // Clear any "Generating content" toast when component unmounts or curioId changes
  useEffect(() => {
    return () => {
      toast.dismiss();
      setToastShown(false);
    };
  }, [curioId]);
  
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

  useEffect(() => {
    console.log("Current blocks:", blocks);

    // If we're actively loading content, dismiss any lingering "generating content" toasts
    if (!isLoadingBlocks && !isLoadingPlaceholder && blocks.length > 0) {
      toast.dismiss();
      setToastShown(false);
    }

    // If no blocks found and we've done a manual refresh, trigger content generation
    if (blocks.length === 0 && manualRefreshAttempted && curioId && childId && !contentGenerationFailed && !isLoadingPlaceholder) {
      const triggerGeneration = async () => {
        try {
          if (!toastShown) {
            toast.loading("Generating content...");
            setToastShown(true);
          }
          
          setIsLoadingPlaceholder(true);
          setContentGenerationFailed(false);
          
          // Get the curio details
          const { data: curioData } = await supabase
            .from('curios')
            .select('*')
            .eq('id', curioId)
            .single();
          
          if (!curioData) {
            toast.error("Failed to find exploration details.");
            setIsLoadingPlaceholder(false);
            return;
          }
          
          // Directly insert a placeholder block to show immediately
          const placeholderId = crypto.randomUUID();
          await supabase.from('content_blocks').insert({
            id: placeholderId,
            curio_id: curioId,
            specialist_id: 'nova',
            type: 'fact',
            content: { 
              fact: `We're exploring "${curioData.title || curioData.query}" for you! Gathering fascinating information...`,
              rabbitHoles: []
            }
          });
          
          // Call the edge function to generate content
          const { data: response, error: fnError } = await supabase.functions.invoke('generate-curiosity-blocks', {
            body: {
              query: curioData.query || curioData.title,
              childProfile: {
                age: childProfile?.age || 10,
                interests: childProfile?.interests || ['science', 'animals', 'space']
              },
              curioId: curioId,
              blockCount: 5
            }
          });
          
          if (fnError) {
            console.error('Error generating content:', fnError);
            toast.error("Failed to generate content. Please try again.");
            setContentGenerationFailed(true);
            setIsLoadingPlaceholder(false);
            return;
          }
          
          if (response && Array.isArray(response) && response.length > 0) {
            toast.success("Content generated successfully!");
            
            // Save blocks to database
            const insertPromises = response.map(blockData => 
              supabase.from('content_blocks').insert({
                curio_id: curioId,
                specialist_id: blockData.specialist_id || 'nova',
                type: blockData.type || 'fact',
                content: blockData.content
              })
            );
            
            await Promise.all(insertPromises);
            
            // Wait a bit then reload the page
            setTimeout(() => {
              setToastShown(false);
              window.location.reload();
            }, 1500);
          } else {
            toast.error("No content was generated. Please try again.");
            setContentGenerationFailed(true);
            setIsLoadingPlaceholder(false);
          }
          
        } catch (err) {
          console.error('Error in content generation:', err);
          toast.error("Failed to generate content. Please try again.");
          setContentGenerationFailed(true);
          setIsLoadingPlaceholder(false);
        }
      };
      
      triggerGeneration();
    }
  }, [blocks, manualRefreshAttempted, curioId, childId, childProfile, contentGenerationFailed, isLoadingPlaceholder, isLoadingBlocks, toastShown]);

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
    if (!childId) return;
    
    if (!question.trim()) {
      toast.error("Please enter a question first");
      return;
    }
    
    try {
      toast.loading("Creating new exploration...");
      
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
        toast.success("New exploration created!");
        
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: childId,
              amount: 2
            })
          });
          
          // Directly insert a placeholder block to show immediately
          const placeholderId = crypto.randomUUID();
          await supabase.from('content_blocks').insert({
            id: placeholderId,
            curio_id: newCurio.id,
            specialist_id: 'nova',
            type: 'fact',
            content: { 
              fact: `We're exploring "${question}" for you! Gathering fascinating information...`,
              rabbitHoles: []
            }
          });
          
          setExplorationPath(prev => [...prev, question]);
          setExplorationDepth(prev => prev + 1);
          
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          navigate(`/curio/${childId}/${newCurio.id}`);
        } catch (err) {
          console.error('Error awarding sparks:', err);
          // Still navigate if sparks fail
          navigate(`/curio/${childId}/${newCurio.id}`);
        }
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast.error("Could not create new exploration. Please try again later.");
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
    setManualRefreshAttempted(true);
    setContentGenerationFailed(false);
    
    // Dismiss any existing toasts before showing new ones
    toast.dismiss();
    setToastShown(false);
    
    // If we have no blocks, force regeneration
    if (blocks.length === 0) {
      // This will trigger the useEffect to generate content
    } else {
      // Otherwise just reload the page
      window.location.reload();
    }
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

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-lg border border-white/10 text-center max-w-3xl mx-auto">
      <div className="mb-6 bg-indigo-900/30 p-6 rounded-full">
        <RefreshCw className={`h-12 w-12 text-indigo-400 ${isLoadingPlaceholder ? 'animate-spin' : ''}`} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {curioTitle ? `Exploring "${curioTitle}"` : "Starting your exploration"}
      </h2>
      <p className="text-white/70 mb-6 max-w-md">
        We're creating amazing content for your curiosity! This might take a moment...
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          className="border-white/20 hover:bg-white/10 text-white"
          onClick={handleBackToDashboard}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <Button 
          onClick={handleRefresh}
          disabled={refreshing || contentGenerationFailed || isLoadingPlaceholder}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing || isLoadingPlaceholder ? 'animate-spin' : ''}`} />
          {refreshing || isLoadingPlaceholder ? "Generating Content..." : "Generate Content"}
        </Button>
      </div>
      
      {contentGenerationFailed && (
        <div className="mt-6 p-4 bg-red-500/20 rounded-lg text-white">
          <p>We're having trouble generating content right now. Please try again later or explore a different topic.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
      <Navbar 
        profileId={childId} 
        showBackButton={true} 
        onBackClick={handleBackToDashboard} 
        pageTitle={curioTitle || "Exploring Knowledge"}
      />
      
      <CurioPageHeader
        curioTitle={curioTitle}
        handleBackToDashboard={handleBackToDashboard}
        handleToggleInsights={handleToggleInsights}
        handleRefresh={handleRefresh}
        refreshing={refreshing || isLoadingPlaceholder}
        showInsights={showInsights}
        childName={childProfile?.name}
      />
      
      {(isLoadingBlocks && blocks.length === 0) || isLoadingPlaceholder ? (
        <CurioLoadingState message="Loading content..." />
      ) : blocksError ? (
        <CurioErrorState message="Failed to load content." onRetry={handleRefresh} />
      ) : blocks.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className={`container mx-auto ${isMobile ? 'px-2' : 'px-4'}`}>
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
        </div>
      )}
      
      <TalkToWhizzy 
        childId={childId}
        curioTitle={curioTitle || undefined}
        ageGroup={childAge < 8 ? '5-7' : childAge < 12 ? '8-11' : '12-16'}
        onNewQuestionGenerated={handleRabbitHoleClick}
      />
    </div>
  );
};

export default EnhancedCurioPage;
