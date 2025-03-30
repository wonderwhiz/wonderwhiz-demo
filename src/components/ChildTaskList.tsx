
import { useState, useEffect } from 'react';
import { Check, X, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  sparks_reward: number; // Changed from reward_sparks to sparks_reward
}

interface ChildTask {
  id: string;
  task_id: string;
  child_profile_id: string;
  status: string;
  assigned_at: string;
  completed_at: string;
  title?: string;
  description?: string;
  sparks_reward?: number; // Changed from reward_sparks to sparks_reward
}

interface ChildTaskListProps {
  childId: string;
  onTaskCompleted?: () => void;
}

const ChildTaskList = ({ childId, onTaskCompleted }: ChildTaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('child_tasks')
        .select('*, tasks:task_id(title, description, sparks_reward)') // Changed from reward_sparks to sparks_reward
        .eq('child_profile_id', childId)
        .eq('status', 'pending')
        .order('assigned_at', { ascending: false });
        
      if (error) throw error;
      
      // Map the joined data to the Task interface format
      if (data) {
        const formattedTasks: Task[] = data.map((item: any) => ({
          id: item.id,
          title: item.tasks?.title || 'Unnamed Task',
          description: item.tasks?.description || '',
          status: item.status as 'pending' | 'completed',
          sparks_reward: item.tasks?.sparks_reward || 0 // Changed from reward_sparks to sparks_reward
        }));
        
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, [childId]);
  
  const handleTaskCompletion = async (taskId: string, rewardAmount: number) => {
    try {
      // Update task status
      const { error: updateError } = await supabase
        .from('child_tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);
        
      if (updateError) throw updateError;
      
      // Increment sparks balance using RPC call
      const { error: rewardError } = await supabase.rpc(
        'increment_sparks_balance',
        { child_id: childId, amount: rewardAmount }
      );
      
      if (rewardError) throw rewardError;
      
      // Show success toast
      toast.success('Task completed! Sparks earned!', {
        description: `+${rewardAmount} sparks added to your balance.`
      });
      
      // Update task list
      fetchTasks();
      
      // Call parent callback if provided
      if (onTaskCompleted) {
        onTaskCompleted();
      }
      
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };
  
  if (loading) {
    return <div className="flex justify-center p-4">Loading tasks...</div>;
  }
  
  if (tasks.length === 0) {
    return <div className="text-center p-4 text-gray-400">No pending tasks</div>;
  }
  
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="bg-wonderwhiz-purple/20 rounded-lg p-3 flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-white">{task.title}</h4>
            <p className="text-sm text-gray-300">{task.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-wonderwhiz-gold/20 px-2 py-1 rounded text-wonderwhiz-gold text-sm">
              <Award className="h-3 w-3 mr-1" />
              <span>{task.sparks_reward}</span> {/* Changed from reward_sparks to sparks_reward */}
            </div>
            <Button 
              size="icon" 
              variant="ghost"
              className="h-8 w-8 rounded-full bg-green-500/20 hover:bg-green-500/30"
              onClick={() => handleTaskCompletion(task.id, task.sparks_reward)} // Changed from reward_sparks to sparks_reward
            >
              <Check className="h-4 w-4 text-green-400" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChildTaskList;
