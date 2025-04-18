
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChildTaskList from './ChildTaskList';
import { Check, Clock, Award, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface ChildDashboardTasksProps {
  childId: string;
  onSparkEarned?: (amount: number) => void;
}

const CompletedTaskList = ({ childId }: { childId: string }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('child_tasks')
          .select('*, tasks:task_id(title, description, sparks_reward)')
          .eq('child_profile_id', childId)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false });
          
        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompletedTasks();
  }, [childId]);
  
  if (loading) {
    return <div className="flex justify-center p-4 text-white/70">Loading tasks...</div>;
  }
  
  if (tasks.length === 0) {
    return <div className="text-center p-4 text-white/60">No completed tasks yet</div>;
  }
  
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <motion.div 
          key={task.id} 
          className="bg-green-500/20 border border-green-500/30 rounded-lg p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h4 className="font-semibold text-white flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-400" />
              {task.tasks?.title}
            </h4>
            <p className="text-sm text-white/70 ml-6">{task.tasks?.description}</p>
            <div className="mt-1 ml-6 flex items-center">
              <div className="text-xs text-white/70">
                Completed: {new Date(task.completed_at).toLocaleDateString()}
              </div>
              <div className="ml-3 flex items-center bg-wonderwhiz-gold/20 px-2 py-0.5 rounded text-wonderwhiz-gold text-xs border border-wonderwhiz-gold/30">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>{task.tasks?.sparks_reward || 0} earned</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const ChildDashboardTasks = ({
  childId,
  onSparkEarned
}: ChildDashboardTasksProps) => {
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchTaskCounts = async () => {
    setIsLoading(true);
    try {
      // Fetch pending tasks count
      const {
        count: pendingCount,
        error: pendingError
      } = await supabase.from('child_tasks').select('*', {
        count: 'exact',
        head: true
      }).eq('child_profile_id', childId).eq('status', 'pending');
      
      if (pendingError) throw pendingError;

      // Fetch completed tasks count
      const {
        count: completedCount,
        error: completedError
      } = await supabase.from('child_tasks').select('*', {
        count: 'exact',
        head: true
      }).eq('child_profile_id', childId).eq('status', 'completed');
      
      if (completedError) throw completedError;
      
      setPendingTasksCount(pendingCount || 0);
      setCompletedTasksCount(completedCount || 0);
    } catch (error) {
      console.error('Error fetching task counts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTaskCounts();
  }, [childId]);
  
  const handleTaskCompleted = () => {
    fetchTaskCounts();
    // If there's a callback for spark earnings, we can call it here
    if (onSparkEarned) {
      // We don't know the exact amount earned, so we're not calling it for now
      // This would be better handled through a more specific event from ChildTaskList
    }
  };
  
  return (
    <Card className="border-wonderwhiz-bright-pink/30 shadow-lg bg-gradient-to-br from-purple-900/90 to-pink-900/40">
      <CardHeader className="pb-2 border-b border-white/10">
        <CardTitle className="text-lg flex items-center justify-between text-white">
          <span className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-wonderwhiz-bright-pink" />
            Tasks
          </span>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-amber-400" />
              <span className="text-white/70">{isLoading ? '...' : pendingTasksCount} pending</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-400" />
              <span className="text-white/70">{isLoading ? '...' : completedTasksCount} completed</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="pending" className="mt-0">
          <TabsList className="grid grid-cols-2 mb-4 bg-white/10 border border-white/20">
            <TabsTrigger value="pending" className="data-[state=active]:bg-wonderwhiz-bright-pink/20 data-[state=active]:text-wonderwhiz-bright-pink">
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              Completed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <ChildTaskList childId={childId} onTaskCompleted={handleTaskCompleted} />
          </TabsContent>
          <TabsContent value="completed">
            <CompletedTaskList childId={childId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChildDashboardTasks;
