
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import MainHeader from '@/components/layout/MainHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import EnhancedSearchInput from '@/components/dashboard/EnhancedSearchInput';
import IntelligentSuggestions from '@/components/dashboard/IntelligentSuggestions';
import TasksSection from '@/components/dashboard/TasksSection';
import AnimatedBackground from '@/components/ui/animated-background';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Task } from '@/types/dashboard';
import { useGroqGeneration } from '@/hooks/useGroqGeneration';

const DashboardContainerContent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { generateQuickAnswer } = useGroqGeneration();
  
  // Sample children profile data
  const profileData = {
    name: "Explorer",
    streakDays: 20,
    age: 10,
    id: "d49eb66b-5404-4743-a137-d9f121d79151",
    interests: ['space', 'dinosaurs', 'science']
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data: childTasks, error } = await supabase
          .from('child_tasks')
          .select(`
            id,
            status,
            tasks:task_id (
              id,
              title,
              description,
              sparks_reward
            )
          `)
          .eq('child_profile_id', profileData.id)
          .eq('status', 'pending');

        if (error) throw error;

        // Transform the data to match our Task interface
        const formattedTasks: Task[] = childTasks.map(task => ({
          id: task.id,
          title: task.tasks.title,
          completed: false,
          type: 'explore' as const,
          duration: '15 min',
          reward: task.tasks.sparks_reward
        }));

        setTasks(formattedTasks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, [profileData.id]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      toast.success("Searching for your curiosities!");
      
      try {
        // Generate a quick answer to show while navigating
        generateQuickAnswer(query, profileData.age)
          .catch(error => console.error('Error generating quick answer:', error));
        
        // Create a new curio in the database
        const { data: newCurio, error } = await supabase
          .from('curios')
          .insert({
            child_id: profileData.id,
            title: query,
            query: query
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        if (newCurio && newCurio.id) {
          // Navigate to the new curio page
          setTimeout(() => {
            navigate(`/curio/${profileData.id}/${newCurio.id}`);
          }, 500);
        } else {
          // Fallback to search page if curio creation fails
          navigate(`/curio/${profileData.id}/search?q=${encodeURIComponent(query)}`);
        }
      } catch (error) {
        console.error('Error creating curio:', error);
        // Fallback to search page
        navigate(`/curio/${profileData.id}/search?q=${encodeURIComponent(query)}`);
      }
    }
  };
  
  const handleTaskClick = (task: any) => {
    toast.info(`Starting quest: ${task.title}`);
    setTimeout(() => {
      if (task.type === 'explore') {
        navigate(`/curio/${profileData.id}/explore?topic=${encodeURIComponent(task.title)}`);
      } else {
        navigate(`/tasks/${profileData.id}/${task.id}`);
      }
    }, 300);
  };
  
  const handleCurioSelect = async (suggestion: string) => {
    toast.success(`Exploring: ${suggestion}`);
    
    try {
      // Create a new curio in the database for the suggestion
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: profileData.id,
          title: suggestion,
          query: suggestion
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      if (newCurio && newCurio.id) {
        // Navigate to the new curio page
        setTimeout(() => {
          navigate(`/curio/${profileData.id}/${newCurio.id}`);
        }, 300);
      } else {
        // Fallback to new curio page without ID
        navigate(`/curio/${profileData.id}/new?topic=${encodeURIComponent(suggestion)}`);
      }
    } catch (error) {
      console.error('Error creating curio for suggestion:', error);
      // Fallback to new curio page
      navigate(`/curio/${profileData.id}/new?topic=${encodeURIComponent(suggestion)}`);
    }
  };
  
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      toast.success("Image received! Let's explore what's in it.");
      
      try {
        // Create a new curio for image exploration
        const { data: newCurio, error } = await supabase
          .from('curios')
          .insert({
            child_id: profileData.id,
            title: "Image Exploration",
            query: "Image Analysis"
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        if (newCurio && newCurio.id) {
          setTimeout(() => {
            navigate(`/curio/${profileData.id}/${newCurio.id}`);
          }, 500);
        } else {
          navigate(`/curio/${profileData.id}/image-search`);
        }
      } catch (error) {
        console.error('Error creating curio for image:', error);
        navigate(`/curio/${profileData.id}/image-search`);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleVoiceInput = async (transcript: string) => {
    if (transcript.trim()) {
      toast.success(`I heard: "${transcript}"`);
      await handleSearch(transcript);
    } else {
      toast.error("I couldn't understand that. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full flex-col"
    >
      <MainHeader childId={profileData.id} profileName={profileData.name} />
      
      <div className="flex-1 overflow-auto bg-gradient-to-br from-wonderwhiz-deep-purple/50 to-wonderwhiz-light-purple/30">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-wonderwhiz-deep-purple/30 border-b border-white/10">
          <DashboardHeader 
            childName={profileData.name} 
            streakDays={profileData.streakDays} 
            childAge={profileData.age} 
            profileId={profileData.id} 
          />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Search Section */}
          <section className="relative z-10">
            <EnhancedSearchInput
              onSearch={handleSearch}
              onImageCapture={handleImageUpload}
              onVoiceCapture={handleVoiceInput}
              placeholder="What would you like to discover today?"
              childAge={profileData.age}
            />
          </section>

          {/* Tasks Section */}
          <section>
            <TasksSection
              tasks={tasks}
              onTaskClick={handleTaskClick}
              childId={profileData.id}
              isLoading={loading}
            />
          </section>

          {/* Intelligent Suggestions */}
          <section>
            <IntelligentSuggestions
              childId={profileData.id}
              childProfile={profileData}
              onSuggestionClick={handleCurioSelect}
              pastCurios={[]}
            />
          </section>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardContainer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple to-wonderwhiz-purple overflow-hidden">
      <Helmet>
        <title>WonderWhiz - Your Learning Adventure</title>
        <meta name="description" content="Discover amazing facts and start your learning adventure!" />
      </Helmet>
      
      {/* Decorative background */}
      <AnimatedBackground />
      
      <div className="relative z-10">
        <SidebarProvider>
          <DashboardContainerContent />
        </SidebarProvider>
      </div>
    </div>
  );
};

export default DashboardContainer;
