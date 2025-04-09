
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmartDashboard from './SmartDashboard';
import { Sparkles, Star, Lightbulb, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedMascot from './AnimatedMascot';
import { Button } from '@/components/ui/button';

interface WelcomeSectionProps {
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  handleRefreshSuggestions: () => void;
  handleCurioSuggestionClick: (suggestion: string) => void;
  childProfile: any;
  pastCurios: any[];
  childId: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  curioSuggestions,
  isLoadingSuggestions,
  handleRefreshSuggestions,
  handleCurioSuggestionClick,
  childProfile,
  pastCurios,
  childId
}) => {
  const [showGlobe, setShowGlobe] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get greeting based on time of day and child profile
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = childProfile?.name || 'Explorer';
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // Get a fun message based on time or randomized
  const getFunMessage = () => {
    const messages = [
      "What will you discover today?",
      "Your wonder journey awaits",
      "Ready for amazing discoveries?",
      "What are you curious about?",
      "Let's explore something magical"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const focusSearchInput = () => {
    // Find the input field using a ref that will be passed to the search component
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      // Fallback - attempt to find a text input if the ref isn't working
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-8 px-4 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-wonderwhiz-bright-pink/10 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-wonderwhiz-vibrant-yellow/10 blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="space-y-10">
          {/* Main greeting section */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            variants={itemVariants}
          >
            <div className="flex items-center gap-4">
              <AnimatedMascot 
                childName={childProfile?.name} 
                streakDays={childProfile?.streak_days}
              />
              
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {getGreeting()}
                </h1>
                <p className="text-white/80 mt-1 font-light text-lg">
                  {getFunMessage()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {childProfile?.streak_days > 0 && (
                <Badge variant="outline" className="bg-wonderwhiz-bright-pink/10 text-wonderwhiz-bright-pink border-wonderwhiz-bright-pink/20 flex items-center gap-1.5 px-3 py-1.5 text-sm">
                  <Star className="h-4 w-4" />
                  <span>{childProfile.streak_days} day streak!</span>
                </Badge>
              )}
              
              <div className="flex items-center gap-1.5 px-4 py-1.5 bg-wonderwhiz-gold/10 border border-wonderwhiz-gold/20 rounded-full">
                <Sparkles className="h-4 w-4 text-wonderwhiz-gold" />
                <span className="text-wonderwhiz-gold font-medium">
                  {childProfile?.sparks_balance || 0}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Toggle for Wonder Globe - the "wow" feature */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center"
          >
            <Button
              variant="ghost"
              className="bg-wonderwhiz-bright-pink/10 hover:bg-wonderwhiz-bright-pink/20 text-white rounded-full px-5 py-2 border border-wonderwhiz-bright-pink/20"
              onClick={() => setShowGlobe(prev => !prev)}
            >
              <MapPin className="h-4 w-4 mr-2" />
              <span>{showGlobe ? 'Hide' : 'Show'} Wonder Globe</span>
            </Button>
          </motion.div>

          {/* Wonder Globe - Breakthrough "Wow" Feature */}
          <AnimatePresence>
            {showGlobe && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="relative h-60 md:h-80 my-4 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Globe background glow */}
                    <div className="absolute inset-0 rounded-full bg-wonderwhiz-bright-pink/20 blur-2xl animate-pulse-gentle"></div>
                    
                    {/* Globe */}
                    <motion.div 
                      className="w-40 h-40 md:w-60 md:h-60 bg-wonderwhiz-deep-purple/80 rounded-full border border-white/20 relative overflow-hidden shadow-2xl"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Knowledge points */}
                      {pastCurios.slice(0, 10).map((curio, index) => (
                        <motion.div
                          key={curio.id || index}
                          className="absolute w-3 h-3 bg-wonderwhiz-bright-pink rounded-full shadow-glow-brand-pink"
                          style={{
                            left: `${30 + Math.random() * 40}%`,
                            top: `${20 + Math.random() * 60}%`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1.2, 1],
                            opacity: 1
                          }}
                          transition={{ 
                            delay: index * 0.2,
                            duration: 1
                          }}
                        />
                      ))}
                      
                      {/* Globe knowledge connections */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                        <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none">
                          {pastCurios.slice(0, 5).map((_, i) => (
                            <motion.path
                              key={i}
                              d={`M${80 + Math.random() * 40},${70 + Math.random() * 60} Q${100 + (Math.random() * 40 - 20)},${60 + (Math.random() * 80 - 40)} ${80 + Math.random() * 40},${70 + Math.random() * 60}`}
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{ delay: 0.5 + i * 0.3, duration: 2 }}
                            />
                          ))}
                        </g>
                      </svg>
                      
                      {/* Globe continents */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute w-20 h-12 rounded-full bg-wonderwhiz-cyan blur-md" style={{ left: '30%', top: '30%' }}></div>
                        <div className="absolute w-24 h-16 rounded-full bg-wonderwhiz-vibrant-yellow blur-md" style={{ right: '20%', top: '50%' }}></div>
                        <div className="absolute w-16 h-14 rounded-full bg-wonderwhiz-bright-pink blur-md" style={{ left: '40%', bottom: '20%' }}></div>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <h3 className="text-white font-medium px-4 py-2 bg-black/30 rounded-full w-max mx-auto backdrop-blur-sm">
                    Your Knowledge Universe
                  </h3>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div variants={itemVariants}>
            <SmartDashboard
              childId={childId}
              childProfile={childProfile}
              curioSuggestions={curioSuggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              onCurioSuggestionClick={handleCurioSuggestionClick}
              handleRefreshSuggestions={handleRefreshSuggestions}
              pastCurios={pastCurios}
            />
          </motion.div>
          
          {/* "Ask anything" focus section always visible at bottom */}
          <motion.div 
            variants={itemVariants}
            className="py-4 flex justify-center"
          >
            <Button
              variant="outline"
              className="bg-white/5 hover:bg-white/10 text-white/80 border-white/10 rounded-full flex items-center gap-2 group"
              onClick={focusSearchInput}
            >
              <Lightbulb className="h-4 w-4 text-wonderwhiz-gold group-hover:animate-pulse-gentle" />
              <span>Ask me anything!</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;
