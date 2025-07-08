import React from 'react';
import { motion } from 'framer-motion';
import { usePersonalizedLearning } from '@/hooks/usePersonalizedLearning';
import IntelligentWelcomeOrchestrator from './IntelligentWelcomeOrchestrator';
import AdaptiveLearningFlowManager from './AdaptiveLearningFlowManager';
import IntelligentEngagementSystem from './IntelligentEngagementSystem';
import LearningJourneyVisualizer from './LearningJourneyVisualizer';
import SmartRecommendations from './SmartRecommendations';
import LearningInsightsPanel from './LearningInsightsPanel';

interface PersonalizedLearningDashboardProps {
  childProfile: any;
  onStartLearning: (topic: string) => void;
  onContinueContent: (content: any) => void;
}

const PersonalizedLearningDashboard: React.FC<PersonalizedLearningDashboardProps> = ({
  childProfile,
  onStartLearning,
  onContinueContent
}) => {
  const {
    insights,
    patterns,
    personalizedContent,
    isAnalyzing
  } = usePersonalizedLearning(childProfile?.id);

  const isYoungChild = (childProfile?.age || 10) <= 8;
  
  // Intelligent time-of-day detection
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };
  
  // Smart mood detection based on patterns
  const detectMood = (): 'curious' | 'excited' | 'focused' | 'playful' => {
    // Use available pattern data or fallback to defaults
    const currentHour = new Date().getHours();
    const streakLength = childProfile?.streak_days || 0;
    
    if (streakLength > 3) return 'excited';
    if (currentHour >= 9 && currentHour <= 11) return 'focused';
    if (isYoungChild) return 'playful';
    return 'curious';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple rounded-full flex items-center justify-center"
            >
              <span className="text-2xl">🧠</span>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 rounded-full animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isYoungChild ? "🔮 Creating Your Magic Dashboard..." : "🤖 Analyzing Your Learning Journey..."}
          </h2>
          <p className="text-white/70">
            {isYoungChild 
              ? "Making everything perfect just for you!" 
              : "Personalizing your experience based on your interests and progress"
            }
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Intelligent Welcome Orchestrator */}
      <motion.div variants={itemVariants}>
        <IntelligentWelcomeOrchestrator
          childProfile={childProfile}
          onStartLearning={onStartLearning}
          timeOfDay={getTimeOfDay()}
          recentActivity={personalizedContent?.continueWhere || []}
          mood={detectMood()}
        />
      </motion.div>

      {/* Adaptive Learning Flow Manager */}
      <motion.div variants={itemVariants}>
        <AdaptiveLearningFlowManager
          childProfile={childProfile}
          recentActivity={personalizedContent?.continueWhere || []}
          onContinueLearning={onContinueContent}
          onStartNewTopic={onStartLearning}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Learning Journey & Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div variants={itemVariants}>
            <LearningJourneyVisualizer
              childProfile={childProfile}
              patterns={patterns}
              insights={insights}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SmartRecommendations
              suggestions={personalizedContent?.suggestedTopics || []}
              childAge={childProfile?.age || 10}
              onSelectTopic={onStartLearning}
            />
          </motion.div>
        </div>

        {/* Right Column - Engagement & Insights */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants}>
            <IntelligentEngagementSystem
              childProfile={childProfile}
              onEngagementAction={(action, data) => {
                console.log('Engagement action:', action, data);
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LearningInsightsPanel
              insights={insights}
              childAge={childProfile?.age || 10}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalizedLearningDashboard;