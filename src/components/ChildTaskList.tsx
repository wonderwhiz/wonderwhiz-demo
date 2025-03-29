
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  sparks_reward: number;
  status?: string;
  assigned_at?: string;
  completed_at?: string;
  task_id?: string;
  child_task_id?: string;
}

interface ChildTaskListProps {
  childId: string;
  onSparkEarned?: (amount: number) => void;
  onTaskComplete?: (amount: number) => void; // Added this prop to match with what's passed from ChildDashboardTasks
}

const ChildTaskList: React.FC<ChildTaskListProps> = ({ childId, onSparkEarned, onTaskComplete }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!childId) return;
    
    const fetchTasks = async () => {
      setLoading(true);
      
      try {
        // Get child's tasks with status
        const { data: childTasks, error: childTasksError } = await supabase
          .from('child_tasks')
          .select(`
            id,
            task_id,
            status,
            assigned_at,
            completed_at,
            tasks (
              id,
              title,
              description,
              sparks_reward
            )
          `)
          .eq('child_profile_id', childId);
          
        if (childTasksError) throw childTasksError;
        
        // Transform the data to a flatter structure
        const formattedTasks = childTasks?.map(ct => ({
          id: ct.tasks.id,
          title: ct.tasks.title,
          description: ct.tasks.description,
          sparks_reward: ct.tasks.sparks_reward,
          status: ct.status,
          assigned_at: ct.assigned_at,
          completed_at: ct.completed_at,
          task_id: ct.task_id,
          child_task_id: ct.id
        })) || [];
        
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [childId]);
  
  const handleCompleteTask = async (taskId: string, childTaskId: string, sparksReward: number) => {
    try {
      // Update task status to completed
      const { error: updateError } = await supabase
        .from('child_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', childTaskId);
        
      if (updateError) throw updateError;
      
      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.child_task_id === childTaskId
            ? { ...task, status: 'completed', completed_at: new Date().toISOString() }
            : task
        )
      );
      
      // Award sparks
      await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({ 
          profileId: childId, 
          amount: sparksReward 
        })
      });
      
      // Add the transaction record
      await supabase
        .from('sparks_transactions')
        .insert({
          child_id: childId,
          amount: sparksReward,
          reason: `Completing task: ${tasks.find(t => t.child_task_id === childTaskId)?.title || 'Task'}`
        });
      
      // Notify parent component - support both callback methods
      if (onSparkEarned) onSparkEarned(sparksReward);
      if (onTaskComplete) onTaskComplete(sparksReward);
      
      toast.success(`You earned ${sparksReward} sparks for completing this task! 🎉`, {
        duration: 3000,
        position: 'bottom-center'
      });
      
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-purple mx-auto"></div>
        <p className="mt-2 text-white/70">Loading your tasks...</p>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-white/70">No tasks assigned yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.child_task_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg border ${
              task.status === 'completed'
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            } transition-colors`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {task.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                ) : (
                  <Clock className="h-5 w-5 text-white/60 mr-3" />
                )}
                <div>
                  <h4 className="text-white font-medium">{task.title}</h4>
                  {task.description && (
                    <p className="text-white/70 text-sm">{task.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-2 bg-amber-500/20 px-2 py-1 rounded-full">
                  <Award className="h-4 w-4 text-amber-400 mr-1" />
                  <span className="text-amber-300 text-xs font-medium">+{task.sparks_reward}</span>
                </div>
                {task.status !== 'completed' && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task.task_id as string, task.child_task_id as string, task.sparks_reward)}
                    className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-xs"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
            {task.status === 'completed' && task.completed_at && (
              <p className="text-white/50 text-xs mt-1">
                Completed on {new Date(task.completed_at).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ChildTaskList;
