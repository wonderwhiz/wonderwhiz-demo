import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Zap, Sparkles, Brain, Mic, ArrowRight } from 'lucide-react';

interface QuickActionPanelProps {
  childAge: number;
  onQuickStart: (topic: string) => void;
  recentTopics: Array<{
    title: string;
    progress: number;
  }>;
}

const QuickActionPanel: React.FC<QuickActionPanelProps> = ({
  childAge,
  onQuickStart,
  recentTopics
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const isYoungChild = childAge <= 8;

  const quickTopics = [
    { title: 'How do rockets work?', icon: '🚀', category: 'space' },
    { title: 'Why do cats purr?', icon: '🐱', category: 'animals' },
    { title: 'What makes rainbows?', icon: '🌈', category: 'science' },
    { title: 'How do computers think?', icon: '💻', category: 'technology' },
    { title: 'Why do we dream?', icon: '😴', category: 'body' },
    { title: 'How do plants grow?', icon: '🌱', category: 'nature' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onQuickStart(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      setIsListening(false);
    }, 2000);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-wonderwhiz-bright-pink/10 via-wonderwhiz-purple/10 to-wonderwhiz-deep-purple/10 border-2 border-wonderwhiz-bright-pink/20 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-10 h-10 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple rounded-xl flex items-center justify-center"
        >
          <Zap className="h-5 w-5 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white">
          {isYoungChild ? "🚀 What Makes You Curious?" : "⚡ Quick Discovery"}
        </h2>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isYoungChild 
              ? "Ask me anything! Like... How do birds fly?" 
              : "What would you like to explore today?"
            }
            className="pl-12 pr-20 py-4 text-lg bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:border-wonderwhiz-bright-pink focus:ring-2 focus:ring-wonderwhiz-bright-pink/20"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleVoiceInput}
              className={`rounded-xl ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
            >
              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white rounded-xl px-4"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Quick Topic Suggestions */}
      <div className="mb-6">
        <h3 className="text-white/80 font-medium mb-3">
          {isYoungChild ? "🎯 Try these amazing questions:" : "💡 Popular explorations:"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickTopics.slice(0, 6).map((topic, index) => (
            <motion.button
              key={topic.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onQuickStart(topic.title)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{topic.icon}</span>
                <span className="text-white/90 font-medium text-sm group-hover:text-white transition-colors">
                  {topic.title}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Voice Listening Indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <Card className="p-6 bg-white">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <Mic className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {isYoungChild ? "🎤 I'm listening!" : "🎙️ Listening..."}
              </h3>
              <p className="text-gray-600">
                {isYoungChild ? "Tell me what you want to learn about!" : "What would you like to explore?"}
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </Card>
  );
};

export default QuickActionPanel;