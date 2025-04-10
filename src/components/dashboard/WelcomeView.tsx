
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import MagicalSearchBar from './MagicalSearchBar';
import { Card, CardContent } from '@/components/ui/card';
import CurioSuggestion from '@/components/CurioSuggestion';

interface WelcomeViewProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  pastCurios: any[];
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  pastCurios,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  onCurioSuggestionClick
}) => {
  // Format recent queries for search history
  const recentQueries = pastCurios
    .slice(0, 3)
    .map(curio => curio.query || curio.title)
    .filter(Boolean);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = childProfile?.name || 'Explorer';
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center"
    >
      {/* Header - Simple greeting */}
      <motion.div 
        variants={itemVariants}
        className="mb-6 text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-nunito font-bold text-white">{getGreeting()}</h1>
        <p className="text-white/70 mt-1">What would you like to discover today?</p>
      </motion.div>
      
      {/* Search Experience - The central focus */}
      <motion.div variants={itemVariants} className="w-full mb-12">
        <MagicalSearchBar
          query={query}
          setQuery={setQuery}
          handleSubmitQuery={handleSubmitQuery}
          isGenerating={isGenerating}
          recentQueries={recentQueries}
          autoFocus={true}
        />
      </motion.div>
      
      {/* Curio Suggestions - Simplified with gentle animation */}
      {curioSuggestions.length > 0 && (
        <motion.div variants={itemVariants} className="w-full">
          <div className="flex items-center mb-4">
            <div className="w-7 h-7 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center mr-2">
              <Compass className="h-4 w-4 text-wonderwhiz-bright-pink" />
            </div>
            <h2 className="text-lg font-bold text-white font-nunito">Wonder Journeys</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {curioSuggestions.slice(0, 3).map((suggestion, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <CurioSuggestion
                  suggestion={suggestion}
                  onClick={() => onCurioSuggestionClick(suggestion)}
                  type="general"
                  index={index}
                  profileId={childId}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Recent journeys - Simple card view */}
      {pastCurios.length > 0 && (
        <motion.div variants={itemVariants} className="w-full mt-8">
          <div className="flex items-center mb-4">
            <div className="w-7 h-7 rounded-full bg-wonderwhiz-vibrant-yellow/20 flex items-center justify-center mr-2">
              <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
            </div>
            <h2 className="text-lg font-bold text-white font-nunito">Recent Discoveries</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastCurios.slice(0, 3).map((curio, index) => (
              <motion.div
                key={curio.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card 
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 h-full cursor-pointer"
                  onClick={() => {
                    // Navigate to curio
                    window.location.href = `/curio/${childId}/${curio.id}`;
                  }}
                >
                  <CardContent className="p-4">
                    <h3 className="text-white font-medium line-clamp-2 mb-2">{curio.title}</h3>
                    <p className="text-white/60 text-sm">
                      {new Date(curio.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WelcomeView;
