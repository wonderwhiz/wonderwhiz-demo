import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { useCurioBlocks } from '@/hooks/use-curio-blocks';
import { useSearch } from '@/hooks/use-search';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { useDynamicContentGeneration } from '@/hooks/use-dynamic-content-generation';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import QuickAnswer from '@/components/curio/QuickAnswer';
import CosmicFlow from '@/components/curio/CosmicFlow';
import SimplifiedContentBlock from '@/components/curio/SimplifiedContentBlock';
import CurioSearchBar from '@/components/curio/CurioSearchBar';
import CurioLoadingState from '@/components/curio/CurioLoadingState';
import CurioErrorState from '@/components/curio/CurioErrorState';
import ViewModeSwitcher from '@/components/curio/ViewModeSwitcher';
import RabbitHoleSuggestions from '@/components/content-blocks/RabbitHoleSuggestions';
import InteractiveImageBlock from '@/components/content-blocks/InteractiveImageBlock';
import TalkToWhizzy from '@/components/curio/TalkToWhizzy';
import { ContentBlockSkeleton } from '@/components/content-blocks/ContentBlockSkeleton';

const SimplifiedCurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad } = useCurioBlocks(childId, curioId, searchQuery);
  const { generateContent, isGenerating } = useDynamicContentGeneration();
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

  const [curioTitle, setCurioTitle] = useState<string | null>(null);
  const [quickAnswerExpanded, setQuickAnswerExpanded] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [ageGroup, setAgeGroup] = useState<'5-7' | '8-11' | '12-16'>('8-11');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [visibleBlocks, setVisibleBlocks] = useState<any[]>([]);
  const [processedBlocks, setProcessedBlocks] = useState<any[]>([]);
  const [showRabbitHoleSuggestions, setShowRabbitHoleSuggestions] = useState(false);
  const [specialistIds, setSpecialistIds] = useState<string[]>([]);
  const [isEnhancingContent, setIsEnhancingContent] = useState(false);
  
  const lastBlockRef = useRef<HTMLDivElement>(null);
  const hasAddedPlaceholders = useRef(false);

  useEffect(() => {
    if (user && !childId) {
      navigate('/profiles');
    }
  }, [user, childId, navigate]);

  useEffect(() => {
    if ('startViewTransition' in document) {
      document.documentElement.classList.add('view-transitions-enabled');
    }
  }, []);

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
            
            if (blocks.length === 0 && !isLoadingBlocks && childProfile && !hasAddedPlaceholders.current) {
              hasAddedPlaceholders.current = true;
              
              const childAge = typeof childProfile.age === 'string' 
                ? parseInt(childProfile.age, 10) 
                : childProfile.age || 10;
                
              setIsEnhancingContent(true);
              
              const placeholderBlocks = [
                {
                  id: `placeholder-${Date.now()}-1`,
                  curio_id: curioId,
                  specialist_id: 'nova',
                  type: 'fact',
                  content: { 
                    fact: "I'm discovering fascinating information about this topic...",
                    rabbitHoles: []
                  },
                  liked: false,
                  bookmarked: false,
                  created_at: new Date().toISOString()
                },
                {
                  id: `placeholder-${Date.now()}-2`,
                  curio_id: curioId,
                  specialist_id: 'spark',
                  type: 'funFact',
                  content: {
                    text: "Did you know? I'm finding interesting facts about this topic..."
                  },
                  liked: false,
                  bookmarked: false,
                  created_at: new Date().toISOString()
                },
                {
                  id: `placeholder-${Date.now()}-3`,
                  curio_id: curioId,
                  specialist_id: 'prism',
                  type: 'quiz',
                  content: {
                    question: "I'm creating an engaging quiz about this topic...",
                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    correctIndex: 0
                  },
                  liked: false,
                  bookmarked: false,
                  created_at: new Date().toISOString()
                }
              ];
              
              setProcessedBlocks(placeholderBlocks);
              
              generateContent({
                query: data.query || data.title,
                childAge: childAge,
                blockCount: 6,
                specialistTypes: ['nova', 'spark', 'prism', 'pixel', 'atlas', 'lotus']
              }).then(generatedBlocks => {
                if (generatedBlocks.length > 0) {
                  const blocksWithIds = generatedBlocks.map((block, index) => ({
                    ...block,
                    id: `generated-${Date.now()}-${index}`,
                    curio_id: curioId,
                    created_at: new Date().toISOString(),
                    liked: false,
                    bookmarked: false
                  }));
                  
                  setProcessedBlocks(blocksWithIds);
                  
                  blocksWithIds.forEach(async (block) => {
                    try {
                      await supabase
                        .from('content_blocks')
                        .insert({
                          curio_id: curioId,
                          specialist_id: block.specialist_id,
                          type: block.type,
                          content: block.content
                        });
                    } catch (err) {
                      console.error('Error saving generated block:', err);
                    }
                  });
                  
                  const specialists = blocksWithIds.map(block => block.specialist_id);
                  const uniqueSpecialists = Array.from(new Set(specialists));
                  setSpecialistIds(uniqueSpecialists);
                }
                
                setIsEnhancingContent(false);
              }).catch(error => {
                console.error('Error generating content:', error);
                setIsEnhancingContent(false);
              });
            }
          }
        });
    }
  }, [curioId, blocks.length, isLoadingBlocks, childProfile, generateContent]);

  useEffect(() => {
    if (childProfile?.age) {
      const age = typeof childProfile.age === 'string' 
        ? parseInt(childProfile.age, 10) 
        : childProfile.age;
        
      if (age >= 5 && age <= 7) {
        setAgeGroup('5-7');
      } else if (age >= 8 && age <= 11) {
        setAgeGroup('8-11');
      } else {
        setAgeGroup('12-16');
      }
    }
  }, [childProfile]);

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
    const blocksToProcess = blocks.length > 0 ? blocks : processedBlocks;
    
    if (!searchQuery) {
      setVisibleBlocks(blocksToProcess);
    } else {
      setVisibleBlocks(blocksToProcess.filter(block => {
        const content = block.content;
        if (!content) return false;
        
        const searchIn = [
          content.fact,
          content.text,
          content.question,
          content.title,
          content.prompt,
          content.description,
          content.instruction,
          content.front,
          content.back,
          content.headline,
          content.body
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchIn.includes(searchQuery.toLowerCase());
      }));
    }
    
    if (blocks.length > 0) {
      const specialists = blocks.map(block => block.specialist_id);
      const uniqueSpecialists = Array.from(new Set(specialists));
      setSpecialistIds(uniqueSpecialists);
    }
  }, [blocks, processedBlocks, searchQuery]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );
    
    if (lastBlockRef.current) {
      observer.observe(lastBlockRef.current);
    }
    
    return () => {
      if (lastBlockRef.current) {
        observer.unobserve(lastBlockRef.current);
      }
    };
  }, [hasMore, loadMore]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition + windowHeight > documentHeight * 0.8) {
        setShowRabbitHoleSuggestions(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (profileError) {
    return <CurioErrorState message="Failed to load profile." />;
  }

  if (isLoadingProfile) {
    return <CurioLoadingState message="Loading profile..." />;
  }

  const handleNavigateToIndex = (index: number) => {
    setCurrentBlockIndex(index);
    const blockElement = document.getElementById(`block-${index}`);
    if (blockElement) {
      blockElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const handleBackToDashboard = () => {
    navigate(`/dashboard/${childId}`);
  };
  
  const handleStartJourney = () => {
    setJourneyStarted(true);
    setQuickAnswerExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          
          await supabase.from('sparks_transactions').insert({
            child_id: childId,
            amount: 2,
            reason: 'Following curiosity'
          });
          
          toast.success('You earned 2 sparks for exploring your curiosity!', {
            icon: '✨',
            position: 'bottom-right',
            duration: 3000
          });
        } catch (err) {
          console.error('Error awarding sparks:', err);
        }
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        navigate(`/curio/${childId}/${newCurio.id}`);
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast.error("Could not create new exploration. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-b from-indigo-950 to-indigo-900">
      <motion.main 
        className="flex-1 flex flex-col min-h-screen relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.header 
          className="py-4 sm:py-6 px-4 sm:px-6 bg-black/20 backdrop-blur-sm sticky top-0 z-40"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="max-w-4xl mx-auto">
            <ViewModeSwitcher currentMode="simplified" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                {curioTitle && (
                  <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {curioTitle}
                  </h1>
                )}
              </div>
            </div>
            
            <div className="mt-3">
              <CurioSearchBar
                placeholder="Search within this exploration..."
                onSearch={(query) => handleSearch({ preventDefault: () => {} } as React.FormEvent)}
                onClear={() => setSearchQuery('')}
              />
            </div>
          </div>
        </motion.header>

        <main className="flex-grow">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
            {curioTitle && !isLoadingBlocks && !searchQuery && (
              <QuickAnswer 
                question={curioTitle}
                onStartJourney={handleStartJourney}
                childId={childId}
              />
            )}
            
            {curioTitle && !isLoadingBlocks && !searchQuery && (
              <InteractiveImageBlock
                topic={curioTitle}
                childId={childId}
                childAge={childProfile?.age ? Number(childProfile.age) : 10}
                onShare={() => {
                  toast.success('Image shared with your learning journey!');
                }}
              />
            )}
            
            {(isLoadingBlocks || isEnhancingContent) && (
              <div className="max-w-3xl mx-auto px-4 space-y-4 w-full">
                {[1, 2, 3].map((i) => (
                  <ContentBlockSkeleton key={i} />
                ))}
              </div>
            )}
            
            {blocksError && (
              <CurioErrorState message="Failed to load content." />
            )}
            
            {searchQuery && visibleBlocks.length === 0 && !isLoadingBlocks && (
              <div className="text-center py-10">
                <p className="text-white/70">No results found for "{searchQuery}"</p>
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery('')}
                  className="text-white/60 hover:text-white mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
            
            {journeyStarted && visibleBlocks.length > 0 && !searchQuery && (
              <CosmicFlow
                blocks={visibleBlocks}
                currentBlockIndex={currentBlockIndex}
                onNavigate={handleNavigateToIndex}
                ageGroup={ageGroup}
              />
            )}
            
            <div className="space-y-6 mt-6">
              {visibleBlocks.map((block, index) => (
                <div key={block.id} id={`block-${index}`}>
                  <SimplifiedContentBlock
                    block={block}
                    ageGroup={ageGroup}
                    onLike={() => handleToggleLike(block.id)}
                    onBookmark={() => handleToggleBookmark(block.id)}
                    onReply={(message) => handleReply(block.id, message)}
                    onShare={() => {
                      toast.success('Content shared!');
                    }}
                  />
                </div>
              ))}
              
              {hasMore && (
                <div ref={lastBlockRef} className="h-12 flex items-center justify-center">
                  <div className="animate-pulse text-white/30 text-sm">Loading more...</div>
                </div>
              )}
            </div>
            
            {showRabbitHoleSuggestions && visibleBlocks.length > 0 && !searchQuery && (
              <RabbitHoleSuggestions
                curioTitle={curioTitle || ''}
                profileId={childId}
                onSuggestionClick={handleRabbitHoleClick}
                specialistIds={specialistIds}
              />
            )}
          </div>
        </main>

        <TalkToWhizzy 
          childId={childId}
          curioTitle={curioTitle || undefined}
          ageGroup={ageGroup}
          onNewQuestionGenerated={handleRabbitHoleClick}
        />
      </motion.main>
    </div>
  );
};

export default SimplifiedCurioPage;
