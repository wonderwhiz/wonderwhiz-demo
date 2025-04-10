
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Star, ArrowRight, Sparkles, Book, Map, Zap } from 'lucide-react';
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
  
  // Create a consistent color palette based on brand guidelines
  const nodeColors = {
    strength: {
      bg: "bg-gradient-to-br from-wonderwhiz-deep-purple/10 to-wonderwhiz-light-purple/20",
      border: "border-wonderwhiz-light-purple/30",
      hover: "hover:border-wonderwhiz-light-purple/50 hover:bg-wonderwhiz-light-purple/10",
      icon: <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />,
      iconBg: "bg-wonderwhiz-deep-purple/70"
    },
    recent: {
      bg: "bg-gradient-to-br from-wonderwhiz-deep-purple/10 to-wonderwhiz-bright-pink/10",
      border: "border-wonderwhiz-bright-pink/30",
      hover: "hover:border-wonderwhiz-bright-pink/50 hover:bg-wonderwhiz-bright-pink/10",
      icon: <Book className="h-4 w-4 text-wonderwhiz-bright-pink" />,
      iconBg: "bg-wonderwhiz-deep-purple/70"
    },
    suggestion: {
      bg: "bg-gradient-to-br from-wonderwhiz-deep-purple/10 to-wonderwhiz-cyan/10",
      border: "border-wonderwhiz-cyan/30",
      hover: "hover:border-wonderwhiz-cyan/50 hover:bg-wonderwhiz-cyan/10",
      icon: <Compass className="h-4 w-4 text-wonderwhiz-cyan" />,
      iconBg: "bg-wonderwhiz-deep-purple/70"
    },
    interest: {
      bg: "bg-gradient-to-br from-wonderwhiz-deep-purple/10 to-wonderwhiz-blue-accent/10",
      border: "border-wonderwhiz-blue-accent/30",
      hover: "hover:border-wonderwhiz-blue-accent/50 hover:bg-wonderwhiz-blue-accent/10",
      icon: <Sparkles className="h-4 w-4 text-wonderwhiz-blue-accent" />,
      iconBg: "bg-wonderwhiz-deep-purple/70"
    }
  };
  
  // Combine data sources for a clean journey visualization
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
      className="bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-wonderwhiz-light-purple/20 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-deep-purple/30 flex items-center justify-center mr-3 border border-white/10">
            <Map className="h-5 w-5 text-wonderwhiz-bright-pink" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-white">Knowledge Journey</h3>
            <p className="text-sm font-inter text-white/70">Your path of discovery</p>
          </div>
        </div>
        
        <Badge className="bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink border-wonderwhiz-bright-pink/20 font-nunito">
          {journeyNodes.length} pathways
        </Badge>
      </div>
      
      {/* Knowledge journey visualization */}
      <div className="space-y-3 relative">
        {journeyNodes.length === 0 ? (
          <div className="text-center py-6 text-white/70 font-inter">
            <p>Start your learning journey by exploring topics!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {journeyNodes.map((node) => (
              <motion.div 
                key={node.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={cn(
                    "overflow-hidden border transition-all cursor-pointer group",
                    nodeColors[node.type as keyof typeof nodeColors].bg,
                    nodeColors[node.type as keyof typeof nodeColors].border,
                    nodeColors[node.type as keyof typeof nodeColors].hover
                  )}
                  onClick={() => handleNodeClick(node)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={cn(
                          "p-2 rounded-full mr-3 border border-white/10", 
                          nodeColors[node.type as keyof typeof nodeColors].iconBg
                        )}>
                          {nodeColors[node.type as keyof typeof nodeColors].icon}
                        </div>
                        
                        <div>
                          <h4 className="font-nunito font-semibold text-white group-hover:text-white/90">{node.title}</h4>
                          <p className="text-xs font-inter text-white/70">{node.subtitle}</p>
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
        className="w-full mt-4 text-wonderwhiz-cyan font-nunito hover:text-white hover:bg-wonderwhiz-cyan/20"
        onClick={() => onTopicClick("Suggest a new topic for me to learn about")}
      >
        <Compass className="mr-2 h-4 w-4" />
        <span>Discover new paths</span>
      </Button>
    </motion.div>
  );
};

export default KnowledgeJourney;
