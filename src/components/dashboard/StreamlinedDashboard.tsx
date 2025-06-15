import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Sparkles, Star, Clock, Trophy, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MagicalSearchBar from './MagicalSearchBar';
import { useNavigate } from 'react-router-dom';

interface StreamlinedDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
  onImageCapture?: (file: File) => void;
  recentTopics?: Array<{
    id: string;
    title: string;
    progress: number;
    lastAccessed: string;
  }>;
  suggestedTopics?: string[];
  streakDays: number;
  sparksBalance: number;
}

const StreamlinedDashboard: React.FC<StreamlinedDashboardProps> = ({
  childProfile,
  onSearch,
  onImageCapture,
  recentTopics = [],
  suggestedTopics = [],
  streakDays,
  sparksBalance
}) => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Navigate directly to encyclopedia with the query
      navigate(`/wonderwhiz/${childProfile?.id}?topic=${encodeURIComponent(query)}`);
      onSearch(query);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    navigate(`/wonderwhiz/${childProfile?.id}?topic=${encodeURIComponent(topic)}`);
  };

  const handleRecentTopicClick = (topicId: string) => {
    navigate(`/wonderwhiz/${childProfile?.id}?topicId=${topicId}`);
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Search Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            What sparks your curiosity today?
          </h1>
          <p className="text-white/70 text-lg">
            Discover amazing topics in our interactive encyclopedia
          </p>
        </div>
        
        <MagicalSearchBar
          onSearch={handleSearch}
          childProfile={childProfile}
          isLoading={isSearching}
          placeholder="Search for any topic or ask a question..."
          onImageCapture={onImageCapture}
          size="lg"
        />
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="flex justify-center gap-6 mb-8">
        <Card className="bg-white/10 border-white/20 px-4 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-wonderwhiz-bright-pink" />
            <span className="text-white font-semibold">{sparksBalance} Sparks</span>
          </div>
        </Card>
        
        {streakDays > 0 && (
          <Card className="bg-white/10 border-white/20 px-4 py-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-semibold">{streakDays} day streak!</span>
            </div>
          </Card>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        {recentTopics.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-wonderwhiz-cyan" />
                    Continue Learning
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {recentTopics.slice(0, 3).map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleRecentTopicClick(topic.id)}
                      className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium group-hover:text-wonderwhiz-bright-pink transition-colors">
                            {topic.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-wonderwhiz-bright-pink rounded-full transition-all duration-300"
                                style={{ width: `${topic.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/60">{topic.progress}%</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Suggested Topics */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Book className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
                  Explore New Topics
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {suggestedTopics.slice(0, 6).map((topic, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleTopicClick(topic)}
                    className="justify-start text-left h-auto p-3 bg-white/5 hover:bg-white/15 text-white/90 hover:text-white transition-all duration-200"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{topic}</span>
                      <ArrowRight className="h-3 w-3 text-white/40" />
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Access */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card className="bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-vibrant-yellow/20 border-wonderwhiz-bright-pink/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Ready for a Learning Adventure?
                </h3>
                <p className="text-white/80">
                  Browse our full encyclopedia or let us surprise you with something amazing!
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate(`/wonderwhiz/${childProfile?.id}`)}
                  className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Browse Encyclopedia
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StreamlinedDashboard;
