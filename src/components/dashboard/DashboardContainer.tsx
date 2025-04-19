
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import EnhancedSearchInput from '@/components/dashboard/EnhancedSearchInput';
import IntelligentSuggestions from '@/components/dashboard/IntelligentSuggestions';
import TasksSection from '@/components/dashboard/TasksSection';
import AnimatedBackground from '@/components/ui/animated-background';

const DashboardContainerContent = () => {
  // Mock data - replace with real data from your backend
  const mockTasks = [
    {
      id: '1',
      title: 'Explore the mysteries of volcanoes',
      completed: false,
      type: 'explore',
      duration: '15 min',
      reward: 50
    },
    {
      id: '2',
      title: 'Learn about dinosaur discoveries',
      completed: false,
      type: 'read',
      duration: '10 min',
      reward: 30
    }
  ];

  const handleLoadMore = () => console.log('Load more triggered');
  const handleSearch = (query: string) => console.log('Search:', query);
  const handleImageUpload = (file: File) => console.log('Image uploaded:', file);
  const handleVoiceInput = (transcript: string) => console.log('Voice input:', transcript);
  const handleTaskClick = (task: any) => console.log('Task clicked:', task);
  const handleCurioSelect = (suggestion: string) => console.log('Curio selected:', suggestion);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full"
    >
      <div className="flex-1 overflow-auto bg-gradient-to-br from-wonderwhiz-deep-purple/50 to-wonderwhiz-light-purple/30">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-wonderwhiz-deep-purple/30 border-b border-white/10">
          <DashboardHeader 
            childName="Explorer" 
            streakDays={20} 
            childAge={10} 
            profileId="d49eb66b-5404-4743-a137-d9f121d79151" 
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
              childAge={10}
            />
          </section>

          {/* Tasks Section */}
          <section>
            <TasksSection
              tasks={mockTasks}
              onTaskClick={handleTaskClick}
              childId="d49eb66b-5404-4743-a137-d9f121d79151"
              pendingTasksCount={2}
            />
          </section>

          {/* Intelligent Suggestions */}
          <section>
            <IntelligentSuggestions
              childId="d49eb66b-5404-4743-a137-d9f121d79151"
              childProfile={{ age: 10, interests: ['space', 'dinosaurs', 'science'] }}
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
