
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Clock, Award, Star, ChevronRight, Check, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  onTaskComplete?: (amount: number) => void;
}

const ChildTaskList: React.FC<ChildTaskListProps> = ({ childId, onSparkEarned, onTaskComplete }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [quickTaskOpen, setQuickTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    sparks_reward: 3 // Default reward for quick tasks
  });
  
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
    setCompletingTask(childTaskId);
    
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
      const { error } = await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({ 
          profileId: childId, 
          amount: sparksReward 
        })
      });
      
      if (error) {
        console.error('Error incrementing sparks balance:', error);
        throw new Error('Failed to award sparks');
      }
      
      // Add the transaction record
      const { error: transactionError } = await supabase
        .from('sparks_transactions')
        .insert({
          child_id: childId,
          amount: sparksReward,
          reason: `Completing task: ${tasks.find(t => t.child_task_id === childTaskId)?.title || 'Task'}`
        });
      
      if (transactionError) {
        console.error('Error creating transaction record:', transactionError);
      }
      
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
    } finally {
      setCompletingTask(null);
    }
  };

  const handleAddQuickTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      // First, create the task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title,
          description: newTask.description || '',
          sparks_reward: newTask.sparks_reward,
          creator_id: childId,
          status: 'active',
          type: 'quick'
        })
        .select('id')
        .single();

      if (taskError) throw taskError;

      // Then, assign it to the child
      const { data: childTaskData, error: childTaskError } = await supabase
        .from('child_tasks')
        .insert({
          child_profile_id: childId,
          task_id: taskData.id,
          status: 'assigned',
          assigned_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (childTaskError) throw childTaskError;

      // Add the new task to the state
      const newTaskObj: Task = {
        id: taskData.id,
        title: newTask.title,
        description: newTask.description || '',
        sparks_reward: newTask.sparks_reward,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        task_id: taskData.id,
        child_task_id: childTaskData.id
      };

      setTasks(prev => [...prev, newTaskObj]);
      setQuickTaskOpen(false);
      setNewTask({ title: '', description: '', sparks_reward: 3 });
      
      toast.success('Your task was added! Complete it to earn sparks.', {
        duration: 3000,
        position: 'bottom-center'
      });
      
    } catch (error) {
      console.error('Error adding quick task:', error);
      toast.error('Failed to add task. Please try again.');
    }
  };
  
  const renderTaskIcon = (task: Task, isCompleting: boolean) => {
    if (isCompleting) {
      return (
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-6 w-6 border-2 border-wonderwhiz-purple border-t-transparent rounded-full"></div>
          </motion.div>
          <Clock className="h-6 w-6 text-transparent" />
        </div>
      );
    }
    
    if (task.status === 'completed') {
      return (
        <div className="relative">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1.5, 1], opacity: [0, 1] }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Star className="h-3 w-3 text-yellow-300" />
          </motion.div>
        </div>
      );
    }
    
    return <Clock className="h-6 w-6 text-white/60" />;
  };
  
  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-wonderwhiz-purple mx-auto"></div>
        <p className="mt-4 text-white/70 font-baloo">Loading your tasks...</p>
        
        <div className="mt-6 flex justify-center">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-wonderwhiz-purple via-wonderwhiz-pink to-wonderwhiz-purple rounded-full"
          ></motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 relative">
      {/* Quick Task Add Button */}
      <div className="flex justify-end mb-2">
        <Button 
          onClick={() => setQuickTaskOpen(true)} 
          size="sm"
          variant="outline"
          className="bg-wonderwhiz-gold/20 text-wonderwhiz-gold border-wonderwhiz-gold/30 hover:bg-wonderwhiz-gold/30 hover:text-white"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add Quick Task
        </Button>
      </div>
      
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.child_task_id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border ${
              task.status === 'completed'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            } transition-all duration-300 relative overflow-hidden group`}
          >
            {task.status === 'completed' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-400/10"></div>
            )}
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center">
                {renderTaskIcon(task, completingTask === task.child_task_id)}
                
                <div className="ml-3">
                  <h4 className={`font-semibold text-lg ${task.status === 'completed' ? 'text-green-300' : 'text-white'} font-baloo`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className={`text-sm ${task.status === 'completed' ? 'text-green-200/70' : 'text-white/70'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`flex items-center mr-3 ${task.status === 'completed' ? 'bg-green-500/20' : 'bg-amber-500/20'} px-3 py-1.5 rounded-full group-hover:scale-105 transition-transform`}>
                  <Award className="h-4 w-4 text-amber-400 mr-1.5" />
                  <span className={`${task.status === 'completed' ? 'text-green-300' : 'text-amber-300'} text-sm font-medium`}>
                    +{task.sparks_reward}
                  </span>
                </div>
                
                {task.status !== 'completed' && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task.id, task.child_task_id as string, task.sparks_reward)}
                    className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 px-4 group-hover:scale-105 transition-transform"
                    disabled={completingTask === task.child_task_id}
                  >
                    {completingTask === task.child_task_id ? (
                      <span>Working...</span>
                    ) : (
                      <span className="flex items-center">
                        Complete <Check className="ml-1 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                )}
                
                {task.status === 'completed' && (
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center"
                  >
                    <Check className="h-5 w-5 text-green-400" />
                  </motion.div>
                )}
              </div>
            </div>
            
            {task.status === 'completed' && task.completed_at && (
              <motion.p 
                className="text-green-300/60 text-xs mt-2 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Star className="h-3 w-3 mr-1.5 text-wonderwhiz-gold" />
                Completed on {new Date(task.completed_at).toLocaleDateString()} - Great job!
              </motion.p>
            )}
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute bottom-0 right-0 h-8 w-16 bg-gradient-to-l from-white/5 to-transparent rounded-tl-xl"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
            
            {task.status === 'completed' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute -right-1 -bottom-1 text-green-500/20 transform rotate-12"
              >
                <CheckCircle className="h-14 w-14" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {tasks.length === 0 && (
        <motion.div 
          className="text-center p-8 bg-white/5 rounded-xl border border-dashed border-white/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                y: [0, -3, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Award className="h-8 w-8 text-wonderwhiz-gold" />
            </motion.div>
          </div>
          <h4 className="text-xl font-bold text-white font-baloo mb-2">No Tasks Yet</h4>
          <p className="text-white/70">Create a quick task or wait for new tasks to be assigned!</p>
          <Button 
            onClick={() => setQuickTaskOpen(true)}
            className="mt-4 bg-wonderwhiz-gold hover:bg-wonderwhiz-gold/80"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Task
          </Button>
        </motion.div>
      )}
      
      <motion.div 
        className="w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full mt-6"
        animate={{ 
          opacity: [0.3, 0.7, 0.3],
          backgroundPosition: ['100% 0%', '0% 100%']
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Quick Task Dialog */}
      <Dialog open={quickTaskOpen} onOpenChange={setQuickTaskOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-wonderwhiz-gold/30">
          <DialogHeader>
            <DialogTitle className="text-wonderwhiz-gold font-baloo text-xl">Add Your Own Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">
                Task
              </Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="col-span-3 bg-gray-800 border-gray-700"
                placeholder="What do you want to accomplish?"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-description" className="text-right">
                Details
              </Label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="col-span-3 bg-gray-800 border-gray-700 min-h-[80px]"
                placeholder="Add any details here (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sparks-reward" className="text-right">
                Sparks
              </Label>
              <div className="col-span-3 flex items-center">
                <Award className="h-5 w-5 text-wonderwhiz-gold mr-2" />
                <span className="text-wonderwhiz-gold font-bold">{newTask.sparks_reward}</span>
                <span className="ml-2 text-sm text-gray-400">(default for quick tasks)</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickTaskOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={handleAddQuickTask} className="bg-wonderwhiz-gold hover:bg-wonderwhiz-gold/80 text-black">
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChildTaskList;
