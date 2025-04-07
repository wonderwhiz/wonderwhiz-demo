import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, BookOpen, Rocket, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { useToast } from '@/components/ui/use-toast';

const CurioPage: React.FC = () => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile, error: profileError } = useChildProfile(childId);
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const { blocks, isLoading: isLoadingBlocks, error: blocksError, hasMore, loadMore, isFirstLoad } = useCurioBlocks(childId, curioId, searchQuery);
  const { loadingMore, loadTriggerRef } = useInfiniteScroll(loadMore, hasMore);

  const [animateBlocks, setAnimateBlocks] = useState(true);

  useEffect(() => {
    if (user && !childId) {
      navigate('/profiles');
    }
  }, [user, childId, navigate]);

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
      const { error } = await supabase
        .from('likes')
        .upsert({
          block_id: blockId,
          child_id: childId,
        }, {
          onConflict: 'block_id, child_id',
          ignoreDuplicates: false,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Could not like this wonder",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleToggleBookmark = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .upsert({
          block_id: blockId,
          child_id: childId,
        }, {
          onConflict: 'block_id, child_id',
          ignoreDuplicates: false,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Could not bookmark this wonder",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (blockId: string, message: string) => {
    try {
      const { error } = await supabase
        .from('replies')
        .insert({
          block_id: blockId,
          child_id: childId,
          message: message,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Could not submit your reply",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleQuizCorrect = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          block_id: blockId,
          child_id: childId,
          correct: true,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      toast({
        title: "Could not submit your quiz result",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleNewsRead = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('news_reads')
        .insert({
          block_id: blockId,
          child_id: childId,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting news read:', error);
      toast({
        title: "Could not submit your news read",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleCreativeUpload = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('creative_uploads')
        .insert({
          block_id: blockId,
          child_id: childId,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting creative upload:', error);
      toast({
        title: "Could not submit your creative upload",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleTaskComplete = async () => {
    try {
      const { error } = await supabase
        .from('tasks_completed')
        .insert({
          curio_id: curioId,
          child_id: childId,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting task completion:', error);
      toast({
        title: "Could not submit your task completion",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleActivityComplete = async () => {
    try {
      const { error } = await supabase
        .from('activities_completed')
        .insert({
          curio_id: curioId,
          child_id: childId,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting activity completion:', error);
      toast({
        title: "Could not submit your activity completion",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleMindfulnessComplete = async () => {
    try {
      const { error } = await supabase
        .from('mindfulness_completed')
        .insert({
          curio_id: curioId,
          child_id: childId,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting mindfulness completion:', error);
      toast({
        title: "Could not submit your mindfulness completion",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleRabbitHoleClick = async (question: string) => {
    if (!childId) return;
    
    try {
      toast.loading("Creating new exploration...", {
        id: "create-curio",
        duration: 3000
      });
      
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
        toast.success("New exploration created!", {
          id: "create-curio"
        });
        
        // Navigate to the new curio
        navigate(`/curio/${childId}/${newCurio.id}`);
      }
    } catch (error) {
      console.error('Error creating rabbit hole curio:', error);
      toast({
        title: "Could not create new exploration",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 sm:p-6 bg-wonderwhiz-deep-purple/40 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex items-center">
            <Input
              type="text"
              placeholder="What do you want to explore?"
              className="flex-grow rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/60 font-inter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="ml-3 bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/90 text-wonderwhiz-deep-purple font-medium rounded-full">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto relative">
        <div className="max-w-3xl mx-auto py-6 sm:py-8 px-2 sm:px-0">
          {/* Welcome Message */}
          {isFirstLoad && !searchQuery && (
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

          {!searchQuery && blocks.length === 0 && !isLoadingBlocks && !blocksError && (
            <CurioBlockListEmpty />
          )}

          {blocks.length > 0 && (
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
            />
          )}

          {/* Load More */}
          {searchQuery && !hasMore && (
            <CurioBlockListSearchNoMore />
          )}

          {!searchQuery && !hasMore && (
            <CurioBlockListNoMore />
          )}

          {hasMore && (
            <CurioBlockListLoadMore loadTriggerRef={loadTriggerRef} loadingMore={loadingMore} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CurioPage;
