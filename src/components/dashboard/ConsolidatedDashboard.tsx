
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Compass, BookOpen, Lightbulb, Map, Calendar } from 'lucide-react';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import CurioSuggestion from '@/components/CurioSuggestion';
import SparksOverview from '@/components/SparksOverview';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Helper function to determine card type from suggestion
const getCardTypeForSuggestion = (suggestion: string): 'space' | 'animals' | 'science' | 'history' | 'technology' | 'general' => {
  suggestion = suggestion.toLowerCase();
  if (suggestion.includes('space')) return 'space';
  if (suggestion.includes('animal')) return 'animals';
  if (suggestion.includes('science')) return 'science';
  if (suggestion.includes('history')) return 'history';
  if (suggestion.includes('technology')) return 'technology';
  return 'general';
};

// De-duplicate suggestions to ensure uniqueness
const dedupeSuggestions = (suggestions: string[]): string[] => {
  const seen = new Set<string>();
  return suggestions.filter(suggestion => {
    const lowercase = suggestion.toLowerCase();
    if (seen.has(lowercase)) return false;
    seen.add(lowercase);
    return true;
  });
};

interface ConsolidatedDashboardProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  handleRefreshSuggestions: () => void;
  pastCurios: any[];
  sparksBalance: number;
  streakDays: number;
}

const ConsolidatedDashboard: React.FC<ConsolidatedDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions = [],
  isLoadingSuggestions = false,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios = [],
  sparksBalance,
  streakDays
}) => {
  const [activeTab, setActiveTab] = useState<'wonders' | 'journey'>('wonders');
  const { recentlyViewedTopics, strongestTopics } = useChildLearningHistory(childId);
  
  // Ensure suggestions are unique
  const uniqueSuggestions = dedupeSuggestions(curioSuggestions);
  
  // Main container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto px-4 py-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Dashboard Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={activeTab === 'wonders' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('wonders')}
          className={cn(
            "rounded-full",
            activeTab === 'wonders' 
              ? "bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          <Compass className="w-4 h-4 mr-2" />
          Wonder Journeys
        </Button>
        <Button
          variant={activeTab === 'journey' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('journey')}
          className={cn(
            "rounded-full",
            activeTab === 'journey' 
              ? "bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/90 text-wonderwhiz-deep-purple" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          <Map className="w-4 h-4 mr-2" />
          Your Progress
        </Button>
      </div>
      
      {/* Active Tab Content */}
      {activeTab === 'wonders' && (
        <>
          {/* Wonder Journeys Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center mr-3">
                  <Compass className="h-4 w-4 text-wonderwhiz-bright-pink" />
                </div>
                <h2 className="text-xl font-bold text-white font-nunito">Discover New Wonders</h2>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/5 hover:bg-white/10 text-white rounded-full h-8 w-8"
                onClick={handleRefreshSuggestions}
                disabled={isLoadingSuggestions}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {uniqueSuggestions.slice(0, 3).map((suggestion, index) => (
                <motion.div
                  key={`suggestion-${index}`}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <CurioSuggestion
                    suggestion={suggestion}
                    onClick={() => onCurioSuggestionClick(suggestion)}
                    type={getCardTypeForSuggestion(suggestion)}
                    loading={isLoadingSuggestions}
                    index={index}
                    profileId={childId}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Explorations */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-wonderwhiz-blue-accent/20 flex items-center justify-center mr-3">
                  <BookOpen className="h-4 w-4 text-wonderwhiz-blue-accent" />
                </div>
                <h2 className="text-xl font-bold text-white font-nunito">Your Recent Explorations</h2>
              </div>
              
              <Badge className="bg-wonderwhiz-blue-accent/20 text-wonderwhiz-blue-accent border-wonderwhiz-blue-accent/20">
                <Calendar className="h-3 w-3 mr-1" /> Last 7 days
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastCurios.slice(0, 3).map((curio, index) => (
                <motion.div 
                  key={`curio-${curio.id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card 
                    className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer overflow-hidden"
                    onClick={() => onCurioSuggestionClick(curio.query || curio.title)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-white/10 p-2 rounded-full mr-3">
                          <Lightbulb className="h-4 w-4 text-wonderwhiz-gold" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white line-clamp-2">{curio.title}</h4>
                          <p className="text-xs text-white/60 mt-1">
                            {new Date(curio.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* More Suggestions - Different from the top ones */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-wonderwhiz-gold/20 flex items-center justify-center mr-3">
                  <Lightbulb className="h-4 w-4 text-wonderwhiz-gold" />
                </div>
                <h2 className="text-xl font-bold text-white font-nunito">More to Explore</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {uniqueSuggestions.slice(3, 5).map((suggestion, index) => (
                <motion.div
                  key={`more-suggestion-${index}`}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <CurioSuggestion
                    suggestion={suggestion}
                    onClick={() => onCurioSuggestionClick(suggestion)}
                    type={getCardTypeForSuggestion(suggestion)}
                    loading={isLoadingSuggestions}
                    index={index + 3}
                    profileId={childId}
                    // Remove the variant prop as it doesn't exist in the CurioSuggestion interface
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
      
      {activeTab === 'journey' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Overview */}
          <motion.div variants={itemVariants}>
            <SparksOverview 
              childId={childId} 
              sparksBalance={sparksBalance}
            />
          </motion.div>
          
          {/* Learning Strengths */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-glow-sm">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-white font-nunito flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-wonderwhiz-cyan" />
                  Your Learning Strengths
                </h3>
                
                <div className="space-y-3">
                  {strongestTopics.length > 0 ? (
                    strongestTopics.slice(0, 3).map((topic, index) => (
                      <div 
                        key={`topic-${index}`}
                        className="bg-white/10 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-wonderwhiz-cyan/20 mr-3">
                            <Lightbulb className="h-4 w-4 text-wonderwhiz-cyan" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{topic.topic}</div>
                            <div className="text-xs text-white/60">You've explored this {topic.level} times</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/60 text-center py-4">
                      Start exploring to build your strengths!
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full text-wonderwhiz-cyan hover:text-white hover:bg-wonderwhiz-cyan/20"
                  onClick={() => window.location.href = `/profile/${childId}`}
                >
                  View Complete Journey
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ConsolidatedDashboard;
