import React from 'react';
import { motion } from 'framer-motion';
import { Home, Book, Trophy, Settings, User, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgeAdaptiveNavigationProps {
  childProfile: any;
  currentSection?: string;
  onNavigate: (section: string) => void;
}

const AgeAdaptiveNavigation: React.FC<AgeAdaptiveNavigationProps> = ({
  childProfile,
  currentSection = 'home',
  onNavigate
}) => {
  const age = childProfile?.age || 10;

  // 5-7 Years Navigation - Big, colorful, icon-focused
  if (age <= 7) {
    const items = [
      { id: 'home', icon: Home, label: 'Home', emoji: '🏠', color: 'bg-pink-500' },
      { id: 'learn', icon: Book, label: 'Learn', emoji: '📚', color: 'bg-blue-500' },
      { id: 'stars', icon: Trophy, label: 'Stars', emoji: '⭐', color: 'bg-yellow-500' }
    ];

    return (
      <div className="flex justify-center gap-4 p-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onNavigate(item.id)}
              className={`h-20 w-20 rounded-2xl border-4 border-white/30 font-bold text-white text-lg ${
                currentSection === item.id ? item.color : 'bg-white/20'
              } hover:${item.color}`}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">{item.emoji}</span>
                <span className="text-xs">{item.label}</span>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    );
  }

  // 8-11 Years Navigation - Balanced visual/text
  if (age <= 11) {
    const items = [
      { id: 'home', icon: Home, label: 'Dashboard' },
      { id: 'explore', icon: Search, label: 'Explore' },
      { id: 'achievements', icon: Trophy, label: 'Achievements' },
      { id: 'profile', icon: User, label: 'Profile' }
    ];

    return (
      <div className="flex justify-center gap-2 p-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onNavigate(item.id)}
              variant={currentSection === item.id ? 'default' : 'ghost'}
              className={`h-12 px-4 rounded-xl border border-white/20 ${
                currentSection === item.id 
                  ? 'bg-wonderwhiz-cyan text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          </motion.div>
        ))}
      </div>
    );
  }

  // 12-16 Years Navigation - Clean, mature design
  const items = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'explore', icon: Search, label: 'Explore' },
    { id: 'progress', icon: Sparkles, label: 'Progress' },
    { id: 'achievements', icon: Trophy, label: 'Achievements' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="border-b border-white/10 bg-[#1A0B2E]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-1">
            {items.map((item) => (
              <Button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                variant="ghost"
                size="sm"
                className={`h-10 px-3 rounded-md text-sm transition-colors ${
                  currentSection === item.id
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-white/70">
              {childProfile?.sparks_balance || 0} points
            </div>
            <div className="w-2 h-2 bg-wonderwhiz-cyan rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AgeAdaptiveNavigation;