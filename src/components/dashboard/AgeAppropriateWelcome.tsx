import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Brain, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgeAppropriateWelcomeProps {
  childProfile: any;
  onStartLearning: (topic: string) => void;
}

const AgeAppropriateWelcome: React.FC<AgeAppropriateWelcomeProps> = ({
  childProfile,
  onStartLearning
}) => {
  const age = childProfile?.age || 10;
  const name = childProfile?.name || 'Explorer';
  
  // Age-specific suggestions
  const getSuggestions = () => {
    if (age <= 7) {
      return [
        'Why do dogs wag their tails?',
        'How do flowers grow?',
        'What makes the sky blue?'
      ];
    } else if (age <= 11) {
      return [
        'How do rockets reach space?',
        'Why do we have different seasons?',
        'How do computers work?'
      ];
    } else {
      return [
        'How does artificial intelligence work?',
        'What causes climate change?',
        'How do vaccines protect us?'
      ];
    }
  };

  const suggestions = getSuggestions();

  if (age <= 7) {
    return (
      <Card className="bg-[#1A0B2E] border-2 border-wonderwhiz-bright-pink/60">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🚀
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Hi {name}! Ready to learn?
            </h2>
            <p className="text-white/90 text-lg">
              Pick something fun to discover!
            </p>
          </div>
          
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <Button
                key={suggestion}
                onClick={() => onStartLearning(suggestion)}
                className="w-full h-16 text-lg bg-white/90 hover:bg-white text-[#1A0B2E] font-bold rounded-xl"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1A0B2E] border-2 border-wonderwhiz-purple/60">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Brain className="h-8 w-8 text-wonderwhiz-cyan" />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Welcome back, {name}
            </h2>
            <p className="text-white/80">
              What sparks your curiosity today?
            </p>
          </div>
        </div>
        
        <div className="grid gap-3">
          {suggestions.map((suggestion, index) => (
            <Button
              key={suggestion}
              onClick={() => onStartLearning(suggestion)}
              variant="ghost"
              className="justify-start h-auto p-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
            >
              <Star className="h-5 w-5 mr-3 text-wonderwhiz-vibrant-yellow" />
              <span className="text-left">{suggestion}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgeAppropriateWelcome;