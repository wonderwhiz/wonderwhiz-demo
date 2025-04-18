
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  type: 'daily' | 'weekly' | 'special';
  sparks_reward: number;
}

interface TasksPanelProps {
  childId: string;
  onComplete?: (taskId: string) => void;
  onClose?: () => void;
}

const TasksPanel: React.FC<TasksPanelProps> = ({ 
  childId, 
  onComplete,
  onClose 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('child_tasks')
          .select('*, tasks(*)')
          .eq('child_id', childId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to match the Task interface
        const transformedTasks = data.map(item => ({
          id: item.tasks.id,
          title: item.tasks.title,
          description: item.tasks.description,
          completed: item.completed,
          created_at: item.tasks.created_at,
          type: item.tasks.type,
          sparks_reward: item.tasks.sparks_reward || 5
        }));
        
        setTasks(transformedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [childId]);
  
  const handleCompleteTask = async (taskId: string) => {
    try {
      // Optimistically update UI
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
      
      // Update task status in the database
      const { error } = await supabase
        .from('child_tasks')
        .update({ completed: true })
        .eq('child_id', childId)
        .eq('task_id', taskId);
      
      if (error) throw error;
      
      // Award sparks for completing the task
      const task = tasks.find(t => t.id === taskId);
      const sparksReward = task?.sparks_reward || 5;
      
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({
          profileId: childId,
          amount: sparksReward
        })
      });
      
      // Record the sparks transaction
      await supabase.from('sparks_transactions').insert({
        child_id: childId,
        amount: sparksReward,
        reason: `Completed task: ${task?.title}`
      });
      
      // Show success message and confetti
      toast.success(`You earned ${sparksReward} sparks!`, {
        icon: '✨',
        position: 'bottom-right',
        duration: 3000
      });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(taskId);
      }
      
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to update task');
      
      // Revert the optimistic update
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed: false } : task
        )
      );
    }
  };

  return (
    <div className="px-4 py-3">
      {/* Panel header with back button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-white/70 hover:text-white"
              onClick={onClose}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-xl font-bold text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-wonderwhiz-gold" />
            Tasks & Quests
          </h2>
        </div>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-white rounded-full"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-white/70">No tasks available right now.</p>
            <p className="text-white/50 text-sm mt-1">Check back later for new challenges!</p>
          </div>
        ) : (
          <div>
            {tasks.some(task => !task.completed) && (
              <div className="mb-6">
                <h3 className="text-white/70 text-sm uppercase font-medium mb-2">Available Tasks</h3>
                {tasks.filter(task => !task.completed).map((task, index) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-3 border border-white/10"
                  >
                    <div className="flex items-start">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-0.5 text-white/60 hover:text-wonderwhiz-gold hover:bg-wonderwhiz-gold/20"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        <Circle className="h-5 w-5" />
                      </Button>
                      <div className="ml-2">
                        <h4 className="font-medium text-white">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-white/70 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center mt-2">
                          <Trophy className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />
                          <span className="text-xs text-wonderwhiz-gold">{task.sparks_reward} sparks</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {tasks.some(task => task.completed) && (
              <div>
                <h3 className="text-white/70 text-sm uppercase font-medium mb-2">Completed</h3>
                {tasks.filter(task => task.completed).map((task, index) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-3 border border-white/10 opacity-70"
                  >
                    <div className="flex items-start">
                      <div className="mt-0.5 text-wonderwhiz-gold">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="ml-2">
                        <h4 className="font-medium text-white">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-white/70 mt-1">{task.description}</p>
                        )}
                        <p className="text-xs text-white/50 mt-1">Completed</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPanel;
