
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star, Clock, Book, Play } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  type: 'daily' | 'learning' | 'creative' | 'challenge';
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

interface TaskOrbitsProps {
  tasks: Task[];
  visible: boolean;
  onTaskClick: (taskId: string) => void;
  maxTasks?: number;
}

const TaskOrbits: React.FC<TaskOrbitsProps> = ({
  tasks,
  visible,
  onTaskClick,
  maxTasks = 5
}) => {
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    // Select tasks to display, prioritize by type and priority
    const priorityMap = { high: 3, medium: 2, low: 1 };
    
    const sortedTasks = [...tasks].sort((a, b) => {
      // First sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority
      const aPriority = priorityMap[a.priority] || 0;
      const bPriority = priorityMap[b.priority] || 0;
      
      return bPriority - aPriority;
    });
    
    setDisplayedTasks(sortedTasks.slice(0, maxTasks));
  }, [tasks, maxTasks]);

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'daily':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'learning':
        return <Book className="h-4 w-4" />;
      case 'creative':
        return <Star className="h-4 w-4" />;
      case 'challenge':
        return <Play className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getTaskColor = (type: Task['type'], completed: boolean) => {
    if (completed) return 'bg-gray-400/50 text-white/50';
    
    switch (type) {
      case 'daily':
        return 'bg-green-500/70 text-white';
      case 'learning':
        return 'bg-blue-500/70 text-white';
      case 'creative':
        return 'bg-amber-500/70 text-white';
      case 'challenge':
        return 'bg-purple-500/70 text-white';
      default:
        return 'bg-gray-500/70 text-white';
    }
  };
  
  // Calculate positions in orbit
  const calculatePosition = (index: number, total: number, radius: number = 150) => {
    const angle = (index / total) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{ zIndex: 40 }}
        >
          {/* Orbit visualization */}
          <motion.div
            className="absolute w-72 h-72 rounded-full border border-white/10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Tasks in orbit */}
          {displayedTasks.map((task, index) => {
            const { x, y } = calculatePosition(index, displayedTasks.length);
            const delay = 0.2 + (index * 0.1);
            
            return (
              <motion.div
                key={task.id}
                className={`absolute pointer-events-auto cursor-pointer rounded-full px-3 py-1.5 ${getTaskColor(task.type, task.completed)}`}
                style={{ translateX: x, translateY: y, zIndex: 41 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20, 
                  delay
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => onTaskClick(task.id)}
              >
                <div className="flex items-center space-x-2">
                  {getTaskIcon(task.type)}
                  <span className="text-xs whitespace-nowrap max-w-32 truncate">
                    {task.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskOrbits;
