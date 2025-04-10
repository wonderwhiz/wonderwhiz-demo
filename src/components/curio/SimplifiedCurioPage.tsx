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

const SimplifiedCurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad } = useCurioBlocks(childId, curioId, searchQuery);
  const { 
    handleReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleToggleLike,
    handleToggleBookmark
  } = useBlockInteractions(childId);

  const [curioTitle, setCurioTitle] = useState<string | null>(null);
  const [quickAnswerExpanded, setQuickAnswerExpanded] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [ageGroup, setAgeGroup] = useState<'5-7' | '8-11' | '12-16'>('8-11');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [visibleBlocks, setVisibleBlocks] = useState<any[]>([]);
  
  const lastBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && !childId) {
      navigate('/profiles');
    }
  }, [user, childId, navigate]);

  useEffect(() => {
    if (curioId) {
      supabase
        .from('curios')
        .select('title')
        .eq('id', curioId)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setCurioTitle(data.title);
          }
        });
    }
  }, [curioId]);

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
    if (!searchQuery) {
      setVisibleBlocks(blocks);
    } else {
      setVisibleBlocks(blocks.filter(block => {
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
  }, [blocks, searchQuery]);
  
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-900">
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
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              placeholder="Search within this exploration..."
            />
          </div>
        </div>
      </motion.header>

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
          {curioTitle && !isLoadingBlocks && !searchQuery && (
            <QuickAnswer 
              question={curioTitle}
              isExpanded={quickAnswerExpanded}
              onToggleExpand={() => setQuickAnswerExpanded(!quickAnswerExpanded)}
              onStartJourney={handleStartJourney}
              childId={childId}
            />
          )}
          
          {isLoadingBlocks && (
            <CurioLoadingState />
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
                />
              </div>
            ))}
            
            {hasMore && (
              <div ref={lastBlockRef} className="h-12 flex items-center justify-center">
                <div className="animate-pulse text-white/30 text-sm">Loading more...</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimplifiedCurioPage;
