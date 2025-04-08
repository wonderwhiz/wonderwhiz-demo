
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WonderfulDashboard from '@/components/dashboard/WonderfulDashboard';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardParticles from '@/components/dashboard/DashboardParticles';
import DashboardCelebration from '@/components/dashboard/DashboardCelebration';

const Dashboard = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const {
    childProfile,
    isLoading,
    pastCurios,
    isLoadingSuggestions,
    curioSuggestions,
    handleRefreshSuggestions
  } = useDashboardProfile(profileId);
  
  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <SidebarProvider>
      <motion.div 
        className="min-h-screen bg-wonderwhiz-gradient relative overflow-hidden w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Helmet>
          <title>WonderWhiz - Your Learning Adventure!</title>
          <meta name="description" content="Explore amazing topics and learn fun facts with WonderWhiz!" />
        </Helmet>

        {/* Background particles */}
        <DashboardParticles />
        
        {/* Celebration effects */}
        <DashboardCelebration 
          childProfile={childProfile} 
          isLoaded={isLoaded} 
        />
        
        <DashboardHeader 
          childName={childProfile?.name || 'Explorer'} 
          profileId={profileId} 
        />
        
        <div className="container mx-auto px-4">
          <WonderfulDashboard 
            childProfile={childProfile}
            pastCurios={pastCurios}
            curioSuggestions={curioSuggestions}
            isLoadingSuggestions={isLoadingSuggestions}
            handleRefreshSuggestions={handleRefreshSuggestions}
            profileId={profileId}
          />
        </div>
      </motion.div>
    </SidebarProvider>
  );
};

export default Dashboard;
