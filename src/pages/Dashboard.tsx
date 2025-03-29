import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Send, Menu, ArrowLeftRight, MessageSquare, Sparkles, Search } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import ContentBlock from '@/components/ContentBlock';
import BlockReply from '@/components/BlockReply';
import { SPECIALISTS } from '@/components/SpecialistAvatar';
import ChildDashboardTasks from '@/components/ChildDashboardTasks';

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
    if (!query.trim() || isGenerating || !childProfile) return;
    
    setIsGenerating(true);
    
    try {
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
      
      console.log("Generated blocks:", generatedBlocks);
      
      for (const block of generatedBlocks) {
        await supabase
          .from('content_blocks')
          .insert({
            curio_id: newCurio.id,
            type: block.type,
            specialist_id: block.specialist_id,
            content: block.content,
          });
      }
      
      setPastCurios(prev => [newCurio, ...prev]);
      
      setContentBlocks(generatedBlocks);
      setCurrentCurio(newCurio);
      
      setQuery('');
      
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
      const { data: blocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curio.id);
        
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
            await supabase
              .from('content_blocks')
              .insert({
                curio_id: curio.id,
                type: block.type,
                specialist_id: block.specialist_id,
                content: block.content,
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
    }
  };
  
  const handleToggleLike = async (blockId: string) => {
    setContentBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, liked: !block.liked } 
          : block
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
        block.id === blockId 
          ? { ...block, bookmarked: !block.bookmarked } 
          : block
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

  const handleSparkEarned = (amount: number) => {
    if (childProfile) {
      setChildProfile({
        ...childProfile,
        sparks_balance: (childProfile.sparks_balance || 0) + amount
      });
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
    <div className="min-h-screen bg-wonderwhiz-gradient flex">
      <Helmet>
        <title>WonderWhiz - Explore & Learn</title>
        <meta name="description" content="Explore topics, ask questions, and learn in a fun, interactive way with WonderWhiz." />
      </Helmet>
      
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
      
      <main className="flex-1 flex flex-col min-h-screen relative">
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
        
        <div className="flex-1 overflow-y-auto py-4 px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ChildDashboardTasks 
                childId={profileId || ''} 
                onSparkEarned={handleSparkEarned}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/5 border-white/10">
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
                      {contentBlocks.map(block => (
                        <div key={block.id} className="space-y-2">
                          <ContentBlock 
                            block={block} 
                            onToggleLike={handleToggleLike}
                            onToggleBookmark={handleToggleBookmark}
                            onReply={handleBlockReply}
                            onSetQuery={setQuery}
                          />
                          
                          {blockReplies[block.id] && blockReplies[block.id].length > 0 && (
                            <div className="pl-4 border-l-2 border-white/20 ml-4">
                              {blockReplies[block.id].map((reply) => (
                                <BlockReply 
                                  key={reply.id}
                                  content={reply.content}
                                  fromUser={reply.from_user}
                                  specialistId={block.specialist_id}
                                  timestamp={reply.created_at}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div ref={feedEndRef} />
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
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
