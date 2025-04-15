
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  onTaskClick
}) => {
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-medium text-white">Today's Tasks</h2>
        </div>
        <div className="text-xs text-white/70 px-2 py-1 bg-white/10 rounded-full">
          {pendingTasks.length} pending
        </div>
      </div>
      
      {pendingTasks.length > 0 ? (
        <div className="space-y-2 mb-2">
          {pendingTasks.map((task, index) => (
            <motion.div
              key={task.id}
              custom={index}
              variants={taskVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 cursor-pointer transition-colors"
              onClick={() => onTaskClick(task)}
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white text-xs">{index + 1}</span>
                </div>
                
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{task.title}</p>
                  <div className="flex items-center mt-1">
                    {task.duration && (
                      <>
                        <Clock className="h-3 w-3 text-white/60 mr-1" />
                        <span className="text-white/60 text-xs">{task.duration}</span>
                      </>
                    )}
                    
                    {task.reward && (
                      <div className="ml-3 flex items-center">
                        <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
                        <span className="text-amber-300 text-xs">+{task.reward}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-3 text-center text-white/70 text-sm bg-white/5 rounded-lg mb-2">
          All tasks completed! Great job!
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <>
          <div className="text-xs text-white/70 font-medium mt-4 mb-2">
            Completed
          </div>
          <div className="space-y-2 opacity-70">
            {completedTasks.slice(0, 2).map((task) => (
              <div
                key={task.id}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                  
                  <div>
                    <p className="text-white font-medium text-sm">{task.title}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-white/60 text-xs">Completed</span>
                      
                      {task.reward && (
                        <div className="ml-3 flex items-center">
                          <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
                          <span className="text-amber-300 text-xs">+{task.reward} earned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {completedTasks.length > 2 && (
              <div className="text-center text-xs text-white/60 mt-1">
                +{completedTasks.length - 2} more completed tasks
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TasksSection;
