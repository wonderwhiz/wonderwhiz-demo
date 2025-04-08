
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

const CurioBlockListError = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  
  const handleRetry = () => {
    // Reload the current page if we're in a curio view
    if (window.location.pathname.includes('/curio/')) {
      window.location.reload();
    } else if (profileId) {
      // Navigate back to dashboard with profileId
      navigate(`/dashboard/${profileId}`);
    } else {
      // Fallback to navigate to profiles if no profileId
      navigate('/profiles');
    }
  };
  
  return (
    <motion.div 
      className="text-center py-10 px-4 text-white/70 max-w-md mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-4">
        <motion.div 
          className="bg-red-500/20 p-4 rounded-full"
          animate={{ 
            boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.2)', '0 0 0 10px rgba(239, 68, 68, 0)'],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </motion.div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Oops, something went wrong</h3>
      <p className="text-sm font-inter mb-4">
        Don't worry! Even the greatest explorers face challenges. Let's try again on our adventure!
      </p>
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="border-wonderwhiz-cyan text-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/10 group"
          onClick={handleRetry}
        >
          <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin" />
          <span>Try Again</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default CurioBlockListError;
