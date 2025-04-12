
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface WonderPathItemProps {
  title: string;
  index: number;
  onClick: () => void;
}

const WonderPathItem: React.FC<WonderPathItemProps> = ({ title, index, onClick }) => {
  const getItemColor = (index: number) => {
    const colors = [
      'from-amber-500/20 to-yellow-600/20',
      'from-emerald-500/20 to-teal-600/20',
      'from-sky-500/20 to-blue-600/20',
      'from-fuchsia-500/20 to-pink-600/20',
      'from-purple-500/20 to-indigo-600/20',
    ];
    
    return colors[index % colors.length];
  };
  
  const getItemIcon = (index: number) => {
    const icons = ['🪐', '🦄', '🧠', '🔬', '🚀', '🌈', '🌎', '⚡'];
    return icons[index % icons.length];
  };
  
  return (
    <motion.button
      className={`w-full text-left p-3 rounded-lg bg-gradient-to-br ${getItemColor(index)} backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center">
        <span className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full mr-3 text-lg">
          {getItemIcon(index)}
        </span>
        
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm line-clamp-1">{title}</h3>
          
          <div className="flex items-center mt-1">
            <div className="flex items-center text-white/60 text-xs">
              <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
              <span className="text-amber-300">+5 sparks</span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default WonderPathItem;
