
import React from 'react';
import SpecialistAvatar from './SpecialistAvatar';

interface BlockReplyProps {
  content: string;
  fromUser: boolean;
  specialistId?: string;
  timestamp: string;
}

const BlockReply: React.FC<BlockReplyProps> = ({ content, fromUser, specialistId = 'nova', timestamp }) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={`flex ${fromUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${fromUser ? 'order-1' : 'order-2'}`}>
        <div className={`flex items-center ${fromUser ? 'justify-end' : 'justify-start'} mb-1`}>
          {!fromUser && <SpecialistAvatar specialistId={specialistId} size="sm" className="mr-2" />}
          <span className={`text-xs ${fromUser ? 'text-white/60' : 'text-white/70'}`}>
            {fromUser ? 'You' : 'Specialist'} • {formattedTime}
          </span>
        </div>
        <div className={`p-3 rounded-lg ${fromUser ? 'bg-wonderwhiz-purple/40' : 'bg-white/10'}`}>
          <p className="text-sm text-white">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default BlockReply;
