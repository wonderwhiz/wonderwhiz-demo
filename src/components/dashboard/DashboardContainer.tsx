import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import CurioContent from '@/components/dashboard/CurioContent';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardContainerContent = () => {
  // Mock data for the CurioContent component
  const [contentBlocks, setContentBlocks] = useState([]);
  const [blockReplies, setBlockReplies] = useState({});
  
  // Handler functions
  const handleLoadMore = () => {
    console.log('Load more triggered');
  };
  
  const handleToggleLike = (blockId: string) => {
    console.log('Toggle like for block:', blockId);
  };
  
  const handleToggleBookmark = (blockId: string) => {
    console.log('Toggle bookmark for block:', blockId);
  };
  
  const handleReply = (blockId: string, message: string) => {
    console.log('Reply to block:', blockId, 'with message:', message);
  };
  
  const handleSetQuery = (query: string) => {
    console.log('Set query:', query);
  };
  
  const handleRabbitHoleFollow = (question: string) => {
    console.log('Follow rabbit hole question:', question);
  };
  
  const handleQuizCorrect = (blockId: string) => {
    console.log('Quiz correct for block:', blockId);
  };
  
  const handleNewsRead = (blockId: string) => {
    console.log('News read for block:', blockId);
  };
  
  const handleCreativeUpload = (blockId: string) => {
    console.log('Creative upload for block:', blockId);
  };
  
  const handlePlayText = (text: string, specialistId: string) => {
    console.log('Play text:', text, 'with specialist:', specialistId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen w-full"
    >
      <DashboardSidebar 
        childId="d49eb66b-5404-4743-a137-d9f121d79151" 
        sparksBalance={8750} 
        pastCurios={[]} 
        onCurioSelect={() => {}}
      />
      <div className="flex-1 overflow-auto bg-gradient-to-br from-wonderwhiz-deep-purple/50 to-wonderwhiz-light-purple/30">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-wonderwhiz-deep-purple/30 border-b border-white/10">
          <DashboardHeader 
            childName="Explorer" 
            streakDays={7} 
            childAge={10} 
            profileId="d49eb66b-5404-4743-a137-d9f121d79151" 
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <CurioContent 
            currentCurio={null}
            contentBlocks={contentBlocks}
            blockReplies={blockReplies}
            isGenerating={false}
            loadingBlocks={false}
            visibleBlocksCount={0}
            profileId="d49eb66b-5404-4743-a137-d9f121d79151"
            onLoadMore={handleLoadMore}
            hasMoreBlocks={false}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onReply={handleReply}
            onSetQuery={handleSetQuery}
            onRabbitHoleFollow={handleRabbitHoleFollow}
            onQuizCorrect={handleQuizCorrect}
            onNewsRead={handleNewsRead}
            onCreativeUpload={handleCreativeUpload}
            playText={handlePlayText}
            childAge={10}
          />
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
        <meta name="description" content="Discover amazing facts, fun activities, and cool adventures! What will you learn today?" />
      </Helmet>
      
      {/* Static decorative background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
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
      
      <div className="relative z-10">
        <SidebarProvider>
          <DashboardContainerContent />
        </SidebarProvider>
      </div>
    </div>
  );
};

export default Dashboard;
