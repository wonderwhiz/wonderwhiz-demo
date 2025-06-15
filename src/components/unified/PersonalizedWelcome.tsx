
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Trophy, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PersonalizedWelcomeProps {
  childName: string;
  childAge: number;
  streakDays: number;
  sparksBalance: number;
}

const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({
  childName,
  childAge,
  streakDays,
  sparksBalance
}) => {
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    
    if (childAge <= 8) {
      return `Good ${timeOfDay}, ${childName}! Ready for an adventure? 🌟`;
    } else if (childAge <= 12) {
      return `Hey ${childName}! What amazing things will you discover today? ✨`;
    } else {
      return `Welcome back, ${childName}! Ready to explore something incredible? 🚀`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="bg-white shadow-lg border-2 border-gray-200 rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {getWelcomeMessage()}
              </h1>
              <p className="text-white/95 text-lg font-medium">
                {childAge <= 8 
                  ? "Let's learn something amazing together!" 
                  : "Your curiosity is your superpower!"
                }
              </p>
            </div>
            
            <div className="hidden md:block">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl"
              >
                {childAge <= 8 ? "🌟" : childAge <= 12 ? "🚀" : "⚡"}
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{sparksBalance}</div>
                  <div className="text-sm text-gray-600 font-medium">Sparks</div>
                </div>
              </div>
              
              {streakDays > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{streakDays}</div>
                    <div className="text-sm text-gray-600 font-medium">Day Streak!</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 font-medium">Today</div>
              <div className="text-lg font-bold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PersonalizedWelcome;
