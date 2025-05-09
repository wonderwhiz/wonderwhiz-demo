
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sparkles, Rocket } from 'lucide-react';

interface WelcomeViewProps {
  userName?: string;
  childId?: string;
  childProfile?: any;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ 
  userName = 'Explorer', 
  childId,
  childProfile
}) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-nunito">
          {getTimeBasedGreeting()}, {userName}!
        </h2>
        <p className="text-white/70 text-lg">
          What would you like to explore today?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="bg-gradient-to-br from-wonderwhiz-pink/20 to-wonderwhiz-purple/20 backdrop-blur-md border-white/10 overflow-hidden">
          <div className="p-6 text-center">
            <div className="mx-auto bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-wonderwhiz-vibrant-yellow" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Begin a Wonder Journey</h3>
            <p className="text-white/70">
              Discover amazing facts and fascinating knowledge about any topic you can imagine!
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20 backdrop-blur-md border-white/10 overflow-hidden">
          <div className="p-6 text-center">
            <div className="mx-auto bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Rocket className="h-8 w-8 text-wonderwhiz-cyan" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Complete Challenges</h3>
            <p className="text-white/70">
              Take on fun learning activities and collect sparks to level up your profile!
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default WelcomeView;
