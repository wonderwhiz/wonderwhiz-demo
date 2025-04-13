
import React from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 overflow-hidden"
    >
      <Helmet>
        <title>WonderWhiz - Your Learning Adventure</title>
        <meta name="description" content="Discover amazing facts, fun activities, and cool adventures! What will you learn today?" />
      </Helmet>
      
      {/* Dynamic stars background for a more magical experience */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Stars />
      </div>
      
      <div className="relative z-10">
        <SidebarProvider>
          <DashboardContainer />
        </SidebarProvider>
      </div>
    </motion.div>
  );
};

// Animated stars background component for visual appeal
const Stars: React.FC = () => {
  // Generate random stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 2,
    delay: Math.random() * 5
  }));

  return (
    <div className="absolute inset-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default Dashboard;
