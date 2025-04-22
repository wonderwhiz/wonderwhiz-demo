
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

interface RelatedCurioPathsProps {
  currentTopic: string;
  onPathSelect: (question: string) => void;
  childAge?: number;
}

const RelatedCurioPaths: React.FC<RelatedCurioPathsProps> = ({
  currentTopic,
  onPathSelect,
  childAge = 10
}) => {
  const [relatedPaths, setRelatedPaths] = useState<string[]>([]);
  const { textSize, messageStyle } = useAgeAdaptation(childAge);
  
  useEffect(() => {
    if (!currentTopic) return;
    
    // Generate related paths based on the current topic
    // This would ideally be replaced with an API call to get actual related topics
    const generateRelatedPaths = () => {
      const topic = currentTopic.toLowerCase();
      const paths = [
        `How does ${topic} work?`,
        `Why is ${topic} important?`,
        `What's the history of ${topic}?`,
        `Fun facts about ${topic}`,
        `${topic} in everyday life`,
        `The future of ${topic}`
      ];
      
      // Shuffle and limit based on age
      const maxPaths = childAge <= 7 ? 3 : 4;
      return shuffleArray(paths).slice(0, maxPaths);
    };
    
    setRelatedPaths(generateRelatedPaths());
  }, [currentTopic, childAge]);
  
  // Helper function to shuffle array
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Get title based on age/message style
  const getTitle = () => {
    switch (messageStyle) {
      case 'playful':
        return "Where To Explore Next?";
      case 'casual':
        return "Continue Your Journey";
      default:
        return "Related Explorations";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-10 mb-8 px-2 py-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-2 mb-4">
        <Compass className="h-5 w-5 text-wonderwhiz-blue-accent" />
        <h3 className={`text-white font-medium ${childAge <= 7 ? 'text-xl' : 'text-lg'}`}>
          {getTitle()}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relatedPaths.map((path, index) => (
          <motion.div
            key={`related-${index}`}
            whileHover={{ x: 4 }}
            className="group"
          >
            <Button
              variant="ghost"
              onClick={() => onPathSelect(path)}
              className="w-full justify-between bg-white/5 hover:bg-white/10 text-left h-auto py-3"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-wonderwhiz-bright-pink" />
                <span className={`text-white ${textSize}`}>{path}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-wonderwhiz-blue-accent transition-colors" />
            </Button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button
          variant="link"
          onClick={() => onPathSelect(`Tell me more about ${currentTopic}`)}
          className="text-wonderwhiz-blue-accent hover:text-wonderwhiz-blue-accent/80"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          <span className={textSize}>
            {childAge <= 7 ? "More about this topic!" : "Explore this topic further"}
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

export default RelatedCurioPaths;
