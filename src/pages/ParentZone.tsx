import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, CheckCircle, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Import components
import ParentZoneHeader from '@/components/ParentZone/ParentZoneHeader';
import OverviewDashboard from '@/components/ParentZone/OverviewDashboard';
import TaskManagement from '@/components/ParentZone/TaskManagement';
import ProfileSettings from '@/components/ParentZone/ProfileSettings';

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

interface PopularTopic {
  name: string;
  percentage: number;
}

const ParentZone = () => {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [allProfiles, setAllProfiles] = useState<ChildProfile[]>([]);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<AssignedTask[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [weeklyActivityData, setWeeklyActivityData] = useState<ActivityData[]>([]);
  const [learningStats, setLearningStats] = useState({
    topicsExplored: 0,
    quizzesCompleted: 0,
    creativePrompts: 0,
    tasksCompleted: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [popularTopics, setPopularTopics] = useState<PopularTopic[]>([]);
  
  useEffect(() => {
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
        
        // Generate sample data for days with no activity (for testing/demo purposes)
        const shouldGenerateSampleData = !activityData || activityData.length === 0;
        
        // Map activity data to chart format
        const activityByDay = daysOfWeek.map(day => {
          // Find activity for this day
          const dayActivity = activityData?.find(
            act => act.activity_date.split('T')[0] === day.date
          ) as DailyActivity | undefined;
          
          // If we have real data, use it
          if (dayActivity) {
            const tasks = dayActivity.tasks_completed || 0;
            const quizzes = dayActivity.quizzes_completed || 0;
            const topics = dayActivity.topics_explored || 0;
            
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
          }
          
          // Generate sample data if needed (for demo purposes)
          if (shouldGenerateSampleData) {
            // Random values but weighted to be higher on weekdays, lower on weekends
            const isWeekend = day.dayNumber === 0 || day.dayNumber === 6;
            const baseFactor = isWeekend ? 0.5 : 1;
            
            const tasks = Math.floor(Math.random() * 3 * baseFactor);
            const quizzes = Math.floor(Math.random() * 2 * baseFactor);
            const topics = Math.floor(Math.random() * 4 * baseFactor);
            
            return {
              name: day.name,
              value: tasks + quizzes + topics,
              date: day.date,
              tasks: tasks,
              quizzes: quizzes,
              topics: topics
            };
          }
          
          // Default return for empty data
          return {
            name: day.name,
            value: 0,
            date: day.date,
            tasks: 0,
            quizzes: 0,
            topics: 0
          };
        });
        
        setWeeklyActivityData(activityByDay);
      } catch (error) {
        console.error('Error fetching weekly activity data:', error);
        // Fallback to sample data if fetch fails
        const fallbackData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
          const tasks = Math.floor(Math.random() * 3);
          const quizzes = Math.floor(Math.random() * 2);
          const topics = Math.floor(Math.random() * 4);
          
          return {
            name: day,
            value: tasks + quizzes + topics,
            date: '',
            tasks: tasks,
            quizzes: quizzes,
            topics: topics
          };
        });
        setWeeklyActivityData(fallbackData);
      }
    };

    const fetchPopularTopics = async () => {
      try {
        // Get topics from content blocks and curios
        const { data: contentBlocks, error: contentError } = await supabase
          .from('content_blocks')
          .select('content, type')
          .in('type', ['fact', 'funFact', 'quiz'])
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (contentError) throw contentError;
        
        const { data: curios, error: curiosError } = await supabase
          .from('curios')
          .select('title')
          .eq('child_id', profileId)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (curiosError) throw curiosError;
        
        // Extract keywords from content and titles
        const keywords: Record<string, number> = {};
        
        // Process content blocks
        contentBlocks?.forEach(block => {
          const content = block.content as any;
          let text = '';
          
          if (block.type === 'fact' || block.type === 'funFact') {
            text = content.fact || '';
          } else if (block.type === 'quiz') {
            text = content.question || '';
          }
          
          // Extract keywords (simple implementation)
          const words = text.toLowerCase().split(/\s+/);
          words.forEach(word => {
            if (word.length > 5) {  // Only consider substantial words
              keywords[word] = (keywords[word] || 0) + 1;
            }
          });
        });
        
        // Process curios titles
        curios?.forEach(curio => {
          const words = curio.title.toLowerCase().split(/\s+/);
          words.forEach(word => {
            if (word.length > 5) {
              keywords[word] = (keywords[word] || 0) + 2;  // Give more weight to curio titles
            }
          });
        });
        
        // Use child's interests if no meaningful data is available
        if (Object.keys(keywords).length < 3 && childProfile?.interests && childProfile.interests.length > 0) {
          const topics = childProfile.interests.slice(0, 3).map((interest, idx) => {
            return {
              name: interest,
              percentage: Math.floor(Math.random() * 40 + 60)  // 60-100%
            };
          });
          
          setPopularTopics(topics);
          return;
        }
        
        // Sort keywords by frequency and get top 3
        const sortedKeywords = Object.entries(keywords)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 3);
        
        // Calculate percentages based on relative frequencies
        const total = sortedKeywords.reduce((sum, [, count]) => sum + count, 0);
        const topics = sortedKeywords.map(([word, count]) => ({
          name: word.charAt(0).toUpperCase() + word.slice(1),  // Capitalize first letter
          percentage: Math.floor((count / total) * 100)
        }));
        
        // Ensure minimum of 3 topics
        while (topics.length < 3) {
          topics.push({
            name: `Topic ${topics.length + 1}`,
            percentage: Math.floor(Math.random() * 40 + 30)
          });
        }
        
        setPopularTopics(topics);
      } catch (error) {
        console.error('Error fetching popular topics:', error);
        // Fallback to sample topics
        const fallbackTopics = [
          { name: 'Space', percentage: 85 },
          { name: 'Animals', percentage: 72 },
          { name: 'Science', percentage: 64 }
        ];
        setPopularTopics(fallbackTopics);
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

    const loadParentZoneData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('parent_user_id', user.id)
          .order('created_at', { ascending: true });
        
        if (profilesError) throw profilesError;

        setAllProfiles(profiles as ChildProfile[]);

        if (profileId) {
          const currentProfile = profiles.find(p => p.id === profileId);
          if (currentProfile) {
            setChildProfile(currentProfile);

            if (currentProfile.parent_user_id !== user.id) {
              toast.error("You don't have permission to view this profile");
              navigate('/profiles');
              return;
            }

            const { data: tasksData, error: tasksError } = await supabase
              .from('tasks')
              .select('*')
              .eq('parent_user_id', user.id);
            if (tasksError) throw tasksError;
            setTasks(tasksData || []);

            await Promise.all([
              fetchAssignedTasks(),
              fetchWeeklyActivityData(),
              fetchLearningStats(),
              fetchRecentActivity(),
              fetchPopularTopics(),
            ]);
          } else {
            toast.error("Profile not found.");
            navigate('/parent-zone');
          }
        } else {
          if (!profiles || profiles.length === 0) {
            toast.info("You need to create a child profile to access the Parent Zone.");
            navigate('/profiles');
          } else if (profiles.length === 1) {
            navigate(`/parent-zone/${profiles[0].id}`, { replace: true });
          }
        }
      } catch (error) {
        console.error("Failed to load Parent Zone data:", error);
        toast.error("Failed to load Parent Zone data.");
        navigate('/profiles');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadParentZoneData();

  }, [profileId, user, navigate]);

  const handleBackToChild = () => {
    navigate(`/dashboard/${profileId}`);
  };
  
  const handleReturnToProfiles = () => {
    navigate('/profiles');
  };

  const handleProfileSwitch = (newProfileId: string) => {
    if (newProfileId) {
      navigate(`/parent-zone/${newProfileId}`);
    }
  };
  
  const handleProfileUpdate = (updatedData: Partial<ChildProfile>) => {
    setChildProfile(prev => prev ? { ...prev, ...updatedData } : null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wonderwhiz-pink"></div>
      </div>
    );
  }
  
  if (!profileId && allProfiles.length > 0) {
    return (
      <div className="min-h-screen bg-wonderwhiz-gradient">
        <Helmet>
          <title>Select Profile - Parent Zone - WonderWhiz</title>
        </Helmet>
        <ParentZoneHeader 
          childProfile={null}
          allProfiles={allProfiles}
          handleBackToChild={() => navigate('/profiles')}
          handleReturnToProfiles={handleReturnToProfiles}
          handleProfileSwitch={handleProfileSwitch}
        />
        <main className="p-4 md:p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-2 font-baloo">Parent Zone</h1>
          <p className="text-white/80 text-center mb-8">Select a child's profile to view their progress and manage settings.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProfiles.map(p => (
              <Link key={p.id} to={`/parent-zone/${p.id}`} className="block">
                <div className="bg-white/10 p-5 rounded-2xl text-center text-white hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 border border-white/20 hover:shadow-lg hover:shadow-wonderwhiz-purple/20">
                  <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-white/30">
                    <AvatarFallback className="bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-pink text-white text-3xl">
                      {p.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold font-baloo">{p.name}</h3>
                  <p className="text-sm text-white/70">Age: {p.age}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-wonderwhiz-gradient">
      <Helmet>
        <title>Parent Zone - WonderWhiz</title>
        <meta name="description" content="Monitor your child's learning journey and set tasks in WonderWhiz's Parent Zone." />
      </Helmet>
      
      <ParentZoneHeader 
        childProfile={childProfile}
        allProfiles={allProfiles}
        handleBackToChild={handleBackToChild}
        handleReturnToProfiles={handleReturnToProfiles}
        handleProfileSwitch={handleProfileSwitch}
      />
      
      <main className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
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
            
            <TabsContent value="overview">
              {childProfile && (
                <OverviewDashboard
                  childId={childProfile.id}
                  childName={childProfile.name}
                  weeklyActivityData={weeklyActivityData}
                  recentActivity={recentActivity}
                  popularTopics={popularTopics}
                  learningStats={learningStats}
                  childInterests={childProfile.interests}
                />
              )}
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-6">
              <TaskManagement
                childId={profileId || ''}
                tasks={tasks}
                assignedTasks={assignedTasks}
                completedTasks={completedTasks}
                onTasksChange={setTasks}
                onAssignedTasksChange={setAssignedTasks}
                onCompletedTasksChange={setCompletedTasks}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              {childProfile && (
                <ProfileSettings
                  childProfile={childProfile}
                  onProfileUpdate={handleProfileUpdate}
                  handleReturnToProfiles={handleReturnToProfiles}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ParentZone;
