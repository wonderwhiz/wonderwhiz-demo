
import React from 'react';
import BlockReply from '../BlockReply';
import { motion, AnimatePresence } from 'framer-motion';

interface Reply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  timestamp: string;
  specialist_id?: string;
}

interface BlockRepliesProps {
  replies: Reply[];
  specialistId: string;
}

const BlockReplies: React.FC<BlockRepliesProps> = ({ replies, specialistId }) => {
  if (replies.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h4 className="text-white text-xs sm:text-sm mb-2 flex items-center">
        <span className="relative inline-flex mr-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span className="w-2 h-2 rounded-full bg-green-400 absolute inset-0 animate-ping opacity-75"></span>
        </span>
        Conversation
      </h4>
      <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto px-1">
        <AnimatePresence initial={false}>
          {replies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, x: reply.from_user ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <BlockReply 
                content={reply.content} 
                fromUser={reply.from_user} 
                specialistId={reply.specialist_id || specialistId} 
                timestamp={reply.timestamp} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BlockReplies;
