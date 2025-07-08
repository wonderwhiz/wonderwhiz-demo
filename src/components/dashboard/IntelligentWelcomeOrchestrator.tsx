import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Zap, Star, Heart, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IntelligentWelcomeOrchestratorProps {
  childProfile: any;
  onStartLearning: (topic: string) => void;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  recentActivity?: any[];
  mood?: 'curious' | 'excited' | 'focused' | 'playful';
}

const IntelligentWelcomeOrchestrator: React.FC<IntelligentWelcomeOrchestratorProps> = ({
  childProfile,
  onStartLearning,
  timeOfDay,
  recentActivity = [],
  mood = 'curious'
}) => {
  const [currentWelcome, setCurrentWelcome] = useState(0);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  
  const isYoungChild = (childProfile?.age || 10) <= 8;
  const childName = childProfile?.name || 'Explorer';

  // Time-based greetings with mood enhancement
  const getSmartGreeting = () => {
    const greetings = {
      morning: {
        curious: `🌅 Good morning, ${childName}! Ready to discover something amazing?`,
        excited: `☀️ Rise and shine, ${childName}! Your brain is hungry for adventure!`,
        focused: `🧠 Morning, ${childName}! Time to unlock some incredible knowledge!`,
        playful: `🎈 Hey there, ${childName}! Let's make today super fun and smart!`
      },
      afternoon: {
        curious: `🌞 Hi ${childName}! What's making you curious today?`,
        excited: `⚡ Afternoon energy, ${childName}! Ready to explore?`,
        focused: `🎯 Perfect timing, ${childName}! Your mind is sharp right now!`,
        playful: `🎪 Afternoon fun time, ${childName}! Learning can be your playground!`
      },
      evening: {
        curious: `🌙 Evening, ${childName}! Perfect time for some cozy learning!`,
        excited: `✨ What a day, ${childName}! One more adventure before bed?`,
        focused: `📚 Evening reflection time, ${childName}! Let's discover something deep!`,
        playful: `🌟 Wind-down learning, ${childName}! Gentle discoveries ahead!`
      }
    };
    
    return greetings[timeOfDay][mood];
  };

  // Intelligent topic suggestions based on context
  const generateContextualSuggestions = () => {
    const baseTopics = {
      morning: ['How do birds wake up?', 'Why is the sky blue?', 'What happens inside clouds?'],
      afternoon: ['How do plants eat sunlight?', 'Why do we need energy?', 'How do machines work?'],
      evening: ['Why do we dream?', 'How do stars shine?', 'What happens at night in the forest?']
    };

    const moodEnhanced = {
      curious: ['Why do cats purr?', 'How do rainbows form?', 'What\'s inside the Earth?'],
      excited: ['How fast can rockets go?', 'What\'s the biggest animal?', 'How do volcanoes work?'],
      focused: ['How does the brain work?', 'Why do we have different languages?', 'How is electricity made?'],
      playful: ['Why do we laugh?', 'How do cartoons move?', 'What makes things bouncy?']
    };

    // Mix time-based and mood-based suggestions
    const suggestions = [...baseTopics[timeOfDay], ...moodEnhanced[mood]];
    
    // Filter based on age
    if (isYoungChild) {
      return suggestions.filter(topic => 
        !topic.includes('electricity') && 
        !topic.includes('language') &&
        !topic.includes('brain work')
      );
    }
    
    return suggestions.slice(0, 6);
  };

  useEffect(() => {
    setDynamicSuggestions(generateContextualSuggestions());
    setPersonalizedMessage(getSmartGreeting());
  }, [timeOfDay, mood, childProfile]);

  // Rotating welcome messages for engagement
  const welcomeMessages = [
    personalizedMessage,
    `🎭 ${childName}, your curiosity is your superpower!`,
    `🚀 Ready to blast off into learning, ${childName}?`,
    `🔮 Every question you ask unlocks magic, ${childName}!`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWelcome((prev) => (prev + 1) % welcomeMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [welcomeMessages.length]);

  // Smart sparks animation based on activity
  const getSparkIntensity = () => {
    const activityLevel = recentActivity.length;
    return activityLevel > 3 ? 'high' : activityLevel > 1 ? 'medium' : 'low';
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-wonderwhiz-purple/20 via-wonderwhiz-bright-pink/10 to-wonderwhiz-vibrant-yellow/15 border-wonderwhiz-bright-pink/30 backdrop-blur-lg">
      {/* Intelligent Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: getSparkIntensity() === 'high' ? 20 : getSparkIntensity() === 'medium' ? 12 : 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: 0 
            }}
            animate={{ 
              y: [null, Math.random() * 100 + '%'],
              scale: [0, 1, 0.8, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2 
            }}
          >
            {mood === 'excited' ? <Zap className="h-4 w-4 text-wonderwhiz-vibrant-yellow/60" /> :
             mood === 'focused' ? <Brain className="h-4 w-4 text-wonderwhiz-cyan/60" /> :
             mood === 'playful' ? <Heart className="h-4 w-4 text-wonderwhiz-bright-pink/60" /> :
             <Sparkles className="h-4 w-4 text-wonderwhiz-purple/60" />}
          </motion.div>
        ))}
      </div>

      <CardContent className="relative z-10 p-8">
        {/* Dynamic Welcome Message */}
        <div className="text-center mb-8">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentWelcome}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              {welcomeMessages[currentWelcome]}
            </motion.h1>
          </AnimatePresence>
          
          <motion.p 
            className="text-white/80 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isYoungChild 
              ? "Pick something cool to learn about!" 
              : "What fascinating topic shall we explore today?"
            }
          </motion.p>
        </div>

        {/* Smart Quick Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dynamicSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Button
                onClick={() => onStartLearning(suggestion)}
                variant="ghost"
                className="w-full h-auto p-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-left font-medium group-hover:text-wonderwhiz-vibrant-yellow transition-colors">
                    {suggestion}
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Rocket className="h-5 w-5 text-white/60 group-hover:text-wonderwhiz-bright-pink" />
                  </motion.div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Mood Indicator */}
        <motion.div 
          className="flex justify-center mt-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
            <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
            <span className="text-white/80 text-sm font-medium">
              {isYoungChild ? 'Feeling super smart!' : `${mood.charAt(0).toUpperCase() + mood.slice(1)} mode activated`}
            </span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default IntelligentWelcomeOrchestrator;