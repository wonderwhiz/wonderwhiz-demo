import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Star,
  Target,
  Calendar,
  Users,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ParentDashboardProps {
  parentId: string;
}

interface ChildAnalytics {
  id: string;
  name: string;
  age: number;
  sparksBalance: number;
  streakDays: number;
  weeklyProgress: number;
  strugglingAreas: string[];
  strengths: string[];
  concerns: string[];
  recentActivity: any[];
  learningGoals: any[];
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ parentId }) => {
  const [children, setChildren] = useState<ChildAnalytics[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    loadParentAnalytics();
  }, [parentId]);

  const loadParentAnalytics = async () => {
    try {
      setIsLoading(true);

      // Load all child profiles
      const { data: childProfiles } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('parent_user_id', parentId);

      if (!childProfiles) return;

      const childAnalytics: ChildAnalytics[] = [];

      for (const child of childProfiles) {
        // Load learning history for each child
        const { data: learningHistory } = await supabase
          .from('learning_history')
          .select('*')
          .eq('child_id', child.id)
          .order('interaction_date', { ascending: false })
          .limit(50);

        // Load recent curios
        const { data: recentCurios } = await supabase
          .from('curios')
          .select('*')
          .eq('child_id', child.id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Load daily activity
        const { data: dailyActivity } = await supabase
          .from('child_daily_activity')
          .select('*')
          .eq('child_profile_id', child.id)
          .order('activity_date', { ascending: false })
          .limit(7);

        // Analyze data
        const analytics: ChildAnalytics = {
          id: child.id,
          name: child.name,
          age: child.age || 10,
          sparksBalance: child.sparks_balance || 0,
          streakDays: child.streak_days || 0,
          weeklyProgress: calculateWeeklyProgress(dailyActivity),
          strugglingAreas: identifyStrugglingAreas(learningHistory),
          strengths: identifyStrengths(learningHistory),
          concerns: identifyConcerns(learningHistory, dailyActivity),
          recentActivity: recentCurios || [],
          learningGoals: generateLearningGoals(learningHistory)
        };

        childAnalytics.push(analytics);
      }

      setChildren(childAnalytics);
      if (childAnalytics.length > 0) {
        setSelectedChild(childAnalytics[0].id);
        generateWeeklyChart(childAnalytics[0].id);
      }
    } catch (error) {
      console.error('Error loading parent analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWeeklyProgress = (dailyActivity: any[]): number => {
    if (!dailyActivity?.length) return 0;
    const totalTopics = dailyActivity.reduce((sum, day) => sum + (day.topics_explored || 0), 0);
    return Math.min(totalTopics * 10, 100); // Scale to percentage
  };

  const identifyStrugglingAreas = (history: any[]): string[] => {
    const topicPerformance: Record<string, { total: number, low: number }> = {};
    
    history?.forEach(entry => {
      if (!topicPerformance[entry.topic]) {
        topicPerformance[entry.topic] = { total: 0, low: 0 };
      }
      topicPerformance[entry.topic].total++;
      if (entry.engagement_level <= 4) {
        topicPerformance[entry.topic].low++;
      }
    });

    return Object.entries(topicPerformance)
      .filter(([, data]) => data.total >= 3 && data.low / data.total > 0.6)
      .map(([topic]) => topic)
      .slice(0, 3);
  };

  const identifyStrengths = (history: any[]): string[] => {
    const topicPerformance: Record<string, { total: number, high: number }> = {};
    
    history?.forEach(entry => {
      if (!topicPerformance[entry.topic]) {
        topicPerformance[entry.topic] = { total: 0, high: 0 };
      }
      topicPerformance[entry.topic].total++;
      if (entry.engagement_level >= 8) {
        topicPerformance[entry.topic].high++;
      }
    });

    return Object.entries(topicPerformance)
      .filter(([, data]) => data.total >= 3 && data.high / data.total > 0.8)
      .map(([topic]) => topic)
      .slice(0, 3);
  };

  const identifyConcerns = (history: any[], activity: any[]): string[] => {
    const concerns: string[] = [];

    // Check for declining engagement
    const recentEngagement = history?.slice(0, 10).reduce((sum, h) => sum + (h.engagement_level || 0), 0) / 10;
    if (recentEngagement < 5) {
      concerns.push('Low engagement in recent sessions');
    }

    // Check for inactivity
    const lastActivity = activity?.[0]?.activity_date;
    if (lastActivity) {
      const daysSinceActivity = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceActivity > 3) {
        concerns.push('No activity for several days');
      }
    }

    // Check completion rates
    const incompleteSessions = history?.filter(h => h.engagement_level < 3).length || 0;
    if (incompleteSessions > history?.length * 0.3) {
      concerns.push('High incomplete session rate');
    }

    return concerns.slice(0, 3);
  };

  const generateLearningGoals = (history: any[]): any[] => {
    const goals = [];
    
    // Consistency goal
    goals.push({
      type: 'consistency',
      title: 'Daily Learning Streak',
      target: 7,
      current: Math.min(history?.length || 0, 7),
      description: 'Learn something new every day'
    });

    // Engagement goal
    const avgEngagement = history?.reduce((sum, h) => sum + (h.engagement_level || 0), 0) / (history?.length || 1);
    goals.push({
      type: 'engagement',
      title: 'Learning Enthusiasm',
      target: 8,
      current: avgEngagement,
      description: 'Maintain high engagement in learning sessions'
    });

    return goals;
  };

  const generateWeeklyChart = async (childId: string) => {
    const { data: weeklyActivity } = await supabase
      .from('child_daily_activity')
      .select('*')
      .eq('child_profile_id', childId)
      .order('activity_date', { ascending: false })
      .limit(7);

    const chartData = weeklyActivity?.reverse().map(day => ({
      day: new Date(day.activity_date).toLocaleDateString('en-US', { weekday: 'short' }),
      topics: day.topics_explored || 0,
      tasks: day.tasks_completed || 0,
      quizzes: day.quizzes_completed || 0
    })) || [];

    setWeeklyData(chartData);
  };

  const selectedChildData = children.find(c => c.id === selectedChild);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-deep-purple/90 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wonderwhiz-cyan"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-deep-purple/90 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Parent Dashboard</h1>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Child Selector */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {children.map(child => (
                <Button
                  key={child.id}
                  variant={selectedChild === child.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedChild(child.id);
                    generateWeeklyChart(child.id);
                  }}
                  className={selectedChild === child.id 
                    ? "bg-wonderwhiz-cyan text-white" 
                    : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  {child.name} ({child.age})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedChildData && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white/10 border border-white/20">
              <TabsTrigger value="overview" className="text-white/70 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-white/70 data-[state=active]:text-white">
                Progress
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-white/70 data-[state=active]:text-white">
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-wonderwhiz-cyan/20">
                  <CardContent className="p-4 text-center">
                    <Star className="h-8 w-8 text-wonderwhiz-vibrant-yellow mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{selectedChildData.sparksBalance}</div>
                    <div className="text-white/60 text-sm">Sparks Earned</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-orange-500/20">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{selectedChildData.streakDays}</div>
                    <div className="text-white/60 text-sm">Day Streak</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{selectedChildData.weeklyProgress}%</div>
                    <div className="text-white/60 text-sm">Weekly Progress</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-wonderwhiz-bright-pink/20">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 text-wonderwhiz-bright-pink mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{selectedChildData.recentActivity.length}</div>
                    <div className="text-white/60 text-sm">Topics This Week</div>
                  </CardContent>
                </Card>
              </div>

              {/* Concerns Alert */}
              {selectedChildData.concerns.length > 0 && (
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-red-300 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Areas of Concern
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedChildData.concerns.map((concern, index) => (
                        <div key={index} className="text-red-200 text-sm">
                          • {concern}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strengths and Areas to Work On */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-green-300 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedChildData.strengths.map((strength, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-300">
                          {strength}
                        </Badge>
                      ))}
                      {selectedChildData.strengths.length === 0 && (
                        <div className="text-white/60 text-sm">Keep learning to discover strengths!</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="text-orange-300 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Areas to Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedChildData.strugglingAreas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="bg-orange-500/20 text-orange-300">
                          {area}
                        </Badge>
                      ))}
                      {selectedChildData.strugglingAreas.length === 0 && (
                        <div className="text-white/60 text-sm">No specific areas need extra support</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {/* Weekly Activity Chart */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Learning Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="day" stroke="#ffffff60" />
                      <YAxis stroke="#ffffff60" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A0B2E', 
                          border: '1px solid #ffffff20',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                      <Bar dataKey="topics" fill="#00D4FF" name="Topics Explored" />
                      <Bar dataKey="tasks" fill="#FFD700" name="Tasks Completed" />
                      <Bar dataKey="quizzes" fill="#FF69B4" name="Quizzes Taken" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Learning Goals */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Learning Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedChildData.learningGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{goal.title}</span>
                        <span className="text-white/60">{Math.round((goal.current / goal.target) * 100)}%</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      <div className="text-white/60 text-xs">{goal.description}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              {/* Recent Activity Timeline */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Learning Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedChildData.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                        <BookOpen className="h-5 w-5 text-wonderwhiz-cyan" />
                        <div>
                          <div className="text-white font-medium">{activity.title}</div>
                          <div className="text-white/60 text-sm">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;