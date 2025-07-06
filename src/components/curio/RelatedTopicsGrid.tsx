import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Star, Sparkles, Brain, Rocket, Globe, BookOpen } from 'lucide-react';

interface RelatedTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

interface RelatedTopicsGridProps {
  currentTopic: string;
  childAge: number;
  onTopicSelect: (topic: string) => void;
}

const RelatedTopicsGrid: React.FC<RelatedTopicsGridProps> = ({
  currentTopic,
  childAge,
  onTopicSelect
}) => {
  const [relatedTopics, setRelatedTopics] = useState<RelatedTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isYoungChild = childAge <= 8;

  useEffect(() => {
    generateRelatedTopics();
  }, [currentTopic, childAge]);

  const generateRelatedTopics = () => {
    setIsLoading(true);
    
    // Simulate API call with smart topic generation
    setTimeout(() => {
      const topics = getSmartRelatedTopics(currentTopic, childAge);
      setRelatedTopics(topics);
      setIsLoading(false);
    }, 1200);
  };

  const getSmartRelatedTopics = (topic: string, age: number): RelatedTopic[] => {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('superintelligence') || topicLower.includes('ai')) {
      return age <= 8 ? [
        {
          id: '1',
          title: 'How Computers Think',
          description: 'Learn how computers make decisions!',
          icon: '🤖',
          difficulty: 'easy',
          estimatedTime: '5 min'
        },
        {
          id: '2',
          title: 'Robots and Their Jobs',
          description: 'What jobs do robots do today?',
          icon: '🦾',
          difficulty: 'easy',
          estimatedTime: '4 min'
        },
        {
          id: '3',
          title: 'Smart Phones and Apps',
          description: 'How do phones know what we want?',
          icon: '📱',
          difficulty: 'easy',
          estimatedTime: '3 min'
        },
        {
          id: '4',
          title: 'The Future of Technology',
          description: 'What amazing inventions are coming?',
          icon: '🚀',
          difficulty: 'medium',
          estimatedTime: '6 min'
        },
        {
          id: '5',
          title: 'Video Game AI',
          description: 'How do game characters think?',
          icon: '🎮',
          difficulty: 'easy',
          estimatedTime: '4 min'
        },
        {
          id: '6',
          title: 'Space Exploration Robots',
          description: 'Robots exploring other planets!',
          icon: '🛸',
          difficulty: 'medium',
          estimatedTime: '7 min'
        }
      ] : [
        {
          id: '1',
          title: 'Machine Learning Algorithms',
          description: 'Deep dive into neural networks and learning systems',
          icon: '🧠',
          difficulty: 'hard',
          estimatedTime: '12 min'
        },
        {
          id: '2',
          title: 'AI Ethics and Safety',
          description: 'Exploring the challenges of AI alignment',
          icon: '⚖️',
          difficulty: 'medium',
          estimatedTime: '10 min'
        },
        {
          id: '3',
          title: 'Quantum Computing',
          description: 'The next frontier in computational power',
          icon: '⚛️',
          difficulty: 'hard',
          estimatedTime: '15 min'
        },
        {
          id: '4',
          title: 'Consciousness and AI',
          description: 'Can machines become truly conscious?',
          icon: '🧩',
          difficulty: 'hard',
          estimatedTime: '18 min'
        },
        {
          id: '5',
          title: 'Robotics and Automation',
          description: 'How AI is transforming physical work',
          icon: '🦾',
          difficulty: 'medium',
          estimatedTime: '8 min'
        },
        {
          id: '6',
          title: 'The Singularity Hypothesis',
          description: 'Exploring potential future scenarios',
          icon: '🌌',
          difficulty: 'hard',
          estimatedTime: '20 min'
        }
      ];
    }
    
    // Default related topics for any subject
    return [
      {
        id: '1',
        title: 'Science Adventures',
        description: age <= 8 ? 'Cool science experiments!' : 'Exploring scientific frontiers',
        icon: '🔬',
        difficulty: 'easy',
        estimatedTime: '5 min'
      },
      {
        id: '2',
        title: 'Space Mysteries',
        description: age <= 8 ? 'Amazing space facts!' : 'Cosmic phenomena explained',
        icon: '🌌',
        difficulty: 'medium',
        estimatedTime: '8 min'
      },
      {
        id: '3',
        title: 'Animal Kingdom',
        description: age <= 8 ? 'Incredible animals!' : 'Biodiversity and evolution',
        icon: '🦁',
        difficulty: 'easy',
        estimatedTime: '6 min'
      },
      {
        id: '4',
        title: 'Human Body',
        description: age <= 8 ? 'How your body works!' : 'Anatomy and physiology',
        icon: '🫀',
        difficulty: 'medium',
        estimatedTime: '10 min'
      }
    ];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Star className="h-3 w-3 fill-current" />;
      case 'medium': return (
        <div className="flex">
          <Star className="h-3 w-3 fill-current" />
          <Star className="h-3 w-3 fill-current" />
        </div>
      );
      case 'hard': return (
        <div className="flex">
          <Star className="h-3 w-3 fill-current" />
          <Star className="h-3 w-3 fill-current" />
          <Star className="h-3 w-3 fill-current" />
        </div>
      );
      default: return <Star className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 text-wonderwhiz-bright-pink" />
          {isYoungChild ? "🌟 More Fun Topics!" : "🔍 Related Explorations"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 p-4 animate-pulse">
              <div className="h-20 bg-white/10 rounded-lg mb-3"></div>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-8 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple rounded-full flex items-center justify-center"
        >
          <Zap className="h-4 w-4 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white">
          {isYoungChild ? "🌟 More Amazing Topics!" : "🔍 Continue Your Journey"}
        </h3>
      </div>
      
      <p className="text-white/70 mb-8 text-lg">
        {isYoungChild 
          ? "Keep exploring! Click on any topic that looks super interesting!" 
          : "Dive deeper into related subjects and discover new connections"
        }
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden">
              <div 
                className="p-5 h-full flex flex-col"
                onClick={() => onTopicSelect(topic.title)}
              >
                {/* Topic Icon & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{topic.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white group-hover:text-wonderwhiz-bright-pink transition-colors">
                      {topic.title}
                    </h4>
                    <p className="text-white/70 text-sm mt-1">
                      {topic.description}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between mt-auto pt-3">
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs border ${getDifficultyColor(topic.difficulty)}`}>
                    {getDifficultyIcon(topic.difficulty)}
                    <span className="capitalize">{topic.difficulty}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <BookOpen className="h-3 w-3" />
                    <span>{topic.estimatedTime}</span>
                  </div>
                </div>

                {/* Hover Action */}
                <motion.div
                  className="flex items-center justify-center mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                >
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-purple/90 text-white text-xs"
                  >
                    {isYoungChild ? "🚀 Explore!" : "Learn More"}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Exploration Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
          <Sparkles className="h-4 w-4 text-wonderwhiz-bright-pink" />
          <span className="text-white/80 text-sm">
            {isYoungChild 
              ? "🎯 The more you explore, the smarter you become!" 
              : "💡 Each topic builds upon your growing knowledge"
            }
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RelatedTopicsGrid;