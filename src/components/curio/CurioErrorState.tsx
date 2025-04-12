
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
      className="flex flex-col items-center justify-center py-8 sm:py-12 text-center"
    >
      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4 shadow-inner shadow-red-500/10">
        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400/80" />
      </div>
      
      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-nunito">Oops!</h3>
      <p className="text-white/80 mb-1 text-base">{message}</p>
      
      <p className="text-white/60 max-w-sm mb-5 px-6 sm:px-0 text-sm font-inter">
        Let's try again to continue your discovery journey
      </p>
      
      <Button 
        variant="outline"
        onClick={() => window.location.reload()}
        className="bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20 text-sm font-medium transition-all duration-300"
      >
        <RefreshCw className="h-3.5 w-3.5 mr-2 opacity-70" />
        <span>Refresh</span>
      </Button>
    </motion.div>
  );
};

export default CurioErrorState;
