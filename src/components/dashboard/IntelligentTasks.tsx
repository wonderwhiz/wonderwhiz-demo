
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Clock, Sparkles, Brain, Award, Zap, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';

interface IntelligentTasksProps {
  childId: string;
  childProfile: any;
  onTaskAction: (task: string) => void;
}

const IntelligentTasks: React.FC<IntelligentTasksProps> = ({
  childId,
  childProfile,
  onTaskAction
}) => {
  const { learningHistory, strongestTopics } = useChildLearningHistory(childId);
  
  const [dailyProgress, setDailyProgress] = useState(0);
  
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
  
  const tasks = generateTasks();
  
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
  
  // Handle task click
  const handleTaskClick = (task: any) => {
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
        return <Lightbulb className="h-5 w-5 text-amber-400" />;
      case 'explore':
        return <Star className="h-5 w-5 text-pink-400" />;
      case 'create':
        return <Zap className="h-5 w-5 text-green-400" />;
      case 'streak':
        return <Award className="h-5 w-5 text-wonderwhiz-gold" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-green-900/20 to-teal-900/20 backdrop-blur-sm rounded-xl border border-white/10 p-5"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500/30 to-emerald-500/30 flex items-center justify-center mr-3">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Today's Journey</h3>
            <div className="flex items-center mt-1">
              <Progress value={dailyProgress} className="h-1.5 w-36 bg-white/10" />
              <span className="ml-2 text-xs text-white/60">{dailyProgress}% complete</span>
            </div>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-white/10 text-white border-white/20 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-gold" />
          <span>{childProfile?.sparks_balance || 0} sparks</span>
        </Badge>
      </motion.div>
      
      <div className="space-y-3 mt-5">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTaskClick(task)}
            className={`
              p-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group
              ${task.completed 
                ? "bg-green-500/20 border border-green-500/30"
                : "bg-white/5 border border-white/10 hover:border-white/20"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${task.completed ? "bg-green-500/50" : "bg-white/10"}
              `}>
                {task.completed ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  getTaskIcon(task)
                )}
              </div>
              
              <div className="flex-grow">
                <p className={`font-medium text-sm ${task.completed ? "text-green-300" : "text-white"}`}>
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
                    <Badge className="ml-2 py-0 h-4 bg-white/10 text-white/70 text-[10px]">
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
      </div>
    </motion.div>
  );
};

export default IntelligentTasks;
