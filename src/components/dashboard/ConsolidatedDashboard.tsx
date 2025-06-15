import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Compass, BookOpen, Lightbulb, Map, Calendar, ArrowRight } from 'lucide-react';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import SparksOverview from '@/components/SparksOverview';
import { cn } from '@/lib/utils';
import DynamicWonderSuggestions from './DynamicWonderSuggestions';
import ParentTasksSection from './ParentTasksSection';
import StreamlinedDashboard from './StreamlinedDashboard';

const getCardTypeForSuggestion = (suggestion: string): 'space' | 'animals' | 'science' | 'history' | 'technology' | 'general' => {
  suggestion = suggestion.toLowerCase();
  if (suggestion.includes('space')) return 'space';
  if (suggestion.includes('animal')) return 'animals';
  if (suggestion.includes('science')) return 'science';
  if (suggestion.includes('history')) return 'history';
  if (suggestion.includes('technology')) return 'technology';
  return 'general';
};

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
  onLike?: (blockId: string) => Promise<boolean>;
  onBookmark?: (blockId: string) => Promise<boolean>;
  onReply?: (blockId: string, message: string) => Promise<boolean>;
  onReadAloud?: (text: string) => () => void;
  likedBlocks?: Record<string, boolean>;
  bookmarkedBlocks?: Record<string, boolean>;
  onImageCapture?: (file: File) => void;
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
  streakDays,
  onImageCapture
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'explore' | 'progress'>('explore');
  const {
    recentlyViewedTopics,
    strongestTopics
  } = useChildLearningHistory(childId);

  const uniqueSuggestions = dedupeSuggestions(curioSuggestions);

  // Convert recent curios to the format expected by StreamlinedDashboard
  const recentTopics = pastCurios.slice(0, 3).map(curio => ({
    id: curio.id,
    title: curio.title,
    progress: Math.floor(Math.random() * 60) + 20, // Simulated progress - replace with real data
    lastAccessed: curio.created_at
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      {/* Tab Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button 
          variant={activeTab === 'explore' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => setActiveTab('explore')} 
          className={cn(
            "rounded-full", 
            activeTab === 'explore' 
              ? "bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          <Compass className="w-4 h-4 mr-2" />
          Explore
        </Button>
        <Button 
          variant={activeTab === 'progress' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => setActiveTab('progress')} 
          className={cn(
            "rounded-full", 
            activeTab === 'progress' 
              ? "bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/90 text-wonderwhiz-deep-purple" 
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          <Map className="w-4 h-4 mr-2" />
          Your Journey
        </Button>
      </div>
      
      {activeTab === 'explore' && (
        <StreamlinedDashboard
          childProfile={childProfile}
          onSearch={onCurioSuggestionClick}
          onImageCapture={onImageCapture}
          recentTopics={recentTopics}
          suggestedTopics={uniqueSuggestions}
          streakDays={streakDays}
          sparksBalance={sparksBalance}
        />
      )}

      {activeTab === 'progress' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <SparksOverview childId={childId} sparksBalance={sparksBalance} />
          </motion.div>
          
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
                      <div key={`topic-${index}`} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-wonderwhiz-cyan/20 mr-3">
                            <Lightbulb className="h-4 w-4 text-wonderwhiz-cyan" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{topic.topic}</div>
                            <div className="text-xs text-white/60">
                              You've explored this {topic.level} times
                            </div>
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
              </CardContent>
            </Card>
          </motion.div>
          
        </div>
      )}
    </motion.div>
  );
};

export default ConsolidatedDashboard;
