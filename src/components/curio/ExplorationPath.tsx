
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface ExplorationPathProps {
  path: string[];
  onNavigate: (index: number) => void;
}

const ExplorationPath: React.FC<ExplorationPathProps> = ({ path, onNavigate }) => {
  return (
    <motion.div 
      className="mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-1">
        {path.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-white/50 flex-shrink-0" />
            )}
            <button
              className={`px-2 py-1 rounded text-sm ${
                index === path.length - 1
                  ? 'bg-purple-700/30 text-purple-200 font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => onNavigate(index)}
            >
              {item.length > 25 ? `${item.substring(0, 25)}...` : item}
            </button>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default ExplorationPath;
