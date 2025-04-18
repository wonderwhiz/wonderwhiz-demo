
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface TasksPanelProps {
  childId: string;
  onClose: () => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  sparks_reward: number;
  due_date?: string;
}

const TasksPanel: React.FC<TasksPanelProps> = ({ childId, onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('child_id', childId)
          .order('completed', { ascending: true })
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [childId]);
  
  const handleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      );
      
      setTasks(updatedTasks);
      
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Update in database
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);
        
      if (error) throw error;
      
      // If marking as completed, award sparks
      if (completed && task.sparks_reward > 0) {
        // Award sparks
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: task.sparks_reward
          })
        });
        
        // Record transaction
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: task.sparks_reward,
          reason: `Completed task: ${task.title}`
        });
        
        toast.success(`Completed! You earned ${task.sparks_reward} sparks!`, {
          icon: '✨',
        });
        
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF5BA3', '#00E2FF']
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="p-5 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <CheckSquare className="mr-2 h-5 w-5 text-wonderwhiz-vibrant-yellow" />
          Your Wonder Tasks
        </h3>
        
        <Button variant="ghost" size="icon" className="text-white/70" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-3 mt-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-t-transparent border-wonderwhiz-bright-pink rounded-full animate-spin"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-white/60 mb-2">No tasks yet</div>
            <p className="text-sm text-white/40 max-w-xs mx-auto">
              Complete your explorations and they'll appear here with special rewards
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`border rounded-xl overflow-hidden transition-colors ${
                task.completed 
                  ? 'bg-white/5 border-white/10 opacity-70' 
                  : 'bg-white/10 border-white/20'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div 
                    className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mr-3 mt-0.5 cursor-pointer ${
                      task.completed ? 'bg-wonderwhiz-vibrant-yellow' : 'border-2 border-white/30'
                    }`}
                    onClick={() => handleTaskCompletion(task.id, !task.completed)}
                  >
                    {task.completed && <CheckSquare className="h-4 w-4 text-wonderwhiz-deep-purple" />}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium text-base ${task.completed ? 'text-white/70 line-through' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    
                    {task.description && (
                      <p className="text-sm text-white/60 mt-1">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-white/60 text-xs">
                        {task.due_date && (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center bg-wonderwhiz-bright-pink/20 px-2 py-1 rounded-md text-xs">
                        <Star className="h-3 w-3 mr-1 text-wonderwhiz-vibrant-yellow" />
                        <span className="text-white font-bold">{task.sparks_reward} sparks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksPanel;
