import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Eye, Star, Rocket, Sparkles, ChevronRight } from 'lucide-react';

interface QuickDiscoveryCardsProps {
  topicTitle: string;
  childAge: number;
  onCardClick: (discovery: string) => void;
}

const QuickDiscoveryCards: React.FC<QuickDiscoveryCardsProps> = ({
  topicTitle,
  childAge,
  onCardClick
}) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const isYoungChild = childAge <= 8;

  const generateDiscoveries = (topic: string, age: number) => {
    const discoveries = [];
    
    if (topic.toLowerCase().includes('space') || topic.toLowerCase().includes('superintelligence')) {
      discoveries.push(
        {
          icon: '🚀',
          title: age <= 8 ? 'Super Cool Facts!' : 'Mind-Blowing Facts',
          description: age <= 8 ? 'Amazing things that will surprise you!' : 'Incredible discoveries that will amaze you',
          color: 'from-blue-500 to-purple-600',
          discovery: 'amazing facts about ' + topic
        },
        {
          icon: '🔬',
          title: age <= 8 ? 'How It Works!' : 'The Science Behind',
          description: age <= 8 ? 'See how cool things happen!' : 'Understanding the mechanisms',
          color: 'from-green-500 to-teal-600',
          discovery: 'how ' + topic + ' works'
        },
        {
          icon: '🌟',
          title: age <= 8 ? 'Why It Matters!' : 'Real-World Impact',
          description: age <= 8 ? 'Why this is important for us!' : 'How this affects our world',
          color: 'from-yellow-500 to-orange-600',
          discovery: 'why ' + topic + ' is important'
        },
        {
          icon: '🔮',
          title: age <= 8 ? 'Future Magic!' : 'Future Possibilities',
          description: age <= 8 ? 'What awesome things might happen!' : 'Potential future developments',
          color: 'from-pink-500 to-rose-600',
          discovery: 'future of ' + topic
        }
      );
    } else {
      // Generic discoveries for any topic
      discoveries.push(
        {
          icon: '💡',
          title: age <= 8 ? 'Cool Facts!' : 'Key Insights',
          description: age <= 8 ? 'Super interesting things to know!' : 'Essential knowledge points',
          color: 'from-indigo-500 to-purple-600',
          discovery: 'interesting facts about ' + topic
        },
        {
          icon: '🎯',
          title: age <= 8 ? 'How It Works!' : 'Understanding How',
          description: age <= 8 ? 'Learn how things happen!' : 'Deep dive into mechanics',
          color: 'from-emerald-500 to-cyan-600',
          discovery: 'how ' + topic + ' works'
        },
        {
          icon: '⭐',
          title: age <= 8 ? 'Why It Rocks!' : 'Significance',
          description: age <= 8 ? 'Why this is totally awesome!' : 'Why this topic matters',
          color: 'from-amber-500 to-orange-600',
          discovery: 'why ' + topic + ' is significant'
        },
        {
          icon: '🚀',
          title: age <= 8 ? 'More Adventures!' : 'Related Topics',
          description: age <= 8 ? 'Other fun things to explore!' : 'Connected areas to explore',
          color: 'from-rose-500 to-pink-600',
          discovery: 'topics related to ' + topic
        }
      );
    }
    
    return discoveries;
  };

  const discoveries = generateDiscoveries(topicTitle, childAge);

  const handleCardClick = (discovery: any, index: number) => {
    setSelectedCard(index);
    setTimeout(() => {
      onCardClick(discovery.discovery);
      setSelectedCard(null);
    }, 600);
  };

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">
            {isYoungChild ? "🔍 Quick Discoveries!" : "🎯 Instant Exploration"}
          </h3>
          <Zap className="h-5 w-5 text-yellow-400" />
        </div>
        <p className="text-white/70">
          {isYoungChild 
            ? "Pick what sounds super cool to learn about first!" 
            : "Choose your learning path based on what interests you most"
          }
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {discoveries.map((discovery, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className="relative overflow-hidden cursor-pointer h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group"
              onClick={() => handleCardClick(discovery, index)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${discovery.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <AnimatePresence>
                {selectedCard === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center z-10"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Sparkles className="h-8 w-8 text-white" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-4 h-full flex flex-col relative z-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{discovery.icon}</div>
                  <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white/80 transition-colors" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-2 text-sm">
                    {discovery.title}
                  </h4>
                  <p className="text-white/70 text-xs leading-relaxed">
                    {discovery.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/10 text-xs px-2 py-1 h-auto"
                  >
                    {isYoungChild ? "Let's Go!" : "Explore"}
                    <Rocket className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 border-2 border-transparent"
                whileHover={{
                  borderImage: "linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1)) 1",
                }}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-6"
      >
        <p className="text-white/50 text-sm">
          {isYoungChild 
            ? "✨ Each card is a new adventure waiting for you!" 
            : "💡 Each path offers unique insights and discoveries"
          }
        </p>
      </motion.div>
    </div>
  );
};

export default QuickDiscoveryCards;