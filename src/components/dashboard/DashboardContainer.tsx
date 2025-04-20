
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import EnhancedSearchInput from '@/components/dashboard/EnhancedSearchInput';
import IntelligentSuggestions from '@/components/dashboard/IntelligentSuggestions';
import TasksSection from '@/components/dashboard/TasksSection';
import AnimatedBackground from '@/components/ui/animated-background';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DashboardContainerContent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - replace with real data from your backend
  const mockTasks = [
    {
      id: '1',
      title: 'Explore the mysteries of volcanoes',
      completed: false,
      type: 'explore' as const, // Using "as const" to ensure the type is correctly inferred
      duration: '15 min',
      reward: 50
    },
    {
      id: '2',
      title: 'Learn about dinosaur discoveries',
      completed: false,
      type: 'read' as const, // Using "as const" to ensure the type is correctly inferred
      duration: '10 min',
      reward: 30
    }
  ];
  
  // Sample children profile data
  const profileData = {
    name: "Explorer",
    streakDays: 20,
    age: 10,
    id: "d49eb66b-5404-4743-a137-d9f121d79151",
    interests: ['space', 'dinosaurs', 'science']
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      toast.success("Searching for your curiosities!");
      setTimeout(() => {
        navigate(`/curio/${profileData.id}/search?q=${encodeURIComponent(query)}`);
      }, 500);
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
  
  const handleCurioSelect = (suggestion: string) => {
    toast.success(`Exploring: ${suggestion}`);
    setTimeout(() => {
      navigate(`/curio/${profileData.id}/new?topic=${encodeURIComponent(suggestion)}`);
    }, 300);
  };
  
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      toast.success("Image received! Let's explore what's in it.");
      setTimeout(() => {
        navigate(`/curio/${profileData.id}/image-search`);
      }, 500);
    };
    reader.readAsDataURL(file);
  };
  
  const handleVoiceInput = (transcript: string) => {
    if (transcript.trim()) {
      toast.success(`I heard: "${transcript}"`);
      handleSearch(transcript);
    } else {
      toast.error("I couldn't understand that. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full"
    >
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
              tasks={mockTasks}
              onTaskClick={handleTaskClick}
              childId={profileData.id}
              pendingTasksCount={2}
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

const Dashboard = () => {
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

export default Dashboard;
