
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChildTaskList from './ChildTaskList';
import { Check, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChildDashboardTasksProps {
  childId: string;
  onSparkEarned?: (amount: number) => void;
}

const ChildDashboardTasks = ({ childId, onSparkEarned }: ChildDashboardTasksProps) => {
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTaskCounts = async () => {
    setIsLoading(true);
    try {
      // Fetch pending tasks count
      const { count: pendingCount, error: pendingError } = await supabase
        .from('child_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('child_profile_id', childId)
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      
      // Fetch completed tasks count
      const { count: completedCount, error: completedError } = await supabase
        .from('child_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('child_profile_id', childId)
        .eq('status', 'completed');
      
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
  };

  return (
    <Card className="bg-white border-white/10 shadow-lg">
      <CardHeader className="pb-2">
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
      <CardContent>
        <Tabs defaultValue="pending" className="mt-2">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <ChildTaskList 
              childId={childId}
              onTaskCompleted={handleTaskCompleted}
            />
          </TabsContent>
          <TabsContent value="completed">
            <div className="py-4 text-center">
              <p className="text-gray-500">Coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChildDashboardTasks;
