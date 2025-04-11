
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { getSpecialistInfo } from '@/utils/specialists';

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
  user_id?: string | null;
  specialist_id?: string;
}

interface BlockRepliesProps {
  replies: BlockReply[];
  specialistId: string;
  onSendReply?: (message: string) => void;
}

const BlockReplies: React.FC<BlockRepliesProps> = ({ replies, specialistId, onSendReply }) => {
  const [replyText, setReplyText] = useState('');
  const specialist = getSpecialistInfo(specialistId);
  
  const handleSubmitReply = () => {
    if (replyText.trim() && onSendReply) {
      onSendReply(replyText);
      setReplyText('');
    }
  };
  
  return (
    <motion.div 
      className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-wonderwhiz-purple/50 scrollbar-track-transparent">
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
      </div>
      
      {/* Comment input form */}
      {onSendReply && (
        <div className="mt-3 flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-white/10 flex-shrink-0">
            <AvatarFallback className="bg-indigo-500">U</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center bg-white/5 rounded-full border border-white/10 pr-1">
            <Input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Chat with ${specialist.name}...`}
              className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-white/40 flex-1 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitReply();
                }
              }}
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-indigo-500/30"
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BlockReplies;
