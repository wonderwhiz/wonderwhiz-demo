
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, Link, PencilRuler, Zap } from 'lucide-react';
import { LearningStage } from '@/hooks/use-progressive-learning';
import { cn } from '@/lib/utils';

interface LearningProgressIndicatorProps {
  currentStage: LearningStage;
  viewedBlocks: number;
  totalBlocks: number;
  childAge?: number;
  onClick?: (stage: LearningStage) => void;
}

const LearningProgressIndicator: React.FC<LearningProgressIndicatorProps> = ({
  currentStage,
  viewedBlocks,
  totalBlocks,
  childAge = 10,
  onClick
}) => {
  const progress = Math.min(100, Math.round((viewedBlocks / Math.max(totalBlocks, 1)) * 100));
  
  const stages: {
    id: LearningStage;
    name: string;
    simpleName?: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'foundational',
      name: 'Foundation',
      simpleName: 'Basics',
      icon: <BookOpen className="h-4 w-4" />,
      color: 'bg-blue-500'
    },
    {
      id: 'expansion',
      name: 'Expansion',
      simpleName: 'More',
      icon: <Lightbulb className="h-4 w-4" />,
      color: 'bg-amber-500'
    },
    {
      id: 'connection',
      name: 'Connections',
      simpleName: 'Links',
      icon: <Link className="h-4 w-4" />,
      color: 'bg-violet-500'
    },
    {
      id: 'application',
      name: 'Application',
      simpleName: 'Try It',
      icon: <PencilRuler className="h-4 w-4" />,
      color: 'bg-emerald-500'
    },
    {
      id: 'deeper_dive',
      name: 'Deeper Dive',
      simpleName: 'Expert',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-fuchsia-500'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium text-sm">Learning Journey</h3>
        <span className="text-xs text-white/70">
          {progress}% explored
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <motion.div 
          className="h-full bg-gradient-to-r from-wonderwhiz-cyan via-wonderwhiz-purple to-wonderwhiz-bright-pink"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Learning Stages */}
      <div className="flex justify-between">
        {stages.map((stage, index) => {
          const isActive = currentStage === stage.id;
          const isPast = getStagePriority(currentStage) >= getStagePriority(stage.id);
          
          return (
            <motion.button
              key={stage.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onClick?.(stage.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-1 py-1 rounded-md transition-all",
                isActive ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              <div 
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full",
                  isPast ? stage.color : "bg-white/10"
                )}
              >
                {stage.icon}
              </div>
              <span className={cn(
                "text-xs whitespace-nowrap",
                isPast ? "text-white" : "text-white/60"
              )}>
                {childAge <= 8 && stage.simpleName ? stage.simpleName : stage.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

// Helper to determine stage priority for progress indication
function getStagePriority(stage: LearningStage): number {
  const priorities: Record<LearningStage, number> = {
    foundational: 1,
    expansion: 2,
    connection: 3,
    application: 4,
    deeper_dive: 5
  };
  
  return priorities[stage] || 0;
}

export default LearningProgressIndicator;
