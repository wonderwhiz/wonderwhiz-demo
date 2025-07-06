import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Brain, 
  Lightbulb, 
  Star, 
  Sparkles,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';

interface CuriosityMeterProps {
  currentEngagement: number; // 0-100
  questionsAsked: number;
  sectionsCompleted: number;
  timeSpent: number; // in minutes
  childAge: number;
  onBoostCuriosity: () => void;
}

const CuriosityMeter: React.FC<CuriosityMeterProps> = ({
  currentEngagement,
  questionsAsked,
  sectionsCompleted,
  timeSpent,
  childAge,
  onBoostCuriosity
}) => {
  const [curiosityLevel, setCuriosityLevel] = useState(0);
  const [showBoostAnimation, setShowBoostAnimation] = useState(false);
  const isYoungChild = childAge <= 8;

  useEffect(() => {
    // Calculate curiosity level based on multiple factors
    const engagementFactor = currentEngagement * 0.4;
    const questionsFactor = Math.min(questionsAsked * 10, 30);
    const completionFactor = sectionsCompleted * 15;
    const timeFactor = Math.min(timeSpent * 2, 20);
    
    const calculatedLevel = Math.min(100, engagementFactor + questionsFactor + completionFactor + timeFactor);
    setCuriosityLevel(calculatedLevel);
  }, [currentEngagement, questionsAsked, sectionsCompleted, timeSpent]);

  const getCuriosityLabel = () => {
    if (curiosityLevel < 20) return isYoungChild ? '🌱 Just Starting!' : '🔍 Exploring';
    if (curiosityLevel < 40) return isYoungChild ? '🔥 Getting Excited!' : '🎯 Engaged';
    if (curiosityLevel < 60) return isYoungChild ? '⚡ Super Curious!' : '🚀 Highly Engaged';
    if (curiosityLevel < 80) return isYoungChild ? '🌟 Amazing Explorer!' : '⭐ Very Curious';
    return isYoungChild ? '🏆 Curiosity Champion!' : '🧠 Peak Curiosity';
  };

  const getCuriosityColor = () => {
    if (curiosityLevel < 20) return 'from-gray-400 to-gray-500';
    if (curiosityLevel < 40) return 'from-blue-400 to-cyan-400';
    if (curiosityLevel < 60) return 'from-purple-400 to-pink-400';
    if (curiosityLevel < 80) return 'from-orange-400 to-yellow-400';
    return 'from-green-400 to-emerald-400';
  };

  const handleBoostClick = () => {
    setShowBoostAnimation(true);
    onBoostCuriosity();
    
    setTimeout(() => {
      setShowBoostAnimation(false);
    }, 2000);
  };

  const getCuriosityTips = () => {
    if (isYoungChild) {
      return [
        "🤔 Ask 'What if...?' questions!",
        "🔍 Look for cool details!",
        "💭 Wonder about how things work!",
        "🎯 Try the interactive activities!"
      ];
    } else {
      return [
        "💡 Challenge assumptions and ask deeper questions",
        "🔗 Connect new concepts to what you already know",
        "🎯 Focus on understanding rather than memorizing",
        "⚡ Engage with interactive elements and activities"
      ];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-wonderwhiz-purple/30 backdrop-blur-sm border-white/20 overflow-hidden relative">
        <AnimatePresence>
          {showBoostAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 z-10 pointer-events-none"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      scale: 0,
                      x: 0,
                      y: 0,
                      rotate: 0
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      x: [0, (Math.cos(i * 45 * Math.PI / 180) * 80)],
                      y: [0, (Math.sin(i * 45 * Math.PI / 180) * 80)],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 relative z-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple rounded-xl flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  {isYoungChild ? '🔥 Curiosity Meter!' : '🧠 Curiosity Level'}
                </h3>
                <p className="text-white/70 text-sm">
                  {getCuriosityLabel()}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleBoostClick}
              size="sm"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold"
              disabled={showBoostAnimation}
            >
              <Zap className="h-4 w-4 mr-1" />
              {isYoungChild ? 'Boost!' : 'Inspire'}
            </Button>
          </div>

          {/* Curiosity Level Visualization */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm font-medium">
                {isYoungChild ? 'Curiosity Power' : 'Engagement Level'}
              </span>
              <span className="text-white font-bold">{Math.round(curiosityLevel)}%</span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-white/10 rounded-full h-4 shadow-inner">
                <motion.div
                  className={`bg-gradient-to-r ${getCuriosityColor()} h-4 rounded-full shadow-lg flex items-center justify-end pr-2`}
                  initial={{ width: 0 }}
                  animate={{ width: `${curiosityLevel}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  {curiosityLevel > 15 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Lightbulb className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
              
              {/* Milestone markers */}
              <div className="flex justify-between absolute -bottom-4 w-full text-xs text-white/40">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-white font-bold text-lg">{questionsAsked}</div>
              <div className="text-white/60 text-xs">
                {isYoungChild ? 'Questions' : 'Inquiries'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-white font-bold text-lg">{sectionsCompleted}</div>
              <div className="text-white/60 text-xs">
                {isYoungChild ? 'Parts Done' : 'Completed'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-white font-bold text-lg">{timeSpent}m</div>
              <div className="text-white/60 text-xs">
                {isYoungChild ? 'Time' : 'Invested'}
              </div>
            </div>
          </div>

          {/* Curiosity Tips */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-white/80 font-semibold text-sm">
                {isYoungChild ? 'Curiosity Boosters!' : 'Boost Your Curiosity'}
              </span>
            </div>
            
            <div className="space-y-2">
              {getCuriosityTips().slice(0, 2).map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <Sparkles className="h-3 w-3 text-yellow-400 mt-1 flex-shrink-0" />
                  <span className="text-white/70 text-sm">{tip}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CuriosityMeter;