
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Award, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

// Define the Task interface with the required 'completed' property
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  type?: string;
  parent_user_id: string;
  sparks_reward: number;
  created_at: string;
  completed?: boolean; // Add the missing 'completed' property
}

interface TasksPanelProps {
  childId: string;
  onComplete?: (taskId: string) => void;
  onClose?: () => void; // Add the missing onClose prop
}

const TasksPanel: React.FC<TasksPanelProps> = ({ childId, onComplete, onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!childId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('child_tasks')
          .select(`
            id,
            status,
            tasks:task_id(id, title, description, sparks_reward, status, type, parent_user_id, created_at)
          `)
          .eq('child_profile_id', childId)
          .order('assigned_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the nested data into a flat structure and add the completed property
        const formattedTasks: Task[] = data?.map((item: any) => ({
          id: item.id,
          title: item.tasks?.title || 'Untitled Task',
          description: item.tasks?.description || '',
          status: item.status,
          type: item.tasks?.type,
          parent_user_id: item.tasks?.parent_user_id,
          sparks_reward: item.tasks?.sparks_reward || 0,
          created_at: item.tasks?.created_at,
          completed: item.status === 'completed'
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
  
  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('child_tasks')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Update the local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'completed', completed: true } : task
      ));
      
      if (onComplete) {
        onComplete(taskId);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-bright-pink rounded-full"></div>
      </div>
    );
  }
  
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
          <h2 className="text-xl font-bold text-white">Your Tasks</h2>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center p-6 text-white/60">
          <p>No tasks assigned yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pending Tasks */}
          {tasks.filter(task => !task.completed).length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-amber-400" />
                Pending Tasks
              </h3>
              <div className="space-y-2">
                {tasks.filter(task => !task.completed).map(task => (
                  <motion.div
                    key={task.id}
                    className="bg-wonderwhiz-purple/30 rounded-lg p-3 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && <p className="text-sm text-white/70">{task.description}</p>}
                        <div className="flex items-center mt-1">
                          <span className="flex items-center text-xs bg-wonderwhiz-vibrant-yellow/20 text-wonderwhiz-vibrant-yellow px-2 py-0.5 rounded-full">
                            <Award className="mr-1 h-3 w-3" />
                            {task.sparks_reward} sparks
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="ml-2 hover:bg-green-500/20 hover:text-green-300"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        Complete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Completed Tasks */}
          {tasks.filter(task => task.completed).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                Completed Tasks
              </h3>
              <div className="space-y-2">
                {tasks.filter(task => task.completed).slice(0, 3).map(task => (
                  <motion.div
                    key={task.id}
                    className="bg-green-500/20 border border-green-500/30 rounded-lg p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                      {task.title}
                    </h4>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center bg-wonderwhiz-vibrant-yellow/20 px-2 py-0.5 rounded text-wonderwhiz-vibrant-yellow text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        <span>{task.sparks_reward} earned</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {tasks.filter(task => task.completed).length > 3 && (
                  <div className="text-center text-white/60 text-sm pt-2">
                    + {tasks.filter(task => task.completed).length - 3} more completed tasks
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksPanel;
