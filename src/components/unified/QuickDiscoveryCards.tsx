
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DiscoveryCard {
  id: string;
  title: string;
  description: string;
  type: 'recent' | 'trending' | 'recommended';
  emoji: string;
  estimatedTime?: string;
  gradient: string;
}

interface QuickDiscoveryCardsProps {
  onCardSelect: (title: string) => void;
  childAge: number;
  recentExplorations?: any[];
}

const QuickDiscoveryCards: React.FC<QuickDiscoveryCardsProps> = ({
  onCardSelect,
  childAge,
  recentExplorations = []
}) => {
  const getDiscoveryCards = (): DiscoveryCard[] => {
    const baseCards = childAge <= 7 ? [
      {
        id: '1',
        title: 'Why do flowers smell sweet?',
        description: 'Discover the amazing world of plant scents! 🌺',
        type: 'recommended' as const,
        emoji: '🌸',
        estimatedTime: '5 min',
        gradient: 'from-pink-400/30 via-rose-300/20 to-pink-500/25'
      },
      {
        id: '2',
        title: 'How do birds fly?',
        description: 'Explore the magic of flight! ✈️',
        type: 'trending' as const,
        emoji: '🐦',
        estimatedTime: '7 min',
        gradient: 'from-blue-400/30 via-sky-300/20 to-cyan-500/25'
      },
      {
        id: '3',
        title: 'What makes thunder so loud?',
        description: 'Uncover the secrets of storms! ⚡',
        type: 'recommended' as const,
        emoji: '⛈️',
        estimatedTime: '6 min',
        gradient: 'from-purple-400/30 via-indigo-300/20 to-blue-500/25'
      },
      {
        id: '4',
        title: 'How do fish breathe underwater?',
        description: 'Dive into underwater mysteries! 🐠',
        type: 'trending' as const,
        emoji: '🐟',
        estimatedTime: '8 min',
        gradient: 'from-teal-400/30 via-cyan-300/20 to-blue-500/25'
      }
    ] : childAge <= 11 ? [
      {
        id: '1',
        title: 'How do submarines work underwater?',
        description: 'Dive into ocean engineering! 🚢',
        type: 'recommended' as const,
        emoji: '🚢',
        estimatedTime: '8 min',
        gradient: 'from-blue-500/30 via-indigo-400/20 to-purple-500/25'
      },
      {
        id: '2',
        title: 'Why do we dream?',
        description: 'Explore the mysteries of sleep! 💭',
        type: 'trending' as const,
        emoji: '💭',
        estimatedTime: '10 min',
        gradient: 'from-purple-500/30 via-pink-400/20 to-rose-500/25'
      },
      {
        id: '3',
        title: 'How does WiFi travel through walls?',
        description: 'Discover invisible waves around us! 📡',
        type: 'recommended' as const,
        emoji: '📡',
        estimatedTime: '9 min',
        gradient: 'from-green-400/30 via-emerald-300/20 to-teal-500/25'
      },
      {
        id: '4',
        title: 'What makes volcanoes erupt?',
        description: 'Explore Earth\'s fiery power! 🌋',
        type: 'trending' as const,
        emoji: '🌋',
        estimatedTime: '11 min',
        gradient: 'from-orange-500/30 via-red-400/20 to-pink-500/25'
      }
    ] : [
      {
        id: '1',
        title: 'How does CRISPR edit genes?',
        description: 'Explore cutting-edge genetic engineering! 🧬',
        type: 'recommended' as const,
        emoji: '🧬',
        estimatedTime: '12 min',
        gradient: 'from-emerald-500/30 via-green-400/20 to-teal-500/25'
      },
      {
        id: '2',
        title: 'What are black holes really?',
        description: 'Journey into space-time mysteries! 🕳️',
        type: 'trending' as const,
        emoji: '🕳️',
        estimatedTime: '15 min',
        gradient: 'from-indigo-600/30 via-purple-500/20 to-pink-500/25'
      },
      {
        id: '3',
        title: 'How do neural networks learn?',
        description: 'Understand artificial intelligence! 🤖',
        type: 'recommended' as const,
        emoji: '🤖',
        estimatedTime: '13 min',
        gradient: 'from-cyan-500/30 via-blue-400/20 to-indigo-500/25'
      },
      {
        id: '4',
        title: 'What is quantum computing?',
        description: 'Explore the future of computation! ⚛️',
        type: 'trending' as const,
        emoji: '⚛️',
        estimatedTime: '14 min',
        gradient: 'from-violet-500/30 via-purple-400/20 to-pink-500/25'
      }
    ];

    // Add recent explorations if available  
    const recentCards = recentExplorations.slice(0, 1).map((exploration, index) => ({
      id: `recent-${index}`,
      title: exploration.title,
      description: 'Continue your amazing journey! 🔄',
      type: 'recent' as const,
      emoji: '🔄',
      estimatedTime: '5 min',
      gradient: 'from-wonderwhiz-bright-pink/30 via-purple-400/20 to-wonderwhiz-vibrant-yellow/25'
    }));

    return [...recentCards, ...baseCards].slice(0, 6);
  };

  const cards = getDiscoveryCards();

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4" />;
      case 'recommended':
        return <Heart className="h-4 w-4" />;
      default:
        return <ArrowRight className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recent':
        return 'text-blue-300';
      case 'trending':
        return 'text-green-300';
      case 'recommended':
        return 'text-pink-300';
      default:
        return 'text-white/60';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.05,
            y: -5,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className={`p-6 bg-gradient-to-br ${card.gradient} backdrop-blur-lg border-2 border-white/30 shadow-xl cursor-pointer group overflow-hidden relative hover:border-wonderwhiz-bright-pink/50 transition-all duration-300`}
            onClick={() => onCardSelect(card.title)}
          >
            {/* Animated background sparkles */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-3xl drop-shadow-lg"
                >
                  {card.emoji}
                </motion.div>
                <div className="flex items-center gap-2">
                  <div className={`${getTypeColor(card.type)}`}>
                    {getCardIcon(card.type)}
                  </div>
                  <span className={`text-xs capitalize font-semibold ${getTypeColor(card.type)}`}>
                    {card.type}
                  </span>
                </div>
              </div>
              
              {card.estimatedTime && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-xs text-white/80 bg-white/15 px-3 py-1 rounded-full border border-white/20 font-semibold backdrop-blur-sm"
                >
                  ⏱️ {card.estimatedTime}
                </motion.div>
              )}
            </div>
            
            <h3 className="text-white font-bold text-lg mb-3 group-hover:text-wonderwhiz-vibrant-yellow transition-colors duration-300 drop-shadow-lg">
              {card.title}
            </h3>
            
            <p className="text-white/80 text-sm mb-4 font-medium">
              {card.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/90 hover:text-white hover:bg-white/20 p-0 h-auto font-bold group-hover:text-wonderwhiz-bright-pink transition-colors duration-300"
              >
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Start exploring!</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </Button>
            </div>

            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-bright-pink/10 via-purple-500/5 to-wonderwhiz-vibrant-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
              initial={false}
            />
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickDiscoveryCards;
