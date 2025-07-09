import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Camera, Sparkles, Star } from 'lucide-react';

interface KidsFriendlyDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
  onImageUpload: (file: File) => void;
  isGenerating: boolean;
  streakDays: number;
  sparksBalance: number;
}

const KidsFriendlyDashboard: React.FC<KidsFriendlyDashboardProps> = ({
  childProfile,
  onSearch,
  onImageUpload,
  isGenerating,
  streakDays,
  sparksBalance
}) => {
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const age = childProfile?.age || 10;
  const isVeryYoung = age <= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isGenerating) {
      onSearch(query.trim());
      setQuery('');
      setShowSearch(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const quickQuestions = isVeryYoung 
    ? [
        { emoji: "🦕", text: "What do dinosaurs eat?", color: "bg-green-400" },
        { emoji: "🌈", text: "Why is the sky blue?", color: "bg-blue-400" },
        { emoji: "🌱", text: "How do flowers grow?", color: "bg-pink-400" }
      ]
    : age <= 11
    ? [
        { emoji: "🚀", text: "How do rockets work?", color: "bg-purple-400" },
        { emoji: "⚡", text: "What is electricity?", color: "bg-yellow-400" },
        { emoji: "🌍", text: "Why do we have seasons?", color: "bg-green-400" }
      ]
    : [
        { emoji: "🧠", text: "How does the brain work?", color: "bg-indigo-400" },
        { emoji: "🌡️", text: "What causes climate change?", color: "bg-red-400" },
        { emoji: "💡", text: "How do computers think?", color: "bg-cyan-400" }
      ];

  if (showSearch) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-purple flex items-center justify-center p-6"
      >
        <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-sm">
          <div className="p-8 text-center space-y-6">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl font-bold text-white">
              {isVeryYoung ? "What do you want to know?" : "What sparks your curiosity?"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isVeryYoung ? "Ask me anything!" : "Type your question..."}
                className="text-lg h-14 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                autoFocus
              />
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={!query.trim() || isGenerating}
                  className="flex-1 h-12 bg-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/80 text-white font-bold"
                >
                  {isGenerating ? "🔮 Creating..." : isVeryYoung ? "Let's Learn! ✨" : "Explore! 🚀"}
                </Button>
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isGenerating}
                  />
                  <Button
                    type="button"
                    className="h-12 w-12 bg-white/20 hover:bg-white/30 border border-white/30"
                    disabled={isGenerating}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </Button>
                </label>
              </div>
            </form>
            
            <Button
              onClick={() => setShowSearch(false)}
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              ← Back
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-deep-purple p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Simple Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">
            {isVeryYoung ? "🌟" : age <= 11 ? "🚀" : "💫"}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {isVeryYoung ? `Hi ${childProfile?.name}!` : `Hey ${childProfile?.name}!`}
          </h1>
          <p className="text-xl text-white/80">
            {isVeryYoung ? "Ready to discover something amazing?" : "What adventure shall we go on today?"}
          </p>
        </motion.div>

        {/* Quick Stats - Simplified */}
        {(sparksBalance > 0 || streakDays > 0) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center gap-6"
          >
            {sparksBalance > 0 && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Star className="h-6 w-6 text-wonderwhiz-vibrant-yellow fill-current" />
                <span className="text-white font-bold text-lg">{sparksBalance}</span>
              </div>
            )}
            
            {streakDays > 0 && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="text-2xl">🔥</span>
                <span className="text-white font-bold text-lg">{streakDays} days</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Main Action - Giant Search Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => setShowSearch(true)}
            className="h-32 w-full max-w-md bg-gradient-to-r from-wonderwhiz-cyan to-wonderwhiz-bright-pink hover:from-wonderwhiz-cyan/80 hover:to-wonderwhiz-bright-pink/80 text-white font-bold text-2xl rounded-3xl shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <Search className="h-8 w-8" />
              {isVeryYoung ? "Ask Me Anything!" : "Start Learning!"}
            </div>
          </Button>
        </motion.div>

        {/* Quick Questions */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-center text-white text-xl font-semibold">
            {isVeryYoung ? "Or try these fun questions:" : "Quick ideas:"}
          </h2>
          
          <div className="grid gap-4">
            {quickQuestions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Button
                  onClick={() => onSearch(question.text)}
                  disabled={isGenerating}
                  className={`w-full h-16 ${question.color} hover:opacity-90 text-white font-semibold text-lg rounded-2xl shadow-lg flex items-center gap-4 justify-start px-6`}
                >
                  <span className="text-3xl">{question.emoji}</span>
                  <span>{question.text}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-8 text-center">
                <div className="text-6xl mb-4">🔮</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isVeryYoung ? "Making magic happen..." : "Creating your learning adventure..."}
                </h3>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wonderwhiz-cyan"></div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KidsFriendlyDashboard;