
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { CheckCircle2, Star, Clock, Book, Play, CheckSquare, Award, Zap } from 'lucide-react';

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
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(150);
  const [rotationSpeed, setRotationSpeed] = useState(50); // seconds for a full rotation
  const orbitRef = useRef<HTMLDivElement>(null);
  const orbitControls = useAnimation();
  
  // Adjust radius based on screen size for responsive design
  useEffect(() => {
    const updateRadius = () => {
      const screenWidth = window.innerWidth;
      // Adjust radius based on screen size (smaller on mobile devices)
      const newRadius = screenWidth < 768 ? 120 : screenWidth < 1024 ? 150 : 180;
      setOrbitRadius(newRadius);
    };
    
    updateRadius();
    window.addEventListener('resize', updateRadius);
    
    return () => window.removeEventListener('resize', updateRadius);
  }, []);
  
  // Start orbiting animation when visible
  useEffect(() => {
    if (visible) {
      orbitControls.start({
        rotate: 360,
        transition: {
          duration: rotationSpeed,
          ease: "linear",
          repeat: Infinity
        }
      });
    } else {
      orbitControls.stop();
    }
  }, [visible, rotationSpeed, orbitControls]);
  
  // Filter and sort tasks
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
        return 'bg-green-500/80 text-white';
      case 'learning':
        return 'bg-blue-500/80 text-white';
      case 'creative':
        return 'bg-amber-500/80 text-white';
      case 'challenge':
        return 'bg-purple-500/80 text-white';
      default:
        return 'bg-gray-500/80 text-white';
    }
  };
  
  const getTaskGlow = (type: Task['type'], completed: boolean) => {
    if (completed) return '';
    
    switch (type) {
      case 'daily':
        return 'shadow-md shadow-green-400/30';
      case 'learning':
        return 'shadow-md shadow-blue-400/30';
      case 'creative':
        return 'shadow-md shadow-amber-400/30';
      case 'challenge':
        return 'shadow-md shadow-purple-400/30';
      default:
        return '';
    }
  };
  
  // Calculate positions in orbit
  const calculatePosition = (index: number, total: number, radius: number = orbitRadius) => {
    const angle = (index / total) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };
  
  const handleTaskExpand = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Toggle expanded state
    setExpandedTask(prev => prev === taskId ? null : taskId);
    
    // If task is expanded, stop orbit rotation
    if (expandedTask !== taskId) {
      orbitControls.stop();
    } else {
      // Resume orbit rotation
      orbitControls.start({
        rotate: 360,
        transition: {
          duration: rotationSpeed,
          ease: "linear",
          repeat: Infinity
        }
      });
    }
  };
  
  const handleTaskStart = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskClick(taskId);
    setExpandedTask(null);
    
    // Resume orbit rotation
    orbitControls.start({
      rotate: 360,
      transition: {
        duration: rotationSpeed,
        ease: "linear",
        repeat: Infinity
      }
    });
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
            className="absolute w-72 h-72 rounded-full border border-white/10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ width: orbitRadius * 2, height: orbitRadius * 2 }}
          >
            {/* Center orbit point */}
            <motion.div 
              className="absolute w-12 h-12 rounded-full bg-wonderwhiz-bright-pink/30 flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 0 0 rgba(236, 72, 153, 0.7)',
                  '0 0 0 10px rgba(236, 72, 153, 0)',
                  '0 0 0 0 rgba(236, 72, 153, 0.7)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <CheckSquare className="h-5 w-5 text-wonderwhiz-bright-pink" />
            </motion.div>
            
            {/* Secondary orbit circle */}
            <motion.div
              className="absolute rounded-full border border-white/5"
              style={{ width: orbitRadius * 1.5, height: orbitRadius * 1.5 }}
              animate={{ rotate: -360 }}
              transition={{
                duration: rotationSpeed * 1.5,
                ease: "linear",
                repeat: Infinity
              }}
            />
            
            {/* Indicators on the orbit */}
            {[0, 1, 2, 3].map(i => {
              const angle = (i / 4) * Math.PI * 2;
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;
              
              return (
                <motion.div
                  key={`indicator-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-white/30"
                  style={{ translateX: x, translateY: y }}
                />
              );
            })}
          </motion.div>
          
          {/* Rotating orbit container */}
          <motion.div
            ref={orbitRef}
            className="absolute"
            animate={orbitControls}
          >
            {/* Tasks in orbit */}
            {displayedTasks.map((task, index) => {
              const { x, y } = calculatePosition(index, displayedTasks.length);
              const delay = 0.2 + (index * 0.1);
              const isExpanded = expandedTask === task.id;
              
              return (
                <React.Fragment key={task.id}>
                  <motion.div
                    className={`absolute pointer-events-auto cursor-pointer rounded-full px-3 py-1.5 ${getTaskColor(task.type, task.completed)} ${getTaskGlow(task.type, task.completed)} backdrop-blur-sm`}
                    style={{ translateX: x, translateY: y, zIndex: isExpanded ? 42 : 41 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: isExpanded ? 1.1 : 1,
                      rotate: isExpanded ? 0 : -orbitControls.get()?.rotate || 0
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20, 
                      delay: isExpanded ? 0 : delay
                    }}
                    whileHover={{ scale: isExpanded ? 1.1 : 1.1 }}
                    onClick={(e) => handleTaskExpand(task.id, e)}
                  >
                    <div className="flex items-center space-x-2">
                      {getTaskIcon(task.type)}
                      <span className="text-xs whitespace-nowrap max-w-32 truncate">
                        {task.title}
                      </span>
                    </div>
                  </motion.div>
                  
                  {/* Expanded task details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        className={`absolute pointer-events-auto rounded-lg ${getTaskColor(task.type, task.completed)} p-4 w-64 z-50 backdrop-blur-md ${getTaskGlow(task.type, task.completed)}`}
                        style={{ translateX: x, translateY: y + 50, transformOrigin: 'top center' }}
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotate: -orbitControls.get()?.rotate || 0 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ type: "spring", damping: 20 }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold">{task.title}</h4>
                          {task.completed ? (
                            <Award className="h-5 w-5" />
                          ) : (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              task.priority === 'high' ? 'bg-red-500/50' : 
                              task.priority === 'medium' ? 'bg-amber-500/50' : 
                              'bg-blue-500/50'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-3 text-sm">
                          <p className="opacity-90">
                            {task.type === 'daily' && "Complete this task daily for a streak bonus!"}
                            {task.type === 'learning' && "Build your knowledge with this learning task."}
                            {task.type === 'creative' && "Express your creativity with this fun activity!"}
                            {task.type === 'challenge' && "Push your skills with this challenge!"}
                          </p>
                          
                          {task.dueDate && (
                            <div className="flex items-center mt-1 opacity-80">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-xs">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            className="flex-1 bg-white/20 hover:bg-white/30 rounded-full py-1 text-sm font-medium transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedTask(null);
                              
                              // Resume orbit rotation
                              orbitControls.start({
                                rotate: 360,
                                transition: {
                                  duration: rotationSpeed,
                                  ease: "linear",
                                  repeat: Infinity
                                }
                              });
                            }}
                          >
                            Close
                          </button>
                          
                          <button 
                            className="flex-1 bg-white/90 text-wonderwhiz-deep-purple hover:bg-white rounded-full py-1 flex items-center justify-center gap-1 text-sm font-medium"
                            onClick={(e) => handleTaskStart(task.id, e)}
                          >
                            <Zap className="h-3 w-3" />
                            <span>Start</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskOrbits;
