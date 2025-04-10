
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Star, ArrowRight, Sparkles, Book, Map } from 'lucide-react';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KnowledgeJourneyProps {
  childId: string;
  childProfile: any;
  onTopicClick: (topic: string) => void;
}

const KnowledgeJourney: React.FC<KnowledgeJourneyProps> = ({
  childId,
  childProfile,
  onTopicClick
}) => {
  const { recentlyViewedTopics, strongestTopics, getPersonalizedSuggestions } = useChildLearningHistory(childId);
  
  // Define a consistent color palette
  const nodeColors = {
    strength: {
      bg: "bg-gradient-to-br from-amber-500/10 to-amber-600/10",
      iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
      icon: <Star className="h-4 w-4 text-amber-300" />,
      hover: "hover:border-amber-500/30"
    },
    recent: {
      bg: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      icon: <Book className="h-4 w-4 text-blue-300" />,
      hover: "hover:border-blue-500/30"
    },
    suggestion: {
      bg: "bg-gradient-to-br from-green-500/10 to-green-600/10",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      icon: <Compass className="h-4 w-4 text-green-300" />,
      hover: "hover:border-green-500/30"
    },
    interest: {
      bg: "bg-gradient-to-br from-purple-500/10 to-purple-600/10",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      icon: <Sparkles className="h-4 w-4 text-purple-300" />,
      hover: "hover:border-purple-500/30"
    }
  };
  
  // Combine data sources for a rich journey visualization
  const generateJourneyNodes = () => {
    const nodes = [];
    
    // Add strongest interests
    if (strongestTopics.length > 0) {
      strongestTopics.slice(0, 2).forEach(topic => {
        nodes.push({
          id: `strength-${topic.topic}`,
          type: 'strength',
          title: topic.topic,
          subtitle: 'Your strength'
        });
      });
    }
    
    // Add recent topics with recency info
    if (recentlyViewedTopics.length > 0) {
      recentlyViewedTopics.slice(0, 3).forEach((topic, index) => {
        nodes.push({
          id: `recent-${topic}`,
          type: 'recent',
          title: topic,
          subtitle: index === 0 ? 'Recently explored' : 'Previously explored'
        });
      });
    }
    
    // Add personalized suggestions as next steps
    const suggestions = getPersonalizedSuggestions().slice(0, 2);
    suggestions.forEach(suggestion => {
      nodes.push({
        id: `suggestion-${suggestion}`,
        type: 'suggestion',
        title: suggestion,
        subtitle: 'Recommended for you'
      });
    });
    
    // Add interests-based nodes
    if (childProfile?.interests && childProfile.interests.length > 0) {
      childProfile.interests.slice(0, 2).forEach(interest => {
        nodes.push({
          id: `interest-${interest}`,
          type: 'interest',
          title: interest,
          subtitle: 'Based on your interests'
        });
      });
    }
    
    return nodes;
  };
  
  const journeyNodes = generateJourneyNodes();

  const handleNodeClick = (node: any) => {
    // Handle clicks differently based on node type
    switch (node.type) {
      case 'strength':
        onTopicClick(`Tell me more about ${node.title}`);
        break;
      case 'recent':
        onTopicClick(`Continue learning about ${node.title}`);
        break;
      case 'suggestion':
        onTopicClick(node.title);
        break;
      case 'interest':
        onTopicClick(`Show me something fascinating about ${node.title}`);
        break;
      default:
        onTopicClick(node.title);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-indigo-600/10 to-indigo-800/10 backdrop-blur-sm rounded-xl border border-indigo-600/20 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500/30 to-indigo-700/30 flex items-center justify-center mr-3">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Knowledge Journey</h3>
            <p className="text-sm text-white/60">Your path of discovery</p>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-white/10 text-white/90 border-white/20">
          {journeyNodes.length} pathways
        </Badge>
      </div>
      
      {/* Knowledge journey visualization - simplified & beautiful */}
      <div className="space-y-3 relative">
        {journeyNodes.length === 0 ? (
          <div className="text-center py-6 text-white/60">
            <p>Start your learning journey by exploring topics!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {journeyNodes.map((node) => (
              <motion.div 
                key={node.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={cn(
                    "overflow-hidden border-white/10",
                    nodeColors[node.type as keyof typeof nodeColors].bg,
                    nodeColors[node.type as keyof typeof nodeColors].hover,
                    "transition-all cursor-pointer group"
                  )}
                  onClick={() => handleNodeClick(node)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={cn("p-2 rounded-full mr-3", nodeColors[node.type as keyof typeof nodeColors].iconBg)}>
                          {nodeColors[node.type as keyof typeof nodeColors].icon}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-white group-hover:text-white/90">{node.title}</h4>
                          <p className="text-xs text-white/60">{node.subtitle}</p>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full mt-3 text-white/70 hover:text-white hover:bg-white/10"
        onClick={() => onTopicClick("Suggest a new topic for me to learn about")}
      >
        <Compass className="mr-2 h-4 w-4" />
        <span>Discover new paths</span>
      </Button>
    </motion.div>
  );
};

export default KnowledgeJourney;
