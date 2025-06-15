
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Star, Book, Zap, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface QuickDiscoveryCardsProps {
  onCardSelect: (topic: string) => void;
  childAge: number;
  recentExplorations: any[];
}

const QuickDiscoveryCards: React.FC<QuickDiscoveryCardsProps> = ({
  onCardSelect,
  childAge,
  recentExplorations
}) => {
  const getDiscoveryCards = () => {
    if (childAge <= 8) {
      return [
        { title: "Animals & Nature", icon: "🦁", color: "from-green-400 to-emerald-500", topic: "Amazing animals and nature" },
        { title: "Space Adventures", icon: "🚀", color: "from-blue-400 to-purple-500", topic: "Space and planets" },
        { title: "How Things Work", icon: "⚙️", color: "from-orange-400 to-red-500", topic: "How everyday things work" },
        { title: "Fun Science", icon: "🧪", color: "from-pink-400 to-purple-500", topic: "Cool science experiments" },
        { title: "Amazing Stories", icon: "📚", color: "from-yellow-400 to-orange-500", topic: "Fascinating historical stories" },
        { title: "Art & Creativity", icon: "🎨", color: "from-purple-400 to-pink-500", topic: "Art and creative activities" }
      ];
    } else if (childAge <= 12) {
      return [
        { title: "Science Mysteries", icon: "🔬", color: "from-blue-400 to-cyan-500", topic: "Scientific mysteries and discoveries" },
        { title: "World Cultures", icon: "🌍", color: "from-green-400 to-teal-500", topic: "Cultures around the world" },
        { title: "Technology", icon: "💻", color: "from-purple-400 to-blue-500", topic: "Amazing technology" },
        { title: "History Heroes", icon: "🏛️", color: "from-yellow-400 to-orange-500", topic: "Historical figures and events" },
        { title: "Nature's Wonders", icon: "🌿", color: "from-green-400 to-emerald-500", topic: "Wonders of nature" },
        { title: "Math Magic", icon: "🔢", color: "from-pink-400 to-purple-500", topic: "Fun with mathematics" }
      ];
    } else {
      return [
        { title: "Advanced Science", icon: "⚛️", color: "from-blue-500 to-purple-600", topic: "Advanced scientific concepts" },
        { title: "Global Issues", icon: "🌐", color: "from-green-500 to-teal-600", topic: "Important global topics" },
        { title: "Innovation", icon: "💡", color: "from-yellow-500 to-orange-600", topic: "Innovation and invention" },
        { title: "Philosophy", icon: "🤔", color: "from-purple-500 to-pink-600", topic: "Philosophical questions" },
        { title: "Future Tech", icon: "🔮", color: "from-cyan-500 to-blue-600", topic: "Future technology" },
        { title: "Critical Thinking", icon: "🧠", color: "from-pink-500 to-red-600", topic: "Critical thinking skills" }
      ];
    }
  };

  const cards = getDiscoveryCards();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            onClick={() => onCardSelect(card.topic)}
            className="p-6 bg-white border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg rounded-2xl group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                {card.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  Tap to explore!
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickDiscoveryCards;
