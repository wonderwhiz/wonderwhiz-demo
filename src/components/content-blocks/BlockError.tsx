
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, LightbulbOff, Lightbulb } from 'lucide-react';
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
  const { textSize, interactionSize } = useAgeAdaptation(childAge);
  
  // Get a child-friendly error message based on the age
  const getFriendlyErrorMessage = (): string => {
    if (childAge <= 7) {
      return "Oops! This part of the lesson is taking a little nap. Let's try again!";
    } else if (childAge <= 11) {
      return "Hmm, we're having trouble showing this part of your learning adventure. Let's try refreshing it!";
    } else {
      return message || "We couldn't load this content block. Please try refreshing it.";
    }
  };
  
  // Get appropriate icon based on child age
  const getIcon = () => {
    if (childAge <= 7) {
      return <LightbulbOff className="h-10 w-10 text-amber-300/70" />;
    } else if (childAge <= 11) {
      return <Lightbulb className="h-10 w-10 text-amber-300/70" />;
    } else {
      return <AlertCircle className="h-10 w-10 text-amber-300/70" />;
    }
  };
  
  // Get button label based on child age
  const getButtonLabel = (): string => {
    if (childAge <= 7) {
      return "Wake it up!";
    } else if (childAge <= 11) {
      return "Refresh";
    } else {
      return "Try Again";
    }
  };
  
  // Map the age adaptation size to button size
  const getButtonSize = () => {
    switch (interactionSize) {
      case 'large':
        return 'lg';
      case 'small':
        return 'sm';
      case 'default':
      default:
        return 'default';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl bg-gradient-to-br from-purple-900/30 to-red-900/30 border border-red-500/20 overflow-hidden p-5 text-center shadow-glow-brand-red"
    >
      <div className="flex flex-col items-center justify-center py-4">
        {getIcon()}
        
        <h3 className={`mt-4 mb-2 font-semibold text-white ${textSize === 'text-lg' ? 'text-xl' : textSize}`}>
          {getFriendlyErrorMessage()}
        </h3>
        
        {childAge > 11 && error?.message && (
          <p className="text-white/60 text-sm mt-1 mb-3 max-w-lg mx-auto">
            {error.message.substring(0, 120)}
            {error.message.length > 120 ? '...' : ''}
          </p>
        )}
        
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size={getButtonSize()}
            className="mt-3 border-purple-400/30 bg-purple-900/30 text-white hover:bg-purple-800/50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {getButtonLabel()}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default BlockError;
