
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
      className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 overflow-hidden"
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
