import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Star, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  type: 'quiz' | 'read' | 'create' | 'explore';
  duration?: string;
  reward?: number;
}

interface TasksSectionProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  childId?: string;
  pendingTasksCount?: number;
  isLoading?: boolean;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  onTaskClick,
  childId,
  pendingTasksCount,
  isLoading
}) => {
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-white/10 rounded w-1/4"></div>
          <div className="h-20 bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }

  if (pendingTasks.length === 0 && (!pendingTasksCount || pendingTasksCount === 0)) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-6 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Today's Quests</h2>
            <p className="text-sm text-white/70">Complete these to earn sparks!</p>
          </div>
        </div>
        
        {pendingTasks.length > 0 && (
          <div className="bg-green-500/30 px-2.5 py-1 rounded-full text-white text-sm font-medium">
            {pendingTasks.length} {pendingTasks.length === 1 ? 'quest' : 'quests'}
          </div>
        )}
      </div>
      
      {pendingTasks.length > 0 ? (
        <div className="space-y-2 mb-2">
          {pendingTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onTaskClick(task)}
              className="group cursor-pointer"
            >
              <div className="bg-white/5 group-hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center">
                    <span className="text-wonderwhiz-bright-pink text-sm font-bold">{index + 1}</span>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-white font-medium text-base group-hover:text-wonderwhiz-bright-pink transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center mt-2 gap-4">
                      {task.duration && (
                        <div className="flex items-center text-white/60">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs">{task.duration}</span>
                        </div>
                      )}
                      
                      {task.reward && (
                        <div className="flex items-center">
                          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-wonderwhiz-gold" />
                          <span className="text-wonderwhiz-gold text-xs">+{task.reward} sparks</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <motion.div
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : pendingTasksCount && pendingTasksCount > 0 ? (
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white text-center">You have {pendingTasksCount} pending tasks!</p>
          <div className="mt-2 flex justify-center">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.href = `/tasks/${childId}`}
            >
              View Tasks
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-wonderwhiz-bright-pink/20 mb-4"
          >
            <Star className="h-8 w-8 text-wonderwhiz-bright-pink" />
          </motion.div>
          <h3 className="text-white font-bold text-lg mb-1">All Caught Up!</h3>
          <p className="text-white/60 text-sm">Check back later for new quests</p>
        </div>
      )}
    </div>
  );
};

export default TasksSection;
