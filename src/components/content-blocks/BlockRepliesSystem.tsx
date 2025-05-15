
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { getSpecialistInfo } from '@/utils/specialists';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
  user_id?: string | null;
  specialist_id?: string;
}

interface BlockRepliesSystemProps {
  blockId: string;
  specialistId: string;
  childId?: string;
  childAge?: number;
  initialReplies?: BlockReply[];
  onReplySuccess?: () => void;
  onReplyFailed?: () => void;
  className?: string;
}

const BlockRepliesSystem: React.FC<BlockRepliesSystemProps> = ({
  blockId,
  specialistId,
  childId,
  childAge = 10,
  initialReplies = [],
  onReplySuccess,
  onReplyFailed,
  className = ''
}) => {
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<BlockReply[]>(initialReplies);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const specialist = getSpecialistInfo(specialistId);

  // Load replies when component mounts
  useEffect(() => {
    if (initialReplies.length === 0) {
      fetchReplies();
    }
  }, [blockId]);
  
  // Update replies when initialReplies change
  useEffect(() => {
    if (initialReplies.length > 0) {
      setReplies(initialReplies);
    }
  }, [initialReplies]);
  
  const fetchReplies = async () => {
    if (!blockId) return;
    
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('block_replies')
        .select('*')
        .eq('block_id', blockId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setReplies(data || []);
      
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setIsFetching(false);
    }
  };
  
  const handleSubmitReply = async () => {
    if (replyText.trim() && !isLoading) {
      setIsLoading(true);
      
      try {
        // Add optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticReply: BlockReply = {
          id: tempId,
          block_id: blockId,
          content: replyText,
          from_user: true,
          created_at: new Date().toISOString()
        };
        
        setReplies(prev => [...prev, optimisticReply]);
        setReplyText('');
        
        // Get the block type and content for context
        const { data: blockData } = await supabase
          .from('content_blocks')
          .select('type, content')
          .eq('id', blockId)
          .single();
          
        // Get child profile for personalization
        const { data: profileData } = childId ? await supabase
          .from('child_profiles')
          .select('*')
          .eq('id', childId)
          .single() : { data: null };
          
        // Call edge function to get response
        const { data, error } = await supabase.functions.invoke('handle-block-chat', {
          body: {
            blockId,
            messageContent: replyText,
            blockType: blockData?.type || 'fact',
            blockContent: blockData?.content || {},
            childProfile: profileData || { age: childAge, interests: [] },
            specialistId
          }
        });
        
        if (error) throw error;
        
        // Store user message and AI reply in database
        const { error: insertError } = await supabase.from('block_replies').insert([
          {
            block_id: blockId,
            content: replyText,
            from_user: true
          },
          {
            block_id: blockId,
            content: data?.reply || "I'm not sure how to respond to that.",
            from_user: false,
            specialist_id: data?.specialistId || specialistId
          }
        ]);
        
        if (insertError) throw insertError;
        
        // Refresh replies to get the actual IDs
        await fetchReplies();
        
        if (onReplySuccess) onReplySuccess();
      } catch (error) {
        console.error('Error sending reply:', error);
        
        // Remove optimistic update
        setReplies(prev => prev.filter(r => !r.id.toString().startsWith('temp-')));
        
        toast.error("Couldn't send your message. Please try again.");
        
        if (onReplyFailed) onReplyFailed();
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className={`mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10 ${className}`}>
      {/* Accessibility improvement: Add aria-live region */}
      <div 
        className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-wonderwhiz-purple/50 scrollbar-track-transparent"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence initial={false}>
          {replies.map((reply, index) => {
            const replySpecialist = reply.from_user ? null : getSpecialistInfo(reply.specialist_id || specialistId);
            
            return (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, x: reply.from_user ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-2"
              >
                <Avatar className="h-7 w-7 border border-white/10 mt-1">
                  {reply.from_user ? (
                    <AvatarFallback className="bg-indigo-500">U</AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={replySpecialist?.avatar} alt={replySpecialist?.name} />
                      <AvatarFallback className={replySpecialist?.fallbackColor || 'bg-purple-600'}>
                        {replySpecialist?.fallbackInitial || 'S'}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                
                <div className="flex-1">
                  <div className="bg-white/5 rounded-lg p-2 text-sm text-white/90">
                    <p className="text-xs font-medium mb-1">
                      {reply.from_user ? 'You' : replySpecialist?.name}
                    </p>
                    {reply.content}
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(reply.created_at).toLocaleDateString()} • {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isFetching && (
          <div className="p-2 text-center text-white/50 text-sm">
            <div className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white/80 animate-spin mr-2"></div>
            Loading messages...
          </div>
        )}
      </div>
      
      {/* Comment input form with accessibility improvements */}
      <div className="mt-3 flex items-center gap-2">
        <Avatar className="h-7 w-7 border border-white/10 flex-shrink-0">
          <AvatarFallback className="bg-indigo-500">U</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-center bg-white/5 rounded-full border border-white/10 pr-1">
          <Input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Chat with ${specialist?.name || 'Specialist'}...`}
            className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-white/40 flex-1 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSubmitReply();
              }
            }}
            disabled={isLoading}
            aria-label="Your message"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-indigo-500/30"
            onClick={handleSubmitReply}
            disabled={!replyText.trim() || isLoading}
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white/80 animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockRepliesSystem;
