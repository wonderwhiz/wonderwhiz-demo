
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

interface BlockErrorProps {
  error?: Error;
  message?: string;
  onRetry?: () => void;
  childAge?: number;
}

const BlockError: React.FC<BlockErrorProps> = ({
  error,
  message = "Something went wrong while loading this content.",
  onRetry,
  childAge = 10
}) => {
  const { textSize, messageStyle } = useAgeAdaptation(childAge);
  
  const getErrorMessage = () => {
    if (messageStyle === 'playful') {
      return "Oops! Something's not working right. Let's try again!";
    } else if (messageStyle === 'casual') {
      return message || "We ran into a problem loading this content. Want to try again?";
    }
    return message;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        
        <p className={`${textSize} text-white/80`}>
          {getErrorMessage()}
        </p>
        
        {error?.message && messageStyle === 'formal' && (
          <p className="text-xs text-white/60 mt-1">
            Error details: {error.message}
          </p>
        )}
        
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2 bg-white/5 hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {messageStyle === 'playful' ? "Try Again!" : "Retry"}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default BlockError;
