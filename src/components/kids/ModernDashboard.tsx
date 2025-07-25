import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Sparkles, 
  Star, 
  Book, 
  Users, 
  Menu, 
  Send, 
  Wand2, 
  ChevronRight, 
  BookOpen,
  Heart,
  Target,
  Zap,
  Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ModernDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
}

const ModernDashboard: React.FC<ModernDashboardProps> = ({
  childProfile,
  onSearch
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  
  const age = childProfile?.age || 10;
  const isYoung = age <= 8;

  const quickTopics = [
    { title: 'How do airplanes fly?', emoji: '✈️', category: 'Science' },
    { title: 'Why is the ocean blue?', emoji: '🌊', category: 'Nature' },
    { title: 'How do rainbows form?', emoji: '🌈', category: 'Weather' },
    { title: 'Why do we dream?', emoji: '😴', category: 'Body' },
    { title: 'How do plants grow?', emoji: '🌱', category: 'Biology' },
    { title: 'What makes thunder?', emoji: '⚡', category: 'Physics' },
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    try {
      onSearch(query.trim());
      toast.success('🎉 Creating your learning adventure!');
      setTimeout(() => {
        navigate(`/wonderwhiz/${childProfile?.id}`);
      }, 500);
    } catch (error) {
      toast.error('Something went wrong. Please try again!');
    } finally {
      setIsSearching(false);
      setSearchInput('');
    }
  };

  const handleQuickTopicClick = (topic: any) => {
    handleSearch(topic.title);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Hi {childProfile?.name}! 👋
                </h1>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              {childProfile?.sparks_balance > 0 && (
                <motion.div 
                  className="bg-amber-50 border border-amber-200 px-3 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="text-slate-900 font-bold text-sm">{childProfile?.sparks_balance}</span>
                  </div>
                </motion.div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profiles')}
                className="text-slate-700 hover:bg-slate-100 p-2 rounded-xl"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {isYoung ? "What makes you curious today? 🤔" : "Ready for your next discovery? 🚀"}
            </h2>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              {isYoung 
                ? "Ask me anything and I'll create a fun learning book just for you!" 
                : "Transform any question into an amazing learning adventure!"
              }
            </p>
          </div>

          {/* Search Bar */}
          <Card className="bg-white border border-slate-200 p-3 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder={isYoung ? "🌟 Ask me something awesome!" : "🔍 What sparks your curiosity?"}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSearch(searchInput);
                    }
                  }}
                  className="pl-12 pr-4 py-5 text-lg bg-white border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 rounded-xl"
                  disabled={isSearching}
                />
              </div>
              <Button
                onClick={() => handleSearch(searchInput)}
                disabled={isSearching || !searchInput.trim()}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-5 rounded-xl font-bold shadow-lg"
              >
                {isSearching ? (
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

        {/* Quick Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {isYoung ? "🎭 Fun Topics to Try!" : "🌟 Popular Discoveries"}
            </h3>
            <p className="text-slate-600">
              {isYoung ? "Tap any topic to start learning!" : "Choose a topic to begin exploring"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleQuickTopicClick(topic)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{topic.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                        {topic.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="bg-indigo-50 px-2 py-1 rounded-full text-indigo-600 font-medium">
                          {topic.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            onClick={() => navigate(`/wonderwhiz/${childProfile?.id}`)}
            variant="outline"
            size="lg"
            className="bg-white border border-slate-200 hover:bg-slate-50 hover:border-indigo-300 text-slate-900 h-auto py-6 px-6 rounded-xl font-semibold"
          >
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="h-6 w-6 text-indigo-500" />
              <span>📚 {isYoung ? "My Books" : "Encyclopedia"}</span>
            </div>
          </Button>
          
          <Button
            onClick={() => navigate('/parent-zone')}
            variant="outline"
            size="lg"
            className="bg-white border border-slate-200 hover:bg-slate-50 hover:border-indigo-300 text-slate-900 h-auto py-6 px-6 rounded-xl font-semibold"
          >
            <div className="flex flex-col items-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              <span>👨‍👩‍👧‍👦 {isYoung ? "Parents" : "Family Zone"}</span>
            </div>
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Book, label: "Books Created", value: "5", color: "bg-blue-50 text-blue-600" },
            { icon: Star, label: "Sparks Earned", value: childProfile?.sparks_balance || "0", color: "bg-amber-50 text-amber-600" },
            { icon: Target, label: "Topics Explored", value: "12", color: "bg-green-50 text-green-600" },
            { icon: Trophy, label: "Learning Streak", value: "3 days", color: "bg-purple-50 text-purple-600" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-white border border-slate-200 p-4 rounded-xl text-center hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default ModernDashboard;