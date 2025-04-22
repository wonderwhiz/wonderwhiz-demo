
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, LightbulbOff, Lightbulb, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

interface BlockErrorProps {
  error?: Error;
  message?: string;
  onRetry?: () => void;
  childAge?: number;
}

export const BlockError: React.FC<BlockErrorProps> = ({
  error,
  message = "Something went wrong while loading this content.",
  onRetry,
  childAge = 10
}) => {
  const { textSize, interactionSize } = useAgeAdaptation(childAge);
  
  const getFriendlyErrorMessage = (): string => {
    if (childAge <= 7) {
      return "Oops! This magical part is taking a little nap. Let's wake it up!";
    } else if (childAge <= 11) {
      return "Hmm, we're having trouble with this part of your learning adventure. Let's try again!";
    } else {
      return message || "We couldn't load this content. Let's try refreshing it.";
    }
  };
  
  const getIcon = () => {
    if (childAge <= 7) {
      return <LightbulbOff className="h-12 w-12 text-amber-300/70" />;
    } else if (childAge <= 11) {
      return <Lightbulb className="h-12 w-12 text-amber-300/70" />;
    } else {
      return <AlertCircle className="h-12 w-12 text-amber-300/70" />;
    }
  };
  
  const getButtonLabel = (): string => {
    if (childAge <= 7) {
      return "Make it Magical Again!";
    } else if (childAge <= 11) {
      return "Try Again!";
    } else {
      return "Retry";
    }
  };
  
  const getButtonSize = (): "default" | "sm" | "lg" | "icon" => {
    switch (interactionSize) {
      case 'large':
        return 'lg';
      case 'small':
        return 'sm';
      default:
        return 'default';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-gradient-to-br from-purple-900/30 to-red-900/30 border border-red-500/20 overflow-hidden p-5 text-center shadow-glow-brand-red"
    >
      <div className="flex flex-col items-center justify-center py-6">
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {getIcon()}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 space-y-2"
        >
          <h3 className={`font-semibold text-white ${textSize === 'text-lg' ? 'text-xl' : textSize}`}>
            {getFriendlyErrorMessage()}
          </h3>
          
          {childAge > 11 && error?.message && (
            <p className="text-white/60 text-sm mt-1 mb-3 max-w-lg mx-auto">
              {error.message.substring(0, 120)}
              {error.message.length > 120 ? '...' : ''}
            </p>
          )}
        </motion.div>
        
        {onRetry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onRetry}
              variant="outline"
              size={getButtonSize()}
              className="mt-5 border-purple-400/30 bg-purple-900/30 text-white hover:bg-purple-800/50 group"
            >
              <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              {getButtonLabel()}
              <Sparkles className="ml-2 h-4 w-4 text-amber-300/70" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BlockError;
