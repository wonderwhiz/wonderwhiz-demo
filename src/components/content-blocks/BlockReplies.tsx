
import React from 'react';
import BlockReply from '../BlockReply';

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
    <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10">
      <h4 className="text-white text-xs sm:text-sm mb-2">Conversation</h4>
      <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto px-1">
        {replies.map(reply => (
          <BlockReply 
            key={reply.id} 
            content={reply.content} 
            fromUser={reply.from_user} 
            specialistId={reply.specialist_id || specialistId} 
            timestamp={reply.timestamp} 
          />
        ))}
      </div>
    </div>
  );
};

export default BlockReplies;
