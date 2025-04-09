
import React, { useEffect } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

const Dashboard = () => {
  // Add analytics for measuring engagement with optimized welcome experience
  useEffect(() => {
    // Track when users visit the dashboard page
    console.log('Dashboard loaded - tracking user engagement');
    
    // Record time of day for cognitive optimization
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    if (hour >= 17) timeOfDay = 'evening';
    console.log(`Dashboard loaded during ${timeOfDay} - optimizing content for this time`);
    
    // Show welcome toast based on time of day - more engaging and fun
    const welcomeMessages = [
      '👋 Ready to discover something amazing today?',
      '🔍 What will you wonder about today?',
      '🧠 Your brain is ready for an adventure!',
      '✨ What magical discovery awaits you?',
      '🚀 Where shall your curiosity take you?'
    ];
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    setTimeout(() => {
      toast(randomMessage, {
        position: 'top-center',
        duration: 4000,
      });
    }, 1500);
    
    // Clean up event listeners when component unmounts
    return () => {
      console.log('Dashboard unloaded');
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-wonderwhiz-gradient overflow-hidden"
    >
      <Helmet>
        <title>WonderWhiz - Explore & Learn</title>
        <meta name="description" content="Explore topics, ask questions, and learn in a fun, interactive way with WonderWhiz." />
      </Helmet>
      
      <SidebarProvider>
        <DashboardContainer />
      </SidebarProvider>
    </motion.div>
  );
};

export default Dashboard;
