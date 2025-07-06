import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sparkles, Flame, Star, Trophy, Brain, Heart, Zap } from 'lucide-react';

interface PersonalizedWelcomeHeroProps {
  childProfile: any;
  insights: any[];
  patterns: any;
}

const PersonalizedWelcomeHero: React.FC<PersonalizedWelcomeHeroProps> = ({
  childProfile,
  insights,
  patterns
}) => {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('');
  
  const childName = childProfile?.name || 'Explorer';
  const childAge = childProfile?.age || 10;
  const sparksBalance = childProfile?.sparks_balance || 0;
  const streakDays = childProfile?.streak_days || 0;
  const isYoungChild = childAge <= 8;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    // Rotate through insights every 4 seconds
    if (insights.length > 1) {
      const interval = setInterval(() => {
        setCurrentInsightIndex((prev) => (prev + 1) % insights.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [insights.length]);

  const getPersonalizedGreeting = () => {
    const greetings = {
      morning: [
        `Good morning, ${childName}! ☀️`,
        `Rise and shine, ${childName}! 🌅`,
        `Morning, superstar ${childName}! ⭐`
      ],
      afternoon: [
        `Hey there, ${childName}! 👋`,
        `Good afternoon, ${childName}! ☀️`,
        `Ready for adventure, ${childName}? 🚀`
      ],
      evening: [
        `Good evening, ${childName}! 🌙`,
        `Hey ${childName}, perfect time to learn! ✨`,
        `Evening explorer ${childName}! 🌟`
      ]
    };

    const timeGreetings = greetings[timeOfDay as keyof typeof greetings] || greetings.afternoon;
    return timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
  };

  const getMotivationalMessage = () => {
    if (patterns?.averageEngagement > 7) {
      return isYoungChild 
        ? "You're such an amazing learner! Let's discover something incredible today! 🌟"
        : "Your curiosity is extraordinary! Ready to explore something fascinating today?";
    } else if (streakDays > 0) {
      return isYoungChild
        ? `Wow! You've been learning for ${streakDays} days in a row! Keep it up! 🔥`
        : `Impressive ${streakDays}-day learning streak! Your consistency is inspiring!`;
    } else {
      return isYoungChild
        ? "Every question leads to an amazing discovery! What shall we explore? 🎯"
        : "Your journey of discovery awaits. What captures your curiosity today?";
    }
  };

  const getBackgroundGradient = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'from-gradient-sunrise-start via-gradient-sunrise-mid to-gradient-sunrise-end';
    } else if (hour < 17) {
      return 'from-gradient-day-start via-gradient-day-mid to-gradient-day-end';
    } else {
      return 'from-gradient-evening-start via-gradient-evening-mid to-gradient-evening-end';
    }
  };

  const currentInsight = insights[currentInsightIndex];

  return (
    <Card className="relative overflow-hidden bg-white shadow-2xl border-0 rounded-3xl">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()} opacity-90`} />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg"
            >
              {getPersonalizedGreeting()}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/95 font-medium mb-6 leading-relaxed"
            >
              {getMotivationalMessage()}
            </motion.p>

            {/* Dynamic Insight Display */}
            <AnimatePresence mode="wait">
              {currentInsight && (
                <motion.div
                  key={currentInsightIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentInsight.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">
                        {currentInsight.title}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {currentInsight.description}
                      </p>
                    </div>
                    <div className="text-xs text-white/70 font-medium">
                      {Math.round(currentInsight.confidence * 100)}% match
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats & Avatar */}
          <div className="flex flex-col items-center gap-4">
            {/* Avatar with learning ring */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-dashed border-white/30"
              />
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/40">
                {childProfile?.avatar_url ? (
                  <img 
                    src={childProfile.avatar_url} 
                    alt={childName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {childName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-white" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{sparksBalance}</div>
                    <div className="text-xs text-white/80">Sparks</div>
                  </div>
                </div>
              </motion.div>

              {streakDays > 0 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-white" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{streakDays}</div>
                      <div className="text-xs text-white/80">Day Streak</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {patterns?.totalSessions > 0 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-white" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{patterns.totalSessions}</div>
                      <div className="text-xs text-white/80">Explored</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PersonalizedWelcomeHero;