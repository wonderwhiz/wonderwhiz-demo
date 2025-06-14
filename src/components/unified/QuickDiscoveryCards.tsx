
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, TrendingUp, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DiscoveryCard {
  id: string;
  title: string;
  description: string;
  type: 'recent' | 'trending' | 'recommended';
  emoji: string;
  estimatedTime?: string;
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
        description: 'Discover the amazing world of plant scents',
        type: 'recommended' as const,
        emoji: '🌸',
        estimatedTime: '5 min'
      },
      {
        id: '2',
        title: 'How do birds fly?',
        description: 'Explore the magic of flight',
        type: 'trending' as const,
        emoji: '🐦',
        estimatedTime: '7 min'
      },
      {
        id: '3',
        title: 'What makes thunder so loud?',
        description: 'Uncover the secrets of storms',
        type: 'recommended' as const,
        emoji: '⛈️',
        estimatedTime: '6 min'
      }
    ] : childAge <= 11 ? [
      {
        id: '1',
        title: 'How do submarines work underwater?',
        description: 'Dive into ocean engineering',
        type: 'recommended' as const,
        emoji: '🚢',
        estimatedTime: '8 min'
      },
      {
        id: '2',
        title: 'Why do we dream?',
        description: 'Explore the mysteries of sleep',
        type: 'trending' as const,
        emoji: '💭',
        estimatedTime: '10 min'
      },
      {
        id: '3',
        title: 'How does WiFi travel through walls?',
        description: 'Discover invisible waves around us',
        type: 'recommended' as const,
        emoji: '📡',
        estimatedTime: '9 min'
      }
    ] : [
      {
        id: '1',
        title: 'How does CRISPR edit genes?',
        description: 'Explore cutting-edge genetic engineering',
        type: 'recommended' as const,
        emoji: '🧬',
        estimatedTime: '12 min'
      },
      {
        id: '2',
        title: 'What are black holes really?',
        description: 'Journey into space-time mysteries',
        type: 'trending' as const,
        emoji: '🕳️',
        estimatedTime: '15 min'
      },
      {
        id: '3',
        title: 'How do neural networks learn?',
        description: 'Understand artificial intelligence',
        type: 'recommended' as const,
        emoji: '🤖',
        estimatedTime: '13 min'
      }
    ];

    // Add recent explorations if available  
    const recentCards = recentExplorations.slice(0, 2).map((exploration, index) => ({
      id: `recent-${index}`,
      title: exploration.title,
      description: 'Continue where you left off',
      type: 'recent' as const,
      emoji: '🔄',
      estimatedTime: '5 min'
    }));

    return [...recentCards, ...baseCards].slice(0, 4);
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

  const getCardColor = (type: string) => {
    switch (type) {
      case 'recent':
        return 'from-blue-500/20 to-blue-600/10 border-blue-400/30';
      case 'trending':
        return 'from-green-500/20 to-green-600/10 border-green-400/30';
      case 'recommended':
        return 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/10 border-wonderwhiz-bright-pink/30';
      default:
        return 'from-white/10 to-white/5 border-white/20';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className={`p-4 bg-gradient-to-br ${getCardColor(card.type)} backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group`}
            onClick={() => onCardSelect(card.title)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{card.emoji}</span>
                <div className="flex items-center gap-1 text-white/60">
                  {getCardIcon(card.type)}
                  <span className="text-xs capitalize">{card.type}</span>
                </div>
              </div>
              {card.estimatedTime && (
                <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                  {card.estimatedTime}
                </span>
              )}
            </div>
            
            <h3 className="text-white font-semibold mb-2 group-hover:text-wonderwhiz-bright-pink transition-colors">
              {card.title}
            </h3>
            
            <p className="text-white/70 text-sm mb-3">
              {card.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white p-0 h-auto hover:bg-transparent"
              >
                Explore now
                <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickDiscoveryCards;
