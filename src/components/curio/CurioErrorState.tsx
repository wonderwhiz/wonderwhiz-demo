
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurioErrorStateProps {
  message?: string;
}

const CurioErrorState: React.FC<CurioErrorStateProps> = ({ message = "Something went wrong" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-10 sm:py-16 text-center"
    >
      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5 shadow-inner">
        <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-400/90" />
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-nunito">Oops!</h3>
      <p className="text-white/90 mb-1 text-base sm:text-lg">{message}</p>
      
      <p className="text-white/70 max-w-sm mb-6 px-6 sm:px-0 text-sm sm:text-base font-inter">
        Let's try again to continue your discovery journey
      </p>
      
      <Button 
        variant="outline"
        onClick={() => window.location.reload()}
        className="bg-white/10 hover:bg-white/15 text-white border-white/10 hover:border-white/20 text-sm font-medium transition-all duration-300"
      >
        <RefreshCw className="h-3.5 w-3.5 mr-2 opacity-80" />
        <span>Try Again</span>
      </Button>
    </motion.div>
  );
};

export default CurioErrorState;
