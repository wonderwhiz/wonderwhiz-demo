
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Map, Award, Star, Clock } from 'lucide-react';

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
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        <Card className="border-none bg-gradient-to-br from-wonderwhiz-cyan/30 to-wonderwhiz-bright-pink/10 overflow-hidden shadow-2xl rounded-xl backdrop-blur-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-wonderwhiz-cyan/30 flex items-center justify-center mr-3 shadow-glow-brand-cyan">
                <Map className="h-5 w-5 text-white" />
              </div>
              Time Capsule
            </h3>
            
            <div className="flex items-center justify-center py-10 px-4 text-center">
              <div>
                <motion.div 
                  className="w-20 h-20 rounded-full bg-wonderwhiz-deep-purple/50 mx-auto flex items-center justify-center text-3xl"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ⏳
                </motion.div>
                <h4 className="mt-4 text-white text-lg font-medium">Begin Your Journey</h4>
                <p className="text-white/70 text-sm mt-2">Your discoveries will be stored here</p>
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
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      <Card className="border-none bg-gradient-to-br from-wonderwhiz-cyan/30 to-wonderwhiz-bright-pink/10 overflow-hidden shadow-2xl rounded-xl backdrop-blur-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
            <div className="w-10 h-10 rounded-full bg-wonderwhiz-cyan/30 flex items-center justify-center mr-3 shadow-glow-brand-cyan">
              <Map className="h-5 w-5 text-white" />
            </div>
            Time Capsule
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {recentAchievements.slice(0, 3).map((achievement, index) => (
              <motion.div
                key={achievement.id || index}
                className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden cursor-pointer group relative"
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => onCurioClick(pastCurios?.find(c => c.id === achievement.id) || {})}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform-gpu" style={{ backgroundSize: '200% 100%', animation: 'shine 1.5s infinite' }}></div>
                
                <div className="p-4 flex items-start">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-wonderwhiz-bright-pink/40 to-wonderwhiz-gold/60 flex items-center justify-center text-2xl mr-4 shadow-glow-brand-gold transform group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(achievement.category)}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white text-lg font-medium line-clamp-1">{achievement.title}</h4>
                    
                    <div className="flex items-center mt-2">
                      <div className="flex items-center text-white/60 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{achievement.date}</span>
                      </div>
                      
                      <div className="ml-3 flex">
                        {[1, 2, 3].map((star) => (
                          <motion.div 
                            key={star}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * (index + star) }}
                          >
                            <Star className={`h-3.5 w-3.5 ${star <= 2 ? 'text-wonderwhiz-gold' : 'text-white/20'}`} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white opacity-0 group-hover:opacity-100"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BookOpen className="h-4 w-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
            
            {recentAchievements.length > 3 && (
              <motion.button
                className="w-full text-center py-3 text-white/70 hover:text-white text-sm flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View all memories</span>
                <Award className="ml-2 h-3.5 w-3.5" />
              </motion.button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MemoryJourney;
