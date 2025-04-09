
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Star, ArrowRight, Sparkles, Book } from 'lucide-react';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { recentlyViewedTopics, strongestTopics, getPersonalizedSuggestions } = useChildLearningHistory(childId);
  const [journeyNodes, setJourneyNodes] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate knowledge journey nodes from learning history
    const generateJourneyNodes = () => {
      // Combine data sources for a rich journey visualization
      const nodes = [];
      
      // Add strongest interests
      if (strongestTopics.length > 0) {
        strongestTopics.slice(0, 2).forEach(topic => {
          nodes.push({
            id: `strength-${topic.topic}`,
            type: 'strength',
            title: topic.topic,
            subtitle: 'Your strength',
            icon: <Star className="h-4 w-4 text-amber-400" />,
            color: 'from-amber-500/20 to-orange-500/20',
            iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500'
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
            subtitle: index === 0 ? 'Recently explored' : 'Previously explored',
            icon: <Book className="h-4 w-4 text-blue-400" />,
            color: 'from-blue-500/20 to-indigo-500/20',
            iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-500'
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
          subtitle: 'Recommended for you',
          icon: <Compass className="h-4 w-4 text-green-400" />,
          color: 'from-green-500/20 to-emerald-500/20',
          iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500'
        });
      });
      
      // Add interests-based nodes
      if (childProfile?.interests && childProfile.interests.length > 0) {
        childProfile.interests.slice(0, 2).forEach(interest => {
          nodes.push({
            id: `interest-${interest}`,
            type: 'interest',
            title: interest,
            subtitle: 'Based on your interests',
            icon: <Sparkles className="h-4 w-4 text-purple-400" />,
            color: 'from-purple-500/20 to-pink-500/20',
            iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500'
          });
        });
      }
      
      setJourneyNodes(nodes);
    };
    
    generateJourneyNodes();
  }, [childProfile, recentlyViewedTopics, strongestTopics, getPersonalizedSuggestions]);

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
        staggerChildren: 0.1
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
      className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl border border-white/10 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-600/30 flex items-center justify-center mr-3">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Your Knowledge Journey</h3>
            <p className="text-sm text-white/60">Discover what to explore next</p>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-white/10 text-white/90 border-white/20">
          {journeyNodes.length} pathways
        </Badge>
      </div>
      
      {/* Knowledge journey visualization */}
      <div className="space-y-3 relative">
        {/* Connecting line for the journey */}
        <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-pink-500/50 z-0"></div>
        
        {journeyNodes.map((node, index) => (
          <motion.div 
            key={node.id}
            variants={itemVariants}
            whileHover={{ x: 3, scale: 1.01 }}
            className={cn(
              "relative z-10 pl-10 py-1",
              index === 0 ? "pb-3" : "",
              index === journeyNodes.length - 1 ? "pt-3" : ""
            )}
          >
            {/* Node marker */}
            <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full bg-white z-10 transform -translate-x-1/2"></div>
            
            <Card 
              className={cn(
                "overflow-hidden border-white/10 bg-gradient-to-br", 
                node.color,
                "hover:border-white/20 transition-all cursor-pointer group"
              )}
              onClick={() => handleNodeClick(node)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn("p-2 rounded-full mr-3", node.iconBg)}>
                      {node.icon}
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
      
      {journeyNodes.length === 0 && (
        <div className="text-center py-6 text-white/60">
          <p>Start your learning journey by exploring topics!</p>
        </div>
      )}
      
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
