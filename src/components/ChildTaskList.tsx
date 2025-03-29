
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Clock, Award, Star, ChevronRight, Check, PlusCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Task {
  id: string;
  title: string;
  description: string | null;
  sparks_reward: number;
  child_task_id?: string;
  completed_at?: string | null;
  status?: string;
  type?: string;
}

interface QuickTask {
  title: string;
  description?: string;
  sparks_reward: number;
}

interface ChildTaskListProps {
  childId: string;
  onSparkEarned?: (amount: number) => void;
  onTaskComplete?: (amount: number) => void;
  limit?: number;
}

const ChildTaskList = ({ childId, onSparkEarned, onTaskComplete, limit = 5 }: ChildTaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [quickTaskOpen, setQuickTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<QuickTask>({
    title: '',
    description: '',
    sparks_reward: 5
  });
  
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      
      try {
        const { data: childTasks, error: childTasksError } = await supabase
          .from('child_tasks')
          .select(`
            id,
            child_profile_id,
            task_id,
            completed_at,
            status,
            tasks (
              id,
              title,
              description,
              sparks_reward,
              status,
              type
            )
          `)
          .eq('child_profile_id', childId)
          .is('completed_at', null)
          .order('assigned_at', { ascending: false })
          .limit(limit);
          
        if (childTasksError) throw childTasksError;
        
        const formattedTasks = childTasks?.map(ct => ({
          id: ct.tasks.id,
          title: ct.tasks.title,
          description: ct.tasks.description,
          sparks_reward: ct.tasks.sparks_reward || 0,
          child_task_id: ct.id,
          completed_at: ct.completed_at,
          status: ct.tasks.status,
          type: ct.tasks.type
        }));
        
        setTasks(formattedTasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    
    if (childId) {
      fetchTasks();
    }
  }, [childId, limit]);
  
  const handleCompleteTask = async (childTaskId: string, sparksReward: number) => {
    if (!childTaskId) {
      toast.error('Task completion failed: Missing child task ID');
      return;
    }
    
    setCompletingTask(childTaskId);
    
    try {
      const { error: updateError } = await supabase
        .from('child_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', childTaskId);
        
      if (updateError) throw updateError;
      
      setTasks(prev => 
        prev.map(task => 
          task.child_task_id === childTaskId
            ? { ...task, completed_at: new Date().toISOString(), status: 'completed' }
            : task
        )
      );
      
      const { error } = await supabase.functions.invoke('increment-sparks-balance', {
        body: JSON.stringify({ 
          profileId: childId, 
          amount: sparksReward
        })
      });
      
      if (error) {
        console.error('Error awarding sparks:', error);
        throw new Error('Failed to award sparks');
      }
      
      const { error: transactionError } = await supabase
        .from('sparks_transactions')
        .insert({
          child_id: childId,
          amount: sparksReward,
          reason: 'Completing task'
        });
        
      if (transactionError) {
        console.error('Error creating transaction record:', transactionError);
      }
      
      if (onSparkEarned) onSparkEarned(sparksReward);
      if (onTaskComplete) onTaskComplete(sparksReward);
      
      toast.success(`Task completed! You earned ${sparksReward} sparks!`, {
        position: 'bottom-right'
      });
      
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    } finally {
      setCompletingTask(null);
    }
  };

  const handleAddQuickTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (newTask.sparks_reward < 1) {
      toast.error('Sparks reward must be at least 1');
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
          parent_user_id: childId,
          status: 'active',
          type: 'quick'
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Then, assign it to the child
      const { data: childTaskData, error: childTaskError } = await supabase
        .from('child_tasks')
        .insert({
          child_profile_id: childId,
          task_id: taskData.id,
          status: 'pending'
        })
        .select()
        .single();

      if (childTaskError) throw childTaskError;

      // Add the new task to the state
      const newTaskObj: Task = {
        id: taskData.id,
        title: newTask.title,
        description: newTask.description || null,
        sparks_reward: newTask.sparks_reward,
        child_task_id: childTaskData.id,
        status: 'active',
        type: 'quick'
      };

      setTasks(prev => [newTaskObj, ...prev]);

      toast.success('New task created successfully!');

      // Reset the form and close the dialog
      setNewTask({
        title: '',
        description: '',
        sparks_reward: 5
      });
      setQuickTaskOpen(false);

    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
        ))}
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end mb-2">
          <Button 
            onClick={() => setQuickTaskOpen(true)} 
            variant="outline" 
            size="sm"
            className="text-wonderwhiz-gold border-wonderwhiz-gold/40 hover:bg-wonderwhiz-gold/10"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Quick Task
          </Button>
        </div>
        
        <Card className="flex flex-col items-center justify-center p-6 bg-wonderwhiz-dark/50 border-white/10 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <Star className="h-12 w-12 text-wonderwhiz-gold opacity-70" />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-2">No Tasks Right Now</h3>
          <p className="text-white/60 text-sm max-w-xs">
            You don't have any active tasks. Create a quick task or ask your parent to assign you some tasks!
          </p>
          
          <Button 
            onClick={() => setQuickTaskOpen(true)}
            className="mt-4 bg-gradient-to-r from-wonderwhiz-gold to-wonderwhiz-gold/80 text-wonderwhiz-dark hover:from-wonderwhiz-gold hover:to-wonderwhiz-gold/90"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add a Quick Task
          </Button>
        </Card>

        <Dialog open={quickTaskOpen} onOpenChange={setQuickTaskOpen}>
          <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-wonderwhiz-gold/30">
            <DialogHeader>
              <DialogTitle className="text-wonderwhiz-gold">Create Quick Task</DialogTitle>
              <DialogDescription className="text-white/70">
                Add a new task to complete and earn sparks!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-white">Task Name</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="What do you want to accomplish?"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white h-20"
                  placeholder="Add some details about your task"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sparks" className="text-white">Sparks Reward</Label>
                <Input
                  id="sparks"
                  type="number"
                  min={1}
                  max={20}
                  value={newTask.sparks_reward}
                  onChange={(e) => setNewTask({ ...newTask, sparks_reward: parseInt(e.target.value) || 1 })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setQuickTaskOpen(false)} className="border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button 
                onClick={handleAddQuickTask} 
                className="bg-gradient-to-r from-wonderwhiz-gold to-wonderwhiz-gold/80 text-wonderwhiz-dark hover:from-wonderwhiz-gold hover:to-wonderwhiz-gold/90"
              >
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 relative">
      <div className="flex justify-end mb-2">
        <Button 
          onClick={() => setQuickTaskOpen(true)} 
          variant="outline" 
          size="sm"
          className="text-wonderwhiz-gold border-wonderwhiz-gold/40 hover:bg-wonderwhiz-gold/10"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Quick Task
        </Button>
      </div>
      
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.child_task_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <Card 
              className={`
                relative 
                overflow-hidden 
                border-white/10 
                bg-white/5 
                backdrop-blur-sm 
                hover:bg-white/8 
                transition-all 
                group
                ${task.type === 'quick' ? 'border-wonderwhiz-gold/20' : ''} 
              `}
            >
              <div className="p-3 sm:p-4 flex justify-between items-center">
                <div className="flex items-start space-x-3">
                  <div className={`
                    mt-1 rounded-full p-1.5 
                    ${task.type === 'quick' ? 'bg-wonderwhiz-gold/20 text-wonderwhiz-gold' : 'bg-wonderwhiz-blue/20 text-wonderwhiz-blue'}
                  `}>
                    {task.completed_at ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white group-hover:text-wonderwhiz-gold transition-colors">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-white/70 mt-0.5 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {task.sparks_reward > 0 && (
                    <motion.div 
                      whileHover={{ scale: 1.1 }} 
                      className="flex items-center bg-wonderwhiz-gold/20 text-wonderwhiz-gold rounded-full px-2 py-0.5"
                    >
                      <Star className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs font-bold">{task.sparks_reward}</span>
                    </motion.div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className={`
                      min-w-20 border-wonderwhiz-blue/30 text-wonderwhiz-blue hover:bg-wonderwhiz-blue/10 
                      ${completingTask === task.child_task_id ? 'opacity-50 pointer-events-none' : ''}
                    `}
                    onClick={() => task.child_task_id && handleCompleteTask(task.child_task_id, task.sparks_reward)}
                    disabled={!!task.completed_at || completingTask === task.child_task_id}
                  >
                    {task.completed_at ? (
                      <span className="flex items-center"><Check className="h-4 w-4 mr-1" /> Done</span>
                    ) : completingTask === task.child_task_id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                      </span>
                    ) : (
                      <span className="flex items-center">Complete <ChevronRight className="h-4 w-4 ml-1" /></span>
                    )}
                  </Button>
                </div>
              </div>
              
              {task.type === 'quick' && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-xs text-wonderwhiz-gold/60 absolute top-1 right-2"
                >
                  Quick Task
                </motion.p>
              )}
              
              <motion.div 
                className="absolute bottom-0 right-0 h-8 w-16 bg-gradient-to-l from-white/5 to-transparent rounded-tl-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-white/60 text-sm pt-1"
      >
        {tasks.length === 1 ? '1 active task' : `${tasks.length} active tasks`}
      </motion.div>
      
      <motion.div
        className="absolute -z-10 top-12 right-6 w-20 h-20 rounded-full bg-wonderwhiz-gold/5"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <Dialog open={quickTaskOpen} onOpenChange={setQuickTaskOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-wonderwhiz-gold/30">
          <DialogHeader>
            <DialogTitle className="text-wonderwhiz-gold">Create Quick Task</DialogTitle>
            <DialogDescription className="text-white/70">
              Add a new task to complete and earn sparks!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-white">Task Name</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="What do you want to accomplish?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white h-20"
                placeholder="Add some details about your task"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sparks" className="text-white">Sparks Reward</Label>
              <Input
                id="sparks"
                type="number"
                min={1}
                max={20}
                value={newTask.sparks_reward}
                onChange={(e) => setNewTask({ ...newTask, sparks_reward: parseInt(e.target.value) || 1 })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickTaskOpen(false)} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button 
              onClick={handleAddQuickTask} 
              className="bg-gradient-to-r from-wonderwhiz-gold to-wonderwhiz-gold/80 text-wonderwhiz-dark hover:from-wonderwhiz-gold hover:to-wonderwhiz-gold/90"
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChildTaskList;
