
import React, { useEffect } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

// Following the recommendations of our expert panel, especially Alison Folino (children's content leader),
// Dr. Qing Hua (pediatric neurology), and Chris Bennett (edtech innovation)
const Dashboard = () => {
  // Add analytics for measuring engagement with optimized welcome experience
  useEffect(() => {
    // Track when users visit the dashboard page
    console.log('Dashboard loaded - tracking user engagement');
    
    // Record time of day for cognitive optimization (Dr. Qing Hua's recommendation)
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    if (hour >= 17) timeOfDay = 'evening';
    console.log(`Dashboard loaded during ${timeOfDay} - optimizing content for this time`);
    
    // Show welcome toast based on time of day with child-friendly messaging
    // Messaging crafted with June Sobel's storytelling expertise
    const welcomeMessages = [
      '✨ Ready to discover something amazing today?',
      '🔎 What wonder are you curious about?',
      '🧠 Your brain is ready for new adventures!',
      '🚀 Where will your curiosity take you today?',
      '💫 What magical things will you learn?'
    ];
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    // Short delay to improve perceived performance - UX research recommendation
    const toastDelayMilliseconds = 1500;
    
    // Only show welcome toast on first visit of the session
    const hasShownWelcomeToast = sessionStorage.getItem('hasShownWelcomeToast');
    if (!hasShownWelcomeToast) {
      setTimeout(() => {
        toast(randomMessage, {
          position: 'top-center',
          duration: 4000,
        });
        sessionStorage.setItem('hasShownWelcomeToast', 'true');
      }, toastDelayMilliseconds);
    }
    
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
        <title>WonderWhiz - Explore Your Curiosity</title>
        <meta name="description" content="Discover amazing facts, fun activities, and learning adventures! Ask questions and explore topics that spark your curiosity." />
      </Helmet>
      
      <SidebarProvider>
        <DashboardContainer />
      </SidebarProvider>
    </motion.div>
  );
};

export default Dashboard;
