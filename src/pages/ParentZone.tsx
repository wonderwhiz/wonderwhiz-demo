
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
  CheckCircle, Clock
} from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';

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

const ParentZone = () => {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newTask, setNewTask] = useState({ title: '', sparks: 5, description: '' });
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // Sample activity data for the charts
  const activityData = [
    { name: 'Mon', value: 15 },
    { name: 'Tue', value: 25 },
    { name: 'Wed', value: 30 },
    { name: 'Thu', value: 10 },
    { name: 'Fri', value: 20 },
    { name: 'Sat', value: 35 },
    { name: 'Sun', value: 28 },
  ];
  
  useEffect(() => {
    const loadProfileAndTasks = async () => {
      if (!profileId) {
        navigate('/profiles');
        return;
      }
      
      try {
        // Check current user session first
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          navigate('/login');
          return;
        }
        
        // Load child profile
        const { data: profileData, error: profileError } = await supabase
          .from('child_profiles')
          .select('*')
          .eq('id', profileId)
          .single();
          
        if (profileError) throw profileError;
        
        // Verify this profile belongs to the current user
        if (profileData.parent_user_id !== session.session.user.id) {
          toast.error("You don't have permission to view this profile");
          navigate('/profiles');
          return;
        }
        
        setChildProfile(profileData);
        
        // Load tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('parent_user_id', session.session.user.id);
          
        if (tasksError) throw tasksError;
        setTasks(tasksData || []);
        
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
  
  const handleBackToChild = () => {
    navigate(`/dashboard/${profileId}`);
  };
  
  const handleReturnToProfiles = () => {
    navigate('/profiles');
  };
  
  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
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
          title: newTask.title,
          description: newTask.description || null,
          sparks_reward: newTask.sparks,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setTasks(prev => [...prev, task]);
      setNewTask({ title: '', sparks: 5, description: '' });
      setIsAddingTask(false);
      toast.success("Task added successfully");
      
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Failed to add task");
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
      const { error } = await supabase
        .from('child_tasks')
        .insert({
          child_profile_id: profileId,
          task_id: taskId,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast.success("Task assigned successfully");
      
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error("Failed to assign task");
    }
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
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-md">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-wonderwhiz-purple/30 flex items-center justify-center mr-3">
                            <Sparkles className="h-4 w-4 text-wonderwhiz-pink" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Completed quiz about penguins</p>
                            <p className="text-xs text-white/60">Earned 5 sparks</p>
                          </div>
                        </div>
                        <span className="text-xs text-white/60">Today</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-md">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-wonderwhiz-blue/30 flex items-center justify-center mr-3">
                            <Calendar className="h-4 w-4 text-wonderwhiz-blue" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Explored topic: Volcanoes</p>
                            <p className="text-xs text-white/60">Created 3 new curios</p>
                          </div>
                        </div>
                        <span className="text-xs text-white/60">Yesterday</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-md">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-wonderwhiz-gold/30 flex items-center justify-center mr-3">
                            <CheckCircle className="h-4 w-4 text-wonderwhiz-gold" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Completed task: Read a book</p>
                            <p className="text-xs text-white/60">Earned 10 sparks</p>
                          </div>
                        </div>
                        <span className="text-xs text-white/60">2 days ago</span>
                      </div>
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
                          <span className="text-white font-medium">12</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div className="h-full bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-pink rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Quizzes Completed</span>
                          <span className="text-white font-medium">8</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div className="h-full bg-gradient-to-r from-wonderwhiz-blue to-wonderwhiz-gold rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Creative Prompts</span>
                          <span className="text-white font-medium">5</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Tasks Completed</span>
                          <span className="text-white font-medium">3</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width: '15%' }}></div>
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
                      {childProfile?.interests.map((interest, idx) => (
                        <div key={idx} className="px-3 py-1 bg-white/10 text-white rounded-full text-sm">
                          {interest}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-white mb-2">Most Explored Topics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80 text-sm">Animals</span>
                          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-wonderwhiz-pink" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/80 text-sm">Space</span>
                          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-wonderwhiz-blue" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/80 text-sm">Science</span>
                          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-wonderwhiz-purple" style={{ width: '45%' }}></div>
                          </div>
                        </div>
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
                  <div className="h-64 flex items-end justify-around">
                    {activityData.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div 
                          className="w-12 bg-gradient-to-t from-wonderwhiz-purple to-wonderwhiz-pink rounded-t-md"
                          style={{ height: `${day.value * 2}px` }}
                        ></div>
                        <div className="text-white/70 text-xs mt-2">{day.name}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-6">
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white text-lg">Manage Tasks</CardTitle>
                    <Button 
                      onClick={() => setIsAddingTask(true)}
                      className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Task
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
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="task-title" className="text-white">Task Title</Label>
                          <Input
                            id="task-title"
                            placeholder="e.g., Read a book for 20 minutes"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="task-description" className="text-white">Description (Optional)</Label>
                          <Input
                            id="task-description"
                            placeholder="Add details about the task"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="task-sparks" className="text-white">Spark Reward</Label>
                          <div className="flex items-center">
                            <Input
                              id="task-sparks"
                              type="number"
                              min="1"
                              max="100"
                              value={newTask.sparks}
                              onChange={(e) => setNewTask({ ...newTask, sparks: parseInt(e.target.value) || 5 })}
                              className="bg-white/10 border-white/20 text-white w-24"
                            />
                            <Sparkles className="ml-2 h-4 w-4 text-wonderwhiz-gold" />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsAddingTask(false)}
                            className="bg-white/10 text-white hover:bg-white/20"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleAddTask}
                            className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90"
                          >
                            Create Task
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-white/70">No tasks created yet. Add your first task!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map(task => (
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
                              className="bg-wonderwhiz-purple/70 hover:bg-wonderwhiz-purple text-white text-xs"
                            >
                              Assign
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
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Assigned Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-white/70">No tasks currently assigned to {childProfile?.name}.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-white/70">No completed tasks yet.</p>
                  </div>
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
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="age" className="text-white">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        defaultValue={childProfile?.age}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="language" className="text-white">Language</Label>
                      <Input
                        id="language"
                        defaultValue={childProfile?.language}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white">Reset PIN</Label>
                      <Button className="w-full bg-wonderwhiz-purple/70 hover:bg-wonderwhiz-purple">
                        Reset PIN
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90">
                      Save Changes
                    </Button>
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
                    <div className="mt-2 flex space-x-2">
                      <Button variant="outline" className="bg-wonderwhiz-purple text-white border-0">English</Button>
                      <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white">Spanish</Button>
                      <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white">French</Button>
                      <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white">+ More</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-white">Content Difficulty</Label>
                    <p className="text-white/70 text-sm">Adjust the complexity level of questions and content</p>
                    <div className="mt-2 flex space-x-2">
                      <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white">Simple</Button>
                      <Button variant="outline" className="bg-wonderwhiz-purple text-white border-0">Age-Appropriate</Button>
                      <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white">Advanced</Button>
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
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      Reset
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Delete Profile</h3>
                      <p className="text-white/70 text-sm">This will permanently delete this child profile</p>
                    </div>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
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
