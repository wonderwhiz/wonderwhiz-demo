
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Star, Award } from 'lucide-react';

interface ProgressVisualizationProps {
  progress: number;
  ageGroup: '5-7' | '8-11' | '12-16';
  totalChapters: number;
  completedChapters: number;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({ 
  progress, 
  ageGroup,
  totalChapters,
  completedChapters
}) => {
  const renderAgeAppropriateVisualization = () => {
    switch(ageGroup) {
      case '5-7':
        return <YoungChildVisualization progress={progress} totalChapters={totalChapters} completedChapters={completedChapters} />;
      case '8-11': 
        return <MiddleChildVisualization progress={progress} totalChapters={totalChapters} completedChapters={completedChapters} />;
      case '12-16':
        return <OlderChildVisualization progress={progress} totalChapters={totalChapters} completedChapters={completedChapters} />;
      default:
        return <MiddleChildVisualization progress={progress} totalChapters={totalChapters} completedChapters={completedChapters} />;
    }
  };

  return (
    <motion.div 
      className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {renderAgeAppropriateVisualization()}
    </motion.div>
  );
};

const YoungChildVisualization: React.FC<{ progress: number, totalChapters: number, completedChapters: number }> = ({ 
  progress,
  totalChapters,
  completedChapters 
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-400" />
          Your Adventure Map
        </h3>
        <div className="text-white/70 text-sm">
          {completedChapters} of {totalChapters} chapters discovered
        </div>
      </div>
      
      <div className="relative h-10 rounded-full overflow-hidden bg-white/10">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        
        <div className="absolute top-0 left-0 h-full w-full">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <defs>
              <pattern id="stars" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="white" fillOpacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars)" />
          </svg>
        </div>
        
        <motion.div 
          className="absolute top-0 left-0 h-full flex items-center"
          style={{ left: `${progress}%` }}
          initial={{ left: 0 }}
          animate={{ left: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.div 
            className="w-8 h-8 -ml-4 bg-white rounded-full flex items-center justify-center"
            animate={{ 
              boxShadow: ['0 0 0 rgba(255, 255, 255, 0.4)', '0 0 20px rgba(255, 255, 255, 0.8)', '0 0 0 rgba(255, 255, 255, 0.4)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-5 h-5 text-yellow-500" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const MiddleChildVisualization: React.FC<{ progress: number, totalChapters: number, completedChapters: number }> = ({ 
  progress,
  totalChapters,
  completedChapters 
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center">
          <Rocket className="w-5 h-5 mr-2 text-wonderwhiz-bright-pink" />
          Your Learning Expedition
        </h3>
        <div className="text-white/70 text-sm">
          {completedChapters} of {totalChapters} chapters completed
        </div>
      </div>
      
      <div className="relative h-12 rounded-full overflow-hidden bg-wonderwhiz-deep-purple/50">
        {/* Cosmic background */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cosmicPath" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b2970" />
                <stop offset="100%" stopColor="#7224a7" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#cosmicPath)" />
          </svg>
        </div>
        
        {/* Progress bar */}
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        
        {/* Chapter milestones */}
        <div className="absolute top-0 left-0 h-full w-full flex items-center">
          {Array.from({ length: totalChapters }).map((_, i) => (
            <div 
              key={i} 
              className="absolute h-full flex items-center"
              style={{ left: `${(i + 1) * (100 / totalChapters)}%` }}
            >
              <div className={`h-3 w-3 rounded-full -ml-1.5 ${i < completedChapters ? 'bg-white' : 'bg-white/30'}`}></div>
            </div>
          ))}
        </div>
        
        {/* Rocket ship */}
        <motion.div 
          className="absolute top-0 left-0 h-full flex items-center"
          style={{ left: `${progress}%` }}
          initial={{ left: 0 }}
          animate={{ left: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.div 
            className="w-10 h-10 -ml-5 flex items-center justify-center"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rocket className="w-6 h-6 text-white transform -rotate-90" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const OlderChildVisualization: React.FC<{ progress: number, totalChapters: number, completedChapters: number }> = ({ 
  progress,
  totalChapters,
  completedChapters
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center">
          <Award className="w-5 h-5 mr-2 text-wonderwhiz-gold" />
          Knowledge Progression
        </h3>
        <div className="text-white/70 text-sm">
          {completedChapters}/{totalChapters} stages ({Math.round(progress)}%)
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {Array.from({ length: totalChapters }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full ${i < completedChapters ? 'bg-wonderwhiz-vibrant-yellow' : 'bg-white/20'}`}
          ></div>
        ))}
      </div>
      
      <div className="relative h-2 rounded-full overflow-hidden bg-white/10">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-wonderwhiz-vibrant-yellow"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
      
      <div className="text-white/70 text-xs flex justify-between">
        <span>Beginning</span>
        <span>Advanced</span>
      </div>
    </div>
  );
};

export default ProgressVisualization;
