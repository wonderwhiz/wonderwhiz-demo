
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface NarrativeProgressProps {
  totalBlocks: number;
  theme: 'space' | 'nature' | 'science' | 'history' | 'arts' | 'technology' | string;
}

const NarrativeProgress: React.FC<NarrativeProgressProps> = ({ 
  totalBlocks,
  theme
}) => {
  // Get theme-specific colors
  const getThemeColors = () => {
    switch(theme) {
      case 'space':
        return 'from-indigo-600 to-purple-700';
      case 'nature':
        return 'from-emerald-600 to-teal-700';
      case 'science':
        return 'from-sky-600 to-blue-700';
      case 'history':
        return 'from-amber-600 to-orange-700';
      case 'arts':
        return 'from-pink-600 to-rose-700';
      case 'technology':
        return 'from-cyan-600 to-blue-700';
      default:
        return 'from-indigo-600 to-purple-700';
    }
  };

  return (
    <div className="mb-6 pt-2 pb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-white/60">Learning journey progress</div>
        <div className="text-sm text-white/60">{totalBlocks} knowledge blocks</div>
      </div>
      
      <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getThemeColors()}`}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: totalBlocks * 0.5, ease: "linear" }}
        />
        
        <motion.div
          className="absolute top-0 transform -translate-y-1/2"
          initial={{ left: 0 }}
          animate={{ left: '100%' }}
          transition={{ duration: totalBlocks * 0.5, ease: "linear" }}
        >
          <Rocket className="h-4 w-4 text-white transform -rotate-90" />
        </motion.div>
      </div>
    </div>
  );
};

export default NarrativeProgress;
