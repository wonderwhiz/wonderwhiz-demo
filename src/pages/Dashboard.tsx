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
import { useCurioData } from '@/hooks/useCurioData';

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
  const [blockReplies, setBlockReplies] = useState<Record<string, BlockReply[]>>({});
  const [pastCurios, setPastCurios] = useState<Curio[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [curioSuggestions, setCurioSuggestions] = useState<string[]>(['How do volcanoes work?', 'What are black holes?', 'Tell me about penguins', 'Show me cool dinosaurs']);
  const [displayedCuriosCount, setDisplayedCuriosCount] = useState(5);
  const isMobile = useIsMobile();
  const [isGenerating, setIsGenerating] = useState(false);
  const { streakDays } = useSparksSystem(profileId);

  const {
    blocks: contentBlocks,
    title: curioTitle,
    query: curioQuery,
    isLoading: isLoadingBlocks,
    isGeneratingContent,
    hasMoreBlocks,
    loadingMoreBlocks,
    loadMoreBlocks,
    totalBlocksLoaded,
    initialLoadComplete,
    searchQuery,
    setSearchQuery,
    handleToggleLike,
    handleToggleBookmark,
    handleSearch,
    clearSearch,
    isFirstLoad
  } = useCurioData(currentCurio?.id, profileId);

  useEffect(() => {
    const loadProfileAndCurios = async () => {
      if (!profileId) {
        navigate('/profiles');
        return;
      }
      
      try {
        setIsLoading(true);
        
        const [profileResponse, curiosResponse] = await Promise.all([
          supabase
            .from('child_profiles')
            .select('*')
            .eq('id', profileId)
            .single(),
          
          supabase
            .from('curios')
            .select('*')
            .eq('child_id', profileId)
            .order('created_at', { ascending: false })
        ]);
        
        const { data: profileData, error: profileError } = profileResponse;
        const { data: curiosData, error: curiosError } = curiosResponse;
        
        if (profileError) throw profileError;
        if (curiosError) throw curiosError;
        
        setChildProfile(profileData);
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

      setPastCurios(prev => [newCurio, ...prev]);
      setCurrentCurio(newCurio);
      setQuery('');
      
      setTimeout(async () => {
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: profileId,
              amount: 1
            })
          });
  
          if (childProfile) {
            setChildProfile({
              ...childProfile,
              sparks_balance: (childProfile.sparks_balance || 0) + 1
            });
          }
  
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
      }, 100);
      
    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error("Oops! Something went wrong with your question.");
      setIsGenerating(false);
    }
  };

  const handleLoadCurio = (curio: Curio) => {
    setCurrentCurio(curio);
  };

  const handleFollowRabbitHole = async (question: string) => {
    setQuery(question);
    
    Promise.resolve().then(async () => {
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
    });
    
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
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
    setQuery(suggestion);
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
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
        
        <DashboardSidebar 
          childId={profileId || ''} 
          sparksBalance={childProfile?.sparks_balance || 0}
          pastCurios={pastCurios}
          currentCurioId={currentCurio?.id}
          onCurioSelect={handleLoadCurio}
        />
        
        <main className="flex-1 flex flex-col min-h-screen relative">
          <DashboardHeader childName={childProfile?.name || 'Explorer'} profileId={profileId} />
          
          <div className="flex-1 overflow-y-auto py-4 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="relative">
                <FloatingElements type="stars" density="low" className="absolute inset-0 pointer-events-none opacity-50" />
                <SearchBar 
                  query={query} 
                  setQuery={setQuery} 
                  handleSubmitQuery={handleSubmitQuery}
                  isGenerating={isGenerating || isGeneratingContent} 
                />
              </div>
              
              <Card className="bg-white/5 border-white/10">
                {!currentCurio ? (
                  <WelcomeSection 
                    curioSuggestions={curioSuggestions}
                    isLoadingSuggestions={isLoadingSuggestions}
                    handleRefreshSuggestions={handleRefreshSuggestions}
                    handleCurioSuggestionClick={handleCurioSuggestionClick}
                    childProfile={childProfile}
                    pastCurios={pastCurios}
                    childId={profileId || ''}
                  />
                ) : (
                  <CurioContent
                    currentCurio={currentCurio}
                    contentBlocks={contentBlocks}
                    blockReplies={blockReplies}
                    isGenerating={isGeneratingContent}
                    loadingBlocks={loadingMoreBlocks}
                    visibleBlocksCount={totalBlocksLoaded}
                    profileId={profileId}
                    onLoadMore={loadMoreBlocks}
                    hasMoreBlocks={hasMoreBlocks}
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
              </Card>
              
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
