
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { useCurioBlocks } from '@/hooks/use-curio-blocks';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useSearch } from '@/hooks/use-search';
import { getBackgroundColor } from '@/components/BlockStyleUtils';
import CurioBlockList from '@/components/CurioBlockList';
import CurioBlockListLoading from '@/components/CurioBlockListLoading';
import CurioBlockListEmpty from '@/components/CurioBlockListEmpty';
import CurioBlockListError from '@/components/CurioBlockListError';
import CurioBlockListLoadMore from '@/components/CurioBlockListLoadMore';
import CurioBlockListNoMore from '@/components/CurioBlockListNoMore';
import CurioBlockListSearchEmpty from '@/components/CurioBlockListSearchEmpty';
import CurioBlockListSearchError from '@/components/CurioBlockListSearchError';
import CurioBlockListSearchLoading from '@/components/CurioBlockListSearchLoading';
import CurioBlockListSearchNoMore from '@/components/CurioBlockListSearchNoMore';
import CurioBlockListWelcome from '@/components/CurioBlockListWelcome';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import { Search, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurioData } from '@/hooks/useCurioData';

const CurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad, generationError } = useCurioBlocks(childId, curioId, searchQuery);
  const { loadingMore, loadTriggerRef } = useInfiniteScroll(loadMore, hasMore);
  const { 
    handleReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleActivityComplete,
    handleMindfulnessComplete,
    handleTaskComplete,
    loadingStates
  } = useBlockInteractions(childId);

  const [animateBlocks, setAnimateBlocks] = useState(true);
  const [curioTitle, setCurioTitle] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && !childId) {
      navigate('/profiles');
    }
  }, [user, childId, navigate]);

  useEffect(() => {
    // Fetch curio title
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
    if (blocks.length > 0) {
      setTimeout(() => {
        setAnimateBlocks(false);
      }, 1000);
    }
  }, [blocks]);

  if (profileError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/80">Failed to load profile.</p>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/80">Loading profile...</p>
      </div>
    );
  }

  const handleToggleLike = async (blockId: string) => {
    try {
      // Using edge function for handling likes instead of direct table access
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'like',
          blockId,
          childId
        }
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Could not like this wonder. Please try again later.");
    }
  };

  const handleToggleBookmark = async (blockId: string) => {
    try {
      // Using edge function for handling bookmarks instead of direct table access
      await supabase.functions.invoke('handle-interaction', {
        body: { 
          type: 'bookmark',
          blockId,
          childId
        }
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error("Could not bookmark this wonder. Please try again later.");
    }
  };

  const handleRabbitHoleClick = async (question: string) => {
    if (!childId) return;
    
    try {
      toast.loading("Creating new exploration...");
      
      // Create a new curio based on the rabbit hole question
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
        
        // Add a spark reward for following curiosity
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
        
        // Navigate to the new curio
        navigate(`/curio/${childId}/${newCurio.id}`);
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast.error("Could not create new exploration. Please try again later.");
    }
  };
  
  const handleBackToDashboard = () => {
    navigate(`/dashboard/${childId}`);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with title */}
      <motion.div 
        className="py-4 sm:py-6 px-4 sm:px-6 bg-wonderwhiz-deep-purple/60 border-b border-white/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToDashboard}
                className="mb-2 text-white/70 hover:text-white -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>Back to Dashboard</span>
              </Button>
              
              {curioTitle && (
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {curioTitle}
                </h1>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5 text-xs text-wonderwhiz-gold">
                <Sparkles className="w-3 h-3 mr-1" />
                <span>Use the search to find specific content</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-white/70 hover:text-white hover:bg-white/10"
                title="Refresh content"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search within this exploration..."
                  className="pl-9 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40 font-inter"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/90 text-wonderwhiz-deep-purple font-medium rounded-full">
                Search
              </Button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto relative">
        <div className="max-w-3xl mx-auto py-6 sm:py-8 px-2 sm:px-0">
          {/* Welcome Message */}
          {isFirstLoad && !searchQuery && !isLoadingBlocks && blocks.length === 0 && (
            <CurioBlockListWelcome childProfile={childProfile} />
          )}

          {/* Search Results */}
          {searchQuery && isLoadingBlocks && (
            <CurioBlockListSearchLoading />
          )}

          {searchQuery && blocksError && (
            <CurioBlockListSearchError />
          )}

          {searchQuery && blocks.length === 0 && !isLoadingBlocks && !blocksError && (
            <CurioBlockListSearchEmpty />
          )}

          {/* Content Blocks */}
          {!searchQuery && isLoadingBlocks && (
            <CurioBlockListLoading />
          )}

          {!searchQuery && blocksError && (
            <CurioBlockListError />
          )}

          {!searchQuery && blocks.length === 0 && !isLoadingBlocks && !blocksError && !isFirstLoad && (
            <CurioBlockListEmpty />
          )}

          {blocks.length > 0 || generationError ? (
            <CurioBlockList
              blocks={blocks}
              animateBlocks={animateBlocks}
              hasMoreBlocks={hasMore}
              loadingMoreBlocks={loadingMore}
              loadTriggerRef={loadTriggerRef}
              searchQuery={searchQuery}
              profileId={childId}
              isFirstLoad={isFirstLoad}
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
              generationError={generationError}
              onRefresh={handleRefresh}
            />
          ) : null}

          {/* Load More */}
          {blocks.length > 0 && searchQuery && !hasMore && blocks.length > 0 && (
            <CurioBlockListSearchNoMore />
          )}

          {blocks.length > 0 && !searchQuery && !hasMore && blocks.length > 0 && (
            <CurioBlockListNoMore />
          )}

          {hasMore && blocks.length > 0 && (
            <CurioBlockListLoadMore loadTriggerRef={loadTriggerRef} loadingMore={loadingMore} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CurioPage;
