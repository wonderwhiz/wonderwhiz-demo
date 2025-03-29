
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Sparkles, Calendar, CheckCircle } from 'lucide-react';

interface ActivityData {
  name: string;
  value: number;
  date: string;
  tasks: number;
  quizzes: number;
  topics: number;
}

interface RecentActivity {
  type: string;
  title: string;
  details?: string;
  sparks?: number;
  date: string;
  icon: string;
}

interface PopularTopic {
  name: string;
  percentage: number;
}

interface LearningStats {
  topicsExplored: number;
  quizzesCompleted: number;
  creativePrompts: number;
  tasksCompleted: number;
}

interface OverviewDashboardProps {
  childId: string;
  childName: string;
  weeklyActivityData: ActivityData[];
  recentActivity: RecentActivity[];
  popularTopics: PopularTopic[];
  learningStats: LearningStats;
  childInterests: string[];
}

const OverviewDashboard = ({
  weeklyActivityData,
  recentActivity,
  popularTopics,
  learningStats,
  childInterests
}: OverviewDashboardProps) => {
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

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
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
            <CardTitle className="text-white text-lg flex items-center">
              Popular Interests
              <span className="ml-2 px-2 py-0.5 bg-wonderwhiz-purple/60 text-white text-xs rounded-full">Insightful</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {childInterests?.map((interest, idx) => (
                <div key={idx} className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">
                  {interest}
                </div>
              ))}
              {(!childInterests || childInterests.length === 0) && (
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
    </div>
  );
};

export default OverviewDashboard;
