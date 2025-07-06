import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Star, 
  Sparkles,
  RefreshCw,
  Eye,
  Smile,
  Zap
} from 'lucide-react';

interface FunFactBubblesProps {
  topicTitle: string;
  childAge: number;
  sectionContent?: string;
  onFactClick?: (fact: string) => void;
}

interface FunFact {
  id: string;
  fact: string;
  icon: string;
  color: string;
  category: 'amazing' | 'weird' | 'cool' | 'mind-blowing';
}

const FunFactBubbles: React.FC<FunFactBubblesProps> = ({
  topicTitle,
  childAge,
  sectionContent,
  onFactClick
}) => {
  const [facts, setFacts] = useState<FunFact[]>([]);
  const [visibleFacts, setVisibleFacts] = useState<FunFact[]>([]);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const isYoungChild = childAge <= 8;

  useEffect(() => {
    generateFunFacts();
  }, [topicTitle, childAge]);

  useEffect(() => {
    // Show facts one by one with a delay
    const timer = setInterval(() => {
      if (currentFactIndex < facts.length) {
        setVisibleFacts(prev => [...prev, facts[currentFactIndex]]);
        setCurrentFactIndex(prev => prev + 1);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [facts, currentFactIndex]);

  const generateFunFacts = () => {
    const topic = topicTitle.toLowerCase();
    let generatedFacts: FunFact[] = [];

    if (topic.includes('superintelligence') || topic.includes('ai')) {
      generatedFacts = [
        {
          id: '1',
          fact: isYoungChild 
            ? "🤖 AI can learn faster than any human brain!" 
            : "AI systems can process information millions of times faster than human neurons",
          icon: '🧠',
          color: 'from-purple-400 to-blue-500',
          category: 'mind-blowing'
        },
        {
          id: '2',
          fact: isYoungChild 
            ? "🎮 Some AI can beat the world's best video game players!" 
            : "AI has mastered complex games like Chess, Go, and StarCraft II at superhuman levels",
          icon: '🎯',
          color: 'from-green-400 to-teal-500',
          category: 'amazing'
        },
        {
          id: '3',
          fact: isYoungChild 
            ? "📚 AI can read thousands of books in just one second!" 
            : "Machine learning models can analyze entire libraries of text in milliseconds",
          icon: '⚡',
          color: 'from-yellow-400 to-orange-500',
          category: 'cool'
        },
        {
          id: '4',
          fact: isYoungChild 
            ? "🎨 AI can create amazing art and music just like artists!" 
            : "Generative AI can produce creative works indistinguishable from human-made content",
          icon: '🎨',
          color: 'from-pink-400 to-rose-500',
          category: 'weird'
        }
      ];
    } else if (topic.includes('space')) {
      generatedFacts = [
        {
          id: '1',
          fact: isYoungChild 
            ? "🌟 There are more stars in space than grains of sand on all Earth's beaches!" 
            : "The observable universe contains approximately 10^24 stars",
          icon: '⭐',
          color: 'from-blue-400 to-purple-500',
          category: 'mind-blowing'
        },
        {
          id: '2',
          fact: isYoungChild 
            ? "🚀 A day on Venus is longer than its year!" 
            : "Venus takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun",
          icon: '🪐',
          color: 'from-orange-400 to-red-500',
          category: 'weird'
        }
      ];
    } else {
      // Generic fun facts
      generatedFacts = [
        {
          id: '1',
          fact: isYoungChild 
            ? `🎉 Learning about ${topicTitle} makes your brain grow stronger!` 
            : `Studying ${topicTitle} creates new neural pathways in your brain`,
          icon: '🧠',
          color: 'from-green-400 to-blue-500',
          category: 'amazing'
        },
        {
          id: '2',
          fact: isYoungChild 
            ? `🔍 Every expert in ${topicTitle} started just like you - as a curious beginner!` 
            : `All expertise in ${topicTitle} begins with curiosity and dedicated learning`,
          icon: '🌟',
          color: 'from-purple-400 to-pink-500',
          category: 'cool'
        }
      ];
    }

    setFacts(generatedFacts);
    setVisibleFacts([]);
    setCurrentFactIndex(0);
  };

  const refreshFacts = () => {
    setVisibleFacts([]);
    setCurrentFactIndex(0);
    setTimeout(() => {
      generateFunFacts();
    }, 300);
  };

  const handleFactClick = (fact: FunFact) => {
    if (onFactClick) {
      onFactClick(fact.fact);
    }
  };

  const getBubblePosition = (index: number) => {
    const positions = [
      { top: '10%', right: '15%' },
      { top: '60%', left: '10%' },
      { top: '30%', right: '5%' },
      { bottom: '20%', right: '20%' },
      { top: '70%', right: '40%' },
      { top: '15%', left: '25%' }
    ];
    return positions[index % positions.length];
  };

  if (visibleFacts.length === 0) return null;

  return (
    <div className="relative h-64">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-deep-purple/10 to-wonderwhiz-purple/10 rounded-3xl" />
      
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <span className="text-white font-bold text-sm">
            {isYoungChild ? '🤯 Mind-Blowing Facts!' : '💡 Fun Facts'}
          </span>
          <Button
            onClick={refreshFacts}
            size="sm"
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/10 p-1 h-auto"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Fact Bubbles */}
      <AnimatePresence>
        {visibleFacts.map((fact, index) => (
          <motion.div
            key={fact.id}
            initial={{ 
              scale: 0, 
              opacity: 0,
              rotate: -180
            }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              rotate: 0
            }}
            exit={{ 
              scale: 0, 
              opacity: 0,
              rotate: 180
            }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: index * 0.2
            }}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -2, 2, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            className="absolute cursor-pointer"
            style={getBubblePosition(index)}
            onClick={() => handleFactClick(fact)}
          >
            <Card className={`bg-gradient-to-br ${fact.color} p-4 max-w-xs shadow-2xl border-0 relative overflow-hidden group`}>
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"
              />
              
              <div className="relative z-10">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-2xl">{fact.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm leading-relaxed">
                      {fact.fact}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    fact.category === 'mind-blowing' ? 'bg-white/20 text-white' :
                    fact.category === 'amazing' ? 'bg-yellow-400/20 text-yellow-100' :
                    fact.category === 'cool' ? 'bg-blue-400/20 text-blue-100' :
                    'bg-pink-400/20 text-pink-100'
                  }`}>
                    {fact.category === 'mind-blowing' && '🤯'} 
                    {fact.category === 'amazing' && '😲'}
                    {fact.category === 'cool' && '😎'}
                    {fact.category === 'weird' && '🤔'}
                    {isYoungChild ? fact.category : fact.category.replace('-', ' ')}
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="text-white/80 group-hover:text-white"
                  >
                    <Eye className="h-3 w-3" />
                  </motion.div>
                </div>
              </div>

              {/* Floating sparkles */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-2 right-2"
              >
                <Sparkles className="h-3 w-3 text-white/60" />
              </motion.div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating action hint */}
      {visibleFacts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
            <span className="text-white/70 text-xs font-medium">
              {isYoungChild ? '👆 Tap bubbles to explore!' : '💫 Click facts to learn more'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FunFactBubbles;