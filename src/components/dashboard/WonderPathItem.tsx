
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface WonderPathItemProps {
  title: string;
  index: number;
  onClick: () => void;
}

const WonderPathItem: React.FC<WonderPathItemProps> = ({ 
  title, 
  index,
  onClick
}) => {
  return (
    <motion.button
      className="w-full flex items-center text-left p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400/60 to-orange-500/60 flex items-center justify-center mr-3 flex-shrink-0">
        <span className="text-white text-sm">{index + 1}</span>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-white text-sm font-medium group-hover:text-white/90 line-clamp-1">{title}</h3>
      </div>
      
      <div className="ml-2 flex-shrink-0">
        <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.button>
  );
};

export default WonderPathItem;
