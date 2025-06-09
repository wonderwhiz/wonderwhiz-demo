
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Target, BookOpen, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CuriosityStep {
  id: string;
  title: string;
  description: string;
  type: 'question' | 'explore' | 'create' | 'connect';
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  sparksReward: number;
}

interface CuriosityChain {
  id: string;
  title: string;
  theme: string;
  steps: CuriosityStep[];
  currentStep: number;
  totalSteps: number;
  estimatedTime: string;
  ageAppropriate: boolean;
}

interface CuriosityChainsProps {
  currentTopic?: string;
  childAge: number;
  interests: string[];
  onStepSelect: (step: CuriosityStep) => void;
  className?: string;
}

const CuriosityChains: React.FC<CuriosityChainsProps> = ({
  currentTopic,
  childAge,
  interests,
  onStepSelect,
  className
}) => {
  const [chains, setChains] = useState<CuriosityChain[]>([]);
  const [activeChain, setActiveChain] = useState<CuriosityChain | null>(null);

  // Generate curiosity chains based on current topic and interests
  useEffect(() => {
    const generateChains = () => {
      const sampleChains: CuriosityChain[] = [
        {
          id: 'space-explorer',
          title: 'Space Explorer Journey',
          theme: 'astronomy',
          currentStep: 1,
          totalSteps: 5,
          estimatedTime: '15 min',
          ageAppropriate: childAge >= 6,
          steps: [
            {
              id: 'what-are-stars',
              title: 'What are stars?',
              description: 'Discover what makes stars shine',
              type: 'question',
              difficulty: 'easy',
              completed: true,
              sparksReward: 10
            },
            {
              id: 'solar-system',
              title: 'Explore our Solar System',
              description: 'Journey through the planets',
              type: 'explore',
              difficulty: 'medium',
              completed: false,
              sparksReward: 15
            },
            {
              id: 'design-spaceship',
              title: 'Design a Spaceship',
              description: 'Create your dream space vehicle',
              type: 'create',
              difficulty: 'medium',
              completed: false,
              sparksReward: 20
            },
            {
              id: 'life-on-mars',
              title: 'Could we live on Mars?',
              description: 'Explore the possibilities',
              type: 'question',
              difficulty: 'hard',
              completed: false,
              sparksReward: 25
            },
            {
              id: 'space-connections',
              title: 'How does space affect Earth?',
              description: 'Connect cosmic and earthly phenomena',
              type: 'connect',
              difficulty: 'hard',
              completed: false,
              sparksReward: 30
            }
          ]
        },
        {
          id: 'ocean-mysteries',
          title: 'Ocean Mysteries',
          theme: 'marine-biology',
          currentStep: 0,
          totalSteps: 4,
          estimatedTime: '12 min',
          ageAppropriate: childAge >= 5,
          steps: [
            {
              id: 'deep-sea-creatures',
              title: 'What lives in the deep ocean?',
              description: 'Meet amazing deep-sea creatures',
              type: 'explore',
              difficulty: 'easy',
              completed: false,
              sparksReward: 10
            },
            {
              id: 'ocean-currents',
              title: 'How do ocean currents work?',
              description: 'Understand water movement',
              type: 'question',
              difficulty: 'medium',
              completed: false,
              sparksReward: 15
            },
            {
              id: 'coral-reef',
              title: 'Design a coral reef',
              description: 'Create an underwater ecosystem',
              type: 'create',
              difficulty: 'medium',
              completed: false,
              sparksReward: 20
            },
            {
              id: 'ocean-climate',
              title: 'How do oceans affect weather?',
              description: 'Connect oceans and climate',
              type: 'connect',
              difficulty: 'hard',
              completed: false,
              sparksReward: 25
            }
          ]
        }
      ];

      // Filter chains based on topic relevance and age appropriateness
      const relevantChains = sampleChains.filter(chain => {
        if (!chain.ageAppropriate) return false;
        if (currentTopic) {
          return currentTopic.toLowerCase().includes(chain.theme) ||
                 chain.theme.includes(currentTopic.toLowerCase()) ||
                 interests.some(interest => 
                   interest.toLowerCase().includes(chain.theme) ||
                   chain.theme.includes(interest.toLowerCase())
                 );
        }
        return interests.some(interest => 
          interest.toLowerCase().includes(chain.theme) ||
          chain.theme.includes(interest.toLowerCase())
        );
      });

      setChains(relevantChains.length > 0 ? relevantChains : sampleChains.slice(0, 1));
    };

    generateChains();
  }, [currentTopic, childAge, interests]);

  const getStepIcon = (type: CuriosityStep['type']) => {
    switch (type) {
      case 'question': return Lightbulb;
      case 'explore': return BookOpen;
      case 'create': return Sparkles;
      case 'connect': return Target;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: CuriosityStep['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleStepClick = (step: CuriosityStep, chain: CuriosityChain) => {
    setActiveChain(chain);
    onStepSelect(step);
  };

  if (chains.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Continue Your Journey
        </h3>
        <p className="text-white/70 text-sm">
          Follow these curiosity chains to deepen your understanding
        </p>
      </div>

      <div className="space-y-4">
        {chains.map((chain) => (
          <Card key={chain.id} className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white font-medium">{chain.title}</h4>
                <p className="text-white/60 text-sm">
                  {chain.currentStep}/{chain.totalSteps} steps • {chain.estimatedTime}
                </p>
              </div>
              <Badge variant="outline" className="text-wonderwhiz-bright-pink border-wonderwhiz-bright-pink/30">
                {Math.round((chain.currentStep / chain.totalSteps) * 100)}%
              </Badge>
            </div>

            <div className="space-y-2">
              {chain.steps.map((step, index) => {
                const IconComponent = getStepIcon(step.type);
                const isNext = index === chain.currentStep;
                const isAccessible = index <= chain.currentStep;

                return (
                  <motion.div
                    key={step.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      step.completed
                        ? 'bg-green-500/20 border border-green-500/30'
                        : isNext
                        ? 'bg-wonderwhiz-bright-pink/20 border border-wonderwhiz-bright-pink/30'
                        : 'bg-white/5 border border-white/10'
                    }`}
                    whileHover={isAccessible ? { scale: 1.02 } : {}}
                  >
                    <div className={`p-1.5 rounded-full ${
                      step.completed
                        ? 'bg-green-500/30'
                        : isNext
                        ? 'bg-wonderwhiz-bright-pink/30'
                        : 'bg-white/10'
                    }`}>
                      <IconComponent className={`h-3 w-3 ${
                        step.completed
                          ? 'text-green-400'
                          : isNext
                          ? 'text-wonderwhiz-bright-pink'
                          : 'text-white/50'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className={`text-sm font-medium ${
                        step.completed || isNext ? 'text-white' : 'text-white/60'
                      }`}>
                        {step.title}
                      </h5>
                      <p className="text-xs text-white/50">{step.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`text-xs ${getDifficultyColor(step.difficulty)}`}
                      >
                        {step.difficulty}
                      </Badge>
                      
                      {isAccessible && !step.completed && (
                        <Button
                          size="sm"
                          onClick={() => handleStepClick(step, chain)}
                          className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 h-6 px-2 text-xs"
                        >
                          Start
                        </Button>
                      )}
                      
                      {step.completed && (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <Sparkles className="h-3 w-3" />
                          <span>+{step.sparksReward}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {chain.currentStep < chain.totalSteps && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Next: {chain.steps[chain.currentStep]?.title}</span>
                  <span>+{chain.steps[chain.currentStep]?.sparksReward} Sparks</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default CuriosityChains;
