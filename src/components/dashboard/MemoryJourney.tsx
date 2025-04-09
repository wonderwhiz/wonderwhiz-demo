
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Star, Award } from 'lucide-react';

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
  
  if (recentAchievements.length === 0) {
    // Provide a welcome message when no achievements yet
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-white/10 bg-gradient-to-br from-wonderwhiz-gold/20 to-wonderwhiz-bright-pink/10 overflow-hidden border-none rounded-xl">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2 text-wonderwhiz-gold" />
              Knowledge Badges
            </h3>
            
            <div className="flex items-center justify-center py-6 px-4 text-center">
              <div>
                <div className="w-14 h-14 rounded-full bg-wonderwhiz-purple/20 mx-auto flex items-center justify-center text-2xl">
                  ✨
                </div>
                <p className="mt-3 text-white font-medium">Your badges will appear here!</p>
                <p className="text-white/60 text-sm mt-1">Explore topics to earn knowledge badges</p>
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
      <Card className="border-white/10 bg-gradient-to-br from-wonderwhiz-gold/20 to-wonderwhiz-bright-pink/10 overflow-hidden border-none rounded-xl">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Award className="h-5 w-5 mr-2 text-wonderwhiz-gold" />
            Knowledge Badges
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {recentAchievements.slice(0, 4).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="bg-white/10 rounded-lg p-2 flex items-center cursor-pointer hover:bg-white/15 transition-colors"
                whileHover={{ scale: 1.03 }}
                onClick={() => onCurioClick(pastCurios.find(c => c.id === achievement.id))}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wonderwhiz-vibrant-yellow to-wonderwhiz-gold flex items-center justify-center text-xl mr-3">
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
