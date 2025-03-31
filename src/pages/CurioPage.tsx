import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MessageSquare, Sparkles } from 'lucide-react';
import ContentBlock from '@/components/ContentBlock';
import BlockReply from '@/components/BlockReply';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import SparksBalance from '@/components/SparksBalance';
import { useInView } from 'react-intersection-observer';

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
  curio_id?: string;
  created_at?: string;
}

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
}

const CurioPage = () => {
  const navigate = useNavigate();
  const { profileId, curioId } = useParams<{ profileId: string; curioId: string }>();
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [curio, setCurio] = useState<Curio | null>(null);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [blockReplies, setBlockReplies] = useState<Record<string, BlockReply[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [displayedBlocksCount, setDisplayedBlocksCount] = useState(2);
  const [totalBlocksCount, setTotalBlocksCount] = useState(0);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    const loadData = async () => {
      if (!profileId || !curioId) {
        navigate('/profiles');
        return;
      }

      try {
        const [profileResponse, curioResponse] = await Promise.all([
          supabase.from('child_profiles').select('*').eq('id', profileId).single(),
          supabase.from('curios').select('*').eq('id', curioId).single()
        ]);

        if (profileResponse.error) throw profileResponse.error;
        if (curioResponse.error) throw curioResponse.error;

        setChildProfile(profileResponse.data);
        setCurio(curioResponse.data);

        await loadContentBlocks(curioResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error("Failed to load content");
        navigate(`/dashboard/${profileId}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [profileId, curioId, navigate]);

  const loadContentBlocks = async (curioData: Curio) => {
    try {
      const { data: blocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioData.id)
        .order('created_at', { ascending: true });

      if (blocksError) throw blocksError;

      if (!blocks || blocks.length === 0) {
        await generateNewBlocks(curioData);
        return;
      }

      setTotalBlocksCount(blocks.length);
      
      const initialBlocks = blocks.slice(0, displayedBlocksCount);
      
      const typedBlocks = initialBlocks.map(block => ({
        ...block,
        type: block.type as 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness'
      }));
      
      setContentBlocks(typedBlocks);

      const blockIds = initialBlocks.map(block => block.id);
      if (blockIds.length > 0) {
        await loadRepliesForBlocks(blockIds);
      }
    } catch (error) {
      console.error('Error loading content blocks:', error);
      toast.error("Failed to load content blocks");
    }
  };

  const loadRepliesForBlocks = async (blockIds: string[]) => {
    try {
      const { data: replies, error: repliesError } = await supabase
        .from('block_replies')
        .select('*')
        .in('block_id', blockIds)
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;

      if (replies) {
        const allReplies = replies.reduce((acc: Record<string, BlockReply[]>, reply) => {
          if (!acc[reply.block_id]) {
            acc[reply.block_id] = [];
          }
          acc[reply.block_id].push(reply);
          return acc;
        }, {});

        setBlockReplies(prev => ({ ...prev, ...allReplies }));
      }
    } catch (error) {
      console.error('Error loading block replies:', error);
    }
  };

  const generateNewBlocks = async (curioData: Curio) => {
    if (!childProfile) return;

    setIsGeneratingContent(true);
    try {
      const claudeResponse = await supabase.functions.invoke('generate-curiosity-blocks', {
        body: JSON.stringify({
          query: curioData.query,
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
        await supabase.from('content_blocks').insert({
          curio_id: curioData.id,
          type: block.type,
          specialist_id: block.specialist_id,
          content: block.content
        });
      }
      
      setTotalBlocksCount(generatedBlocks.length);
      
      const typedBlocks = generatedBlocks.slice(0, displayedBlocksCount).map(block => ({
        ...block,
        id: block.id || `temp-${Date.now()}-${Math.random()}`,
        type: block.type as 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness',
        liked: false,
        bookmarked: false
      }));
      
      setContentBlocks(typedBlocks);
    } catch (error) {
      console.error('Error generating blocks:', error);
      toast.error("Failed to generate content");
    } finally {
      setIsGeneratingContent(false);
    }
  };

  useEffect(() => {
    if (inView && !isLoading && contentBlocks.length < totalBlocksCount) {
      loadMoreBlocks();
    }
  }, [inView, isLoading, contentBlocks.length, totalBlocksCount]);

  const loadMoreBlocks = useCallback(async () => {
    if (contentBlocks.length >= totalBlocksCount) return;

    try {
      const nextBatchSize = 2; // Load 2 blocks at a time
      const nextBlocksStartIndex = contentBlocks.length;
      const nextBlocksEndIndex = Math.min(nextBlocksStartIndex + nextBatchSize, totalBlocksCount);

      const { data: nextBlocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('curio_id', curioId)
        .order('created_at', { ascending: true })
        .range(nextBlocksStartIndex, nextBlocksEndIndex - 1);

      if (blocksError) throw blocksError;
      
      if (nextBlocks && nextBlocks.length > 0) {
        await loadRepliesForBlocks(nextBlocks.map(block => block.id));
        
        const typedNewBlocks = nextBlocks.map(block => ({
          ...block,
          type: block.type as 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness'
        }));
        
        setContentBlocks(prev => [...prev, ...typedNewBlocks]);
        setDisplayedBlocksCount(prev => prev + nextBlocks.length);
      }
    } catch (error) {
      console.error('Error loading more blocks:', error);
    }
  }, [contentBlocks.length, totalBlocksCount, curioId]);

  const handleToggleLike = async (blockId: string) => {
    setContentBlocks(prev => prev.map(block => 
      block.id === blockId ? {...block, liked: !block.liked} : block
    ));
    
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
    setContentBlocks(prev => prev.map(block => 
      block.id === blockId ? {...block, bookmarked: !block.bookmarked} : block
    ));
    
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

  const handleFollowRabbitHole = async (question: string) => {
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
      
      const { data: newCurio, error: curioError } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          query: question.trim(),
          title: question.trim()
        })
        .select()
        .single();
        
      if (curioError) throw curioError;
      
      navigate(`/curio/${profileId}/${newCurio.id}`);
    } catch (error) {
      console.error('Error following rabbit hole:', error);
      toast.error("Oops! Something went wrong.");
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
    <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col">
      <Helmet>
        <title>{curio?.title || 'Loading...'} | WonderWhiz</title>
        <meta name="description" content={`Exploring: ${curio?.query || 'Loading...'}`} />
      </Helmet>
      
      <header className="sticky top-0 z-10 bg-wonderwhiz-dark/80 backdrop-blur-md border-b border-white/10 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10 rounded-full"
            onClick={() => navigate(`/dashboard/${profileId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <Link to={`/dashboard/${profileId}`} className="flex items-center">
            <WonderWhizLogo className="h-8" />
            <h1 className="ml-2 font-baloo text-xl text-white hidden sm:block">WonderWhiz</h1>
          </Link>
        </div>
        
        <div className="flex items-center">
          {childProfile && (
            <SparksBalance 
              childId={profileId || ''} 
              initialBalance={childProfile.sparks_balance} 
              size="sm" 
            />
          )}
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 sm:px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/5 border-white/10 overflow-hidden mb-6">
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <MessageSquare className="h-6 w-6 text-wonderwhiz-gold mt-1 flex-shrink-0" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">{curio?.title}</h1>
              </div>
              
              {isGeneratingContent && (
                <div className="p-4 mb-6 bg-wonderwhiz-purple/20 backdrop-blur-sm rounded-lg border border-wonderwhiz-purple/30 flex items-center">
                  <div className="mr-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  </div>
                  <p className="text-white">Generating your personalized content...</p>
                </div>
              )}
              
              <div className="space-y-6">
                {contentBlocks.map((block, index) => (
                  <motion.div 
                    key={block.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="space-y-2"
                  >
                    <ContentBlock 
                      block={block}
                      onToggleLike={handleToggleLike}
                      onToggleBookmark={handleToggleBookmark}
                      onReply={handleBlockReply}
                      onRabbitHoleFollow={handleFollowRabbitHole}
                      onQuizCorrect={() => handleQuizCorrect(block.id)}
                      onNewsRead={() => handleNewsRead(block.id)}
                      onCreativeUpload={() => handleCreativeUpload(block.id)}
                      colorVariant={index % 3}
                      userId={profileId}
                      childProfileId={profileId}
                    />
                    
                    {blockReplies[block.id] && blockReplies[block.id].length > 0 && (
                      <div className="pl-3 sm:pl-4 border-l-2 border-white/20 ml-3 sm:ml-4">
                        {blockReplies[block.id].map(reply => (
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
                  </motion.div>
                ))}
                
                {contentBlocks.length < totalBlocksCount && (
                  <div 
                    ref={loadMoreRef}
                    className="h-20 flex items-center justify-center text-white/50 text-sm"
                  >
                    <div className="animate-pulse flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-gold" />
                      <span>Loading more wonders...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurioPage;
