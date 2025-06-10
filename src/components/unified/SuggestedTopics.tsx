
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface SuggestedTopicsProps {
  childAge: number;
  onTopicSelect: (topic: string) => void;
}

const SuggestedTopics: React.FC<SuggestedTopicsProps> = ({
  childAge,
  onTopicSelect
}) => {
  const getPopularTopics = () => {
    if (childAge <= 7) {
      return [
        { topic: "How do butterflies get their colors?", category: "Nature", emoji: "🦋" },
        { topic: "Why do we need to sleep?", category: "Body", emoji: "😴" },
        { topic: "What makes music sound good?", category: "Science", emoji: "🎵" },
        { topic: "How do seeds know when to grow?", category: "Plants", emoji: "🌱" },
        { topic: "Why is the ocean salty?", category: "Ocean", emoji: "🌊" },
        { topic: "How do birds learn to fly?", category: "Animals", emoji: "🐦" }
      ];
    } else if (childAge <= 11) {
      return [
        { topic: "How does gravity work?", category: "Physics", emoji: "🪐" },
        { topic: "What happens inside a computer?", category: "Technology", emoji: "💻" },
        { topic: "How do earthquakes happen?", category: "Earth", emoji: "🌍" },
        { topic: "Why do some animals glow in the dark?", category: "Biology", emoji: "🦑" },
        { topic: "How do solar panels make electricity?", category: "Energy", emoji: "☀️" },
        { topic: "What makes something invisible?", category: "Optics", emoji: "👻" }
      ];
    } else {
      return [
        { topic: "How does CRISPR gene editing work?", category: "Genetics", emoji: "🧬" },
        { topic: "What are quantum computers?", category: "Computing", emoji: "⚛️" },
        { topic: "How do neural networks learn?", category: "AI", emoji: "🧠" },
        { topic: "What causes climate change?", category: "Environment", emoji: "🌡️" },
        { topic: "How does cryptocurrency work?", category: "Economics", emoji: "💰" },
        { topic: "What is dark matter?", category: "Cosmology", emoji: "🌌" }
      ];
    }
  };

  const topics = getPopularTopics();

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Popular Right Now
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((item, index) => (
          <motion.div
            key={item.topic}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="p-3 bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              onClick={() => onTopicSelect(item.topic)}
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm group-hover:text-wonderwhiz-bright-pink transition-colors truncate">
                    {item.topic}
                  </p>
                  <p className="text-white/50 text-xs">{item.category}</p>
                </div>
                <Lightbulb className="h-4 w-4 text-white/30 group-hover:text-wonderwhiz-bright-pink transition-colors" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedTopics;
