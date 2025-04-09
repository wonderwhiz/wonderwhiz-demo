
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Star, Award, Sparkles } from 'lucide-react';

interface MemoryJourneyProps {
  childId?: string;
  pastCurios?: any[];
  onCurioClick?: (curio: any) => void;
}

const MemoryJourney: React.FC<MemoryJourneyProps> = ({
  childId,
  pastCurios = [],
  onCurioClick = () => {}
}) => {
  // Get recent achievements
  const recentAchievements = (pastCurios || [])
    .slice(0, 10)
    .filter(curio => curio?.title && curio.title.length < 30) // Keep titles short
    .map(curio => ({
      id: curio.id,
      title: curio.title,
      date: new Date(curio.created_at).toLocaleDateString(),
      category: getCategoryFromTitle(curio.title)
    }));
  
  // Simple category detection
  function getCategoryFromTitle(title: string): string {
    if (!title) return 'general';
    
    title = title.toLowerCase();
    if (title.includes('space') || title.includes('planet') || title.includes('star') || title.includes('galaxy')) return 'space';
    if (title.includes('animal') || title.includes('dog') || title.includes('cat') || title.includes('bird')) return 'animals';
    if (title.includes('science') || title.includes('experiment') || title.includes('energy')) return 'science';
    if (title.includes('history') || title.includes('ancient') || title.includes('past')) return 'history';
    if (title.includes('art') || title.includes('music') || title.includes('paint')) return 'arts';
    return 'general';
  }
  
  // Get category icon
  function getCategoryIcon(category: string) {
    switch(category) {
      case 'space': return '🚀';
      case 'animals': return '🦁';
      case 'science': return '🧪';
      case 'history': return '🏛️';
      case 'arts': return '🎨';
      default: return '🌟';
    }
  }
  
  if (!recentAchievements || recentAchievements.length === 0) {
    // Provide a welcome message when no achievements yet
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-none bg-gradient-to-br from-wonderwhiz-vibrant-yellow/30 to-wonderwhiz-bright-pink/20 overflow-hidden shadow-lg rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2 text-wonderwhiz-vibrant-yellow" />
              Knowledge Badges
            </h3>
            
            <div className="flex items-center justify-center py-8 px-4 text-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-wonderwhiz-purple/20 mx-auto flex items-center justify-center text-2xl animate-bounce-gentle">
                  ✨
                </div>
                <p className="mt-4 text-white font-medium">Your badges will appear here!</p>
                <p className="text-white/70 text-sm mt-2">Explore topics to earn magical knowledge badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-none bg-gradient-to-br from-wonderwhiz-vibrant-yellow/30 to-wonderwhiz-bright-pink/20 overflow-hidden shadow-lg rounded-xl">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-wonderwhiz-vibrant-yellow" />
            Knowledge Badges
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {recentAchievements.slice(0, 4).map((achievement, index) => (
              <motion.div
                key={achievement.id || index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center cursor-pointer hover:bg-white/15 transition-all duration-300 group"
                whileHover={{ scale: 1.03, y: -2 }}
                onClick={() => onCurioClick(pastCurios?.find(c => c.id === achievement.id) || {})}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wonderwhiz-vibrant-yellow to-wonderwhiz-gold flex items-center justify-center text-xl mr-3 shadow-glow-brand-yellow group-hover:animate-pulse-gentle">
                  {getCategoryIcon(achievement.category)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium line-clamp-1">{achievement.title}</p>
                  <p className="text-white/60 text-xs">{achievement.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MemoryJourney;
