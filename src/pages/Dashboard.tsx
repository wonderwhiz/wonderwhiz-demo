import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Send, Star, MessageCircle, BookmarkPlus, Menu, ArrowLeftRight, MessageSquare, Sparkles } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  interests: string[];
  age: number;
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

// Mock specialists for our content
const SPECIALISTS = {
  'nova': { name: 'Nova the Explorer', color: 'bg-gradient-to-r from-blue-400 to-indigo-500' },
  'spark': { name: 'Spark the Scientist', color: 'bg-gradient-to-r from-yellow-300 to-amber-500' },
  'prism': { name: 'Prism the Artist', color: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
  'pixel': { name: 'Pixel the Robot', color: 'bg-gradient-to-r from-pink-400 to-rose-500' },
  'atlas': { name: 'Atlas the Turtle', color: 'bg-gradient-to-r from-purple-400 to-indigo-500' },
  'lotus': { name: 'Lotus the Wellbeing Panda', color: 'bg-gradient-to-r from-orange-400 to-red-500' },
};

// A mock function to generate content blocks based on a query
// In a real implementation, this would call Claude/Gemini
const generateMockContentBlocks = (query: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const specialistIds = Object.keys(SPECIALISTS);
  
  // 1. Knowledge Card
  blocks.push({
    id: `block-${Date.now()}-1`,
    type: 'fact',
    specialist_id: 'nova',
    content: {
      fact: `Here's what I know about ${query}: This is a fascinating topic that has many interesting aspects! Let me tell you more...`,
      rabbitHoles: [
        `Tell me more about the history of ${query}`,
        `What are some fun facts about ${query}?`
      ]
    },
    liked: false,
    bookmarked: false
  });
  
  // 2. Quiz
  blocks.push({
    id: `block-${Date.now()}-2`,
    type: 'quiz',
    specialist_id: 'spark',
    content: {
      question: `Which of these facts about ${query} is true?`,
      options: [
        `${query} has been studied for over 100 years`,
        `${query} was first discovered in 1995`,
        `${query} is related to quantum physics`,
        `${query} can be found in nature`
      ],
      correctIndex: 3
    },
    liked: false,
    bookmarked: false
  });
  
  // 3. Flashcard
  blocks.push({
    id: `block-${Date.now()}-3`,
    type: 'flashcard',
    specialist_id: 'atlas',
    content: {
      front: `What is special about ${query}?`,
      back: `${query} is special because it has unique properties that make it important for many different applications.`
    },
    liked: false,
    bookmarked: false
  });
  
  // 4. Creative Prompt
  blocks.push({
    id: `block-${Date.now()}-4`,
    type: 'creative',
    specialist_id: 'prism',
    content: {
      prompt: `Can you draw or describe what ${query} might look like in your imagination?`,
      type: 'drawing'
    },
    liked: false,
    bookmarked: false
  });
  
  // Generate remaining blocks...
  blocks.push({
    id: `block-${Date.now()}-5`,
    type: 'task',
    specialist_id: 'lotus',
    content: {
      task: `Let's learn more about ${query} by doing a quick 1-minute research activity.`,
      reward: 5
    },
    liked: false,
    bookmarked: false
  });
  
  blocks.push({
    id: `block-${Date.now()}-6`,
    type: 'riddle',
    specialist_id: 'spark',
    content: {
      riddle: `I'm thinking of something related to ${query} that starts with the letter A. Can you guess what it is?`,
      answer: `Adventure! Every exploration into ${query} is an exciting adventure of discovery.`
    },
    liked: false,
    bookmarked: false
  });
  
  blocks.push({
    id: `block-${Date.now()}-7`,
    type: 'funFact',
    specialist_id: 'nova',
    content: {
      fact: `Did you know that ${query} is connected to many other topics? Scientists are still learning new things about it every day!`,
      rabbitHoles: [
        `How does ${query} affect our daily lives?`,
        `What's the future of ${query}?`
      ]
    },
    liked: false,
    bookmarked: false
  });
  
  blocks.push({
    id: `block-${Date.now()}-8`,
    type: 'activity',
    specialist_id: 'atlas',
    content: {
      activity: `Find something in your home that reminds you of ${query} and share why!`
    },
    liked: false,
    bookmarked: false
  });
  
  blocks.push({
    id: `block-${Date.now()}-9`,
    type: 'news',
    specialist_id: 'pixel',
    content: {
      headline: `New Discoveries About ${query} Surprise Scientists`,
      summary: `Recent studies have shown exciting new information about ${query} that changes how we understand it.`,
      source: 'WonderWhiz News'
    },
    liked: false,
    bookmarked: false
  });
  
  blocks.push({
    id: `block-${Date.now()}-10`,
    type: 'mindfulness',
    specialist_id: 'lotus',
    content: {
      exercise: `Close your eyes and imagine ${query}. What colors do you see? What feelings come up? Take 3 deep breaths as you think about it.`,
      duration: 30
    },
    liked: false,
    bookmarked: false
  });
  
  return blocks;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [currentCurio, setCurrentCurio] = useState<Curio | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [pastCurios, setPastCurios] = useState<Curio[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadProfileAndCurios = async () => {
      if (!profileId) {
        navigate('/profiles');
        return;
      }
      
      try {
        // Load child profile
        const { data: profileData, error: profileError } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('id', profileId)
          .single();
          
        if (profileError) throw profileError;
        setChildProfile(profileData);
        
        // Load past curios
        const { data: curiosData, error: curiosError } = await supabase
          .from('curios')
          .select('*')
          .eq('child_id', profileId)
          .order('created_at', { ascending: false });
          
        if (curiosError) throw curiosError;
        setPastCurios(curiosData || []);
        
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
  
  const handleSubmitQuery = async () => {
    if (!query.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // First, save the new curio
      const { data: newCurio, error: curioError } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          query: query.trim(),
          title: query.trim(),
        })
        .select()
        .single();
        
      if (curioError) throw curioError;
      
      // Call Claude Edge Function to generate content blocks
      const claudeResponse = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: JSON.stringify({
          query: query.trim(),
          childProfile: childProfile
        })
      });

      const contentBlocks = claudeResponse.data;
      
      // Save blocks to database
      for (const block of contentBlocks) {
        await supabase
          .from('content_blocks')
          .insert({
            curio_id: newCurio.id,
            type: block.type,
            specialist_id: block.specialist_id,
            content: block.content,
          });
      }
      
      // Update UI with new blocks
      setContentBlocks(contentBlocks);
      setCurrentCurio(newCurio);
      
      // Clear query
      setQuery('');
      
      // Scroll to the new content
      setTimeout(() => {
        feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error("Oops! Something went wrong with your question.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleLoadCurio = async (curio: Curio) => {
    setCurrentCurio(curio);
    setIsSidebarOpen(false);
    
    try {
      const { data: blocks, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curio.id);
        
      if (error) throw error;
      
      // If no blocks exist for this curio, generate them now
      if (!blocks || blocks.length === 0) {
        const newBlocks = generateMockContentBlocks(curio.query);
        setContentBlocks(newBlocks);
        
        // Save blocks to database (would happen in real app)
      } else {
        setContentBlocks(blocks as ContentBlock[]);
      }
      
    } catch (error) {
      console.error('Error loading curio content:', error);
      toast.error("Failed to load content");
    }
  };
  
  const handleToggleLike = (blockId: string) => {
    setContentBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, liked: !block.liked } 
          : block
      )
    );
    
    // In a real app, we would update the like status in the database
  };
  
  const handleToggleBookmark = (blockId: string) => {
    setContentBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, bookmarked: !block.bookmarked } 
          : block
      )
    );
    
    // In a real app, we would update the bookmark status in the database
  };
  
  const renderContentBlock = (block: ContentBlock) => {
    const specialist = SPECIALISTS[block.specialist_id as keyof typeof SPECIALISTS] || {
      name: 'Wonder Wizard',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    };
    
    let content;
    switch (block.type) {
      case 'fact':
        content = (
          <div className="space-y-3">
            <p>{block.content.fact}</p>
            {block.content.rabbitHoles && (
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Want to know more?</p>
                <div className="flex flex-col space-y-2">
                  {block.content.rabbitHoles.map((question: string, idx: number) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className="justify-start bg-white/10 hover:bg-white/20 border-white/20 text-white"
                      onClick={() => setQuery(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        break;
      
      case 'quiz':
        content = (
          <div className="space-y-4">
            <p className="font-medium">{block.content.question}</p>
            <div className="space-y-2">
              {block.content.options.map((option: string, idx: number) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="justify-start w-full bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );
        break;
        
      case 'flashcard':
        content = (
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front bg-white/20 p-6 flex items-center justify-center rounded-lg min-h-[120px]">
                <p className="font-medium text-center">{block.content.front}</p>
              </div>
              <div className="flip-card-back bg-white/30 p-6 flex items-center justify-center rounded-lg min-h-[120px]">
                <p className="text-center">{block.content.back}</p>
              </div>
            </div>
          </div>
        );
        break;
        
      case 'creative':
        content = (
          <div className="space-y-4">
            <p>{block.content.prompt}</p>
            <div className="p-4 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center hover:border-wonderwhiz-pink transition-colors cursor-pointer">
              <p className="text-white/60 text-sm">Tap to upload your {block.content.type}</p>
            </div>
          </div>
        );
        break;
        
      case 'task':
        content = (
          <div className="space-y-4">
            <p>{block.content.task}</p>
            <Button className="space-x-2">
              <span>Mark Complete</span>
              <Sparkles className="h-4 w-4" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+{block.content.reward} Sparks</span>
            </Button>
          </div>
        );
        break;
        
      case 'riddle':
        content = (
          <div className="space-y-4">
            <p>{block.content.riddle}</p>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  Reveal Answer
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-3 bg-white/10 rounded-lg">
                {block.content.answer}
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
        break;
        
      // More cases would follow for other block types...
      
      default:
        content = <p>This content is still loading...</p>;
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <Card className={`overflow-hidden ${specialist.color}`}>
          <CardContent className="p-0">
            <div className="p-3 bg-black/20 flex items-center">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <span className="font-bold text-white">{specialist.name.charAt(0)}</span>
              </div>
              <span className="font-medium text-white/90">{specialist.name}</span>
            </div>
            <div className="p-4 text-white">
              {content}
            </div>
            <div className="p-2 bg-black/10 flex justify-end space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`hover:bg-white/10 ${block.liked ? 'text-red-400' : 'text-white/70'}`}
                onClick={() => handleToggleLike(block.id)}
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/70 hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`hover:bg-white/10 ${block.bookmarked ? 'text-wonderwhiz-blue' : 'text-white/70'}`}
                onClick={() => handleToggleBookmark(block.id)}
              >
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-pink"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient flex">
      <Helmet>
        <title>WonderWhiz - Explore & Learn</title>
        <meta name="description" content="Explore topics, ask questions, and learn in a fun, interactive way with WonderWhiz." />
      </Helmet>
      
      {/* Sidebar for past curios */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-wonderwhiz-dark border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="p-4 border-b border-white/10 flex items-center">
          <WonderWhizLogo className="h-8" />
          <span className="ml-3 font-baloo font-bold text-white">WonderWhiz</span>
        </div>
        
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-medium mb-1">Welcome, {childProfile?.name}!</h3>
          <div className="flex items-center text-wonderwhiz-gold">
            <Sparkles className="h-4 w-4 mr-1" />
            <span className="text-sm">0 Sparks</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-medium mb-2">Your Past Curios</h3>
          {pastCurios.length === 0 ? (
            <p className="text-white/60 text-sm">Ask a question to start exploring!</p>
          ) : (
            <div className="space-y-2">
              {pastCurios.map(curio => (
                <button
                  key={curio.id}
                  onClick={() => handleLoadCurio(curio)}
                  className={`w-full text-left p-2 rounded-lg text-sm hover:bg-white/10 transition-colors ${
                    currentCurio?.id === curio.id ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{curio.title}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 bg-wonderwhiz-dark/80 backdrop-blur-md border-b border-white/10 p-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden text-white" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuery(); }}>
              <div className="relative">
                <Input 
                  placeholder="What do you want to explore today?" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  disabled={isGenerating}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-wonderwhiz-purple text-white hover:bg-wonderwhiz-purple/80"
                  disabled={!query.trim() || isGenerating}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
          
          <div className="w-10">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => navigate(`/parent-zone/${profileId}`)}
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* Content feed */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-2xl mx-auto">
            {/* Welcome message when no content */}
            {!currentCurio && (
              <div className="text-center py-12">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <WonderWhizLogo className="h-24 mx-auto" />
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-4">Welcome to WonderWhiz!</h1>
                <p className="text-white/80 text-lg mb-8">
                  What are you curious about today? Type your question above!
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {['Tell me about penguins', 'How do volcanoes work?', 'What are black holes?', 'Show me cool dinosaurs'].map(suggestion => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show current curio and its content */}
            {currentCurio && (
              <div>
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 mb-6 bg-wonderwhiz-purple/20 backdrop-blur-sm rounded-lg border border-wonderwhiz-purple/30 flex items-center"
                    >
                      <div className="mr-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      </div>
                      <p className="text-white">Generating your personalized content...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <h2 className="text-2xl font-bold text-white mb-4">{currentCurio.title}</h2>
                <div className="space-y-4">
                  {contentBlocks.map(block => renderContentBlock(block))}
                </div>
              </div>
            )}
            
            {/* Ref for scrolling to the end of feed */}
            <div ref={feedEndRef} />
          </div>
        </div>
      </main>
      
      {/* Overlay for sidebar on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
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
        `}
      </style>
    </div>
  );
};

export default Dashboard;
