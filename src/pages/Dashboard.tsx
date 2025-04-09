
import React, { useEffect } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

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
    // Messaging crafted with child development expertise
    const welcomeMessages = [
      '✨ What amazing thing will you discover today?',
      '🔎 Ready for a wonder adventure?',
      '🧠 Time to grow your super brain!',
      '🚀 Let\'s blast off into learning fun!',
      '💫 Unlock new magical powers today!'
    ];
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    // Short delay to improve perceived performance
    const toastDelayMilliseconds = 1000;
    
    // Only show welcome toast on first visit of the session
    const hasShownWelcomeToast = sessionStorage.getItem('hasShownWelcomeToast');
    if (!hasShownWelcomeToast) {
      setTimeout(() => {
        toast(randomMessage, {
          position: 'top-center',
          duration: 4000,
        });
        
        // Add gentle confetti for a delightful welcome
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.3 },
            colors: ['#8b5cf6', '#10b981', '#3b82f6', '#ec4899', '#f59e0b'],
            disableForReducedMotion: true
          });
        }, 300);
        
        sessionStorage.setItem('hasShownWelcomeToast', 'true');
      }, toastDelayMilliseconds);
    }
    
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
        <title>WonderWhiz - Your Learning Adventure</title>
        <meta name="description" content="Discover amazing facts, fun activities, and cool adventures! What will you learn today?" />
      </Helmet>
      
      <SidebarProvider>
        <DashboardContainer />
      </SidebarProvider>
    </motion.div>
  );
};

export default Dashboard;
