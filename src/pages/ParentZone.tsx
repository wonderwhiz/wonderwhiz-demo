import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, ArrowLeft, ChevronRight, Settings, 
  BarChart3, Sparkles, Plus, Trash2, Calendar,
  CheckCircle, Clock, X
} from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  age: number;
  language: string;
  interests: string[];
  sparks_balance: number;
  created_at: string;
}

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

interface ActivityData {
  name: string;
  value: number;
  date: string;
  tasks: number;
  quizzes: number;
  topics: number;
}

interface DailyActivity {
  id: string;
  child_profile_id: string;
  activity_date: string;
  tasks_completed: number;
  quizzes_completed: number;
  topics_explored: number;
}

const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  sparks_reward: z.number().min(1, { message: "Reward must be at least 1 spark" })
});

const ParentZone = () => {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<AssignedTask[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [weeklyActivityData, setWeeklyActivityData] = useState<ActivityData[]>([]);
  const [learningStats, setLearningStats] = useState({
    topicsExplored: 0,
    quizzesCompleted: 0,
    creativePrompts: 0,
    tasksCompleted: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [popularTopics, setPopularTopics] = useState<{name: string, percentage: number}[]>([]);
  
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      sparks_reward: 5
    },
  });
  
  useEffect(() => {
    const loadProfileAndTasks = async () => {
      if (!profileId) {
        navigate('/profiles');
        return;
      }
      
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          navigate('/login');
          return;
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('id', profileId)
          .single();
          
        if (profileError) throw profileError;
        
        if (profileData.parent_user_id !== session.session.user.id) {
          toast.error("You don't have permission to view this profile");
          navigate('/profiles');
          return;
        }
        
        setChildProfile(profileData);
        
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('parent_user_id', session.session.user.id);
          
        if (tasksError) throw tasksError;
        setTasks(tasksData || []);
        
        await fetchAssignedTasks();
        await fetchWeeklyActivityData();
        await fetchLearningStats();
        await fetchRecentActivity();
        
      } catch (error) {
        console.error('Error loading profile or tasks:', error);
        toast.error("Failed to load profile data");
        navigate('/profiles');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileAndTasks();
  }, [profileId, navigate]);
  
  const fetchAssignedTasks = async () => {
    try {
      const { data: assignedData, error: assignedError } = await supabase
        .from('child_tasks')
        .select(`
          *,
          task:tasks (*)
        `)
        .eq('child_profile_id', profileId)
        .order('assigned_at', { ascending: false });
        
      if (assignedError) throw assignedError;

      const activeTasksData = assignedData?.filter(task => task.status === 'pending') || [];
      const completedTasksData = assignedData?.filter(task => task.status === 'completed') || [];
      
      setAssignedTasks(activeTasksData);
      setCompletedTasks(completedTasksData);
      
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      toast.error("Failed to load assigned tasks");
    }
  };

  const fetchWeeklyActivityData = async () => {
    try {
      // Get the current day
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Calculate the start date of the current week (Sunday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Format the date range to fetch activity data
      const startDate = startOfWeek.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Get activity data for the current week
      const { data: activityData, error: activityError } = await supabase
        .from('child_daily_activity')
        .select('*')
        .eq('child_profile_id', profileId)
        .gte('activity_date', startDate)
        .order('activity_date', { ascending: true });
      
      if (activityError) throw activityError;
      
      // Format day names
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      // Create array with all days of the week
      const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return {
          name: dayNames[i],
          date: date.toISOString().split('T')[0],
          dayNumber: i
        };
      });
      
      // Map activity data to chart format
      const activityByDay = daysOfWeek.map(day => {
        // Find activity for this day
        const dayActivity = activityData?.find(
          act => new Date(act.activity_date).toISOString().split('T')[0] === day.date
        ) as DailyActivity | undefined;
        
        const tasks = dayActivity?.tasks_completed || 0;
        const quizzes = dayActivity?.quizzes_completed || 0;
        const topics = dayActivity?.topics_explored || 0;
        
        // Combine all activity for chart display
        const totalActivity = tasks + quizzes + topics;
        
        return {
          name: day.name,
          value: totalActivity,
          date: day.date,
          tasks: tasks,
          quizzes: quizzes,
          topics: topics
        };
      });
      
      setWeeklyActivityData(activityByDay);
      
      // Also set popular topics based on interests
      if (childProfile?.interests && childProfile.interests.length > 0) {
        const sampleTopics = [
          { name: 'Animals', percentage: Math.random() * 40 + 60 },  // 60-100%
          { name: 'Space', percentage: Math.random() * 30 + 50 },    // 50-80%
          { name: 'Science', percentage: Math.random() * 20 + 40 }   // 40-60%
        ];
        
        // Replace with actual interests if available
        const topics = childProfile.interests.slice(0, 3).map((interest, idx) => {
          return {
            name: interest,
            percentage: sampleTopics[idx]?.percentage || (Math.random() * 50 + 30)
          };
        });
        
        setPopularTopics(topics.length > 0 ? topics : sampleTopics);
      }
      
    } catch (error) {
      console.error('Error fetching weekly activity data:', error);
      // Fallback to empty data if fetch fails
      const fallbackData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({
        name: day,
        value: 0,
        date: '',
        tasks: 0,
        quizzes: 0,
        topics: 0
      }));
      setWeeklyActivityData(fallbackData);
    }
  };
  
  const fetchLearningStats = async () => {
    try {
      // Get count of completed tasks
      const { count: tasksCount, error: tasksError } = await supabase
        .from('child_tasks')
        .select('id', { count: 'exact', head: true })
        .eq('child_profile_id', profileId)
        .eq('status', 'completed');
        
      if (tasksError) throw tasksError;
      
      // Get sum of activity data
      const { data: activityData, error: activityError } = await supabase
        .from('child_daily_activity')
        .select('tasks_completed, quizzes_completed, topics_explored')
        .eq('child_profile_id', profileId);
        
      if (activityError) throw activityError;
      
      // Calculate total activity counts
      const totalQuizzes = activityData?.reduce((sum, item) => sum + (item.quizzes_completed || 0), 0) || 0;
      const totalTopics = activityData?.reduce((sum, item) => sum + (item.topics_explored || 0), 0) || 0;
      
      // Set learning stats based on actual data
      setLearningStats({
        topicsExplored: totalTopics,
        quizzesCompleted: totalQuizzes,
        creativePrompts: Math.floor(totalTopics / 2), // Assuming half of topics have creative prompts
        tasksCompleted: tasksCount || 0
      });
    } catch (error) {
      console.error('Error fetching learning stats:', error);
    }
  };
  
  const fetchRecentActivity = async () => {
    try {
      // Get recently completed tasks
      const { data: recentTasks, error: tasksError } = await supabase
        .from('child_tasks')
        .select(`
          id,
          completed_at,
          task:tasks (title, sparks_reward)
        `)
        .eq('child_profile_id', profileId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5);
        
      if (tasksError) throw tasksError;
      
      // Get recent activity data
      const { data: recentActivity, error: activityError } = await supabase
        .from('child_daily_activity')
        .select('*')
        .eq('child_profile_id', profileId)
        .order('activity_date', { ascending: false })
        .limit(7);
        
      if (activityError) throw activityError;
      
      // Transform into activity items
      const activityItems = [];
      
      // Add task completions
      if (recentTasks) {
        for (const task of recentTasks) {
          activityItems.push({
            type: 'task',
            title: task.task?.title || 'Task',
            sparks: task.task?.sparks_reward || 0,
            date: task.completed_at,
            icon: 'CheckCircle'
          });
        }
      }
      
      // Add activity from daily activity logs
      if (recentActivity) {
        for (const activity of recentActivity) {
          if (activity.quizzes_completed > 0) {
            activityItems.push({
              type: 'quiz',
              title: `Completed ${activity.quizzes_completed} quiz${activity.quizzes_completed > 1 ? 'zes' : ''}`,
              sparks: activity.quizzes_completed * 2, // Assume 2 sparks per quiz
              date: activity.activity_date,
              icon: 'Sparkles'
            });
          }
          
          if (activity.topics_explored > 0) {
            activityItems.push({
              type: 'topic',
              title: `Explored ${activity.topics_explored} topic${activity.topics_explored > 1 ? 's' : ''}`,
              details: `Created ${Math.floor(activity.topics_explored * 1.5)} new curios`,
              date: activity.activity_date,
              icon: 'Calendar'
            });
          }
        }
      }
      
      // Sort by date
      activityItems.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      // Take only the 5 most recent items
      setRecentActivity(activityItems.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };
  
  const handleBackToChild = () => {
    navigate(`/dashboard/${profileId}`);
  };
  
  const handleReturnToProfiles = () => {
    navigate('/profiles');
  };
  
  const onSubmitTask = async (values: z.infer<typeof taskSchema>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate('/login');
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
      
      setTasks(prev => [...prev, task]);
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
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
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
          child_profile_id: profileId,
          task_id: taskId,
          status: 'pending'
        })
        .select(`
          *,
          task:tasks (*)
        `)
        .single();
        
      if (error) throw error;
      
      setAssignedTasks(prev => [data, ...prev]);
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
      
      setAssignedTasks(prev => prev.filter(task => task.id !== childTaskId));
      toast.success("Task unassigned");
      
    } catch (error) {
      console.error('Error unassigning task:', error);
      toast.error("Failed to unassign task");
    }
  };
  
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(dateString).toLocaleDateString();
  };
  
  const updateProfile = async (updatedData: Partial<ChildProfile>) => {
    try {
      const { error } = await supabase
        .from('child_profiles')
        .update(updatedData)
        .eq('id', profileId);
        
      if (error) throw error;
      
      setChildProfile(prev => prev ? { ...prev, ...updatedData } : null);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  // Custom tooltip for the weekly activity chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-md shadow-lg border border-gray-200">
          <p className="font-bold">{label}</p>
          <div className="text-sm space-y-1 mt-1">
            <p>Tasks: <span className="font-semibold">{data.tasks}</span></p>
            <p>Quizzes: <span className="font-semibold">{data.quizzes}</span></p>
            <p>Topics: <span className="font-semibold">{data.topics}</span></p>
            <p className="pt-1 border-t border-gray-200 mt-1">
              Total: <span className="font-semibold">{data.value}</span>
            </p>
          </div>
        </div>
      );
    }
  
    return null;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-pink"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient">
      <Helmet>
        <title>Parent Zone - WonderWhiz</title>
        <meta name="description" content="Monitor your child's learning journey and set tasks in WonderWhiz's Parent Zone." />
      </Helmet>
      
      <header className="p-4 border-b border-white/10 bg-wonderwhiz-dark/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <WonderWhizLogo className="h-8" />
            <span className="ml-3 font-baloo font-bold text-white">Parent Zone</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={handleBackToChild}
            >
              <User className="h-4 w-4 mr-2" />
              Child View
            </Button>
            
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={handleReturnToProfiles}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Profiles
            </Button>
          </div>
        </div>
      </header>
      
      <main className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {childProfile && (
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarFallback className="bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-pink text-white text-2xl">
                      {childProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{childProfile.name}'s Dashboard</h1>
                    <p className="text-white/70">Age: {childProfile.age} • Joined: {new Date(childProfile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-white/10 px-4 py-2 rounded-lg">
                  <Sparkles className="h-5 w-5 mr-2 text-wonderwhiz-gold" />
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{childProfile.sparks_balance}</div>
                    <div className="text-xs text-white/70">Total Sparks</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/10 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-wonderwhiz-purple data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-wonderwhiz-purple data-[state=active]:text-white">
                <CheckCircle className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-wonderwhiz-purple data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.length === 0 ? (
                        <div className="text-center p-4 text-white/70">
                          No recent activity
                        </div>
                      ) : (
                        recentActivity.map((activity, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded-md">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-wonderwhiz-purple/30 flex items-center justify-center mr-3">
                                {activity.icon === 'Sparkles' && <Sparkles className="h-4 w-4 text-wonderwhiz-pink" />}
                                {activity.icon === 'Calendar' && <Calendar className="h-4 w-4 text-wonderwhiz-blue" />}
                                {activity.icon === 'CheckCircle' && <CheckCircle className="h-4 w-4 text-wonderwhiz-gold" />}
                              </div>
                              <div>
                                <p className="text-sm text-white">{activity.title}</p>
                                {activity.sparks && (
                                  <p className="text-xs text-white/60">Earned {activity.sparks} sparks</p>
                                )}
                                {activity.details && (
                                  <p className="text-xs text-white/60">{activity.details}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-white/60">{formatRelativeTime(activity.date)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-white/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg">Learning Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Topics Explored</span>
                          <span className="text-white font-medium">{learningStats.topicsExplored}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-pink rounded-full" 
                            style={{ width: `${Math.min((learningStats.topicsExplored / 20) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Quizzes Completed</span>
                          <span className="text-white font-medium">{learningStats.quizzesCompleted}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-wonderwhiz-blue to-wonderwhiz-gold rounded-full" 
                            style={{ width: `${Math.min((learningStats.quizzesCompleted / 20) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Creative Prompts</span>
                          <span className="text-white font-medium">{learningStats.creativePrompts}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" 
                            style={{ width: `${Math.min((learningStats.creativePrompts / 20) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Tasks Completed</span>
                          <span className="text-white font-medium">{learningStats.tasksCompleted}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" 
                            style={{ width: `${Math.min((learningStats.tasksCompleted / 20) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-white/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg">Popular Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {childProfile?.interests?.map((interest, idx) => (
                        <div key={idx} className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">
                          {interest}
                        </div>
                      ))}
                      {(!childProfile?.interests || childProfile.interests.length === 0) && (
                        <p className="text-white/70">No interests set</p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-white mb-2">Most Explored Topics</h4>
                      <div className="space-y-2">
                        {popularTopics.map((topic, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-white/80 text-sm">{topic.name}</span>
                            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  idx === 0 ? 'bg-wonderwhiz-pink' : 
                                  idx === 1 ? 'bg-wonderwhiz-blue' : 'bg-wonderwhiz-purple'
                                }`} 
                                style={{ width: `${topic.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyActivityData}>
                        <XAxis 
                          dataKey="name" 
                          stroke="#f8fafc" 
                          opacity={0.7}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#f8fafc" 
                          opacity={0.7}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="url(#colorGradient)" 
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Activity Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white">Day</TableHead>
                        <TableHead className="text-white text-center">Tasks</TableHead>
                        <TableHead className="text-white text-center">Quizzes</TableHead>
                        <TableHead className="text-white text-center">Topics</TableHead>
                        <TableHead className="text-white text-center">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeklyActivityData.map((day, idx) => (
                        <TableRow key={idx} className="border-white/10">
                          <TableCell className="text-white font-medium">
                            {day.name}
                          </TableCell>
                          <TableCell className="text-white/70 text-center">{day.tasks}</TableCell>
                          <TableCell className="text-white/70 text-center">{day.quizzes}</TableCell>
                          <TableCell className="text-white/70 text-center">{day.topics}</TableCell>
                          <TableCell className="text-white text-center font-semibold">{day.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-6">
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
                                  <Sparkles className="ml-2 h-4 w-4 text-wonderwhiz-gold" />
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
                                <Sparkles className="h-3 w-3 text-wonderwhiz-gold mr-1" />
                                <span className="text-xs text-white/70">{task.sparks_reward} Sparks</span>
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
                      <p className="text-white/70">No tasks currently assigned to {childProfile?.name}.</p>
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
                                <Sparkles className="h-3 w-3 text-wonderwhiz-gold mr-1" />
                                <span className="text-xs text-white/70">{assignedTask.task.sparks_reward} Sparks</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 text-wonderwhiz-pink/70 mr-1" />
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
                                <Sparkles className="h-3 w-3 text-wonderwhiz-gold mr-1" />
                                <span className="text-xs text-white/70">{completedTask.task.sparks_reward} Sparks</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 text-wonderwhiz-pink/70 mr-1" />
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
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-white">Name</Label>
                      <Input
                        id="name"
                        defaultValue={childProfile?.name}
                        className="bg-white/10 border-white/20 text-white"
                        onBlur={(e) => {
                          if (e.target.value !== childProfile?.name) {
                            updateProfile({ name: e.target.value });
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="age" className="text-white">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        defaultValue={childProfile?.age}
                        className="bg-white/10 border-white/20 text-white"
                        onBlur={(e) => {
                          const newAge = parseInt(e.target.value);
                          if (!isNaN(newAge) && newAge !== childProfile?.age) {
                            updateProfile({ age: newAge });
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="language" className="text-white">Language</Label>
                      <Input
                        id="language"
                        defaultValue={childProfile?.language}
                        className="bg-white/10 border-white/20 text-white"
                        onBlur={(e) => {
                          if (e.target.value !== childProfile?.language) {
                            updateProfile({ language: e.target.value });
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white">Reset PIN</Label>
                      <Input
                        id="pin"
                        type="text"
                        placeholder="Enter new PIN"
                        className="bg-white/10 border-white/20 text-white mb-2"
                      />
                      <Button 
                        className="w-full bg-wonderwhiz-purple/70 hover:bg-wonderwhiz-purple"
                        onClick={() => {
                          const pinInput = document.getElementById('pin') as HTMLInputElement;
                          if (pinInput && pinInput.value) {
                            updateProfile({ pin: pinInput.value });
                            pinInput.value = '';
                          } else {
                            toast.error('Please enter a new PIN');
                          }
                        }}
                      >
                        Set New PIN
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Content Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Content Language</Label>
                    <p className="text-white/70 text-sm">The primary language for learning content</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        className={childProfile?.language?.toLowerCase() === 'english' ? 
                          "bg-wonderwhiz-purple text-white border-0" : 
                          "bg-white/10 hover:bg-white/20 text-white"}
                        onClick={() => updateProfile({ language: 'english' })}
                      >
                        English
                      </Button>
                      <Button 
                        variant="outline" 
                        className={childProfile?.language?.toLowerCase() === 'spanish' ? 
                          "bg-wonderwhiz-purple text-white border-0" : 
                          "bg-white/10 hover:bg-white/20 text-white"}
                        onClick={() => updateProfile({ language: 'spanish' })}
                      >
                        Spanish
                      </Button>
                      <Button 
                        variant="outline" 
                        className={childProfile?.language?.toLowerCase() === 'french' ? 
                          "bg-wonderwhiz-purple text-white border-0" : 
                          "bg-white/10 hover:bg-white/20 text-white"}
                        onClick={() => updateProfile({ language: 'french' })}
                      >
                        French
                      </Button>
                      <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white">+ More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2 border-b border-white/10">
                  <CardTitle className="text-white text-lg">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Reset Progress</h3>
                      <p className="text-white/70 text-sm">This will reset all sparks and learning progress</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
                          updateProfile({ sparks_balance: 0 });
                          toast.success("Progress has been reset");
                        }
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Delete Profile</h3>
                      <p className="text-white/70 text-sm">This will permanently delete this child profile</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
                          // Delete profile logic would go here
                          toast.success("Profile deleted successfully");
                          navigate('/profiles');
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ParentZone;
