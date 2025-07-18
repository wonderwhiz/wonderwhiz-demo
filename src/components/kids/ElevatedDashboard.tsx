import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Star, Book, Users, Settings, LogOut, Menu, Search, Wand2, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ElevatedDashboardProps {
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

const ElevatedDashboard: React.FC<ElevatedDashboardProps> = ({
  childProfile,
  onSearch
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const age = childProfile?.age || 10;
  const isVeryYoung = age <= 8;

  // Welcome message 
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'answer',
        content: isVeryYoung 
          ? `Hi ${childProfile?.name}! ✨ I'm here to help you discover amazing things! What would you like to explore?`
          : `Welcome back, ${childProfile?.name}! What sparks your curiosity today?`,
        relatedQuestions: isVeryYoung ? [
          "Why is the sky blue?",
          "How do birds fly?",
          "Why do we sleep?",
          "How does rain happen?"
        ] : [
          "How do black holes work?", 
          "Why do we dream?",
          "How are diamonds made?",
          "What makes music sound good?"
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
      
      const mockAnswer = generateAnswer(question, isVeryYoung);
      const answerMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'answer',
        content: mockAnswer.content,
        funFacts: mockAnswer.funFacts,
        relatedQuestions: mockAnswer.relatedQuestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, answerMessage]);
      
      if (childProfile?.id) {
        toast.success(`✨ +5 sparks for exploring!`, {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error('Something went wrong. Try again!');
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
      toast.success('See you later! 👋');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-background touch-manipulation overscroll-contain">
      {/* Kid-Friendly Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/20 shadow-sm">
        <div className="bg-card/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            {/* Logo Area */}
            <motion.div 
              className="flex items-center gap-4 touch-friendly"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-brand to-accent-info rounded-2xl flex items-center justify-center shadow-lg">
                <Wand2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  Hey {childProfile?.name}! 👋
                </h1>
                <p className="text-sm text-text-secondary font-medium">Ready for an adventure?</p>
              </div>
            </motion.div>

            {/* Center Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="secondary"
                size="default"
                onClick={() => navigate(`/wonderwhiz/${childProfile?.id}`)}
                className="bg-interactive-hover hover:bg-interactive-active text-text-primary font-semibold rounded-xl px-6 py-3 shadow-md hover:shadow-lg"
              >
                <Book className="w-5 h-5 mr-2" />
                📚 Encyclopedia
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => navigate('/parent-zone')}
                className="border-border hover:bg-interactive-hover text-text-primary font-semibold rounded-xl px-6 py-3"
              >
                <Users className="w-5 h-5 mr-2" />
                👨‍👩‍👧‍👦 Parent Zone
              </Button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Sparks Counter */}
              {childProfile?.sparks_balance > 0 && (
                <motion.div 
                  className="bg-gradient-to-r from-wonderwhiz-gold/20 to-wonderwhiz-vibrant-yellow/20 border border-wonderwhiz-gold/30 px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-wonderwhiz-gold fill-current" />
                    <span className="text-white font-medium text-sm">{childProfile?.sparks_balance}</span>
                  </div>
                </motion.div>
              )}
              
              {/* Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="text-white/80 hover:text-white hover:bg-white/10 relative p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-16 right-6 bg-surface-elevated/95 backdrop-blur-xl rounded-2xl border border-white/20 p-2 min-w-56 z-50 shadow-2xl"
            >
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowMenu(false);
                    navigate(`/wonderwhiz/${childProfile?.id}`);
                  }}
                  className="w-full justify-start text-text-primary hover:bg-interactive-hover"
                >
                  <Book className="h-4 w-4 mr-3" />
                  Wonder Encyclopedia
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/parent-zone');
                  }}
                  className="w-full justify-start text-text-primary hover:bg-interactive-hover"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Parent Zone
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/profiles');
                  }}
                  className="w-full justify-start text-text-primary hover:bg-interactive-hover"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Switch Profile
                </Button>
                <div className="h-px bg-border my-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowMenu(false);
                    handleSignOut();
                  }}
                  className="w-full justify-start text-accent-error hover:bg-accent-error/10"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-[calc(100vh-5rem)]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 max-w-5xl mx-auto w-full">
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
                  // User Question - Right aligned
                  <div className="flex justify-end">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-accent-brand/20 to-accent-info/20 backdrop-blur-sm border border-border/40 rounded-3xl px-8 py-6 max-w-lg shadow-lg"
                    >
                      <p className="text-text-primary font-semibold text-lg leading-relaxed">{message.content}</p>
                    </motion.div>
                  </div>
                ) : (
                  // AI Answer - Left aligned
                  <div className="flex justify-start">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-3xl p-8 max-w-4xl shadow-lg"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-accent-warning to-accent-brand rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Lightbulb className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 space-y-6">
                          <p className="text-text-primary text-xl font-medium leading-relaxed">
                            {message.content}
                          </p>
                          
                          {/* Fun Facts */}
                          {message.funFacts && message.funFacts.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-gradient-to-br from-accent-warning/15 to-accent-success/15 border border-accent-warning/40 rounded-3xl p-6 shadow-md"
                            >
                              <h4 className="text-accent-warning font-bold text-lg mb-4 flex items-center gap-3">
                                <Sparkles className="h-6 w-6" />
                                {isVeryYoung ? "🤯 Wow Facts!" : "✨ Amazing Details!"}
                              </h4>
                              <div className="space-y-4">
                                {message.funFacts.map((fact, index) => (
                                  <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="flex items-start gap-4 p-4 bg-surface-secondary/50 rounded-2xl"
                                  >
                                    <span className="text-accent-warning text-2xl flex-shrink-0">{isVeryYoung ? '🎉' : '💡'}</span>
                                    <p className="text-text-primary font-medium text-lg leading-relaxed">{fact}</p>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Related Questions */}
                          {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="space-y-3"
                            >
                              <h4 className="text-white/80 font-medium flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                {isVeryYoung ? "Ask me more:" : "Continue exploring:"}
                              </h4>
                              <div className="grid gap-3">
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
                                      size="sm"
                                      className="w-full text-left justify-start bg-surface-glass hover:bg-surface-secondary/20 border-white/20 hover:border-white/40 text-white h-auto py-4 px-5 rounded-2xl transition-all duration-200"
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

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-surface-elevated/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-wonderwhiz-vibrant-yellow to-wonderwhiz-gold rounded-xl flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Lightbulb className="w-5 h-5 text-wonderwhiz-deep-purple" />
                    </motion.div>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-white/60 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <span className="text-white/80">
                    {isVeryYoung ? "Thinking..." : "Exploring..."}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-border/20 bg-card/95 backdrop-blur-xl p-4 sm:p-6 shadow-lg">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className={`relative transition-all duration-300 ${isInputFocused ? 'transform scale-[1.02]' : ''}`}
            >
              <div className="flex gap-4 items-end">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    placeholder={isVeryYoung ? "🤔 What amazing thing do you want to learn about?" : "💭 What sparks your curiosity today?"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    disabled={isLoading}
                    className="bg-surface-secondary/80 border-border/40 rounded-2xl px-6 py-5 text-lg text-text-primary placeholder:text-text-tertiary focus:border-accent-brand/50 focus:ring-2 focus:ring-accent-brand/30 disabled:opacity-50 font-medium shadow-inner"
                  />
                  {inputValue && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2"
                    >
                      <Sparkles className="h-6 w-6 text-accent-brand animate-pulse" />
                    </motion.div>
                  )}
                </div>
                <Button
                  onClick={() => handleSubmit(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gradient-to-r from-accent-brand to-accent-info hover:from-accent-info hover:to-accent-brand text-white p-5 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg min-w-[4rem]"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-7 w-7" />
                    </motion.div>
                  ) : (
                    <Send className="h-7 w-7" />
                  )}
                </Button>
              </div>
              
              {/* Helpful hint for first-time users */}
              {messages.length === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-center mt-4"
                >
                  <p className="text-white/60 text-sm">
                    {isVeryYoung ? "Try asking about animals, space, or colors! 🌈" : "Ask about science, history, technology, or anything else! 🚀"}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Smart answer generator
const generateAnswer = (question: string, isVeryYoung: boolean) => {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('sky') && lowerQ.includes('blue')) {
    return {
      content: isVeryYoung 
        ? "The sky looks blue because of something super cool called 'scattering'! When sunlight hits tiny particles in the air, blue light bounces around more than other colors. It's like blue light is more bouncy! 🌟" 
        : "The sky appears blue due to Rayleigh scattering. When sunlight enters Earth's atmosphere, it collides with gas molecules. Blue light has a shorter wavelength and gets scattered more than other colors, making the sky appear blue to our eyes.",
      funFacts: isVeryYoung ? [
        "The sky on Mars looks reddish-orange! 🔴",
        "At sunrise and sunset, the sky turns orange and red! 🌅",
        "Sometimes you can see green flashes in the sky! 💚"
      ] : [
        "On Mars, sunsets appear blue due to the different atmosphere composition",
        "The deepest blue skies occur at high altitudes where there's less atmosphere",
        "Some animals can see ultraviolet light, making the sky look different to them"
      ],
      relatedQuestions: isVeryYoung ? [
        "Why are clouds white?",
        "What makes rainbows?",
        "Why does the sun look yellow?"
      ] : [
        "How do auroras form?",
        "Why do sunsets have different colors?",
        "What causes atmospheric optical phenomena?"
      ]
    };
  }
  
  // Default response
  return {
    content: isVeryYoung 
      ? "That's a fantastic question! Let me think about that... 🤔" 
      : "That's an interesting question! Let me explore that with you...",
    funFacts: [
      "Every question leads to new discoveries!",
      "Scientists ask questions like this all the time!"
    ],
    relatedQuestions: [
      "What else would you like to know?",
      "Is there something specific you're curious about?"
    ]
  };
};

export default ElevatedDashboard;