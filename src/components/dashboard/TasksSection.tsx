
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, BookOpen, Pencil, Medal, ChevronRight, Brain, CheckCircle, Sparkles as SparklesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface Task {
  id: string;
  title: string;
  completed?: boolean;
  type: 'explore' | 'quiz' | 'creative' | 'read';
  duration?: string;
  reward: number;
}

interface ParentAssignedTask {
  id: string;
  status: string;
  task: {
    id: string;
    title: string;
    description: string | null;
    sparks_reward: number;
  };
}

interface TasksSectionProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  childId: string;
  pendingTasksCount: number;
}

const TasksSection: React.FC<TasksSectionProps> = ({ 
  tasks, 
  onTaskClick, 
  childId,
  pendingTasksCount
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [parentTasks, setParentTasks] = useState<ParentAssignedTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchParentAssignedTasks = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('child_tasks')
          .select(`
            id,
            status,
            task:tasks (id, title, description, sparks_reward)
          `)
          .eq('child_profile_id', childId)
          .eq('status', 'pending');
        
        if (error) throw error;
        
        if (data) {
          setParentTasks(data);
        }
      } catch (error) {
        console.error('Error fetching parent-assigned tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (childId) {
      fetchParentAssignedTasks();
    }
  }, [childId]);
  
  const getTaskIcon = (type: string) => {
    switch(type) {
      case 'explore':
        return <BookOpen className="h-4 w-4 text-wonderwhiz-bright-pink" />;
      case 'quiz':
        return <Brain className="h-4 w-4 text-wonderwhiz-blue" />;
      case 'creative':
        return <Pencil className="h-4 w-4 text-wonderwhiz-gold" />;
      case 'read':
        return <BookOpen className="h-4 w-4 text-wonderwhiz-purple" />;
      default:
        return <Medal className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />;
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      toast.loading("Completing task...");
      
      const { data, error } = await supabase
        .from('child_tasks')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Remove the task from the list
        setParentTasks(prev => prev.filter(t => t.id !== taskId));
        
        // Try to increment the sparks balance
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: childId,
              amount: 5 // Default amount if we don't know the actual reward
            })
          });
          
          toast.success("Task completed! +5 Sparks earned!");
        } catch (err) {
          console.error('Error awarding sparks:', err);
          toast.success("Task completed!");
        }
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error("Failed to complete task");
    }
  };

  const combinedTasks = [
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      isParentTask: false,
      reward: task.reward,
      type: task.type,
      onClick: () => onTaskClick(task)
    })),
    ...parentTasks.map(task => ({
      id: task.id,
      title: task.task.title,
      isParentTask: true,
      reward: task.task.sparks_reward,
      type: 'parent' as const,
      onClick: () => handleCompleteTask(task.id)
    }))
  ];

  // Make sure we always return content, even if no tasks
  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center text-xl">
            <CheckCircle2 className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
            Today's Tasks
          </CardTitle>
          <div className="px-2 py-1 bg-white/10 text-white rounded-full text-xs flex items-center">
            {pendingTasksCount} pending
          </div>
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'pt-2 pb-3 px-3' : 'pt-2'}`}>
        {combinedTasks.length === 0 ? (
          <div className="bg-white/5 hover:bg-white/10 p-4 rounded-lg text-center">
            <p className="text-white/70">No tasks for today. Check back later!</p>
          </div>
        ) : (
          <div className={`space-y-2 ${isMobile ? 'max-h-[180px]' : 'max-h-[250px]'} overflow-y-auto pr-1`}>
            {combinedTasks.slice(0, isMobile ? 2 : 3).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg overflow-hidden cursor-pointer"
                onClick={task.onClick}
              >
                <div className="p-3 flex items-center justify-between relative">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-wonderwhiz-deep-purple rounded-full mr-3">
                      {task.isParentTask ? 
                        <Medal className="h-3.5 w-3.5 text-wonderwhiz-gold" /> :
                        getTaskIcon(task.type)}
                    </div>
                    <div>
                      <p className="text-white font-nunito line-clamp-1">
                        {index + 1}. {task.title}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="text-wonderwhiz-gold text-xs flex items-center">
                          <SparklesIcon className="h-3 w-3 mr-1" />
                          {task.reward}
                        </div>
                        {task.isParentTask && (
                          <span className="ml-2 text-wonderwhiz-bright-pink text-xs">
                            Parent Task
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-4 w-4 text-white/40" />
                  
                  {task.isParentTask && (
                    <div className="absolute -bottom-0.5 left-0 right-0 h-1 bg-gradient-to-r from-wonderwhiz-gold/30 to-wonderwhiz-bright-pink/30" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {combinedTasks.length > 3 && (
          <div className="mt-3 text-center">
            <Button
              variant="ghost"
              className="text-white/60 text-sm hover:text-white hover:bg-white/10"
              onClick={() => navigate(`/tasks/${childId}`)}
            >
              View all {combinedTasks.length} tasks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksSection;
