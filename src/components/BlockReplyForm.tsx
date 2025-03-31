
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface BlockReplyFormProps {
  isLoading: boolean;
  onSubmit: (text: string) => void;
}

const BlockReplyForm: React.FC<BlockReplyFormProps> = ({ isLoading, onSubmit }) => {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = () => {
    if (replyText.trim() && !isLoading) {
      onSubmit(replyText);
      setReplyText('');
    }
  };

  return (
    <div className="mt-2 sm:mt-3 flex items-center space-x-2">
      <Input 
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Type your reply..."
        className="bg-white/10 border-white/20 text-white text-xs sm:text-sm h-8 sm:h-10"
        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
        disabled={isLoading}
      />
      <Button 
        onClick={handleSubmit}
        size="icon"
        className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-white h-8 w-8 sm:h-10 sm:w-10"
        disabled={!replyText.trim() || isLoading}
        aria-label="Send reply"
      >
        <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};

export default BlockReplyForm;
