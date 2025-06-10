
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Star, Rocket, Atom } from 'lucide-react';

interface QuickStartOnboardingProps {
  onTopicSelect: (topic: string) => void;
  onDismiss: () => void;
  childAge: number;
}

const QuickStartOnboarding: React.FC<QuickStartOnboardingProps> = ({
  onTopicSelect,
  onDismiss,
  childAge
}) => {
  const getAgeAppropriateTopics = () => {
    if (childAge <= 7) {
      return [
        { topic: "Why do animals have different colors?", icon: "🦋", description: "Discover amazing animal colors!" },
        { topic: "How do plants grow?", icon: "🌱", description: "Watch nature in action!" },
        { topic: "What makes rainbows?", icon: "🌈", description: "Learn about beautiful colors!" }
      ];
    } else if (childAge <= 11) {
      return [
        { topic: "How do volcanoes work?", icon: "🌋", description: "Explore Earth's powerful forces!" },
        { topic: "What are black holes?", icon: "🕳️", description: "Journey into space mysteries!" },
        { topic: "How does the internet work?", icon: "🌐", description: "Discover digital connections!" }
      ];
    } else {
      return [
        { topic: "How does DNA work?", icon: "🧬", description: "Unlock the secrets of life!" },
        { topic: "What is artificial intelligence?", icon: "🤖", description: "Explore the future of technology!" },
        { topic: "How do renewable energies work?", icon: "⚡", description: "Power the planet sustainably!" }
      ];
    }
  };

  const topics = getAgeAppropriateTopics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 border-wonderwhiz-bright-pink/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Rocket className="h-8 w-8 text-wonderwhiz-bright-pink" />
            <div>
              <h3 className="text-xl font-bold text-white">Ready to explore? 🚀</h3>
              <p className="text-white/70">Pick a topic to get started on your learning adventure!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topics.map((item, index) => (
            <motion.div
              key={item.topic}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-4 bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                onClick={() => onTopicSelect(item.topic)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-white mb-1 group-hover:text-wonderwhiz-bright-pink transition-colors">
                    {item.topic}
                  </h4>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-white/60 text-sm">
            ✨ Or search for anything you're curious about above!
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuickStartOnboarding;
