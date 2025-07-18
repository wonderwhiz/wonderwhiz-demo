import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Star, Book, Users, Settings, LogOut, Menu, Search, Wand2, Lightbulb, Heart, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface MobileResponsiveDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
}

interface ChatMessage {
  id: string;
  type: 'question' | 'answer';
  content: string;
  funFacts?: string[];
  relatedQuestions?: string[];
  timestamp: Date;
}

const MobileResponsiveDashboard: React.FC<MobileResponsiveDashboardProps> = ({
  childProfile,
  onSearch
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const age = childProfile?.age || 10;
  const isVeryYoung = age <= 8;

  // Welcome message with age-appropriate content
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'answer',
        content: isVeryYoung 
          ? `Hi ${childProfile?.name}! 🌟 I'm your learning buddy! What cool thing do you want to discover today?`
          : `Hey ${childProfile?.name}! Ready to explore amazing topics and learn something awesome?`,
        relatedQuestions: isVeryYoung ? [
          "🦖 Why did dinosaurs disappear?",
          "🌈 How are rainbows made?", 
          "🐙 How many hearts do octopuses have?",
          "🌙 Why does the moon change shape?"
        ] : [
          "🕳️ How do black holes work?",
          "🧠 Why do we dream?", 
          "💎 How are diamonds formed?",
          "🎵 What makes music sound beautiful?"
        ],
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [childProfile?.name, isVeryYoung, messages.length]);

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'question', 
      content: question.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      onSearch(question.trim());
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAnswer = generateMockAnswer(question, isVeryYoung);
      const answerMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'answer',
        content: mockAnswer.content,
        funFacts: mockAnswer.funFacts,
        relatedQuestions: mockAnswer.relatedQuestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, answerMessage]);
      
      toast.success(isVeryYoung ? '🎉 +5 sparks! Great question!' : '✨ +5 sparks for exploring!', {
        duration: 2000,
      });
    } catch (error) {
      toast.error('Oops! Something went wrong. Try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSubmit(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(inputValue);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('See you soon! 👋');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-background touch-manipulation overscroll-contain">
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/20 shadow-sm">
        <div className="max-w-full mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          {/* Compact Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-brand to-accent-info rounded-xl flex items-center justify-center shadow-lg">
              <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-text-primary">
                Hey {childProfile?.name}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary font-medium">Ready for an adventure?</p>
            </div>
          </motion.div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Sparks Counter */}
            {childProfile?.sparks_balance > 0 && (
              <motion.div 
                className="bg-gradient-to-r from-accent-warning/20 to-accent-warning/10 border border-accent-warning/30 px-3 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent-warning fill-current" />
                  <span className="text-text-primary font-bold text-sm">{childProfile?.sparks_balance}</span>
                </div>
              </motion.div>
            )}
            
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="text-text-primary hover:bg-interactive-hover relative p-2 touch-friendly"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-card/98 backdrop-blur-xl border-b border-border/20 p-4 z-50 shadow-lg"
            >
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => {
                    setShowMenu(false);
                    navigate(`/wonderwhiz/${childProfile?.id}`);
                  }}
                  className="bg-interactive-hover hover:bg-interactive-active text-text-primary font-semibold rounded-xl py-3 px-4 touch-friendly"
                >
                  <Book className="w-4 h-4 mr-2" />
                  📚 Books
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/parent-zone');
                  }}
                  className="border-border hover:bg-interactive-hover text-text-primary font-semibold rounded-xl py-3 px-4 touch-friendly"
                >
                  <Users className="w-4 h-4 mr-2" />
                  👨‍👩‍👧‍👦 Parents
                </Button>
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/profiles');
                  }}
                  className="text-text-primary hover:bg-interactive-hover font-semibold rounded-xl py-3 px-4 touch-friendly"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Switch Kid
                </Button>
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => {
                    setShowMenu(false);
                    handleSignOut();
                  }}
                  className="text-accent-error hover:bg-accent-error/10 font-semibold rounded-xl py-3 px-4 touch-friendly"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Chat Messages - Mobile Optimized */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {message.type === 'question' ? (
                // User Question - Mobile Friendly
                <div className="flex justify-end">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-accent-brand/15 to-accent-info/15 backdrop-blur-sm border border-border/40 rounded-3xl px-4 sm:px-6 py-4 sm:py-5 max-w-[85%] sm:max-w-md shadow-lg"
                  >
                    <p className="text-text-primary font-semibold text-base sm:text-lg leading-relaxed">{message.content}</p>
                  </motion.div>
                </div>
              ) : (
                // AI Answer - Mobile Friendly
                <div className="flex justify-start">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-card/80 backdrop-blur-sm border border-border/40 rounded-3xl p-4 sm:p-6 w-full sm:max-w-4xl shadow-lg"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent-warning to-accent-brand rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1 space-y-4 sm:space-y-6">
                        <p className="text-text-primary text-base sm:text-lg font-medium leading-relaxed">
                          {message.content}
                        </p>
                        
                        {/* Fun Facts - Mobile Optimized */}
                        {message.funFacts && message.funFacts.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-accent-warning/15 to-accent-success/15 border border-accent-warning/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-md"
                          >
                            <h4 className="text-accent-warning font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                              {isVeryYoung ? "🤯 Wow Facts!" : "✨ Amazing Details!"}
                            </h4>
                            <div className="space-y-3 sm:space-y-4">
                              {message.funFacts.map((fact, index) => (
                                <motion.div 
                                  key={index} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  className="flex items-start gap-3 p-3 sm:p-4 bg-surface-secondary/50 rounded-xl sm:rounded-2xl"
                                >
                                  <span className="text-accent-warning text-xl sm:text-2xl flex-shrink-0">{isVeryYoung ? '🎉' : '💡'}</span>
                                  <p className="text-text-primary font-medium text-sm sm:text-base leading-relaxed">{fact}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Related Questions - Mobile Optimized */}
                        {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-3 sm:space-y-4"
                          >
                            <h4 className="text-text-secondary font-semibold text-sm sm:text-base flex items-center gap-2">
                              <Search className="h-4 w-4" />
                              {isVeryYoung ? "Ask me more:" : "Continue exploring:"}
                            </h4>
                            <div className="grid gap-2 sm:gap-3">
                              {message.relatedQuestions.map((question, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                >
                                  <Button
                                    onClick={() => handleQuickQuestion(question)}
                                    variant="outline"
                                    size="default"
                                    className="w-full text-left justify-start bg-surface-secondary/30 hover:bg-interactive-hover border-border/30 hover:border-accent-brand/40 text-text-primary h-auto py-3 sm:py-4 px-4 sm:px-5 rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base font-medium touch-friendly"
                                  >
                                    {question}
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading State - Mobile Optimized */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-card/80 backdrop-blur-sm border border-border/40 rounded-3xl p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-warning to-accent-brand rounded-xl flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-text-tertiary rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
                <span className="text-text-secondary text-sm sm:text-base">
                  {isVeryYoung ? "Thinking..." : "Exploring..."}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Mobile-Optimized Input Area */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/20 bg-card/98 backdrop-blur-xl p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder={isVeryYoung ? "🤔 What do you want to learn?" : "💭 What sparks your curiosity?"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="bg-surface-secondary/80 border-border/40 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg text-text-primary placeholder:text-text-tertiary focus:border-accent-brand/50 focus:ring-2 focus:ring-accent-brand/30 disabled:opacity-50 font-medium shadow-inner touch-friendly"
              />
              {inputValue && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2"
                >
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-accent-brand animate-pulse" />
                </motion.div>
              )}
            </div>
            <Button
              onClick={() => handleSubmit(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-accent-brand to-accent-info hover:from-accent-info hover:to-accent-brand text-white p-4 sm:p-5 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold min-w-[3.5rem] sm:min-w-[4rem] touch-friendly"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
                </motion.div>
              ) : (
                <Send className="h-6 w-6 sm:h-7 sm:w-7" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for mock answers
const generateMockAnswer = (question: string, isVeryYoung: boolean) => {
  const answers = {
    young: {
      content: "Great question! Let me tell you something amazing about that...",
      funFacts: [
        "Did you know this is super cool?",
        "Here's something that might surprise you!",
        "This is one of my favorite facts!"
      ],
      relatedQuestions: [
        "🌟 What else would you like to know?",
        "🎈 How about this fun topic?",
        "🦋 Want to learn about something else?"
      ]
    },
    older: {
      content: "Excellent question! Here's what makes this topic fascinating...",
      funFacts: [
        "This connects to many other interesting concepts",
        "Scientists have discovered amazing things about this",
        "There's still so much we're learning about this topic"
      ],
      relatedQuestions: [
        "🔬 How does this relate to science?",
        "🌍 What impact does this have on our world?", 
        "🤔 What questions does this raise?"
      ]
    }
  };
  
  return isVeryYoung ? answers.young : answers.older;
};

export default MobileResponsiveDashboard;