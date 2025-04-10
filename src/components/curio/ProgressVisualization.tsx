
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressVisualizationProps {
  progress: number; // 0-100
  ageGroup: '5-7' | '8-11' | '12-16';
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  progress,
  ageGroup
}) => {
  // Determine visualization style based on age group
  const getVisualizationStyle = () => {
    switch(ageGroup) {
      case '5-7':
        return {
          icon: <Rocket className="h-6 w-6" />,
          pathColor: 'from-wonderwhiz-vibrant-yellow via-wonderwhiz-bright-pink to-wonderwhiz-cyan',
          theme: 'space adventure'
        };
      case '8-11':
        return {
          icon: <Rocket className="h-6 w-6" />,
          pathColor: 'from-wonderwhiz-cyan via-wonderwhiz-bright-pink to-wonderwhiz-gold',
          theme: 'explorer journey'
        };
      case '12-16':
        return {
          icon: <Rocket className="h-6 w-6" />,
          pathColor: 'from-wonderwhiz-blue-accent via-wonderwhiz-bright-pink to-wonderwhiz-gold',
          theme: 'knowledge quest'
        };
      default:
        return {
          icon: <Rocket className="h-6 w-6" />,
          pathColor: 'from-wonderwhiz-vibrant-yellow via-wonderwhiz-bright-pink to-wonderwhiz-cyan',
          theme: 'learning journey'
        };
    }
  };

  const { icon, pathColor, theme } = getVisualizationStyle();

  // For stars/planets in the background
  const stars = Array(8).fill(0).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 2,
    left: `${Math.random() * 90 + 5}%`,
    top: `${Math.random() * 70 + 10}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative py-6 mt-4 mb-8"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-white/60 font-inter">Your {theme} progress</p>
        <span className="text-xs font-medium text-white/80">{Math.round(progress)}% complete</span>
      </div>
      
      {/* Background stars/planets */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white/30"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay
          }}
        />
      ))}
      
      {/* Progress path */}
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", pathColor)}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
      
      {/* Rocket/icon position */}
      <motion.div
        className="absolute bottom-4 flex items-center justify-center"
        initial={{ left: '0%' }}
        animate={{ left: `${Math.max(0, Math.min(progress, 97))}%` }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow flex items-center justify-center text-wonderwhiz-deep-purple">
          {icon}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressVisualization;
