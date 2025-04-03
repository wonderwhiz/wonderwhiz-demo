
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import FloatingElements from '@/components/FloatingElements';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useBlockInteractions } from '@/hooks/useBlockInteractions';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SearchBar from '@/components/dashboard/SearchBar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import CurioContent from '@/components/dashboard/CurioContent';
import DiscoverySection from '@/components/dashboard/DiscoverySection';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  interests: string[];
  age: number;
  sparks_balance: number;
}

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

interface ContentBlock {
  id: string;
  type: 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness';
  specialist_id: string;
  content: any;
  liked: boolean;
  bookmarked: boolean;
}

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [currentCurio, setCurrentCurio] = useState<Curio | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [blockReplies, setBlockReplies] = useState<Record<string, BlockReply[]>>({});
  const [pastCurios, setPastCurios] = useState<Curio[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [curioSuggestions, setCurioSuggestions] = useState<string[]>(['How do volcanoes work?', 'What are black holes?', 'Tell me about penguins', 'Show me cool dinosaurs']);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [visibleBlocksCount, setVisibleBlocksCount] = useState(3);
  const [displayedCuriosCount, setDisplayedCuriosCount] = useState(5);
  const isMobile = useIsMobile();
  const [isGenerating, setIsGenerating] = useState(false);
  const { streakDays } = useSparksSystem(profileId);

  // Function to load more content blocks
  const handleLoadMoreBlocks = () => {
    setVisibleBlocksCount(prev => Math.min(prev + 3, contentBlocks.length));
  };
  
  // Set up infinite scroll for content blocks
  const observerTarget = useInfiniteScroll({
    loadMore: handleLoadMoreBlocks,
    isLoading: loadingBlocks,
    hasMore: visibleBlocksCount < contentBlocks.length
  });

  useEffect(() => {
    const loadProfileAndCurios = async () => {
      if (!profileId) {
        navigate('/profiles');
        return;
      }
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('id', profileId)
          .single();
          
        if (profileError) throw profileError;
        setChildProfile(profileData);
        
        const { data: curiosData, error: curiosError } = await supabase
          .from('curios')
          .select('*')
          .eq('child_id', profileId)
          .order('created_at', { ascending: false });
          
        if (curiosError) throw curiosError;
        setPastCurios(curiosData || []);
        
        if (profileData) {
          fetchCurioSuggestions(profileData, curiosData || []);
        }
      } catch (error) {
        console.error('Error loading profile or curios:', error);
        toast.error("Failed to load your profile");
        navigate('/profiles');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileAndCurios();
  }, [profileId, navigate]);

  const fetchCurioSuggestions = async (profile: any, curios: any[]) => {
    setIsLoadingSuggestions(true);
    try {
      const response = await supabase.functions.invoke('generate-curio-suggestions', {
        body: JSON.stringify({
          childProfile: profile,
          pastCurios: curios
        })
      });
      
      if (response.error) {
        console.error('Error fetching curio suggestions:', response.error);
        if (response.data?.fallbackSuggestions) {
          setCurioSuggestions(response.data.fallbackSuggestions);
        }
        return;
      }
      
      const suggestions = response.data;
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        setCurioSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error fetching curio suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleRefreshSuggestions = () => {
    if (childProfile && pastCurios) {
      fetchCurioSuggestions(childProfile, pastCurios);
    }
  };

  const handleSubmitQuery = async () => {
    if (!query.trim() || isGenerating || !childProfile) return;
    setIsGenerating(true);
    
    try {
      const { data: newCurio, error: curioError } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          query: query.trim(),
          title: query.trim()
        })
        .select()
        .single();
        
      if (curioError) throw curioError;

      // Award sparks for starting a new curio
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: profileId,
            amount: 1
          })
        });

        // Update the local state with new sparks balance
        if (childProfile) {
          setChildProfile({
            ...childProfile,
            sparks_balance: (childProfile.sparks_balance || 0) + 1
          });
        }

        // Add the transaction record
        await supabase.from('sparks_transactions').insert({
          child_id: profileId,
          amount: 1,
          reason: 'Starting new Curio'
        });
        
        toast.success('You earned 1 spark for your curiosity!', {
          duration: 2000,
          position: 'bottom-right'
        });
      } catch (error) {
        console.error('Error awarding sparks for new curio:', error);
      }
      
      const claudeResponse = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: JSON.stringify({
          query: query.trim(),
          childProfile: childProfile
        })
      });
      
      if (claudeResponse.error) {
        throw new Error(`Failed to generate content: ${claudeResponse.error.message}`);
      }
      
      const generatedBlocks = claudeResponse.data;
      if (!Array.isArray(generatedBlocks)) {
        throw new Error("Invalid response format from generate-curiosity-blocks");
      }
      
      for (const block of generatedBlocks) {
        await supabase.from('content_blocks').insert({
          curio_id: newCurio.id,
          type: block.type,
          specialist_id: block.specialist_id,
          content: block.content
        });
      }
      
      setPastCurios(prev => [newCurio, ...prev]);
      setContentBlocks(generatedBlocks);
      setCurrentCurio(newCurio);
      setQuery('');
    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error("Oops! Something went wrong with your question.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadCurio = async (curio: Curio) => {
    setCurrentCurio(curio);
    setLoadingBlocks(true);
    setContentBlocks([]);
    setVisibleBlocksCount(3);
    
    try {
      const { data: blocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curio.id)
        .order('created_at', { ascending: true });
        
      if (blocksError) throw blocksError;
      
      const blockIds = blocks?.map(block => block.id) || [];
      let allReplies: Record<string, BlockReply[]> = {};
      
      if (blockIds.length > 0) {
        const { data: replies, error: repliesError } = await supabase
          .from('block_replies')
          .select('*')
          .in('block_id', blockIds)
          .order('created_at', { ascending: true });
          
        if (repliesError) throw repliesError;
        
        if (replies) {
          allReplies = replies.reduce((acc: Record<string, BlockReply[]>, reply) => {
            if (!acc[reply.block_id]) {
              acc[reply.block_id] = [];
            }
            acc[reply.block_id].push(reply);
            return acc;
          }, {});
        }
      }
      
      if (!blocks || blocks.length === 0) {
        if (childProfile) {
          setIsGenerating(true);
          const claudeResponse = await supabase.functions.invoke('generate-curiosity-blocks', {
            body: JSON.stringify({
              query: curio.query,
              childProfile: childProfile
            })
          });
          
          const generatedBlocks = claudeResponse.data;
          for (const block of generatedBlocks) {
            await supabase.from('content_blocks').insert({
              curio_id: curio.id,
              type: block.type,
              specialist_id: block.specialist_id,
              content: block.content
            });
          }
          
          setContentBlocks(generatedBlocks);
          setIsGenerating(false);
        }
      } else {
        setContentBlocks(blocks as ContentBlock[]);
      }
      
      setBlockReplies(allReplies);
    } catch (error) {
      console.error('Error loading curio content:', error);
      toast.error("Failed to load content");
    } finally {
      setLoadingBlocks(false);
    }
  };

  const handleFollowRabbitHole = async (question: string) => {
    setQuery(question);
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 2
        })
      });
      
      if (childProfile) {
        setChildProfile({
          ...childProfile,
          sparks_balance: (childProfile.sparks_balance || 0) + 2
        });
      }
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 2,
        reason: 'Following a rabbit hole'
      });
      
      toast.success('You earned 2 sparks for exploring deeper!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for rabbit hole:', error);
    }
    
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
  };

  const handleToggleLike = async (blockId: string) => {
    setContentBlocks(prev => 
      prev.map(block => 
        block.id === blockId ? { ...block, liked: !block.liked } : block
      )
    );
    
    try {
      const blockToUpdate = contentBlocks.find(b => b.id === blockId);
      if (blockToUpdate) {
        await supabase
          .from('content_blocks')
          .update({ liked: !blockToUpdate.liked })
          .eq('id', blockId);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const handleToggleBookmark = async (blockId: string) => {
    setContentBlocks(prev => 
      prev.map(block => 
        block.id === blockId ? { ...block, bookmarked: !block.bookmarked } : block
      )
    );
    
    try {
      const blockToUpdate = contentBlocks.find(b => b.id === blockId);
      if (blockToUpdate) {
        await supabase
          .from('content_blocks')
          .update({ bookmarked: !blockToUpdate.bookmarked })
          .eq('id', blockId);
      }
    } catch (error) {
      console.error('Error updating bookmark status:', error);
    }
  };

  const handleBlockReply = async (blockId: string, message: string) => {
    if (!message.trim() || !childProfile) return;
    
    try {
      const block = contentBlocks.find(b => b.id === blockId);
      if (!block) return;
      
      const { data: replyData, error: replyError } = await supabase
        .from('block_replies')
        .insert({
          block_id: blockId,
          content: message,
          from_user: true
        })
        .select()
        .single();
        
      if (replyError) throw replyError;
      
      setBlockReplies(prev => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), replyData]
      }));
      
      const aiResponse = await supabase.functions.invoke('handle-block-chat', {
        body: JSON.stringify({
          blockId,
          messageContent: message,
          blockType: block.type,
          blockContent: block.content,
          childProfile,
          specialistId: block.specialist_id
        })
      });
      
      if (aiResponse.error) {
        throw new Error(`Failed to get response: ${aiResponse.error.message}`);
      }
      
      const { data: aiReplyData, error: aiReplyError } = await supabase
        .from('block_replies')
        .insert({
          block_id: blockId,
          content: aiResponse.data.reply,
          from_user: false
        })
        .select()
        .single();
        
      if (aiReplyError) throw aiReplyError;
      
      setBlockReplies(prev => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), aiReplyData]
      }));
    } catch (error) {
      console.error('Error handling reply:', error);
      toast.error("Failed to send message");
    }
  };

  const handleQuizCorrect = async (blockId: string) => {
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 5
        })
      });
      
      if (childProfile) {
        setChildProfile({
          ...childProfile,
          sparks_balance: (childProfile.sparks_balance || 0) + 5
        });
      }
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 5,
        reason: 'Answering quiz correctly',
        block_id: blockId
      });
      
      toast.success('You earned 5 sparks for answering correctly!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for correct quiz answer:', error);
    }
  };

  const handleNewsRead = async (blockId: string) => {
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 3
        })
      });
      
      if (childProfile) {
        setChildProfile({
          ...childProfile,
          sparks_balance: (childProfile.sparks_balance || 0) + 3
        });
      }
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 3,
        reason: 'Reading a news card',
        block_id: blockId
      });
      
      toast.success('You earned 3 sparks for reading the news!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for news read:', error);
    }
  };

  const handleCreativeUpload = async (blockId: string) => {
    try {
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: profileId,
          amount: 10
        })
      });
      
      if (childProfile) {
        setChildProfile({
          ...childProfile,
          sparks_balance: (childProfile.sparks_balance || 0) + 10
        });
      }
      
      await supabase.from('sparks_transactions').insert({
        child_id: profileId,
        amount: 10,
        reason: 'Uploading creative content',
        block_id: blockId
      });
      
      toast.success('You earned 10 sparks for your creativity!', {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error awarding sparks for creative upload:', error);
    }
  };

  const handleSparkEarned = (amount: number) => {
    if (childProfile) {
      setChildProfile({
        ...childProfile,
        sparks_balance: (childProfile.sparks_balance || 0) + amount
      });
    }
  };

  const handleCurioSuggestionClick = async (suggestion: string) => {
    if (!childProfile || isGenerating) return;
    setIsGenerating(true);
    
    try {
      const { data: newCurio, error: curioError } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          query: suggestion.trim(),
          title: suggestion.trim()
        })
        .select()
        .single();
        
      if (curioError) throw curioError;

      // Award sparks for starting a new curio
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: profileId,
            amount: 1
          })
        });

        // Update the local state with new sparks balance
        if (childProfile) {
          setChildProfile({
            ...childProfile,
            sparks_balance: (childProfile.sparks_balance || 0) + 1
          });
        }

        // Add the transaction record
        await supabase.from('sparks_transactions').insert({
          child_id: profileId,
          amount: 1,
          reason: 'Starting new Curio'
        });
        
        toast.success('You earned 1 spark for your curiosity!', {
          duration: 2000,
          position: 'bottom-right'
        });
      } catch (error) {
        console.error('Error awarding sparks for new curio:', error);
      }
      
      const claudeResponse = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: JSON.stringify({
          query: suggestion.trim(),
          childProfile: childProfile
        })
      });
      
      if (claudeResponse.error) {
        throw new Error(`Failed to generate content: ${claudeResponse.error.message}`);
      }
      
      const generatedBlocks = claudeResponse.data;
      if (!Array.isArray(generatedBlocks)) {
        throw new Error("Invalid response format from generate-curiosity-blocks");
      }
      
      for (const block of generatedBlocks) {
        await supabase.from('content_blocks').insert({
          curio_id: newCurio.id,
          type: block.type,
          specialist_id: block.specialist_id,
          content: block.content
        });
      }
      
      setPastCurios(prev => [newCurio, ...prev]);
      setContentBlocks(generatedBlocks);
      setCurrentCurio(newCurio);
      setQuery('');
    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error("Oops! Something went wrong with your question.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-pink"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-wonderwhiz-gradient flex w-full">
        <Helmet>
          <title>WonderWhiz - Explore & Learn</title>
          <meta name="description" content="Explore topics, ask questions, and learn in a fun, interactive way with WonderWhiz." />
        </Helmet>
        
        {/* Dashboard sidebar component */}
        <DashboardSidebar 
          childId={profileId || ''} 
          sparksBalance={childProfile?.sparks_balance || 0}
          pastCurios={pastCurios}
          currentCurioId={currentCurio?.id}
          onCurioSelect={handleLoadCurio}
        />
        
        <main className="flex-1 flex flex-col min-h-screen relative">
          {/* Dashboard header component */}
          <DashboardHeader childName={childProfile?.name || 'Explorer'} profileId={profileId} />
          
          <div className="flex-1 overflow-y-auto py-4 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Search bar component */}
              <div className="relative">
                <FloatingElements type="stars" density="low" className="absolute inset-0 pointer-events-none opacity-50" />
                <SearchBar 
                  query={query} 
                  setQuery={setQuery} 
                  handleSubmitQuery={handleSubmitQuery}
                  isGenerating={isGenerating} 
                />
              </div>
              
              <Card className="bg-white/5 border-white/10">
                {!currentCurio ? (
                  <WelcomeSection 
                    curioSuggestions={curioSuggestions}
                    isLoadingSuggestions={isLoadingSuggestions}
                    handleRefreshSuggestions={handleRefreshSuggestions}
                    handleCurioSuggestionClick={handleCurioSuggestionClick}
                  />
                ) : (
                  <CurioContent
                    currentCurio={currentCurio}
                    contentBlocks={contentBlocks}
                    blockReplies={blockReplies}
                    isGenerating={isGenerating}
                    loadingBlocks={loadingBlocks}
                    visibleBlocksCount={visibleBlocksCount}
                    profileId={profileId}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                    onReply={handleBlockReply}
                    onSetQuery={setQuery}
                    onRabbitHoleFollow={handleFollowRabbitHole}
                    onQuizCorrect={handleQuizCorrect}
                    onNewsRead={handleNewsRead}
                    onCreativeUpload={handleCreativeUpload}
                  />
                )}
                
                {/* Invisible element for intersection observer */}
                <div ref={observerTarget} />
              </Card>
              
              {/* Discovery section with sparks and tasks */}
              {childProfile && (
                <DiscoverySection 
                  childId={profileId || ''}
                  sparksBalance={childProfile.sparks_balance || 0}
                  onSparkEarned={handleSparkEarned}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      
      <style>
        {`
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
          height: 120px;
          cursor: pointer;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .flip-card:hover .flip-card-inner, .flip-card:focus .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @media (max-width: 640px) {
          .flip-card {
            height: 100px;
          }
        }
        `}
      </style>
    </SidebarProvider>
  );
};

export default Dashboard;
