
import React from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple to-wonderwhiz-purple overflow-hidden">
      <Helmet>
        <title>WonderWhiz - Your Learning Adventure</title>
        <meta name="description" content="Discover amazing facts, fun activities, and cool adventures! What will you learn today?" />
      </Helmet>
      
      {/* Static decorative background instead of animated stars */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <StaticBackground />
      </div>
      
      <div className="relative z-10">
        <SidebarProvider>
          <DashboardContainer />
        </SidebarProvider>
      </div>
    </div>
  );
};

// Static decorative background - no animations
const StaticBackground = () => {
  return (
    <div className="absolute inset-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-deep-purple via-indigo-900 to-purple-950"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      {/* Static stars - small dots */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>
      
      {/* Soft glow effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
    </div>
  );
};

export default Dashboard;
