
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, Clock, Sparkles, Brain, Award, Zap, Lightbulb, BookOpen, Bell } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import DailyChallenge from './DailyChallenge';

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
  
  // Fetch parent-assigned tasks
  useEffect(() => {
    const fetchParentAssignedTasks = async () => {
      setIsLoadingTasks(true);
      try {
        // Fetch pending tasks
        const { data: pendingTasks, error: pendingError } = await supabase
          .from('child_tasks')
          .select('*, tasks:task_id(title, description, sparks_reward)')
          .eq('child_profile_id', childId)
          .eq('status', 'pending')
          .order('assigned_at', { ascending: false });
          
        if (pendingError) throw pendingError;
        
        // Fetch completed tasks
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
        
        // Update notification status and count
        const hasNew = (pendingTasks && pendingTasks.length > 0);
        setHasNewNotifications(hasNew);
        
        // Send count to parent component if callback provided
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
    
    // Set up real-time subscription to task changes
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
  
  // Calculate daily progress based on completed tasks
  useEffect(() => {
    // This would normally come from the backend
    // For now, simulate based on time of day
    const hour = new Date().getHours();
    const simulatedProgress = Math.min(Math.max(hour - 6, 0) * 10, 100);
    setDailyProgress(simulatedProgress);
  }, []);
  
  // Generate intelligent tasks based on learning history and interests
  const generateTasks = () => {
    const tasks = [];
    
    // Basic daily tasks
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
    
    // Create task based on strongest interest
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
    
    // Create task based on personal interests
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
    
    // Add streak maintenance task if they have a streak
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
  
  // Animation variants
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
  
  // Handle parent task completion
  const handleParentTaskCompletion = async (taskId: string) => {
    try {
      // Call the edge function to complete the task
      const { data, error } = await supabase.functions.invoke('complete-task', {
        body: { taskId, childId }
      });
      
      if (error) throw error;
      
      // Update local state
      const completedTask = parentTasks.find(task => task.id === taskId);
      if (completedTask) {
        setParentTasks(parentTasks.filter(task => task.id !== taskId));
        setCompletedParentTasks([{ ...completedTask, status: 'completed', completed_at: new Date().toISOString() }, ...completedParentTasks]);
        
        // Update notification counter
        if (onPendingTasksCount) {
          onPendingTasksCount(parentTasks.length - 1);
        }
      }
      
      // Show success toast
      toast.success("Task completed!", {
        description: `Great job! You've earned ${completedTask?.tasks?.sparks_reward || 0} sparks!`,
      });
      
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error("Failed to complete task");
    }
  };
  
  // Handle system task click
  const handleSystemTaskClick = (task: any) => {
    // If already completed, just show a message
    if (task.completed) {
      toast.success("You've already completed this task!", {
        description: "Great job keeping up with your learning journey!",
      });
      return;
    }
    
    // Execute appropriate action based on task type
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
    
    // Show success toast
    toast.success("Task started!", {
      description: `You're on your way to earning ${task.reward} sparks!`,
    });
  };
  
  // Get task icon based on type
  const getTaskIcon = (task: any) => {
    switch (task.type) {
      case 'quiz':
        return <Brain className="h-5 w-5 text-indigo-400" />;
      case 'read':
        return <BookOpen className="h-5 w-5 text-amber-400" />;
      case 'explore':
        return <Star className="h-5 w-5 text-pink-400" />;
      case 'create':
        return <Zap className="h-5 w-5 text-green-400" />;
      case 'streak':
        return <Award className="h-5 w-5 text-amber-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-indigo-600/10 to-indigo-800/10 backdrop-blur-sm rounded-xl border border-indigo-600/20 p-5"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-600/30 flex items-center justify-center mr-3 relative">
            <CheckCircle className="h-5 w-5 text-white" />
            <AnimatePresence>
              {hasNewNotifications && (
                <motion.div
                  variants={notificationVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500"
                />
              )}
            </AnimatePresence>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Your Tasks</h3>
            <div className="flex items-center mt-1">
              <Progress value={dailyProgress} className="h-1.5 w-36 bg-white/10" />
              <span className="ml-2 text-xs text-white/60">{dailyProgress}% complete</span>
            </div>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-white/10 text-white border-white/20 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{childProfile?.sparks_balance || 0} sparks</span>
        </Badge>
      </motion.div>
      
      <Tabs defaultValue="all" className="mt-2">
        <TabsList className="w-full grid grid-cols-3 bg-white/5 border border-white/10">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-indigo-600/20">All Tasks</TabsTrigger>
          <TabsTrigger value="parent" className="text-sm data-[state=active]:bg-indigo-600/20 relative">
            From Parents
            <AnimatePresence>
              {parentTasks.length > 0 && (
                <motion.div
                  variants={notificationVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white"
                >
                  {parentTasks.length}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsTrigger>
          <TabsTrigger value="system" className="text-sm data-[state=active]:bg-indigo-600/20">Learning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-3">
          <div className="space-y-3">
            {/* Parent-assigned tasks first */}
            {!isLoadingTasks && parentTasks.map((task) => (
              <motion.div
                key={`parent-${task.id}`}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleParentTaskCompletion(task.id)}
                className="p-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group bg-pink-500/20 border border-pink-500/30 hover:border-pink-500/50"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-pink-500/30">
                    <Star className="h-4 w-4 text-white" />
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.5 
                      }}
                      className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <p className="font-medium text-sm text-white">
                      {task.tasks?.title || 'Task from parent'}
                    </p>
                    {task.tasks?.description && (
                      <p className="text-white/70 text-xs mt-1">{task.tasks.description}</p>
                    )}
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 text-white/60 mr-1" />
                      <span className="text-white/60 text-xs">From parent</span>
                      
                      <div className="ml-3 flex items-center">
                        <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
                        <span className="text-amber-300 text-xs">+{task.tasks?.sparks_reward || 5}</span>
                      </div>
                      
                      <Badge className="ml-2 py-0 h-4 bg-pink-500/20 text-pink-300 text-[10px] border-none">
                        Priority
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          
            {/* Then system-generated tasks */}
            {systemTasks.map((task) => (
              <motion.div
                key={task.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSystemTaskClick(task)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group",
                  task.completed 
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-white/5 border border-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    task.completed ? "bg-green-500/50" : "bg-white/10"
                  )}>
                    {task.completed ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      getTaskIcon(task)
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <p className={cn("font-medium text-sm", task.completed ? "text-green-300" : "text-white")}>
                      {task.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 text-white/60 mr-1" />
                      <span className="text-white/60 text-xs">{task.timeEstimate}</span>
                      
                      <div className="ml-3 flex items-center">
                        <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
                        <span className="text-amber-300 text-xs">+{task.reward}</span>
                      </div>
                      
                      {task.priority === 'high' && (
                        <Badge className="ml-2 py-0 h-4 bg-indigo-500/20 text-indigo-300 text-[10px] border-none">
                          Priority
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Progress indicator for the task (if applicable) */}
                {task.completed && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-green-400/30" />
                )}
              </motion.div>
            ))}

            {isLoadingTasks && (
              <div className="text-center py-4 text-white/60">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white/30 mx-auto mb-2"></div>
                <p>Loading tasks...</p>
              </div>
            )}
            
            {!isLoadingTasks && parentTasks.length === 0 && systemTasks.length === 0 && (
              <div className="text-center py-8 text-white/60">
                <p>No tasks available. Check back soon!</p>
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
                  onClick={() => handleParentTaskCompletion(task.id)}
                  className="p-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group bg-pink-500/20 border border-pink-500/30 hover:border-pink-500/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-pink-500/30">
                      <Star className="h-4 w-4 text-white" />
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatType: "reverse", 
                          duration: 1.5 
                        }}
                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <p className="font-medium text-sm text-white">
                        {task.tasks?.title || 'Task from parent'}
                      </p>
                      {task.tasks?.description && (
                        <p className="text-white/70 text-xs mt-1">{task.tasks.description}</p>
                      )}
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-white/60 mr-1" />
                        <span className="text-white/60 text-xs">From parent</span>
                        
                        <div className="ml-3 flex items-center">
                          <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
                          <span className="text-amber-300 text-xs">+{task.tasks?.sparks_reward || 5}</span>
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
                    <p>Loading tasks from your parents...</p>
                  </div>
                ) : (
                  <p>No tasks from your parents yet!</p>
                )}
              </div>
            )}
            
            {!isLoadingTasks && completedParentTasks.length > 0 && (
              <div className="mt-6">
                <h4 className="text-white/70 text-sm font-medium mb-3">Recently Completed</h4>
                {completedParentTasks.map((task) => (
                  <motion.div
                    key={`completed-${task.id}`}
                    variants={itemVariants}
                    className="p-3 rounded-lg relative overflow-hidden group bg-green-500/20 border border-green-500/30 mb-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/30">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      
                      <div className="flex-grow">
                        <p className="font-medium text-sm text-green-300">
                          {task.tasks?.title || 'Completed task'}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-white/60 text-xs">
                            Completed {new Date(task.completed_at).toLocaleDateString()}
                          </span>
                          
                          <div className="ml-3 flex items-center">
                            <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
                            <span className="text-amber-300 text-xs">+{task.tasks?.sparks_reward || 5} earned</span>
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
        
        <TabsContent value="system" className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-white/90 text-sm font-medium">Learning Tasks</h4>
              {systemTasks.length > 0 ? (
                systemTasks.map((task) => (
                  <motion.div
                    key={`system-tab-${task.id}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSystemTaskClick(task)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group",
                      task.completed 
                        ? "bg-green-500/20 border border-green-500/30"
                        : "bg-white/5 border border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        task.completed ? "bg-green-500/50" : "bg-white/10"
                      )}>
                        {task.completed ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          getTaskIcon(task)
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <p className={cn("font-medium text-sm", task.completed ? "text-green-300" : "text-white")}>
                          {task.title}
                        </p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-white/60 mr-1" />
                          <span className="text-white/60 text-xs">{task.timeEstimate}</span>
                          
                          <div className="ml-3 flex items-center">
                            <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
                            <span className="text-amber-300 text-xs">+{task.reward}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress indicator for the task (if applicable) */}
                    {task.completed && (
                      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-green-400/30" />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-white/60">
                  <p>No learning tasks available right now.</p>
                </div>
              )}
            </div>
            
            {/* Daily challenges in the tasks tab too */}
            <div>
              <DailyChallenge childId={childId} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default IntelligentTasks;
