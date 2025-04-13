import React from 'react';
import { Sparkles, Award, Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface LearningProgressProps {
  questionCount?: number;
  explorationDepth: number;
  sparksEarned: number;
  childAge?: number;
  streakDays?: number;
  blocksExplored?: number;
}

const LearningProgress: React.FC<LearningProgressProps> = ({
  questionCount = 0,
  explorationDepth = 0,
  sparksEarned = 0,
  childAge = 10,
  streakDays = 0,
  blocksExplored = 0
}) => {
  const getLevelInfo = () => {
    const count = Math.max(questionCount, blocksExplored);
    
    const levels = [
      { threshold: 0, name: "New Explorer", color: "text-wonderwhiz-cyan" },
      { threshold: 5, name: "Curious Cat", color: "text-wonderwhiz-bright-pink" },
      { threshold: 15, name: "Knowledge Seeker", color: "text-wonderwhiz-gold" },
      { threshold: 30, name: "Wonder Wizard", color: "text-purple-400" },
      { threshold: 50, name: "Wisdom Master", color: "text-indigo-400" },
      { threshold: 100, name: "Curiosity Champion", color: "text-amber-400" }
    ];
    
    let currentLevel = levels[0];
    for (const level of levels) {
      if (count >= level.threshold) {
        currentLevel = level;
      } else {
        break;
      }
    }
    
    const currentIndex = levels.findIndex(l => l.name === currentLevel.name);
    const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
    
    let progressPercentage = 100;
    if (nextLevel) {
      const currentLevelQuestions = count - currentLevel.threshold;
      const questionsToNextLevel = nextLevel.threshold - currentLevel.threshold;
      progressPercentage = Math.min(100, Math.floor((currentLevelQuestions / questionsToNextLevel) * 100));
    }
    
    return {
      current: currentLevel,
      next: nextLevel,
      progress: progressPercentage
    };
  };

  const levelInfo = getLevelInfo();
  
  if (childAge < 8) {
    return (
      <div className="bg-wonderwhiz-deep-purple/50 rounded-lg border border-white/10 p-3 mb-4">
        <div className="flex items-center mb-2">
          <Star className="h-5 w-5 text-wonderwhiz-gold mr-2" />
          <h3 className="text-white font-medium">Your Wonder Journey</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-wonderwhiz-bright-pink text-xl font-bold">{blocksExplored || questionCount}</div>
            <div className="text-white/70 text-xs">Questions</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-wonderwhiz-cyan text-xl font-bold">{sparksEarned}</div>
            <div className="text-white/70 text-xs">Sparks</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-wonderwhiz-gold text-xl font-bold">{streakDays}</div>
            <div className="text-white/70 text-xs">Day Streak</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-wonderwhiz-deep-purple/30 rounded-lg border border-white/10 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-wonderwhiz-gold mr-2" />
          <h3 className="text-white font-medium">Learning Journey</h3>
        </div>
        
        <div className="flex items-center bg-white/10 px-2 py-1 rounded-full">
          <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-vibrant-yellow mr-1.5" />
          <span className="text-white text-xs">{sparksEarned} Sparks</span>
        </div>
      </div>
      
      <div className="flex items-center mb-3">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${levelInfo.current.color} bg-white/10 mr-3`}>
          <Award className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className={`${levelInfo.current.color} font-medium`}>{levelInfo.current.name}</h4>
            {levelInfo.next && (
              <span className="text-white/50 text-xs">{levelInfo.progress}% to {levelInfo.next.name}</span>
            )}
          </div>
          
          {levelInfo.next && (
            <div className="w-full h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
              <motion.div 
                className={`h-full ${levelInfo.current.color.replace('text-', 'bg-')}`}
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-wonderwhiz-bright-pink text-lg font-bold">{blocksExplored || questionCount}</div>
          <div className="text-white/70 text-xs">Questions</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-wonderwhiz-cyan text-lg font-bold">{explorationDepth}</div>
          <div className="text-white/70 text-xs">Depth</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-wonderwhiz-gold text-lg font-bold">{streakDays}</div>
          <div className="text-white/70 text-xs">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;
