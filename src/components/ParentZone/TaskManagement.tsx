
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, X, CheckCircle, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  sparks_reward: number;
}

interface AssignedTask {
  id: string;
  child_profile_id: string;
  task_id: string;
  status: string;
  assigned_at: string;
  completed_at: string | null;
  task: {
    id: string;
    title: string;
    description: string | null;
    sparks_reward: number;
  }
}

interface TaskManagementProps {
  childId: string;
  tasks: Task[];
  assignedTasks: AssignedTask[];
  completedTasks: AssignedTask[];
  onTasksChange: (updatedTasks: Task[]) => void;
  onAssignedTasksChange: (updatedTasks: AssignedTask[]) => void;
  onCompletedTasksChange: (updatedTasks: AssignedTask[]) => void;
}

const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  sparks_reward: z.number().min(1, { message: "Reward must be at least 1 spark" })
});

const TaskManagement = ({ 
  childId, 
  tasks, 
  assignedTasks, 
  completedTasks,
  onTasksChange,
  onAssignedTasksChange,
  onCompletedTasksChange
}: TaskManagementProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      sparks_reward: 5
    },
  });

  const onSubmitTask = async (values: z.infer<typeof taskSchema>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("You must be logged in");
        return;
      }
      
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          parent_user_id: session.session.user.id,
          title: values.title,
          description: values.description || null,
          sparks_reward: values.sparks_reward,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      onTasksChange([...tasks, task]);
      form.reset({ title: '', description: '', sparks_reward: 5 });
      setIsAddingTask(false);
      toast.success("Task created successfully");
      
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Failed to create task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      onTasksChange(tasks.filter(task => task.id !== taskId));
      toast.success("Task deleted");
      
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
    }
  };

  const handleAssignTask = async (taskId: string) => {
    try {
      const existingTask = assignedTasks.find(t => t.task.id === taskId);
      
      if (existingTask) {
        toast.error("This task is already assigned");
        return;
      }
      
      const { data, error } = await supabase
        .from('child_tasks')
        .insert({
          child_profile_id: childId,
          task_id: taskId,
          status: 'pending'
        })
        .select(`
          *,
          task:tasks (*)
        `)
        .single();
        
      if (error) throw error;
      
      onAssignedTasksChange([data, ...assignedTasks]);
      toast.success("Task assigned successfully");
      
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error("Failed to assign task");
    }
  };

  const handleUnassignTask = async (childTaskId: string) => {
    try {
      const { error } = await supabase
        .from('child_tasks')
        .delete()
        .eq('id', childTaskId);
        
      if (error) throw error;
      
      onAssignedTasksChange(assignedTasks.filter(task => task.id !== childTaskId));
      toast.success("Task unassigned");
      
    } catch (error) {
      console.error('Error unassigning task:', error);
      toast.error("Failed to unassign task");
    }
  };

  return (
    <>
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white text-lg">Manage Tasks</CardTitle>
            <Button 
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90"
            >
              {isAddingTask ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <h3 className="text-white font-medium mb-4">Create New Task</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitTask)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Task Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Read a book for 20 minutes"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Description (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add details about the task"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-white/60">
                          Provide any additional instructions for this task
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sparks_reward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Spark Reward</FormLabel>
                        <div className="flex items-center">
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              className="bg-white/10 border-white/20 text-white w-24"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                            />
                          </FormControl>
                          <span className="ml-2 text-wonderwhiz-gold">✨</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end pt-2">
                    <Button 
                      type="submit"
                      className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></div>
                          Creating...
                        </>
                      ) : (
                        'Create Task'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
          
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70">No tasks created yet. Add your first task!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => {
                const isAlreadyAssigned = assignedTasks.some(t => t.task.id === task.id);
                
                return (
                  <div key={task.id} className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-wonderwhiz-pink mr-2" />
                        <h3 className="font-medium text-white">{task.title}</h3>
                      </div>
                      {task.description && (
                        <p className="text-white/70 text-sm mt-1 ml-6">{task.description}</p>
                      )}
                      <div className="ml-6 flex items-center mt-2">
                        <span className="text-xs text-white/70">✨ {task.sparks_reward} Sparks</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        onClick={() => handleAssignTask(task.id)}
                        className={`text-white text-xs ${
                          isAlreadyAssigned
                            ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed'
                            : 'bg-wonderwhiz-purple/70 hover:bg-wonderwhiz-purple'
                        }`}
                        disabled={isAlreadyAssigned}
                      >
                        {isAlreadyAssigned ? 'Assigned' : 'Assign'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Assigned Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {assignedTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70">No tasks currently assigned.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedTasks.map((assignedTask) => (
                <div key={assignedTask.id} className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-wonderwhiz-blue mr-2" />
                      <h3 className="font-medium text-white">{assignedTask.task.title}</h3>
                    </div>
                    {assignedTask.task.description && (
                      <p className="text-white/70 text-sm mt-1 ml-6">{assignedTask.task.description}</p>
                    )}
                    <div className="ml-6 flex items-center mt-2">
                      <div className="flex items-center mr-3">
                        <span className="text-xs text-white/70">✨ {assignedTask.task.sparks_reward} Sparks</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-white/70">
                          Assigned: {new Date(assignedTask.assigned_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUnassignTask(assignedTask.id)}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Unassign
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Completed Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {completedTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70">No completed tasks yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedTasks.map((completedTask) => (
                <div key={completedTask.id} className="p-3 bg-wonderwhiz-purple/20 rounded-lg border border-wonderwhiz-purple/30 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-wonderwhiz-purple mr-2" />
                      <h3 className="font-medium text-white">{completedTask.task.title}</h3>
                    </div>
                    {completedTask.task.description && (
                      <p className="text-white/70 text-sm mt-1 ml-6">{completedTask.task.description}</p>
                    )}
                    <div className="ml-6 flex items-center mt-2 space-x-3">
                      <div className="flex items-center">
                        <span className="text-xs text-white/70">✨ {completedTask.task.sparks_reward} Sparks</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-white/70">
                          Completed: {new Date(completedTask.completed_at || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TaskManagement;
