
import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import ConfettiTrigger from './ConfettiTrigger';

interface Task {
  id: string;
  title: string;
  description?: string;
  sparks_reward: number;
  status: string;
  child_task_id: string;
}

interface ChildTaskListProps {
  childId: string;
  onTaskComplete?: (sparks: number) => void;
}

const ChildTaskList: React.FC<ChildTaskListProps> = ({ childId, onTaskComplete }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [childId]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('child_tasks')
        .select(`
          id,
          status,
          task:tasks (
            id,
            title,
            description,
            sparks_reward
          )
        `)
        .eq('child_profile_id', childId);

      if (error) throw error;

      // Transform the nested data into a flat structure
      const formattedTasks = data.map(item => ({
        id: item.task.id,
        title: item.task.title,
        description: item.task.description,
        sparks_reward: item.task.sparks_reward,
        status: item.status,
        child_task_id: item.id
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (childTaskId: string, taskId: string, sparks: number) => {
    setCompletingTaskId(childTaskId);
    
    try {
      // Update the task status to completed
      const { error: updateError } = await supabase
        .from('child_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', childTaskId);

      if (updateError) throw updateError;

      // Add the sparks transaction
      const { error: transactionError } = await supabase
        .from('sparks_transactions')
        .insert({
          child_id: childId,
          amount: sparks,
          reason: `Completed task`
        });

      if (transactionError) throw transactionError;

      try {
        // Call the edge function to update the child's sparks balance
        const { error } = await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({ 
            profileId: childId, 
            amount: sparks 
          })
        });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error calling increment-sparks-balance function:', error);
        // Fallback: Try using RPC if edge function fails
        try {
          const { error: rpcError } = await supabase
            .rpc('increment_sparks_balance', { 
              profile_id: childId, 
              amount: sparks 
            });
            
          if (rpcError) throw rpcError;
        } catch (rpcFallbackError) {
          console.error('Error with RPC fallback:', rpcFallbackError);
          throw rpcFallbackError;
        }
      }

      // Update the local task list
      setTasks(prev => 
        prev.map(task => 
          task.child_task_id === childTaskId 
            ? { ...task, status: 'completed' } 
            : task
        )
      );

      // Call the onTaskComplete callback if provided
      if (onTaskComplete) {
        onTaskComplete(sparks);
      }

      toast.success(`Task completed! You earned ${sparks} sparks! ✨`);

    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Could not complete task');
    } finally {
      setCompletingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-pink"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-6 bg-white/5 rounded-lg">
        <p className="text-white/70">No tasks assigned yet!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => {
        const isCompleted = task.status === 'completed';
        const isPending = task.status === 'pending';
        
        return (
          <motion.div
            key={task.child_task_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg border ${
              isCompleted 
                ? 'bg-wonderwhiz-purple/20 border-wonderwhiz-purple/40'
                : 'bg-white/5 border-white/10 hover:bg-white/10 transition-colors'
            }`}
          >
            <div className="flex items-start">
              <div className="mt-1 mr-3">
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-wonderwhiz-purple" />
                ) : (
                  <Circle className="h-6 w-6 text-white/60" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-lg text-white">{task.title}</h3>
                {task.description && (
                  <p className="text-white/70 mt-1">{task.description}</p>
                )}
                <div className="flex items-center mt-2">
                  <Sparkles className="h-4 w-4 text-wonderwhiz-gold mr-1" />
                  <span className="text-sm text-white">{task.sparks_reward} Sparks reward</span>
                </div>
              </div>
              
              <div>
                {isPending ? (
                  <ConfettiTrigger intensity="high">
                    <button
                      onClick={() => handleCompleteTask(task.child_task_id, task.id, task.sparks_reward)}
                      disabled={!!completingTaskId}
                      className="px-3 py-2 bg-wonderwhiz-pink hover:bg-wonderwhiz-pink/80 text-white rounded-md transition-colors flex items-center disabled:opacity-50"
                    >
                      {completingTaskId === task.child_task_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></div>
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Complete
                    </button>
                  </ConfettiTrigger>
                ) : (
                  <div className="flex items-center px-3 py-2 bg-wonderwhiz-purple/30 text-white/90 rounded-md">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ChildTaskList;
