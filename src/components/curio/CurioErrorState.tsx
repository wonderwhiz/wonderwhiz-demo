
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface CurioErrorStateProps {
  message?: string;
}

const CurioErrorState: React.FC<CurioErrorStateProps> = ({ message = "Something went wrong. Please try again later." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center py-12"
    >
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-w-md text-center">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Oops!</h3>
        <p className="text-white/70">{message}</p>
      </div>
    </motion.div>
  );
};

export default CurioErrorState;
