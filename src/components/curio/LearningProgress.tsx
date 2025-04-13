
import React from 'react';
import { Sparkles, BookOpen, Brain, Award, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LearningProgressProps {
  sparksEarned: number;
  explorationDepth: number;
  blocksExplored: number;
  streakDays?: number;
  badges?: string[];
}

const LearningProgress: React.FC<LearningProgressProps> = ({
  sparksEarned,
  explorationDepth,
  blocksExplored,
  streakDays = 0,
  badges = []
}) => {
  // Calculate a "progress score" based on blocks explored
  const progressPercentage = Math.min(blocksExplored * 5, 100);
  
  // Calculate level based on sparks earned
  const level = Math.floor(sparksEarned / 50) + 1;
  const levelProgress = (sparksEarned % 50) / 50 * 100;
  
  return (
    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/80">Sparks Earned</h3>
            <p className="text-xl font-bold text-wonderwhiz-gold">{sparksEarned}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/80">Knowledge Blocks</h3>
            <p className="text-xl font-bold text-blue-400">{blocksExplored}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/80">Exploration Depth</h3>
            <p className="text-xl font-bold text-emerald-400">{explorationDepth}</p>
          </div>
        </div>
      </div>
      
      {/* Level and Learning Progress */}
      <div className="mt-4">
        <div className="flex justify-between mb-1 text-xs text-white/70">
          <span>Curiosity Level {level}</span>
          <span>{Math.round(levelProgress)}% to Level {level + 1}</span>
        </div>
        <Progress value={levelProgress} className="h-2 bg-white/20">
          <div className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink via-purple-500 to-blue-500 rounded-full" style={{ width: `${levelProgress}%` }}></div>
        </Progress>
      </div>
      
      {/* Streak and Badges Section */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Target className="h-4 w-4 text-orange-400 mr-2" />
            <span className="text-sm text-white/80">{streakDays} Day Streak</span>
          </div>
          
          <div className="flex">
            {badges.length > 0 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex -space-x-2">
                      {badges.slice(0, 3).map((badge, index) => (
                        <div key={index} className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                          <Award className="h-3 w-3 text-yellow-300" />
                        </div>
                      ))}
                      {badges.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">
                          +{badges.length - 3}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You've earned {badges.length} badges!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span className="text-xs text-white/50">No badges yet. Keep exploring!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgress;
