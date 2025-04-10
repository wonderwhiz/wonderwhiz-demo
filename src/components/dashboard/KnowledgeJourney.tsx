
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Star, ArrowRight, Sparkles, Book, Map, Zap, ChevronDown } from 'lucide-react';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  const [showAll, setShowAll] = useState(false);
  
  // Create a consistent color palette based on brand guidelines
  const nodeColors = {
    strength: {
      bg: "bg-wonderwhiz-deep-purple/20",
      border: "border-wonderwhiz-vibrant-yellow/30",
      hover: "hover:border-wonderwhiz-vibrant-yellow/50 hover:bg-wonderwhiz-deep-purple/30",
      icon: <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />,
      iconBg: "bg-wonderwhiz-deep-purple/50"
    },
    recent: {
      bg: "bg-wonderwhiz-deep-purple/20",
      border: "border-wonderwhiz-bright-pink/30",
      hover: "hover:border-wonderwhiz-bright-pink/50 hover:bg-wonderwhiz-deep-purple/30",
      icon: <Book className="h-4 w-4 text-wonderwhiz-bright-pink" />,
      iconBg: "bg-wonderwhiz-deep-purple/50"
    },
    suggestion: {
      bg: "bg-wonderwhiz-deep-purple/20",
      border: "border-wonderwhiz-cyan/30",
      hover: "hover:border-wonderwhiz-cyan/50 hover:bg-wonderwhiz-deep-purple/30",
      icon: <Compass className="h-4 w-4 text-wonderwhiz-cyan" />,
      iconBg: "bg-wonderwhiz-deep-purple/50"
    },
    interest: {
      bg: "bg-wonderwhiz-deep-purple/20",
      border: "border-wonderwhiz-blue-accent/30",
      hover: "hover:border-wonderwhiz-blue-accent/50 hover:bg-wonderwhiz-deep-purple/30",
      icon: <Sparkles className="h-4 w-4 text-wonderwhiz-blue-accent" />,
      iconBg: "bg-wonderwhiz-deep-purple/50"
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
  // Show only 3 nodes initially, show all if showAll is true
  const displayedNodes = showAll ? journeyNodes : journeyNodes.slice(0, 3);

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
      className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-indigo-950/70 backdrop-blur-sm rounded-2xl border border-wonderwhiz-light-purple/30 p-5 shadow-lg"
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
            {displayedNodes.map((node) => (
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
                          "p-2 rounded-full mr-3 border border-white/20", 
                          nodeColors[node.type as keyof typeof nodeColors].iconBg
                        )}>
                          {nodeColors[node.type as keyof typeof nodeColors].icon}
                        </div>
                        
                        <div>
                          <h4 className="font-nunito font-semibold text-white group-hover:text-white/90">{node.title}</h4>
                          <p className="text-xs font-inter text-white/70">{node.subtitle}</p>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-4 w-4 text-white/60 group-hover:text-white/90 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {journeyNodes.length > 3 && (
              <motion.div variants={itemVariants}>
                <Button 
                  variant="ghost" 
                  className="w-full text-white/70 font-nunito hover:text-white hover:bg-wonderwhiz-deep-purple/30 flex items-center justify-center"
                  onClick={() => setShowAll(!showAll)}
                >
                  <ChevronDown className={`mr-2 h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                  <span>{showAll ? 'Show less' : `Show ${journeyNodes.length - 3} more pathways`}</span>
                </Button>
              </motion.div>
            )}
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
