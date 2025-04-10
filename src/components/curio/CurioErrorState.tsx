
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 font-nunito">Oops! {message}</h3>
      
      <p className="text-white/60 max-w-md mb-6">
        We've encountered an issue while preparing your content. Let's try again.
      </p>
      
      <Button 
        variant="default"
        onClick={() => window.location.reload()}
        className="bg-white/10 text-white hover:bg-white/20"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        <span>Refresh</span>
      </Button>
    </motion.div>
  );
};

export default CurioErrorState;
