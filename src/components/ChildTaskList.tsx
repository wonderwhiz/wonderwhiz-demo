
import { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Task {
  id: string;
  task_id: string;
  status: string;
  assigned_at: string;
  completed_at: string | null;
  task: {
    id: string;
    title: string;
    description: string | null;
    sparks_reward: number;
  };
}

interface ChildTaskListProps {
  childId: string;
  onTaskCompleted?: () => void;
}

export const ChildTaskList = ({ childId, onTaskCompleted }: ChildTaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [childId]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data: assignedTasks, error } = await supabase
        .from('child_tasks')
        .select(`
          *,
          task:tasks (*)
        `)
        .eq('child_profile_id', childId)
        .eq('status', 'pending')
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setTasks(assignedTasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      // Update the task status
      const { error: updateError } = await supabase
        .from('child_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (updateError) throw updateError;

      // Get the task details to add sparks
      const { data: taskData } = await supabase
        .from('child_tasks')
        .select(`
          task:tasks (sparks_reward)
        `)
        .eq('id', taskId)
        .single();

      if (taskData?.task?.sparks_reward) {
        // Add sparks to child's balance
        const sparksReward = taskData.task.sparks_reward;
        
        const { error: sparksError } = await supabase.rpc('increment', {
          row_id: childId,
          increment_amount: sparksReward
        });

        if (sparksError) throw sparksError;
        
        // Add a sparks transaction record
        const { error: transactionError } = await supabase
          .from('sparks_transactions')
          .insert({
            child_id: childId,
            amount: sparksReward,
            reason: 'Task completed'
          });
          
        if (transactionError) throw transactionError;
      }

      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task completed!');
      
      if (onTaskCompleted) {
        onTaskCompleted();
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-purple mx-auto"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-500">No tasks assigned yet!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="p-3 bg-white rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h3 className="font-medium">{task.task.title}</h3>
              {task.task.description && (
                <p className="text-gray-500 text-sm mt-1">{task.task.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center text-amber-600">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">
                    Assigned: {new Date(task.assigned_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-wonderwhiz-purple font-medium">
                  +{task.task.sparks_reward} sparks
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-wonderwhiz-purple text-wonderwhiz-purple hover:bg-wonderwhiz-purple/10"
              onClick={() => handleCompleteTask(task.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Done
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChildTaskList;
