import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Target, Zap, Brain, Award, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdaptiveLearningFlowManagerProps {
  childProfile: any;
  recentActivity: any[];
  onContinueLearning: (item: any) => void;
  onStartNewTopic: (topic: string) => void;
}

interface LearningSession {
  id: string;
  title: string;
  progress: number;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
  lastAccessed: string;
  type: 'encyclopedia' | 'quiz' | 'creative';
  nextStep: string;
  estimatedTime: number;
  streakDays: number;
}

const AdaptiveLearningFlowManager: React.FC<AdaptiveLearningFlowManagerProps> = ({
  childProfile,
  recentActivity,
  onContinueLearning,
  onStartNewTopic
}) => {
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState<LearningSession[]>([]);
  const [optimalLearningTime, setOptimalLearningTime] = useState<string>('');
  const [focusScore, setFocusScore] = useState(85);
  
  const isYoungChild = (childProfile?.age || 10) <= 8;

  // Generate adaptive learning sessions based on child's patterns
  useEffect(() => {
    const generateAdaptiveSessions = () => {
      const mockSessions: LearningSession[] = [
        {
          id: '1',
          title: 'Ocean Adventures',
          progress: 65,
          timeSpent: 12,
          difficulty: 'easy',
          lastAccessed: new Date(Date.now() - 86400000).toISOString(),
          type: 'encyclopedia',
          nextStep: 'Learn about deep sea creatures',
          estimatedTime: 8,
          streakDays: 3
        },
        {
          id: '2',
          title: 'Space Explorers',
          progress: 30,
          timeSpent: 5,
          difficulty: 'medium',
          lastAccessed: new Date(Date.now() - 172800000).toISOString(),
          type: 'quiz',
          nextStep: 'Take the planets quiz',
          estimatedTime: 5,
          streakDays: 1
        },
        {
          id: '3',
          title: 'Dinosaur Discovery',
          progress: 90,
          timeSpent: 25,
          difficulty: 'easy',
          lastAccessed: new Date(Date.now() - 259200000).toISOString(),
          type: 'creative',
          nextStep: 'Create your own dinosaur',
          estimatedTime: 15,
          streakDays: 7
        }
      ];

      // Intelligent sorting based on engagement patterns
      const sorted = mockSessions.sort((a, b) => {
        // Prioritize by progress (sweet spot: 30-80%), recency, and streak
        const aScore = Math.abs(a.progress - 55) + (a.streakDays * 10) - (new Date().getTime() - new Date(a.lastAccessed).getTime()) / 86400000;
        const bScore = Math.abs(b.progress - 55) + (b.streakDays * 10) - (new Date().getTime() - new Date(b.lastAccessed).getTime()) / 86400000;
        return bScore - aScore;
      });

      setAdaptiveRecommendations(sorted.slice(0, 3));
    };

    generateAdaptiveSessions();
    
    // Calculate optimal learning time based on child's age
    const currentHour = new Date().getHours();
    if (isYoungChild) {
      setOptimalLearningTime(currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening');
    } else {
      setOptimalLearningTime('anytime');
    }
  }, [childProfile, recentActivity, isYoungChild]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'encyclopedia': return <Brain className="h-4 w-4" />;
      case 'quiz': return <Target className="h-4 w-4" />;
      case 'creative': return <Zap className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'from-wonderwhiz-bright-pink to-wonderwhiz-purple';
    if (progress < 70) return 'from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink';
    return 'from-wonderwhiz-cyan to-wonderwhiz-vibrant-yellow';
  };

  return (
    <div className="space-y-6">
      {/* Adaptive Flow Header */}
      <Card className="bg-gradient-to-r from-wonderwhiz-deep-purple/40 to-wonderwhiz-purple/40 border-wonderwhiz-purple/30 backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isYoungChild ? '🎯 Your Learning Adventures' : '🚀 Intelligent Learning Flow'}
              </h3>
              <p className="text-white/80">
                {isYoungChild 
                  ? 'Pick up where you left off or start something new!'
                  : 'Optimized based on your learning patterns and engagement'
                }
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-wonderwhiz-cyan" />
                <span className="text-white font-medium">
                  {optimalLearningTime === 'anytime' ? 'Perfect time to learn!' : `Great ${optimalLearningTime} energy!`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
                <span className="text-white/80 text-sm">Focus Score: {focusScore}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Learning Sessions */}
      <div className="grid gap-4">
        {adaptiveRecommendations.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(session.type)}
                        <h4 className="font-bold text-white text-lg group-hover:text-wonderwhiz-bright-pink transition-colors">
                          {session.title}
                        </h4>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge className={`px-2 py-1 text-xs ${getDifficultyColor(session.difficulty)}`}>
                          {session.difficulty}
                        </Badge>
                        {session.streakDays > 1 && (
                          <Badge className="bg-wonderwhiz-vibrant-yellow/20 text-wonderwhiz-vibrant-yellow border-wonderwhiz-vibrant-yellow/30 px-2 py-1 text-xs">
                            🔥 {session.streakDays} days
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Smart Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-white/70 mb-2">
                        <span>{session.progress}% complete</span>
                        <span>{session.estimatedTime} min left</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${getProgressColor(session.progress)} rounded-full relative overflow-hidden`}
                          initial={{ width: 0 }}
                          animate={{ width: `${session.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        >
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-3">
                      <span className="font-medium">Next: </span>
                      {session.nextStep}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>📚 {session.timeSpent} min spent</span>
                      <span>⏰ {new Date(session.lastAccessed).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => onContinueLearning(session)}
                      className="ml-4 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-purple hover:to-wonderwhiz-bright-pink"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Start New Topic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-cyan/20 border-wonderwhiz-vibrant-yellow/30 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {isYoungChild ? '✨ Start Something New!' : '🌟 Begin Fresh Adventure'}
                </h4>
                <p className="text-white/80">
                  {isYoungChild 
                    ? 'What are you curious about today?'
                    : 'Explore a completely new topic based on your interests'
                  }
                </p>
              </div>
              <Button
                onClick={() => onStartNewTopic('')}
                className="bg-wonderwhiz-vibrant-yellow text-wonderwhiz-deep-purple hover:bg-wonderwhiz-vibrant-yellow/90 font-bold"
              >
                <Zap className="mr-2 h-5 w-5" />
                New Topic
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdaptiveLearningFlowManager;