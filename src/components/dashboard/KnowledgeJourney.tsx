
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, BookOpen, ArrowRight } from 'lucide-react';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { Button } from '@/components/ui/button';

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
  const {
    learningHistory,
    topicConnections,
    strongestTopics,
    findRelatedTopics,
    isLoading
  } = useChildLearningHistory(childId);
  
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  
  // Select the strongest topic by default
  useEffect(() => {
    if (strongestTopics.length > 0 && !selectedTopic) {
      const topic = strongestTopics[0].topic;
      setSelectedTopic(topic);
      setRelatedTopics(findRelatedTopics(topic));
    }
  }, [strongestTopics, findRelatedTopics, selectedTopic]);
  
  // Handle topic selection
  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setRelatedTopics(findRelatedTopics(topic));
  };
  
  // Choose topic to explore
  const handleExplore = (topic: string) => {
    onTopicClick(`Tell me more about ${topic}`);
  };
  
  // Calculate the number of topics explored
  const topicsExplored = learningHistory.length;
  
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
    hidden: { opacity: 0, y: 20 },
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
  
  const connectionVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { 
        delay: 0.3,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="h-10 w-10 text-white/30" />
        </motion.div>
      </div>
    );
  }
  
  // No learning history yet
  if (learningHistory.length === 0) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible" 
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 text-center h-64 flex flex-col items-center justify-center"
      >
        <BookOpen className="h-12 w-12 text-white/30 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Your Knowledge Journey</h3>
        <p className="text-white/70 mb-4">Begin your exploration to see your knowledge grow here!</p>
        <Button 
          variant="outline"
          onClick={() => onTopicClick('What is the most fascinating science fact?')}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
        >
          Start Exploring
        </Button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl border border-white/10 p-5 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div variants={itemVariants} className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow flex items-center justify-center mr-3">
            <Brain className="h-5 w-5 text-wonderwhiz-deep-purple" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Your Knowledge Universe</h3>
            <p className="text-sm text-white/60">
              {topicsExplored} topic{topicsExplored !== 1 ? 's' : ''} explored
            </p>
          </div>
        </motion.div>
      </div>
      
      <div className="relative h-[280px] w-full">
        {/* Interactive knowledge graph visualization */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Background effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-vibrant-yellow/20 blur-2xl"
          />
          
          {/* Selected topic node */}
          {selectedTopic && (
            <motion.div
              variants={itemVariants}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center cursor-pointer shadow-xl shadow-purple-900/20"
                onClick={() => handleExplore(selectedTopic)}
              >
                <Sparkles className="h-6 w-6 text-wonderwhiz-gold mb-1" />
                <span className="text-white font-medium text-center px-2 text-sm leading-tight line-clamp-2">
                  {selectedTopic}
                </span>
              </motion.div>
            </motion.div>
          )}
          
          {/* Related topics */}
          {relatedTopics.map((topic, index) => {
            // Position in a circle around the main topic
            const angle = (index * (360 / relatedTopics.length)) * (Math.PI / 180);
            const radius = 110;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <React.Fragment key={topic}>
                {/* Connection line */}
                <svg className="absolute top-1/2 left-1/2 z-0 w-full h-full pointer-events-none">
                  <motion.line
                    variants={connectionVariants}
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${x}px)`}
                    y2={`calc(50% + ${y}px)`}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4,8"
                  />
                  <defs>
                    <linearGradient id="lineGradient" gradientTransform="rotate(90)">
                      <stop offset="0%" stopColor="#FFCD4A" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FF5CBE" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Topic node */}
                <motion.div
                  variants={itemVariants}
                  style={{
                    top: `calc(50% + ${y}px)`,
                    left: `calc(50% + ${x}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer"
                    onClick={() => handleTopicSelect(topic)}
                  >
                    <span className="text-white/90 font-medium text-xs text-center px-2 line-clamp-2">
                      {topic}
                    </span>
                  </motion.div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <h4 className="text-sm font-medium text-white/70">
          {selectedTopic ? `Explore ${selectedTopic}` : 'Select a topic to explore'}
        </h4>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectedTopic && handleExplore(selectedTopic)}
          className="text-white/70 hover:text-white group flex items-center gap-1"
        >
          <span>Dive deeper</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

export default KnowledgeJourney;
