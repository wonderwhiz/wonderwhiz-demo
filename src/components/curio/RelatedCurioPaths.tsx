
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Map, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RelatedCurioPathsProps {
  currentTopic: string;
  onPathSelect: (path: string) => void;
  childAge?: number;
}

interface RelatedPath {
  title: string;
  description: string;
  type: 'deeper' | 'broader' | 'related';
}

const RelatedCurioPaths: React.FC<RelatedCurioPathsProps> = ({
  currentTopic,
  onPathSelect,
  childAge = 10
}) => {
  const [loading, setLoading] = useState(true);
  const [relatedPaths, setRelatedPaths] = useState<RelatedPath[]>([]);
  
  useEffect(() => {
    // In a real implementation this would call an API or database
    // For now, we'll generate related paths based on the topic
    const generateRelatedPaths = () => {
      setLoading(true);
      
      const topic = currentTopic.toLowerCase();
      const paths: RelatedPath[] = [];
      
      // Generate a deeper path
      paths.push({
        title: `How does ${topic} work?`,
        description: `Dive deeper into the mechanics and processes of ${topic}.`,
        type: 'deeper'
      });
      
      // Generate a broader path
      paths.push({
        title: `${topic} in our world`,
        description: `Explore how ${topic} connects to our everyday lives.`,
        type: 'broader'
      });
      
      // Generate related paths
      paths.push({
        title: `Fun facts about ${topic}`,
        description: `Discover surprising and interesting tidbits about ${topic}.`,
        type: 'related'
      });
      
      // Add age-appropriate paths
      if (childAge <= 7) {
        paths.push({
          title: `${topic} adventures!`,
          description: `Join an exciting adventure to learn more about ${topic}.`,
          type: 'related'
        });
      } else if (childAge <= 11) {
        paths.push({
          title: `${topic} mysteries`,
          description: `Uncover mysteries and puzzles related to ${topic}.`,
          type: 'related'
        });
      } else {
        paths.push({
          title: `The science behind ${topic}`,
          description: `Explore the scientific principles and research about ${topic}.`,
          type: 'deeper'
        });
      }
      
      setRelatedPaths(paths);
      setLoading(false);
    };
    
    const timer = setTimeout(() => {
      generateRelatedPaths();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentTopic, childAge]);
  
  // Get path icon based on type
  const getPathIcon = (type: string) => {
    switch (type) {
      case 'deeper': return <Compass className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />;
      case 'broader': return <Map className="h-4 w-4 text-cyan-400" />;
      case 'related': 
      default: return <Star className="h-4 w-4 text-pink-400" />;
    }
  };
  
  // Get path style based on type
  const getPathStyle = (type: string) => {
    switch (type) {
      case 'deeper': 
        return 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-amber-500/20';
      case 'broader': 
        return 'from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border-cyan-500/20';
      case 'related': 
      default:
        return 'from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border-pink-500/20';
    }
  };
  
  // Get button text based on child age
  const getButtonText = (type: string) => {
    if (childAge <= 7) {
      switch (type) {
        case 'deeper': return "Let's explore!";
        case 'broader': return "Show me!";
        case 'related': return "Let's go!";
        default: return "Discover!";
      }
    } else {
      return "Explore";
    }
  };
  
  // UI States
  if (loading) {
    return (
      <div className="mt-8 bg-black/20 border border-white/10 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-2">Related Paths</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="mt-8 bg-black/20 border border-white/10 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-medium text-white mb-3">Continue Your Journey</h3>
      
      <div className="space-y-3">
        {relatedPaths.map((path, index) => (
          <motion.div 
            key={index}
            className={`bg-gradient-to-r ${getPathStyle(path.type)} border rounded-lg p-3 flex items-start justify-between`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex-1">
              <div className="flex items-center">
                {getPathIcon(path.type)}
                <h4 className="ml-2 text-white font-medium">{path.title}</h4>
              </div>
              <p className="mt-1 text-sm text-white/70">{path.description}</p>
            </div>
            
            <Button 
              size="sm" 
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white mt-1 flex-shrink-0"
              onClick={() => {
                toast.success(`Starting new journey: ${path.title}`);
                onPathSelect(path.title);
              }}
            >
              {getButtonText(path.type)}
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedCurioPaths;
