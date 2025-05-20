
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

import { CheckCircle, AlertTriangle } from 'lucide-react';

interface BlockReplyFormProps {
  isLoading: boolean;
  onSubmit: (text: string) => void;
  isSuccess?: boolean; // New prop for success state
  error?: string | null; // New prop for error message
  onDismissError?: () => void; // Optional: callback to clear the error in parent state
  onDismissSuccess?: () => void; // Optional: callback to clear success state
}

const BlockReplyForm: React.FC<BlockReplyFormProps> = ({ 
  isLoading, 
  onSubmit,
  isSuccess,
  error,
  onDismissError,
  onDismissSuccess
}) => {
  const [replyText, setReplyText] = useState('');
  const [internalSuccess, setInternalSuccess] = useState(false);

  const handleSubmit = () => {
    if (replyText.trim() && !isLoading) {
      onSubmit(replyText); // Parent handles actual submission and error/success states
      setReplyText(''); // Clear input optimistically or on parent success signal
      setInternalSuccess(true); // Show internal success for a bit
      if (onDismissSuccess) onDismissSuccess(); // If parent manages success state visibility
      setTimeout(() => setInternalSuccess(false), 3000); // Clear internal success message
    }
  };
  
  // Effect to handle externally controlled success state
  useEffect(() => {
    if (isSuccess) {
      setReplyText(''); // Clear input if parent signals success
      setInternalSuccess(true);
      const timer = setTimeout(() => {
        setInternalSuccess(false);
        if (onDismissSuccess) onDismissSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onDismissSuccess]);


  return (
    <div className="mt-2 sm:mt-3">
      <div className="flex items-center space-x-2">
        <Input 
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          className={`bg-white/10 border-white/20 text-white text-xs sm:text-sm h-8 sm:h-10 ${error ? 'border-red-500/50' : ''}`}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
          disabled={isLoading}
        />
        <Button 
          onClick={handleSubmit}
          size="icon"
          className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-white h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
          disabled={!replyText.trim() || isLoading}
          aria-label="Send reply"
        >
          <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>
      {/* Display Success Message */}
      {internalSuccess && !error && ( // Show internal success if no overriding error
        <div className="mt-2 text-xs text-green-400 flex items-center">
          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
          Reply sent successfully!
        </div>
      )}
      {/* Display Error Message */}
      {error && (
        <div className="mt-2 text-xs text-red-400 flex items-center">
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
          {error}
          {onDismissError && (
            <button onClick={onDismissError} className="ml-2 text-white/70 hover:text-white text-xs underline">
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockReplyForm;
