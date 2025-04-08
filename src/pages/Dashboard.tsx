
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Search, Rocket, BookOpen, Brain, Star } from 'lucide-react';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WonderfulDashboard from '@/components/dashboard/WonderfulDashboard';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

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

  // Fun loading animation states
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingTexts = [
    "Gathering stars...",
    "Finding dinosaurs...", 
    "Mixing potions...",
    "Waking up robots...",
    "Chasing comets..."
  ];
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);

  // Simulate a loading sequence
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const next = prev + Math.random() * 15;
          return next > 100 ? 100 : next;
        });
        
        setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
      }, 700);
      
      return () => clearInterval(interval);
    } else if (childProfile && !isLoaded) {
      // Celebrate when dashboard loads
      setIsLoaded(true);
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#8b5cf6', '#ec4899', '#3b82f6']
        });
        
        if (childProfile.streak_days > 0) {
          toast.success(
            <div className="flex flex-col items-center">
              <span className="font-bold">{childProfile.streak_days} day streak!</span>
              <span className="text-sm">Keep learning to earn more sparks! ✨</span>
            </div>,
            { position: "bottom-center", duration: 5000 }
          );
        }
      }, 800);
    }
  }, [isLoading, childProfile, isLoaded]);
  
  // Magical particles floating animation
  const particles = Array.from({ length: 15 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 rounded-full bg-wonderwhiz-gold/40"
      initial={{ 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight,
        opacity: 0
      }}
      animate={{ 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight,
        opacity: [0, 0.5, 0],
        scale: [0.5, 1, 0.5]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 5
      }}
    />
  ));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col items-center justify-center relative overflow-hidden">
        {/* Magical particles */}
        {particles}
        
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <WonderWhizLogo className="h-16 w-16" />
        </motion.div>
        
        <motion.div 
          className="w-64 h-4 bg-white/10 rounded-full overflow-hidden mb-4"
          initial={{ width: 0 }}
          animate={{ width: "16rem" }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
            style={{ width: `${loadingProgress}%` }}
          />
        </motion.div>
        
        <motion.p 
          className="text-white text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {loadingText}
        </motion.p>
        
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {['🚀', '🌈', '✨', '🔮', '🌟'].map((emoji, i) => (
            <motion.div
              key={i}
              className="text-3xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                delay: 1 + (i * 0.2),
                duration: 0.8,
                rotate: {
                  repeat: Infinity,
                  duration: 2,
                  delay: 2 + (i * 0.5),
                  repeatType: "reverse"
                }
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-wonderwhiz-gradient relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>WonderWhiz - Your Learning Adventure!</title>
        <meta name="description" content="Explore amazing topics and learn fun facts with WonderWhiz!" />
      </Helmet>

      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles}
      </div>
      
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
  );
};

export default Dashboard;
