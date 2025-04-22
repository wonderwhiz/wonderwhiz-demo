
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, MapPin, BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RelatedCurioPathsProps {
  currentTopic: string;
  onPathSelect: (path: string) => void;
  childAge?: number;
}

const RelatedCurioPaths: React.FC<RelatedCurioPathsProps> = ({
  currentTopic,
  onPathSelect,
  childAge = 10
}) => {
  // Generate related paths based on current topic
  const relatedPaths = React.useMemo(() => {
    const topic = currentTopic.toLowerCase();
    
    return [
      {
        title: `Why is ${topic} important?`,
        description: `Discover the real-world impact and significance of ${topic}.`,
        type: 'deeper' as const,
        icon: <MapPin className="h-4 w-4 text-wonderwhiz-bright-pink" />
      },
      {
        title: `How does ${topic} work?`,
        description: `Explore the fascinating mechanics and processes behind ${topic}.`,
        type: 'deeper' as const,
        icon: <BookOpen className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
      },
      {
        title: `${topic} in history`,
        description: `Journey through time to see how ${topic} has evolved.`,
        type: 'broader' as const,
        icon: <Compass className="h-4 w-4 text-wonderwhiz-cyan" />
      },
      {
        title: `Fun facts about ${topic}`,
        description: `Discover surprising and interesting tidbits about ${topic}.`,
        type: 'related' as const,
        icon: <Sparkles className="h-4 w-4 text-wonderwhiz-green" />
      }
    ];
  }, [currentTopic]);

  // Adjust content based on child age
  const getContentForAge = () => {
    if (childAge < 8) {
      return {
        title: 'Explore More',
        description: 'What else would you like to learn about?'
      };
    }
    
    if (childAge > 12) {
      return {
        title: 'Expand Your Knowledge',
        description: 'Consider these related exploration paths'
      };
    }
    
    return {
      title: 'Continue Your Journey',
      description: 'Where would you like to go next?'
    };
  };
  
  const content = getContentForAge();
  
  // Animation variants
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
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="rounded-xl bg-black/20 border border-white/10 p-6 mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-4">
        <h3 className="text-xl font-bold text-white">{content.title}</h3>
        <p className="text-white/70">{content.description}</p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relatedPaths.map((path, index) => (
          <motion.button
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 hover:bg-white/10 rounded-lg p-4 text-left transition-all border border-white/5 hover:border-white/20"
            onClick={() => onPathSelect(path.title)}
          >
            <div className="flex items-start">
              <span className="mt-0.5 mr-3">{path.icon}</span>
              <div className="flex-1">
                <h4 className="text-white font-medium">{path.title}</h4>
                <p className="text-white/60 text-sm mt-1">{path.description}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <Badge variant="outline" className="text-xs bg-white/5">
                {path.type}
              </Badge>
              <ArrowRight className="h-4 w-4 text-white/40" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedCurioPaths;
