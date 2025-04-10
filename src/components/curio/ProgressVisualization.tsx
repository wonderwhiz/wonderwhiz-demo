
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Star, Award } from 'lucide-react';

interface ProgressVisualizationProps {
  progress: number;
  ageGroup: '5-7' | '8-11' | '12-16';
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({ 
  progress,
  ageGroup 
}) => {
  // Different visualizations based on age group
  const renderAgeAppropriateVisualization = () => {
    if (ageGroup === '5-7') {
      // Simplified, more visual progress for younger children
      return (
        <div className="relative h-24 mb-2">
          <div className="absolute inset-0">
            <div className="h-full relative overflow-hidden rounded-xl bg-gradient-to-r from-wonderwhiz-deep-purple/30 to-wonderwhiz-deep-purple/50">
              {/* Stars in background */}
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1.5 w-1.5 bg-white rounded-full opacity-60"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
              
              {/* Path */}
              <div className="absolute left-0 right-0 top-1/2 h-4 -translate-y-1/2 bg-gradient-to-r from-wonderwhiz-vibrant-yellow/20 via-wonderwhiz-bright-pink/20 to-wonderwhiz-cyan/20 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-wonderwhiz-vibrant-yellow via-wonderwhiz-bright-pink to-wonderwhiz-cyan rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              {/* Rocket */}
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2"
                initial={{ left: "2%" }}
                animate={{ left: `${Math.max(2, Math.min(progress - 2, 95))}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Rocket className="h-8 w-8 text-wonderwhiz-bright-pink transform -rotate-90" />
              </motion.div>
            </div>
          </div>
        </div>
      );
    } else if (ageGroup === '8-11') {
      // Standard visualization with more information
      return (
        <div className="relative h-16 mb-2">
          <div className="absolute inset-0">
            <div className="h-full relative overflow-hidden rounded-xl bg-gradient-to-r from-wonderwhiz-deep-purple/30 to-wonderwhiz-deep-purple/50">
              {/* Path with milestones */}
              <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-wonderwhiz-vibrant-yellow via-wonderwhiz-bright-pink to-wonderwhiz-cyan rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                
                {/* Milestone markers */}
                {[20, 40, 60, 80, 100].map(milestone => (
                  <div 
                    key={milestone} 
                    className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full ${
                      progress >= milestone ? "bg-wonderwhiz-bright-pink" : "bg-white/20"
                    }`}
                    style={{ left: `${milestone}%`, transform: "translate(-50%, -50%)" }}
                  />
                ))}
              </div>
              
              {/* Rocket */}
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2"
                initial={{ left: "2%" }}
                animate={{ left: `${Math.max(2, Math.min(progress - 2, 95))}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Rocket className="h-6 w-6 text-wonderwhiz-bright-pink transform -rotate-90" />
              </motion.div>
            </div>
          </div>
        </div>
      );
    } else {
      // More sophisticated for older children
      return (
        <div className="relative h-10 mb-2">
          <div className="absolute inset-0">
            <div className="h-full relative overflow-hidden rounded-xl bg-wonderwhiz-deep-purple/40 backdrop-blur-sm">
              {/* Path with labeled milestones */}
              <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-wonderwhiz-cyan via-wonderwhiz-bright-pink to-wonderwhiz-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              {/* Position indicator */}
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 z-10"
                initial={{ left: "2%" }}
                animate={{ left: `${Math.max(2, Math.min(progress - 1, 98))}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="h-3 w-3 bg-white rounded-full shadow-glow-brand-pink" />
              </motion.div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  // Different text based on progress level
  const getProgressText = () => {
    if (progress < 20) {
      return "Just getting started!";
    } else if (progress < 40) {
      return "Building foundational knowledge";
    } else if (progress < 60) {
      return "Making good progress";
    } else if (progress < 80) {
      return "Advanced understanding";
    } else {
      return "Journey nearly complete!";
    }
  };

  return (
    <div className="mb-8">
      {renderAgeAppropriateVisualization()}
      
      <div className="flex justify-between items-center text-xs">
        <div className="text-white/70">
          {progress < 100 ? getProgressText() : (
            <span className="flex items-center text-wonderwhiz-vibrant-yellow">
              <Award className="h-3 w-3 mr-1" /> Journey Complete!
            </span>
          )}
        </div>
        <div className="text-white font-medium">{Math.round(progress)}% complete</div>
      </div>
    </div>
  );
};

export default ProgressVisualization;
