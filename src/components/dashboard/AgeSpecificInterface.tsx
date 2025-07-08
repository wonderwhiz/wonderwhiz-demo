import React from 'react';
import { motion } from 'framer-motion';
import { Star, Rocket, Trophy, Brain, Target, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgeSpecificInterfaceProps {
  childProfile: any;
  onStartLearning: (topic: string) => void;
  streakDays: number;
  sparksBalance: number;
}

// 5-7 Years Interface Component
const YoungChildInterface: React.FC<AgeSpecificInterfaceProps> = ({
  childProfile,
  onStartLearning,
  streakDays,
  sparksBalance
}) => {
  const suggestions = [
    { topic: 'Why do dogs wag their tails?', emoji: '🐕', color: 'bg-pink-500' },
    { topic: 'How do flowers grow?', emoji: '🌸', color: 'bg-green-500' },
    { topic: 'What makes rainbows?', emoji: '🌈', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Big Welcome Card */}
      <Card className="bg-[#1A0B2E] border-4 border-wonderwhiz-bright-pink/80">
        <CardContent className="p-8 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            🚀
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Hi {childProfile?.name}!
          </h1>
          <p className="text-2xl text-white/90">
            Ready to learn something cool?
          </p>
        </CardContent>
      </Card>

      {/* Stars Progress */}
      <Card className="bg-[#1A0B2E] border-4 border-wonderwhiz-vibrant-yellow/80">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            {Array.from({ length: Math.min(sparksBalance / 10, 10) }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
              >
                <Star className="h-8 w-8 text-wonderwhiz-vibrant-yellow fill-current mx-1" />
              </motion.div>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            You have {sparksBalance} sparks! ✨
          </h3>
          {streakDays > 1 && (
            <p className="text-xl text-white/80">
              🔥 {streakDays} days in a row!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Big Learning Buttons */}
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.topic}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Button
              onClick={() => onStartLearning(suggestion.topic)}
              className={`w-full h-20 text-xl font-bold ${suggestion.color} hover:scale-105 transition-transform rounded-2xl border-4 border-white/30`}
            >
              <span className="text-4xl mr-4">{suggestion.emoji}</span>
              {suggestion.topic}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 8-11 Years Interface Component
const MiddleChildInterface: React.FC<AgeSpecificInterfaceProps> = ({
  childProfile,
  onStartLearning,
  streakDays,
  sparksBalance
}) => {
  const suggestions = [
    { topic: 'How do rockets reach space?', icon: Rocket, category: 'Science' },
    { topic: 'Why do we have different seasons?', icon: Star, category: 'Nature' },
    { topic: 'How do computers work?', icon: Brain, category: 'Technology' }
  ];

  return (
    <div className="space-y-6">
      {/* Balanced Welcome */}
      <Card className="bg-[#1A0B2E] border-2 border-wonderwhiz-cyan/60">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-5xl"
            >
              🌟
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {childProfile?.name}!
              </h1>
              <p className="text-white/80 text-lg">
                What adventure awaits today?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Progress */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#1A0B2E] border-2 border-wonderwhiz-bright-pink/60">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-wonderwhiz-vibrant-yellow mx-auto mb-2" />
            <p className="text-white font-medium">{sparksBalance} Sparks</p>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div 
                className="bg-wonderwhiz-vibrant-yellow h-2 rounded-full"
                style={{ width: `${Math.min((sparksBalance / 100) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A0B2E] border-2 border-orange-500/60">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <p className="text-white font-medium">
              {streakDays > 1 ? `${streakDays} Day Streak!` : 'Start Your Streak!'}
            </p>
            <div className="flex justify-center mt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full mx-0.5 ${
                    i < streakDays ? 'bg-orange-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Options */}
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <Card className="bg-[#1A0B2E] border-2 border-white/20 hover:border-wonderwhiz-cyan/60 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <Button
                  onClick={() => onStartLearning(suggestion.topic)}
                  variant="ghost"
                  className="w-full justify-start h-auto p-0 text-white hover:bg-transparent"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-wonderwhiz-cyan/20 p-3 rounded-xl">
                      <suggestion.icon className="h-6 w-6 text-wonderwhiz-cyan" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{suggestion.topic}</h3>
                      <p className="text-white/60 text-sm">{suggestion.category}</p>
                    </div>
                    <div className="ml-auto">
                      <Target className="h-5 w-5 text-white/40" />
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 12-16 Years Interface Component
const TeenInterface: React.FC<AgeSpecificInterfaceProps> = ({
  childProfile,
  onStartLearning,
  streakDays,
  sparksBalance
}) => {
  const suggestions = [
    { topic: 'How does artificial intelligence work?', category: 'Technology', difficulty: 'Advanced' },
    { topic: 'What causes climate change?', category: 'Environment', difficulty: 'Intermediate' },
    { topic: 'How do vaccines protect us?', category: 'Biology', difficulty: 'Advanced' }
  ];

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <Card className="bg-[#1A0B2E] border border-wonderwhiz-purple/40">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Good to see you, {childProfile?.name}
              </h1>
              <p className="text-white/70 mt-1">
                Continue your learning journey
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-wonderwhiz-cyan">
                {sparksBalance}
              </div>
              <div className="text-white/60 text-sm">Learning Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#1A0B2E] border border-wonderwhiz-cyan/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Streak</p>
                <p className="text-xl font-semibold text-white">{streakDays} days</p>
              </div>
              <Zap className="h-5 w-5 text-wonderwhiz-cyan" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A0B2E] border border-wonderwhiz-vibrant-yellow/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Progress</p>
                <p className="text-xl font-semibold text-white">78%</p>
              </div>
              <Target className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A0B2E] border border-wonderwhiz-bright-pink/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Rank</p>
                <p className="text-xl font-semibold text-white">#15</p>
              </div>
              <Trophy className="h-5 w-5 text-wonderwhiz-bright-pink" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Learning Options */}
      <Card className="bg-[#1A0B2E] border border-white/20">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recommended Topics
          </h2>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.topic}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Button
                  onClick={() => onStartLearning(suggestion.topic)}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 text-white hover:bg-white/10 border border-transparent hover:border-white/20 rounded-lg"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <h3 className="font-medium">{suggestion.topic}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-wonderwhiz-purple/30 text-wonderwhiz-purple rounded">
                          {suggestion.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded">
                          {suggestion.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-xs text-white/60">Est. 15 min</div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Age-Specific Interface Component
const AgeSpecificInterface: React.FC<AgeSpecificInterfaceProps> = (props) => {
  const age = props.childProfile?.age || 10;

  if (age <= 7) {
    return <YoungChildInterface {...props} />;
  } else if (age <= 11) {
    return <MiddleChildInterface {...props} />;
  } else {
    return <TeenInterface {...props} />;
  }
};

export default AgeSpecificInterface;