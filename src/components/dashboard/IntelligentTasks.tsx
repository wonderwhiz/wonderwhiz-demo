
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, Clock, Sparkles, Brain, Award, Zap, Lightbulb, BookOpen, Bell, ChevronDown, Rocket } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

interface IntelligentTasksProps {
  childId: string;
  childProfile: any;
  onTaskAction: (task: string) => void;
  onPendingTasksCount?: (count: number) => void;
}

const IntelligentTasks: React.FC<IntelligentTasksProps> = ({
  childId,
  childProfile,
  onTaskAction,
  onPendingTasksCount
}) => {
  const { learningHistory, strongestTopics } = useChildLearningHistory(childId);
  
  const [dailyProgress, setDailyProgress] = useState(0);
  const [parentTasks, setParentTasks] = useState<any[]>([]);
  const [completedParentTasks, setCompletedParentTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchParentAssignedTasks = async () => {
      setIsLoadingTasks(true);
      try {
        const { data: pendingTasks, error: pendingError } = await supabase
          .from('child_tasks')
          .select('*, tasks:task_id(title, description, sparks_reward)')
          .eq('child_profile_id', childId)
          .eq('status', 'pending')
          .order('assigned_at', { ascending: false });
          
        if (pendingError) throw pendingError;
        
        const { data: completedTasks, error: completedError } = await supabase
          .from('child_tasks')
          .select('*, tasks:task_id(title, description, sparks_reward)')
          .eq('child_profile_id', childId)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(5);
          
        if (completedError) throw completedError;
        
        setParentTasks(pendingTasks || []);
        setCompletedParentTasks(completedTasks || []);
        
        const hasNew = (pendingTasks && pendingTasks.length > 0);
        setHasNewNotifications(hasNew);
        
        if (onPendingTasksCount) {
          onPendingTasksCount(pendingTasks ? pendingTasks.length : 0);
        }
        
      } catch (error) {
        console.error('Error fetching parent-assigned tasks:', error);
      } finally {
        setIsLoadingTasks(false);
      }
    };
    
    fetchParentAssignedTasks();
    
    const tasksSubscription = supabase
      .channel('child-tasks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'child_tasks', filter: `child_profile_id=eq.${childId}` },
        (payload) => {
          fetchParentAssignedTasks();
          if (payload.eventType === 'INSERT') {
            toast.info("You have a new task from your parent!", {
              description: "Check your tasks tab to see what's new!",
              icon: <Bell className="h-5 w-5 text-indigo-400" />
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(tasksSubscription);
    };
  }, [childId, onPendingTasksCount]);
  
  useEffect(() => {
    const hour = new Date().getHours();
    const simulatedProgress = Math.min(Math.max(hour - 6, 0) * 10, 100);
    setDailyProgress(simulatedProgress);
  }, []);
  
  const generateTasks = () => {
    const tasks = [];
    
    tasks.push({
      id: 'daily-quiz',
      title: 'Complete Today\'s Wonder Quiz',
      type: 'quiz',
      completed: dailyProgress >= 30,
      reward: 5,
      timeEstimate: '2 min',
      priority: 'high',
    });
    
    tasks.push({
      id: 'daily-read',
      title: 'Discover a New Amazing Fact',
      type: 'read',
      completed: dailyProgress >= 60,
      reward: 5, 
      timeEstimate: '3 min',
      priority: 'high',
    });
    
    if (strongestTopics.length > 0) {
      const strongestTopic = strongestTopics[0].topic;
      tasks.push({
        id: 'explore-strength',
        title: `Explore more about ${strongestTopic}`,
        type: 'explore',
        completed: false,
        reward: 10,
        timeEstimate: '5 min',
        priority: 'medium',
      });
    }
    
    const interests = childProfile?.interests || [];
    if (interests.length > 0) {
      const randomInterest = interests[Math.floor(Math.random() * interests.length)];
      tasks.push({
        id: 'interest-task',
        title: `Create something inspired by ${randomInterest}`,
        type: 'create',
        completed: false,
        reward: 15,
        timeEstimate: '10 min',
        priority: 'low',
      });
    }
    
    if (childProfile?.streak_days > 0) {
      tasks.push({
        id: 'maintain-streak',
        title: `Maintain your ${childProfile.streak_days} day streak!`,
        type: 'streak',
        completed: dailyProgress >= 90,
        reward: childProfile.streak_days,
        timeEstimate: '1 min',
        priority: 'high',
      });
    }
    
    return tasks;
  };
  
  const systemTasks = generateTasks();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  const completionVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.05, 1],
      backgroundColor: ["rgba(0, 214, 143, 0.1)", "rgba(0, 214, 143, 0.3)", "rgba(0, 214, 143, 0.1)"],
      transition: { duration: 0.6 }
    }
  };
  
  const notificationVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { scale: 0.8, opacity: 0 }
  };
  
  const handleParentTaskCompletion = async (taskId: string) => {
    setCompletingTaskId(taskId);
    
    try {
      const { data, error } = await supabase.functions.invoke('complete-task', {
        body: { taskId, childId }
      });
      
      if (error) throw error;
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#00E2FF', '#FF5BA3', '#FFD54F', '#00D68F'],
        disableForReducedMotion: true
      });
      
      const completedTask = parentTasks.find(task => task.id === taskId);
      if (completedTask) {
        setParentTasks(parentTasks.filter(task => task.id !== taskId));
        setCompletedParentTasks([{ ...completedTask, status: 'completed', completed_at: new Date().toISOString() }, ...completedParentTasks]);
        
        if (onPendingTasksCount) {
          onPendingTasksCount(parentTasks.length - 1);
        }
      }
      
      toast.success("Task completed!", {
        description: `Great job! You've earned ${completedTask?.tasks?.sparks_reward || 0} sparks!`,
        icon: <CheckCircle className="h-5 w-5 text-wonderwhiz-green" />
      });
      
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error("Failed to complete task");
    } finally {
      setTimeout(() => {
        setCompletingTaskId(null);
      }, 1000);
    }
  };
  
  const handleSystemTaskClick = (task: any) => {
    if (task.completed) {
      toast.success("You've already completed this task!", {
        description: "Great job keeping up with your learning journey!",
        icon: <CheckCircle className="h-5 w-5 text-wonderwhiz-green" />
      });
      return;
    }
    
    setCompletingTaskId(task.id);
    
    switch (task.type) {
      case 'quiz':
        onTaskAction("Start today's quiz");
        break;
      case 'read':
        onTaskAction("Show me an amazing fact");
        break;
      case 'explore':
        onTaskAction(`Tell me about ${task.title.split('about ')[1]}`);
        break;
      case 'create':
        onTaskAction(`Creative ideas for ${task.title.split('by ')[1]}`);
        break;
      case 'streak':
        onTaskAction("What should I learn today?");
        break;
      default:
        onTaskAction(task.title);
    }
    
    toast.success("Task started!", {
      description: `You're on your way to earning ${task.reward} sparks!`,
      icon: <Rocket className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
    });
    
    setTimeout(() => {
      setCompletingTaskId(null);
    }, 1000);
  };
  
  const getTaskIcon = (task: any) => {
    switch (task.type) {
      case 'quiz':
        return <Brain className="h-5 w-5 text-wonderwhiz-cyan" />;
      case 'read':
        return <BookOpen className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />;
      case 'explore':
        return <Star className="h-5 w-5 text-wonderwhiz-bright-pink" />;
      case 'create':
        return <Zap className="h-5 w-5 text-wonderwhiz-green" />;
      case 'streak':
        return <Award className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />;
      default:
        return <CheckCircle className="h-5 w-5 text-wonderwhiz-blue-accent" />;
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-indigo-950/70 backdrop-blur-sm rounded-2xl border border-wonderwhiz-light-purple/30 p-5 shadow-lg"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/30 flex items-center justify-center mr-3 relative border border-white/10">
            <CheckCircle className="h-5 w-5 text-white" />
            <AnimatePresence>
              {hasNewNotifications && (
                <motion.div
                  variants={notificationVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-wonderwhiz-bright-pink"
                />
              )}
            </AnimatePresence>
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-white">Your Tasks</h3>
            <div className="flex items-center mt-1">
              <Progress value={dailyProgress} className="h-1.5 w-36 bg-white/10" />
              <span className="ml-2 text-xs text-white/60">{dailyProgress}% complete</span>
            </div>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-white/10 text-white border-white/20 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-vibrant-yellow" />
          <span>{childProfile?.sparks_balance || 0} sparks</span>
        </Badge>
      </motion.div>
      
      <Tabs defaultValue="all" className="mt-2">
        <TabsList className="w-full grid grid-cols-2 bg-white/5 border border-white/10">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-wonderwhiz-deep-purple/30 font-nunito">All Tasks</TabsTrigger>
          <TabsTrigger value="parent" className="text-sm data-[state=active]:bg-wonderwhiz-deep-purple/30 relative font-nunito">
            From Parents
            <AnimatePresence>
              {parentTasks.length > 0 && (
                <motion.div
                  variants={notificationVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-wonderwhiz-bright-pink flex items-center justify-center text-[10px] text-white font-medium"
                >
                  {parentTasks.length}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-3">
          <div className="space-y-3">
            {!isLoadingTasks && parentTasks.map((task) => (
              <motion.div
                key={`parent-${task.id}`}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                animate={completingTaskId === task.id ? "animate" : "initial"}
                {...(completingTaskId === task.id ? { variants: completionVariants } : {})}
                onClick={() => handleParentTaskCompletion(task.id)}
                className="p-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group bg-gradient-to-r from-wonderwhiz-bright-pink/10 to-wonderwhiz-bright-pink/5 border border-wonderwhiz-bright-pink/30 hover:border-wonderwhiz-bright-pink/50"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-wonderwhiz-deep-purple/50 border border-wonderwhiz-bright-pink/30">
                    <Star className="h-4 w-4 text-wonderwhiz-bright-pink" />
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.5 
                      }}
                      className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-wonderwhiz-bright-pink"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <p className="font-nunito font-semibold text-sm text-white">
                      {task.tasks?.title || 'Task from parent'}
                    </p>
                    {task.tasks?.description && (
                      <p className="text-white/70 text-xs mt-1 font-inter">{task.tasks.description}</p>
                    )}
                    <div className="flex items-center mt-1.5">
                      <Clock className="h-3 w-3 text-white/60 mr-1" />
                      <span className="text-white/60 text-xs font-inter">From parent</span>
                      
                      <div className="ml-3 flex items-center">
                        <Sparkles className="h-3 w-3 text-wonderwhiz-vibrant-yellow mr-1" />
                        <span className="text-wonderwhiz-vibrant-yellow text-xs font-inter">+{task.tasks?.sparks_reward || 5}</span>
                      </div>
                      
                      <Badge className="ml-2 py-0 h-4 bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink text-[10px] border-none font-nunito">
                        Priority
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          
            {systemTasks.map((task) => (
              <motion.div
                key={task.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                animate={completingTaskId === task.id ? "animate" : "initial"}
                {...(completingTaskId === task.id ? { variants: completionVariants } : {})}
                onClick={() => handleSystemTaskClick(task)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group border",
                  task.completed 
                    ? "bg-gradient-to-r from-wonderwhiz-green/15 to-wonderwhiz-green/5 border-wonderwhiz-green/30"
                    : "bg-gradient-to-r from-wonderwhiz-deep-purple/20 to-wonderwhiz-deep-purple/10 border-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border",
                    task.completed 
                      ? "bg-wonderwhiz-deep-purple/40 border-wonderwhiz-green/30" 
                      : "bg-wonderwhiz-deep-purple/40 border-white/10"
                  )}>
                    {task.completed ? (
                      <CheckCircle className="h-4 w-4 text-wonderwhiz-green" />
                    ) : (
                      getTaskIcon(task)
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <p className={cn("font-nunito font-semibold text-sm", task.completed ? "text-wonderwhiz-green" : "text-white")}>
                      {task.title}
                    </p>
                    <div className="flex items-center mt-1.5">
                      <Clock className="h-3 w-3 text-white/60 mr-1" />
                      <span className="text-white/60 text-xs font-inter">{task.timeEstimate}</span>
                      
                      <div className="ml-3 flex items-center">
                        <Sparkles className="h-3 w-3 text-wonderwhiz-vibrant-yellow mr-1" />
                        <span className="text-wonderwhiz-vibrant-yellow text-xs font-inter">+{task.reward}</span>
                      </div>
                      
                      {task.priority === 'high' && (
                        <Badge className="ml-2 py-0 h-4 bg-wonderwhiz-cyan/20 text-wonderwhiz-cyan text-[10px] border-none font-nunito">
                          Priority
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {task.completed && (
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-wonderwhiz-green" />
                    </div>
                  )}
                </div>
                
                {task.completed && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-wonderwhiz-green/30" />
                )}
              </motion.div>
            ))}
            
            {isLoadingTasks && (
              <div className="text-center py-4 text-white/60">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white/30 mx-auto mb-2"></div>
                <p className="font-inter">Loading tasks...</p>
              </div>
            )}
            
            {!isLoadingTasks && parentTasks.length === 0 && systemTasks.length === 0 && (
              <div className="text-center py-8 text-white/60">
                <p className="font-inter">No tasks available. Check back soon!</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="parent" className="mt-3">
          <div className="space-y-3">
            {!isLoadingTasks && parentTasks.length > 0 ? (
              parentTasks.map((task) => (
                <motion.div
                  key={`parent-tab-${task.id}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  animate={completingTaskId === task.id ? "animate" : "initial"}
                  {...(completingTaskId === task.id ? { variants: completionVariants } : {})}
                  onClick={() => handleParentTaskCompletion(task.id)}
                  className="p-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group bg-gradient-to-r from-wonderwhiz-bright-pink/10 to-wonderwhiz-bright-pink/5 border border-wonderwhiz-bright-pink/30 hover:border-wonderwhiz-bright-pink/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-wonderwhiz-deep-purple/50 border border-wonderwhiz-bright-pink/30">
                      <Star className="h-4 w-4 text-wonderwhiz-bright-pink" />
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatType: "reverse", 
                          duration: 1.5 
                        }}
                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-wonderwhiz-bright-pink"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <p className="font-nunito font-semibold text-sm text-white">
                        {task.tasks?.title || 'Task from parent'}
                      </p>
                      {task.tasks?.description && (
                        <p className="text-white/70 text-xs mt-1 font-inter">{task.tasks.description}</p>
                      )}
                      <div className="flex items-center mt-1.5">
                        <Clock className="h-3 w-3 text-white/60 mr-1" />
                        <span className="text-white/60 text-xs font-inter">From parent</span>
                        
                        <div className="ml-3 flex items-center">
                          <Sparkles className="h-3 w-3 text-wonderwhiz-vibrant-yellow mr-1" />
                          <span className="text-wonderwhiz-vibrant-yellow text-xs font-inter">+{task.tasks?.sparks_reward || 5}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-white/60">
                {isLoadingTasks ? (
                  <div>
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white/30 mx-auto mb-2"></div>
                    <p className="font-inter">Loading tasks from your parents...</p>
                  </div>
                ) : (
                  <p className="font-inter">No tasks from your parents yet!</p>
                )}
              </div>
            )}
            
            {!isLoadingTasks && completedParentTasks.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white/70 text-sm font-nunito font-medium">Recently Completed</h4>
                  {completedParentTasks.length > 3 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => setShowAllCompleted(!showAllCompleted)}
                    >
                      <span>{showAllCompleted ? 'Show less' : 'Show all'}</span>
                      <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${showAllCompleted ? 'rotate-180' : ''}`} />
                    </Button>
                  )}
                </div>
                
                {(showAllCompleted ? completedParentTasks : completedParentTasks.slice(0, 3)).map((task) => (
                  <motion.div
                    key={`completed-${task.id}`}
                    variants={itemVariants}
                    className="p-3 rounded-lg relative overflow-hidden group bg-gradient-to-r from-wonderwhiz-green/15 to-wonderwhiz-green/5 border border-wonderwhiz-green/30 mb-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-wonderwhiz-deep-purple/40 border border-wonderwhiz-green/30">
                        <CheckCircle className="h-4 w-4 text-wonderwhiz-green" />
                      </div>
                      
                      <div className="flex-grow">
                        <p className="font-nunito font-semibold text-sm text-wonderwhiz-green">
                          {task.tasks?.title || 'Completed task'}
                        </p>
                        <div className="flex items-center mt-1.5">
                          <span className="text-white/60 text-xs font-inter">
                            Completed {new Date(task.completed_at).toLocaleDateString()}
                          </span>
                          
                          <div className="ml-3 flex items-center">
                            <Sparkles className="h-3 w-3 text-wonderwhiz-vibrant-yellow mr-1" />
                            <span className="text-wonderwhiz-vibrant-yellow text-xs font-inter">+{task.tasks?.sparks_reward || 5} earned</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default IntelligentTasks;
