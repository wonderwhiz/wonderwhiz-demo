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
import CurioBlockList from '@/components/CurioBlockList';
import CurioPageSearch from '@/components/curio/CurioPageSearch';
import CurioLoadingState from '@/components/curio/CurioLoadingState';
import CurioErrorState from '@/components/curio/CurioErrorState';
import RabbitHoleSuggestions from '@/components/curio/RabbitHoleSuggestions';
import InteractiveImageBlock from '@/components/content-blocks/InteractiveImageBlock';
import TalkToWhizzy from '@/components/curio/TalkToWhizzy';
import QuickAnswer from '@/components/curio/QuickAnswer';
import LearningProgress from '@/components/curio/LearningProgress';
import ExplorationPath from '@/components/curio/ExplorationPath';
import ConnectionsVisualizer from '@/components/curio/ConnectionsVisualizer';
import AgeAdaptiveInterface from '@/components/curio/AgeAdaptiveInterface';
import EnhancedVoiceInput from '@/components/curio/EnhancedVoiceInput';
import EnhancedSearchBar from '@/components/curio/EnhancedSearchBar';
import EnhancedCurioContent from '@/components/curio/EnhancedCurioContent';

const EnhancedCurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad, generationError, triggerContentGeneration } = useCurioBlocks(childId, curioId, searchQuery);
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
  const [showPersonalizedMessage, setShowPersonalizedMessage] = useState(false);
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [specialistIds, setSpecialistIds] = useState<string[]>([]);
  const [showRabbitHoleSuggestions, setShowRabbitHoleSuggestions] = useState(false);
  const [quickAnswerExpanded, setQuickAnswerExpanded] = useState(false);
  const [explorationDepth, setExplorationDepth] = useState(0);
  const [explorationPath, setExplorationPath] = useState<string[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [earnedSparks, setEarnedSparks] = useState(0);
  const [childAge, setChildAge] = useState(10);
  const [relatedConnections, setRelatedConnections] = useState<{title: string, description: string, type: 'related' | 'deeper' | 'broader'}[]>([]);
  
  const loadTriggerRef = useRef<HTMLDivElement>(null);
  const contentGenerationAttempted = useRef<boolean>(false);

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
  
  // Trigger content generation if we've got empty or only placeholder blocks
  useEffect(() => {
    if (curioId && childId && blocks.length === 0 && !isLoadingBlocks && !contentGenerationAttempted.current) {
      contentGenerationAttempted.current = true;
      console.log("Triggering content generation for empty curio");
      if (triggerContentGeneration) {
        triggerContentGeneration();
      }
    }
    
    // Check if we only have placeholder blocks
    const onlyPlaceholders = blocks.length > 0 && blocks.every(block => block.id.startsWith('placeholder-'));
    if (onlyPlaceholders && !isLoadingBlocks && !contentGenerationAttempted.current) {
      contentGenerationAttempted.current = true;
      console.log("Triggering content generation for placeholder blocks");
      if (triggerContentGeneration) {
        triggerContentGeneration();
      }
    }
  }, [blocks, curioId, childId, isLoadingBlocks, triggerContentGeneration]);
  
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
      
      setEarnedSparks(prev => prev + 2);
      toast.success("You earned 2 sparks for your curiosity!", {
        icon: "✨"
      });
      
      generateRelatedConnections();
    }
  }, [blocks.length, isFirstLoad]);
  
  const generateRelatedConnections = () => {
    if (!curioTitle) return;
    
    const title = curioTitle.toLowerCase();
    
    const connections = [
      {
        title: `Why is ${title} important?`,
        description: `Discover the significance and real-world impact of ${title}.`,
        type: 'deeper' as 'deeper'
      },
      {
        title: `How does ${title} work?`,
        description: `Explore the fascinating mechanics and processes behind ${title}.`,
        type: 'deeper' as 'deeper'
      },
      {
        title: `${title} in history`,
        description: `Journey through time to see how ${title} has evolved and changed.`,
        type: 'broader' as 'broader'
      },
      {
        title: `Fun facts about ${title}`,
        description: `Discover surprising and interesting tidbits about ${title}.`,
        type: 'related' as 'related'
      }
    ];
    
    setRelatedConnections(connections);
  };

  useEffect(() => {
    if (blocks.length > 0) {
      setTimeout(() => {
        setAnimateBlocks(false);
      }, 1000);
      
      const specialists = blocks.map(block => block.specialist_id);
      const uniqueSpecialists = Array.from(new Set(specialists));
      setSpecialistIds(uniqueSpecialists);
    }
  }, [blocks]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition + windowHeight > documentHeight * 0.75) {
        if (blocks.length > 0) {
          setShowRabbitHoleSuggestions(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blocks.length]);

  // Add this new function to handle manual refresh/regeneration
  const handleRefreshContent = async () => {
    if (!triggerContentGeneration) return;
    
    setRefreshing(true);
    contentGenerationAttempted.current = false;
    
    try {
      await supabase
        .from('content_blocks')
        .delete()
        .eq('curio_id', curioId);
        
      // Reset blocks array to show placeholders again
      setBlocks([]);
      setTimeout(() => {
        triggerContentGeneration();
      }, 1000);
    } catch (error) {
      console.error("Error refreshing content:", error);
      toast.error("Failed to refresh content");
    } finally {
      setRefreshing(false);
    }
  };

  if (profileError) {
    return <CurioErrorState message="Failed to load profile." />;
  }

  if (isLoadingProfile) {
    return <CurioLoadingState message="Loading profile..." />;
  }

  const handleNavigateToIndex = (index: number) => {
    toast.info(`Navigation to exploration step ${index+1}`);
  };
  
  const handleBackToDashboard = () => {
    navigate(`/dashboard/${childId}`);
  };
  
  const handleStartJourney = () => {
    setQuickAnswerExpanded(false);
    window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' });
  };
  
  const handleRabbitHoleClick = async (question: string) => {
    if (!childId) return;
    
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
          
          setExplorationPath(prev => [...prev, question]);
          setExplorationDepth(prev => prev + 1);
          
          setEarnedSparks(prev => prev + 2);
          
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          navigate(`/curio/${childId}/${newCurio.id}`);
        } catch (err) {
          console.error('Error awarding sparks:', err);
        }
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast.error("Could not create new exploration. Please try again later.");
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript) {
      setIsVoiceActive(false);
      handleRabbitHoleClick(transcript);
    }
  };
  
  const handleExplorationNavigate = (index: number) => {
    toast.info("Path navigation coming soon!");
  };

  const handlePlayContent = (text: string) => {
    if (text && playText) {
      playText(text, 'whizzy');
      
      if (childAge < 8) {
        toast.success("Reading to you!");
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  return (
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
      onBookmark={handleToggleBookmark}
      onReply={handleReply}
      onReadAloud={(text, specialistId) => {
        if (playText) {
          playText(text, specialistId);
        }
      }}
      onExplore={() => toast.info("Explore feature coming soon!")}
      onRabbitHoleClick={handleRabbitHoleClick}
      childAge={childAge}
      isLoading={isLoadingBlocks}
      onRefresh={handleRefreshContent}
      refreshing={refreshing}
      generationError={generationError}
    />
  );
};

export default EnhancedCurioPage;
