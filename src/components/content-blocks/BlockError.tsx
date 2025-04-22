
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlockErrorProps {
  message: string;
  error?: Error;
  onRetry?: () => void;
  childAge?: number;
}

export const BlockError: React.FC<BlockErrorProps> = ({
  message,
  error,
  onRetry,
  childAge = 10
}) => {
  // Adapt the messaging based on child age
  const getTitle = () => {
    if (childAge <= 7) {
      return "Oops! Something went wrong";
    } else if (childAge <= 11) {
      return "We hit a small problem";
    } else {
      return "Error Occurred";
    }
  };
  
  const getDescription = () => {
    if (childAge <= 7) {
      return message || "We couldn't show this part. Let's try again!";
    } else {
      return message || "There was an error loading this content.";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-5 mb-6"
    >
      <div className="flex items-start">
        <div className="bg-red-500/20 p-2 rounded-full mr-4">
          <AlertCircle className="h-5 w-5 text-red-300" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {getTitle()}
          </h3>
          
          <p className="text-white/80 mb-3">
            {getDescription()}
          </p>
          
          {childAge >= 12 && error && (
            <div className="bg-black/20 rounded p-3 mb-3 overflow-auto max-h-24 text-xs text-white/70 font-mono">
              {error.message}
            </div>
          )}
          
          {onRetry && (
            <Button 
              size="sm" 
              onClick={onRetry}
              className="bg-red-500/30 text-white hover:bg-red-500/50 border border-red-500/20"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
