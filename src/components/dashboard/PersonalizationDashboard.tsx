import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  AlertTriangle,
  Settings,
  BookOpen,
  Zap
} from 'lucide-react';
import { usePersonalizationEngine } from '@/hooks/usePersonalizationEngine';

interface PersonalizationDashboardProps {
  childId: string;
  childProfile: any;
}

const PersonalizationDashboard: React.FC<PersonalizationDashboardProps> = ({
  childId,
  childProfile
}) => {
  const {
    profile,
    patterns,
    recommendations,
    isLoading,
    updateLearningPreferences
  } = usePersonalizationEngine(childId);

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wonderwhiz-cyan"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile || !patterns) {
    return null;
  }

  const age = childProfile?.age || 10;
  const isYoungChild = age <= 8;

  return (
    <div className="space-y-6">
      {/* Learning Profile Overview */}
      <Card className="bg-gradient-to-r from-wonderwhiz-deep-purple to-wonderwhiz-purple border-wonderwhiz-cyan/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-wonderwhiz-cyan" />
            {isYoungChild ? "Your Learning Style" : "Personalized Learning Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-wonderwhiz-vibrant-yellow">
                {Math.round(patterns.engagementScore * 10)}%
              </div>
              <div className="text-white/70 text-sm">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-wonderwhiz-cyan">
                {Math.round(patterns.completionRate)}%
              </div>
              <div className="text-white/70 text-sm">Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-wonderwhiz-bright-pink">
                {profile.optimalSessionLength}m
              </div>
              <div className="text-white/70 text-sm">Best Session</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {profile.learningStyle}
              </div>
              <div className="text-white/70 text-sm">Learning Style</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Challenges */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="bg-white/5 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-green-400" />
              {isYoungChild ? "You're Great At!" : "Strengths"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.strengths.length > 0 ? (
              profile.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                    {strength}
                  </Badge>
                </motion.div>
              ))
            ) : (
              <div className="text-white/60 text-sm">
                Keep learning to discover your strengths!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Areas to Improve */}
        <Card className="bg-white/5 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-400" />
              {isYoungChild ? "Let's Practice!" : "Growth Areas"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.challenges.length > 0 ? (
              profile.challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    {challenge}
                  </Badge>
                </motion.div>
              ))
            ) : (
              <div className="text-white/60 text-sm">
                {isYoungChild ? "You're doing amazing!" : "No specific challenges identified"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Smart Recommendations */}
      <Card className="bg-white/5 border-wonderwhiz-cyan/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
            {isYoungChild ? "Perfect for You!" : "Personalized Recommendations"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="text-white/90 text-sm">
                {recommendation}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-white/70" />
            {isYoungChild ? "Make it Perfect!" : "Learning Preferences"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Content Difficulty</span>
              <span className="text-white">{profile.contentDifficulty}/10</span>
            </div>
            <Progress value={profile.contentDifficulty * 10} className="h-2" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className="border-wonderwhiz-cyan text-wonderwhiz-cyan"
            >
              {profile.learningStyle} learner
            </Badge>
            <Badge 
              variant="outline" 
              className="border-white/30 text-white/70"
            >
              Best at {profile.preferredTimeOfDay}
            </Badge>
            <Badge 
              variant="outline" 
              className="border-white/30 text-white/70"
            >
              {profile.optimalSessionLength}min sessions
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white/80 hover:bg-white/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizationDashboard;