
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlockErrorStateProps {
  message?: string;
  onRetry?: () => void;
  type?: 'loading' | 'error' | 'empty';
  childAge?: number;
}

const BlockErrorState: React.FC<BlockErrorStateProps> = ({
  message = "There was a problem loading this content.",
  onRetry,
  type = 'error',
  childAge = 10
}) => {
  // Adjust messaging based on child age
  const getErrorMessage = () => {
    if (childAge <= 7) {
      switch (type) {
        case 'loading': 
          return "Still getting your amazing content ready!";
        case 'error': 
          return "Oops! Something went wrong with this part.";
        case 'empty':
          return "Nothing here yet. Let's explore something else!";
        default:
          return "Hmm, something's not right here.";
      }
    } else if (childAge <= 11) {
      switch (type) {
        case 'loading': 
          return "Loading your content...";
        case 'error': 
          return "Sorry! We couldn't load this content correctly.";
        case 'empty':
          return "This section is empty. Try exploring another topic!";
        default:
          return message;
      }
    } else {
      return message;
    }
  };

  const errorMessage = getErrorMessage();

  return (
    <motion.div
      className="p-6 rounded-lg bg-black/20 border border-white/10 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-red-400" />
        </div>
        
        <p className="text-white/80 max-w-sm mx-auto">
          {errorMessage}
        </p>
        
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            className="mt-2 bg-white/5 hover:bg-white/10 border-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>{childAge <= 7 ? "Try Again!" : "Retry"}</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default BlockErrorState;
