
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurioErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const CurioErrorState: React.FC<CurioErrorStateProps> = ({ 
  message = "Oops! Something went wrong with this exploration.", 
  onRetry 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center py-12 px-4"
    >
      <div className="bg-white/5 border border-white/20 rounded-xl p-6 max-w-md text-center shadow-glow-sm">
        <div className="flex justify-center mb-5">
          <div className="relative w-16 h-16">
            <motion.div 
              className="absolute inset-0 rounded-full bg-orange-500/20 blur-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative flex items-center justify-center h-full">
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 font-nunito">Hmm, That's Strange!</h3>
        <p className="text-white/70 mb-5">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/90 text-wonderwhiz-deep-purple font-medium"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => window.location.reload()}
          >
            <Lightbulb className="w-4 h-4 mr-2 text-wonderwhiz-gold" />
            Try a New Question
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CurioErrorState;
