
import React, { useEffect } from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { SidebarProvider } from '@/components/ui/sidebar';

const Dashboard = () => {
  // Add analytics for measuring engagement
  useEffect(() => {
    // Track when users visit the dashboard page
    console.log('Dashboard loaded - tracking user engagement');
    
    // Clean up event listeners when component unmounts
    return () => {
      console.log('Dashboard unloaded');
    };
  }, []);

  return (
    <SidebarProvider>
      <DashboardContainer />
    </SidebarProvider>
  );
};

export default Dashboard;
