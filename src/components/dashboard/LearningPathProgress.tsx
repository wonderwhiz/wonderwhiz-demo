
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Star, Award, Trophy, Brain, Book, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LearningPathProgressProps {
  streakDays: number;
  interests: string[];
  completedTopics: number;
  sparksBalance: number;
}

const LearningPathProgress: React.FC<LearningPathProgressProps> = ({
  streakDays = 0,
  interests = [],
  completedTopics = 0,
  sparksBalance = 0
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate level based on sparks balance
  const level = Math.floor(sparksBalance / 100) + 1;
  const progress = (sparksBalance % 100) / 100;
  
  // Milestones
  const milestones = [
    { day: 1, icon: <Star className="h-5 w-5" />, label: 'First Day', achieved: streakDays >= 1 },
    { day: 3, icon: <Book className="h-5 w-5" />, label: '3 Day Streak', achieved: streakDays >= 3 },
    { day: 7, icon: <Brain className="h-5 w-5" />, label: 'Week Explorer', achieved: streakDays >= 7 },
    { day: 14, icon: <Lightbulb className="h-5 w-5" />, label: '2 Week Genius', achieved: streakDays >= 14 },
    { day: 30, icon: <Trophy className="h-5 w-5" />, label: 'Monthly Master', achieved: streakDays >= 30 },
  ];
  
  // Path points for the journey line
  const pathPoints = milestones.map((_, index) => {
    const progress = index / (milestones.length - 1);
    return {
      x: `${progress * 100}%`,
      achieved: milestones[index].achieved
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-blue/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-wonderwhiz-bright-pink/20 p-2 rounded-full mr-3">
            <Rocket className="h-5 w-5 text-wonderwhiz-bright-pink" /> 
          </div>
          <h3 className="font-bold text-white text-lg">Your Learning Journey</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="text-white hover:text-wonderwhiz-vibrant-yellow transition-colors"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>
      </div>
      
      {/* Level and progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm">Level {level}</span>
          <span className="text-white text-sm">{Math.round(progress * 100)}% to Level {level + 1}</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, type: "spring" }}
          />
        </div>
        <div className="mt-2 text-center">
          <span className="text-white/70 text-xs">{sparksBalance} total sparks collected</span>
        </div>
      </div>
      
      {/* Streak journey path */}
      <div className="relative py-8">
        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-white/20 rounded-full" />
        
        {pathPoints.map((point, index) => (
          <div 
            key={index}
            className="absolute top-1/2 transform -translate-y-1/2 -ml-3"
            style={{ left: point.x }}
          >
            <motion.div 
              className={`w-6 h-6 rounded-full flex items-center justify-center ${point.achieved ? 'bg-wonderwhiz-vibrant-yellow' : 'bg-white/20'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              {point.achieved ? (
                milestones[index].icon
              ) : (
                <span className="text-xs text-white">{milestones[index].day}</span>
              )}
            </motion.div>
            <motion.div
              className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <span className={`text-xs ${point.achieved ? 'text-wonderwhiz-vibrant-yellow' : 'text-white/60'}`}>
                {milestones[index].label}
              </span>
            </motion.div>
          </div>
        ))}
        
        {/* Current position rocket */}
        <motion.div 
          className="absolute top-1/2 transform -translate-y-1/2 -ml-4"
          initial={{ left: '0%' }}
          animate={{ 
            left: `${Math.min((streakDays / 30) * 100, 100)}%`,
          }}
          transition={{ duration: 1, type: "spring" }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Rocket className="h-8 w-8 text-wonderwhiz-bright-pink transform rotate-90" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Details section */}
      {showDetails && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-lg p-3 flex flex-col items-center">
              <Award className="h-6 w-6 text-wonderwhiz-gold mb-2" />
              <span className="text-white text-sm font-medium">{streakDays} Day Streak</span>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3 flex flex-col items-center">
              <Star className="h-6 w-6 text-wonderwhiz-gold mb-2" />
              <span className="text-white text-sm font-medium">{completedTopics} Topics Explored</span>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3 flex flex-col items-center">
              <Brain className="h-6 w-6 text-wonderwhiz-gold mb-2" />
              <span className="text-white text-sm font-medium">Level {level} Explorer</span>
            </div>
          </div>
          
          {interests.length > 0 && (
            <div className="mt-4">
              <h4 className="text-white text-sm mb-2">Your Interests:</h4>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <div key={index} className="bg-wonderwhiz-purple/30 px-3 py-1 rounded-full text-xs text-white">
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LearningPathProgress;
