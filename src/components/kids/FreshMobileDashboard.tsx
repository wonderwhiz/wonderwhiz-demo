import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Star, Book, Users, Menu, Search, Wand2, Lightbulb, Heart, Zap, ChevronRight, Compass, Home, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface FreshMobileDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
}

interface QuickTopic {
  id: string;
  title: string;
  emoji: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ageAppropriate: boolean;
}

const FreshMobileDashboard: React.FC<FreshMobileDashboardProps> = ({
  childProfile,
  onSearch
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const age = childProfile?.age || 10;
  const isYoung = age <= 8;

  const quickTopics: QuickTopic[] = [
    { id: '1', title: 'How do airplanes fly?', emoji: '✈️', category: 'Science', difficulty: 'Easy', ageAppropriate: true },
    { id: '2', title: 'Why is the ocean blue?', emoji: '🌊', category: 'Nature', difficulty: 'Easy', ageAppropriate: true },
    { id: '3', title: 'How do rainbows form?', emoji: '🌈', category: 'Weather', difficulty: 'Easy', ageAppropriate: true },
    { id: '4', title: 'Why do we dream?', emoji: '😴', category: 'Body', difficulty: isYoung ? 'Easy' : 'Medium', ageAppropriate: true },
    { id: '5', title: 'How do plants grow?', emoji: '🌱', category: 'Nature', difficulty: 'Easy', ageAppropriate: true },
    { id: '6', title: 'What makes thunder?', emoji: '⚡', category: 'Weather', difficulty: 'Easy', ageAppropriate: true },
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setInputValue('');
    setShowTopics(false);

    try {
      onSearch(query.trim());
      toast.success(isYoung ? '🎉 Creating your adventure!' : '✨ Generating your exploration!');
      
      // Navigate to WonderWhiz
      setTimeout(() => {
        navigate(`/wonderwhiz/${childProfile?.id}`);
      }, 500);
    } catch (error) {
      toast.error('Oops! Try again!');
      setShowTopics(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTopic = (topic: QuickTopic) => {
    handleSearch(topic.title);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-tertiary">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-surface-elevated/95 backdrop-blur-lg border-b border-gray-200/30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent-brand to-accent-info rounded-2xl flex items-center justify-center shadow-lg">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">
                Hi {childProfile?.name}! 👋
              </h1>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            {childProfile?.sparks_balance > 0 && (
              <motion.div 
                className="bg-gradient-to-r from-accent-warning/20 to-accent-warning/10 border border-accent-warning/30 px-3 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent-warning fill-current" />
                  <span className="text-text-primary font-bold text-sm">{childProfile?.sparks_balance}</span>
                </div>
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profiles')}
              className="text-text-primary hover:bg-surface-secondary p-2 rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              {isYoung ? "What makes you curious today? 🤔" : "Ready for your next discovery? 🚀"}
            </h2>
            <p className="text-lg text-text-secondary font-medium">
              {isYoung ? "Ask me anything and I'll create a fun book just for you!" : "Transform any question into an amazing learning adventure!"}
            </p>
          </div>

          {/* Search Input */}
          <Card className="bg-surface-elevated/80 border-gray-200/50 p-2 rounded-3xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={isYoung ? "🌟 Ask me something awesome!" : "🔍 What sparks your curiosity?"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-14 pr-4 py-6 text-lg bg-transparent border-none text-text-primary placeholder:text-text-tertiary focus:ring-0 font-medium rounded-3xl"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={() => handleSearch(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                size="lg"
                className="bg-gradient-to-r from-accent-brand to-accent-info hover:from-accent-info hover:to-accent-brand text-white px-8 py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    {isYoung ? "Create!" : "Explore!"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Quick Topics Grid */}
        <AnimatePresence>
          {showTopics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  {isYoung ? "🎭 Fun Topics to Try!" : "🌟 Popular Discoveries"}
                </h3>
                <p className="text-text-secondary">
                  {isYoung ? "Tap any topic to start learning!" : "Choose a topic to begin exploring"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="bg-surface-elevated/90 border-gray-200/50 p-6 rounded-3xl hover:border-accent-brand/40 transition-all cursor-pointer hover:shadow-lg group backdrop-blur-sm"
                      onClick={() => handleQuickTopic(topic)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl flex-shrink-0">{topic.emoji}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-text-primary text-lg mb-2 group-hover:text-accent-brand transition-colors">
                            {topic.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-text-tertiary">
                            <span className="bg-accent-brand/10 px-2 py-1 rounded-full text-accent-brand font-medium">
                              {topic.category}
                            </span>
                            <span>•</span>
                            <span>{topic.difficulty}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-text-tertiary group-hover:text-accent-brand transition-colors" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            onClick={() => navigate(`/wonderwhiz/${childProfile?.id}`)}
            variant="outline"
            size="lg"
            className="bg-surface-elevated/80 border-gray-200/50 hover:bg-surface-secondary hover:border-accent-brand/40 text-text-primary h-auto py-6 px-6 rounded-2xl font-semibold backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="h-6 w-6 text-accent-brand" />
              <span>📚 {isYoung ? "My Books" : "Encyclopedia"}</span>
            </div>
          </Button>
          
          <Button
            onClick={() => navigate('/parent-zone')}
            variant="outline"
            size="lg"
            className="bg-surface-elevated/80 border-gray-200/50 hover:bg-surface-secondary hover:border-accent-brand/40 text-text-primary h-auto py-6 px-6 rounded-2xl font-semibold backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-2">
              <Users className="h-6 w-6 text-accent-info" />
              <span>👨‍👩‍👧‍👦 {isYoung ? "Parents" : "Family Zone"}</span>
            </div>
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { icon: Book, label: "Books", value: "12", color: "from-blue-400 to-blue-600" },
            { icon: Star, label: "Sparks", value: childProfile?.sparks_balance || "0", color: "from-yellow-400 to-yellow-600" },
            { icon: Heart, label: "Streak", value: "5", color: "from-pink-400 to-pink-600" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-surface-elevated/90 border-gray-200/50 p-6 rounded-2xl text-center hover:shadow-lg transition-all backdrop-blur-sm">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{stat.value}</div>
                <div className="text-text-secondary text-sm font-medium">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

// Mock answer generator for development
const generateMockAnswer = (question: string, isYoung: boolean) => {
  const answers = {
    airplane: {
      content: isYoung 
        ? "Airplanes fly because of special curved wings that push air down, which lifts the plane up! It's like magic, but it's really science! ✈️"
        : "Airplanes achieve flight through four main forces: lift (generated by wing shape), thrust (from engines), weight (gravity pulling down), and drag (air resistance). The curved wing design creates different air pressures above and below, generating lift!",
      funFacts: isYoung 
        ? ["The first airplane flew for only 12 seconds!", "Some planes can fly faster than sound!", "Birds taught us how to fly!"]
        : ["The Wright brothers' first flight was shorter than a Boeing 747 wingspan", "Modern jets can reach speeds of Mach 2+", "Wing design is based on bird flight patterns studied for centuries"],
      relatedQuestions: isYoung
        ? ["🚁 How do helicopters fly?", "🦅 How do birds fly?", "🚀 How do rockets work?"]
        : ["How do helicopters achieve vertical flight?", "What's the difference between jet and propeller engines?", "How do spacecraft navigate in zero gravity?"]
    },
    ocean: {
      content: isYoung
        ? "The ocean looks blue because water likes blue light! When sunlight hits the water, blue light bounces back to our eyes while other colors get absorbed. It's like the ocean is choosing its favorite color! 🌊"
        : "Ocean water appears blue due to selective absorption and scattering of light. Water molecules absorb longer wavelengths (reds, oranges) more readily than shorter ones (blues), and blue light is scattered back toward our eyes.",
      funFacts: isYoung
        ? ["The deepest part of the ocean is deeper than Mount Everest is tall!", "Oceans contain 99% of Earth's living space!", "There are underwater waterfalls in the ocean!"]
        : ["The Mariana Trench reaches 36,200 feet deep", "Oceans hold 97% of Earth's water", "Ocean currents transport heat globally, affecting climate"],
      relatedQuestions: isYoung
        ? ["🐙 What lives in the deep ocean?", "🌊 Why are waves made?", "🏝️ How are islands formed?"]
        : ["How do ocean currents affect global weather?", "What causes bioluminescence in marine life?", "How do underwater volcanoes form islands?"]
    }
  };

  // Simple matching logic
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes('airplane') || lowerQuestion.includes('fly')) {
    return answers.airplane;
  } else if (lowerQuestion.includes('ocean') || lowerQuestion.includes('blue')) {
    return answers.ocean;
  }
  
  // Default response
  return {
    content: isYoung 
      ? "That's such a cool question! I love how curious you are! Let me think about the best way to explain this amazing topic to you! 🤔✨"
      : "What an intriguing question! This topic opens up fascinating areas of exploration. Let me break this down into digestible, engaging information for you!",
    funFacts: isYoung
      ? ["Every question leads to new discoveries!", "Scientists ask questions just like you!", "Learning is the greatest adventure!"]
      : ["Curiosity drives all scientific advancement", "Every expert was once a beginner with questions", "Knowledge builds upon previous discoveries"],
    relatedQuestions: isYoung
      ? ["🔬 How do scientists discover things?", "🌟 What makes stars shine?", "🦖 What happened to the dinosaurs?"]
      : ["How do researchers approach complex problems?", "What role does hypothesis testing play in discovery?", "How do breakthrough discoveries happen?"]
  };
};

export default FreshMobileDashboard;