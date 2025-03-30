
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CurioCard } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Send, Menu, ArrowLeftRight, MessageSquare, Sparkles, Search, Star, Lightbulb, RefreshCw, ChevronDown, User, LogOut, UserCircle, PanelLeftClose, PanelLeft } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import ContentBlock from '@/components/ContentBlock';
import BlockReply from '@/components/BlockReply';
import { SPECIALISTS } from '@/components/SpecialistAvatar';
import ChildDashboardTasks from '@/components/ChildDashboardTasks';
import SparksBalance from '@/components/SparksBalance';
import SparksHistory from '@/components/SparksHistory';
import SparksOverview from '@/components/SparksOverview';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import MagicalBorder from '@/components/MagicalBorder';
import FloatingElements from '@/components/FloatingElements';
import CurioSuggestion from '@/components/CurioSuggestion';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SparksBadge from '@/components/SparksBadge';
import { Sidebar, SidebarProvider, SidebarContent, SidebarHeader, SidebarFooter, SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar';

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
  const {
    profileId
  } = useParams<{
    profileId: string;
  }>();
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [curioSuggestions, setCurioSuggestions] = useState<string[]>(['How do volcanoes work?', 'What are black holes?', 'Tell me about penguins', 'Show me cool dinosaurs']);
  const [pastCurios, setPastCurios] = useState<Curio[]>([]);
  const [showSparksHistory, setShowSparksHistory] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [curioPageSize] = useState(5);
  const [displayedCuriosCount, setDisplayedCuriosCount] = useState(curioPageSize);
  const isMobile = useIsMobile();
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    streakDays,
    streakBonusReceived,
    streakBonusAmount
  } = useSparksSystem(profileId);

  useEffect(() => {
    const loadProfileAndCurios = async () => {
      if (!profileId) {
        navigate('/profiles');
        return;
      }
      try {
        const {
          data: profileData,
          error: profileError
        } = await supabase.from('child_profiles').select('*').eq('id', profileId).single();
        if (profileError) throw profileError;
        setChildProfile(profileData);
        const {
          data: curiosData,
          error: curiosError
        } = await supabase.from('curios').select('*').eq('child_id', profileId).order('created_at', {
          ascending: false
        });
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
      const {
        data: newCurio,
        error: curioError
      } = await supabase.from('curios').insert({
        child_id: profileId,
        query: query.trim(),
        title: query.trim()
      }).select().single();
      if (curioError) throw curioError;

      // Award sparks for starting a new curio
      try {
        const {
          data: sparkData
        } = await supabase.functions.invoke('increment-sparks-balance', {
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

      // Update past curios list
      setPastCurios(prev => [newCurio, ...prev]);
      
      // Instead of generating content here, navigate to the dedicated curio page
      navigate(`/curio/${profileId}/${newCurio.id}`);
      setQuery('');
    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error("Oops! Something went wrong with your question.");
      setIsGenerating(false);
    }
  };

  const handleLoadCurio = (curio: Curio) => {
    // Navigate to the dedicated curio page instead of loading content in this component
    navigate(`/curio/${profileId}/${curio.id}`);
  };

  const handleFollowRabbitHole = async (question: string) => {
    setQuery(question);
    try {
      const {
        data: sparkData
      } = await supabase.functions.invoke('increment-sparks-balance', {
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

  const handleLoadMoreCurios = () => {
    setDisplayedCuriosCount(prev => Math.min(prev + curioPageSize, pastCurios.length));
  };

  const handleCurioSuggestionClick = async (suggestion: string) => {
    if (!childProfile || isGenerating) return;
    setIsGenerating(true);
    try {
      const {
        data: newCurio,
        error: curioError
      } = await supabase.from('curios').insert({
        child_id: profileId,
        query: suggestion.trim(),
        title: suggestion.trim()
      }).select().single();
      if (curioError) throw curioError;

      // Award sparks for starting a new curio
      try {
        const {
          data: sparkData
        } = await supabase.functions.invoke('increment-sparks-balance', {
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

      // Update past curios list
      setPastCurios(prev => [newCurio, ...prev]);
      
      // Navigate to the dedicated curio page instead of generating content here
      navigate(`/curio/${profileId}/${newCurio.id}`);
    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error("Oops! Something went wrong with your question.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-wonderwhiz-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-pink"></div>
      </div>;
  }

  return <SidebarProvider>
      <div className="min-h-screen bg-wonderwhiz-gradient flex w-full">
        <Helmet>
          <title>WonderWhiz - Explore & Learn</title>
          <meta name="description" content="Explore topics, ask questions, and learn in a fun, interactive way with WonderWhiz." />
        </Helmet>
        
        <Sidebar variant="inset" className="bg-purple-950">
          <SidebarHeader className="rounded-none bg-violet-900">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Welcome, {childProfile?.name}!</h3>
              <SidebarTrigger />
            </div>
            <div className="flex items-center">
              <SparksBalance childId={profileId || ''} initialBalance={childProfile?.sparks_balance} size="md" />
              <button onClick={() => setShowSparksHistory(prev => !prev)} className="ml-auto text-white/60 hover:text-white transition-colors">
                {showSparksHistory ? 'Hide' : 'View'} History
              </button>
            </div>
          </SidebarHeader>
          
          <AnimatePresence>
            {showSparksHistory && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} className="overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <SparksHistory childId={profileId || ''} limit={5} />
                </div>
              </motion.div>}
          </AnimatePresence>
          
          <SidebarContent className="bg-purple-950">
            <div className="p-4">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <span>Your Past Curios</span>
                <div className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70">
                  {pastCurios.length}
                </div>
              </h3>
              
              {pastCurios.length === 0 ? <p className="text-white/60 text-sm">Ask a question to start exploring!</p> : <div className="space-y-3">
                  {pastCurios.slice(0, displayedCuriosCount).map((curio, index) => <CurioCard key={curio.id} colorVariant={index} className={`
                        cursor-pointer 
                        transition-all 
                        hover:bg-white/10 
                        border 
                        border-opacity-20 
                        rounded-lg 
                        overflow-hidden 
                        shadow-sm 
                        hover:shadow-md
                      `} onClick={() => handleLoadCurio(curio)}>
                      <div className={`
                          p-3 
                          flex 
                          items-center 
                          text-white/80
                          line-clamp-2 
                          break-words 
                          overflow-hidden
                        `}>
                        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="
                            text-sm 
                            font-medium 
                            leading-tight 
                            line-clamp-2 
                            break-words 
                            max-h-[3rem] 
                            overflow-hidden 
                            text-ellipsis
                          ">
                          {curio.title}
                        </span>
                      </div>
                    </CurioCard>)}
                  
                  {displayedCuriosCount < pastCurios.length && <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} className="flex justify-center pt-2">
                      <Button variant="ghost" size="sm" className="
                          text-white/60 
                          hover:text-white 
                          hover:bg-white/10 
                          flex 
                          items-center 
                          gap-1 
                          text-xs 
                          border 
                          border-white/10 
                          rounded-full
                        " onClick={handleLoadMoreCurios}>
                        Load More <ChevronDown className="h-3 w-3" />
                      </Button>
                    </motion.div>}
                </div>}
            </div>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 flex flex-col min-h-screen relative">
          <header className="sticky top-0 z-10 bg-wonderwhiz-dark/80 backdrop-blur-md border-b border-white/10 p-3 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="text-white hover:bg-white/10 rounded-full" />
            </div>
            
            <div className="flex-1 flex justify-center">
              <WonderWhizLogo className="h-8" />
              <h1 className="ml-2 font-baloo text-xl text-white hidden sm:block">WonderWhiz</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-white hover:bg-white/10 rounded-full p-1"
                  >
                    <UserCircle className="h-10 w-10 text-wonderwhiz-purple" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-wonderwhiz-dark/95 border-white/20 backdrop-blur-xl text-white">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <User className="h-4 w-4 text-wonderwhiz-gold" />
                    <span>{childProfile?.name}</span>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
                    onClick={() => navigate(`/parent-zone/${profileId}`)}
                  >
                    <ArrowLeftRight className="h-4 w-4 text-wonderwhiz-blue" />
                    <span>Parent Zone</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white hover:bg-white/10 focus:bg-white/10 hover:text-red-400 focus:text-red-400 cursor-pointer" 
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate('/login');
                      toast.success('Logged out successfully');
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto py-4 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="my-4 sm:my-6 relative">
                <FloatingElements type="stars" density="low" className="absolute inset-0 pointer-events-none opacity-50" />
                
                <MagicalBorder active={true} type="rainbow" className="rounded-2xl overflow-hidden shadow-lg">
                  <form onSubmit={e => {
                  e.preventDefault();
                  handleSubmitQuery();
                }} className="relative">
                    <Input placeholder={isMobile ? "Ask me anything!" : "What do you want to explore today? Ask me anything!"} value={query} onChange={e => setQuery(e.target.value)} disabled={isGenerating} className="py-6 bg-white/10 border-white/20 text-white text-base sm:text-lg placeholder:text-white/60 placeholder:text-center focus:ring-2 focus:ring-wonderwhiz-gold/50 focus:border-wonderwhiz-gold px-[40px] my-0 sm:py-[40px]" />
                    
                    <Button type="submit" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 bg-wonderwhiz-gold text-wonderwhiz-dark hover:bg-wonderwhiz-gold/80 rounded-full shadow-glow-gold" disabled={!query.trim() || isGenerating}>
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <motion.div animate={{
                      rotate: [0, 15, -15, 0]
                    }} transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }}>
                        <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-wonderwhiz-gold" />
                      </motion.div>
                    </div>
                  </form>
                </MagicalBorder>
              </div>
              
              <AnimatePresence>
                {showQuickMenu && <motion.div initial={{
                opacity: 0,
                y: -20
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -20
              }} className="fixed right-4 top-20 z-30 bg-wonderwhiz-dark/95 rounded-2xl p-2 border border-white/20 backdrop-blur-xl shadow-lg">
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" className="flex items-center justify-start gap-3 text-white hover:bg-white/10" onClick={() => {
                    setShowQuickMenu(false);
                    // Show SparksOverview
                    document.getElementById('sparks-overview')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}>
                        <Sparkles className="h-5 w-5 text-wonderwhiz-gold" />
                        <span>Your Sparks</span>
                      </Button>
                      
                      <Button variant="ghost" className="flex items-center justify-start gap-3 text-white hover:bg-white/10" onClick={() => {
                    setShowQuickMenu(false);
                    // Show Tasks
                    document.getElementById('tasks-section')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}>
                        <Star className="h-5 w-5 text-wonderwhiz-purple" />
                        <span>My Tasks</span>
                      </Button>
                    </div>
                  </motion.div>}
              </AnimatePresence>
              
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.4
            }}>
                <Card className="bg-white/5 border-white/10">
                  <div className="text-center py-8 sm:py-12">
                      <motion.div initial={{
                    opacity: 0,
                    scale: 0.9
                  }} animate={{
                    opacity: 1,
                    scale: 1
                  }} transition={{
                    duration: 0.5
                  }} className="mb-6">
                        <WonderWhizLogo className="h-20 sm:h-24 mx-auto" />
                      </motion.div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Welcome to WonderWhiz!</h1>
                      <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 px-4">
                        What are you curious about today? Type your question above!
                      </p>
                      
                      <div className="flex items-center justify-center mb-4">
                        <h3 className="text-lg font-medium text-white mr-2">Suggestions for you</h3>
                        <Button variant="ghost" size="icon" className="text-white hover:text-wonderwhiz-gold transition-colors" onClick={handleRefreshSuggestions} disabled={isLoadingSuggestions}>
                          <motion.div animate={isLoadingSuggestions ? {
                        rotate: 360
                      } : {}} transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear"
                      }} className={isLoadingSuggestions ? "animate-spin" : ""}>
                            <RefreshCw className="h-5 w-5" />
                          </motion.div>
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-3 sm:px-4">
                        {curioSuggestions.map((suggestion, index) => <CurioSuggestion key={`${suggestion}-${index}`} suggestion={suggestion} onClick={handleCurioSuggestionClick} index={index} directGenerate={true} />)}
                      </div>
                    </div>
                </Card>
              </motion.div>
              
              <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Discover More</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div id="sparks-overview" initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: 0.1
                }}>
                    {childProfile && <SparksOverview childId={profileId || ''} sparksBalance={childProfile.sparks_balance || 0} />}
                  </motion.div>
                  
                  <motion.div id="tasks-section" initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: 0.2
                }}>
                    <ChildDashboardTasks childId={profileId || ''} onSparkEarned={handleSparkEarned} />
                  </motion.div>
                </div>
              </div>
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
    </SidebarProvider>;
};

export default Dashboard;
