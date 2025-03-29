import React, { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChildTaskListProps {
  onSparkEarned?: (amount: number) => void;
  onTaskComplete?: (sparks: number) => void;
}

const ChildTaskList = ({ onSparkEarned, onTaskComplete }: ChildTaskListProps) => {
  const { profileId } = useParams<{ profileId: string }>();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskList, setTaskList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!profileId) return;

    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error('Not authenticated!');
        return;
      }

      const { data, error } = await supabase
        .from('child_tasks')
        .select(`
          *,
          task:tasks (*)
        `)
        .eq('child_profile_id', profileId)
        .order('assigned_at', { ascending: false });

      if (error) throw error;

      setTaskList(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [profileId]);

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddQuickTask = async (title: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error('Please log in to add tasks');
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          parent_user_id: session.session.user.id,
          sparks_reward: 5,  // Default reward
          type: 'quick',     // Distinguish quick tasks
          status: 'active'   // Set initial status
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Quick task "${title}" added!`);
      // Additional logic for refreshing tasks or updating UI
      loadTasks();
    } catch (error) {
      console.error('Error adding quick task:', error);
      toast.error('Failed to add task');
    }
  };

  const handleCompleteTask = async (taskId: string, sparksReward: number) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error('Please log in to complete tasks');
        return;
      }

      const { error } = await supabase
        .from('child_tasks')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('id', taskId)
        .eq('child_profile_id', profileId);

      if (error) throw error;

      // Update sparks balance
      const { error: sparksError } = await supabase.rpc('increment_sparks_balance', {
        child_profile_id: profileId,
        spark_amount: sparksReward
      });

      if (sparksError) throw sparksError;

      toast.success(`Task completed! You earned ${sparksReward} sparks!`);
      onTaskComplete?.(sparksReward);
      onSparkEarned?.(sparksReward);
      loadTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('child_tasks')
        .delete()
        .eq('id', taskId)
        .eq('child_profile_id', profileId);

      if (error) throw error;

      toast.success('Task removed successfully!');
      loadTasks();
    } catch (error) {
      console.error('Error removing task:', error);
      toast.error('Failed to remove task');
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Add a quick task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTaskTitle.trim() !== '') {
                handleAddQuickTask(newTaskTitle);
                setNewTaskTitle('');
              }
            }}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
        {isLoading ? (
          <p className="text-white/70">Loading tasks...</p>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence>
              {taskList.map((task) => (
                <motion.li
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-wonderwhiz-purple" />
                    <span className="text-white">{task.task.title}</span>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => handleCompleteTask(task.id, task.task.sparks_reward)}
                    >
                      Complete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleRemoveTask(task.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ChildTaskList;
