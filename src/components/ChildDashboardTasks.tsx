
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChildTaskList from './ChildTaskList';
import { Check, Clock, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
    return <div className="flex justify-center p-4">Loading tasks...</div>;
  }
  
  if (tasks.length === 0) {
    return <div className="text-center p-4 text-gray-400">No completed tasks yet</div>;
  }
  
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="bg-green-500/20 rounded-lg p-3">
          <div>
            <h4 className="font-semibold text-white flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-400" />
              {task.tasks?.title}
            </h4>
            <p className="text-sm text-gray-300 ml-6">{task.tasks?.description}</p>
            <div className="mt-1 ml-6 flex items-center">
              <div className="text-xs text-gray-400">
                Completed: {new Date(task.completed_at).toLocaleDateString()}
              </div>
              <div className="ml-3 flex items-center bg-wonderwhiz-gold/20 px-2 py-0.5 rounded text-wonderwhiz-gold text-xs">
                <Award className="h-3 w-3 mr-1" />
                <span>{task.tasks?.sparks_reward || 0} earned</span>
              </div>
            </div>
          </div>
        </div>
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
    <Card className="border-white/10 shadow-lg bg-purple-900">
      <CardHeader className="pb-2 bg-purple-300">
        <CardTitle className="text-lg flex items-center justify-between text-gray-800">
          <span>Tasks</span>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-amber-600" />
              <span className="text-gray-600">{isLoading ? '...' : pendingTasksCount} pending</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-gray-600">{isLoading ? '...' : completedTasksCount} completed</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-purple-900">
        <Tabs defaultValue="pending" className="mt-2">
          <TabsList className="grid grid-cols-2 mb-4 bg-purple-200">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
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
