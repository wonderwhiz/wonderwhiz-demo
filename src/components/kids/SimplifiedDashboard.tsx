import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Star, Mic, ArrowRight, Book, Users, Settings, LogOut, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SimplifiedDashboardProps {
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

const SimplifiedDashboard: React.FC<SimplifiedDashboardProps> = ({
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

  // Welcome message 
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'answer',
        content: isVeryYoung 
          ? `Hi ${childProfile?.name}! 🌟 I'm your magical learning friend! What amazing thing do you want to discover today?`
          : `Hey ${childProfile?.name}! Ready to explore the wonders of our world? Ask me anything that sparks your curiosity!`,
        relatedQuestions: isVeryYoung ? [
          "🐱 Why do cats purr?",
          "🌈 How are rainbows made?",
          "🦋 How do butterflies fly?",
          "🌙 Why does the moon change shapes?"
        ] : [
          "✈️ How do airplanes stay in the sky?", 
          "🧠 Why do we dream when we sleep?",
          "🌍 How do volcanoes work?",
          "🔬 What are atoms made of?"
        ],
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [childProfile?.name, isVeryYoung, messages.length]);

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return;

    console.log('🎯 User asked question:', question);
    console.log('🔐 Auth state - Child Profile:', childProfile?.name, childProfile?.id);

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
      console.log('📞 Calling onSearch function...');
      onSearch(question.trim());
      
      // Enhanced mock response for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAnswer = generateEnhancedAnswer(question, isVeryYoung);
      const answerMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'answer',
        content: mockAnswer.content,
        funFacts: mockAnswer.funFacts,
        relatedQuestions: mockAnswer.relatedQuestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, answerMessage]);
      
      // Add sparks for engagement
      if (childProfile?.id) {
        toast.success(`✨ You earned 5 sparks for asking!`, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('❌ Error getting answer:', error);
      toast.error('Oops! Something went wrong. Try asking again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    // Remove emoji prefix for processing
    const cleanQuestion = question.replace(/^[🌟✨🎯🔥🚀🌈🐱🦋🌙✈️🧠🌍🔬]\s*/, '');
    handleSubmit(cleanQuestion);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-pulse">🧙‍♂️</div>
            <div>
              <h1 className="text-white font-bold text-xl">
                {isVeryYoung ? `${childProfile?.name}'s Magic World` : `${childProfile?.name}'s Discovery Zone`}
              </h1>
              <p className="text-white/70 text-sm">Ask me anything!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {childProfile?.sparks_balance > 0 && (
              <motion.div 
                className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-white font-bold text-sm">{childProfile?.sparks_balance}</span>
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="text-white hover:bg-white/10 relative"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Quick Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-16 right-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-2 min-w-48"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/wonderwhiz/${childProfile?.id}`)}
                    className="w-full justify-start text-white hover:bg-white/10"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Wonder Encyclopedia
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/parent-zone')}
                    className="w-full justify-start text-white hover:bg-white/10"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Parent Zone
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profiles')}
                    className="w-full justify-start text-white hover:bg-white/10"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Switch Profile
                  </Button>
                  <hr className="my-2 border-white/20" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full justify-start text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 pb-32 max-w-4xl mx-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              {message.type === 'question' ? (
                // User Question
                <div className="flex justify-end">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm rounded-2xl p-4 max-w-md"
                  >
                    <p className="text-white font-medium">{message.content}</p>
                  </motion.div>
                </div>
              ) : (
                // AI Answer
                <div className="flex justify-start">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-3xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl animate-bounce">🧙‍♂️</div>
                      <div className="flex-1">
                        <p className="text-white text-lg leading-relaxed mb-4">
                          {message.content}
                        </p>
                        
                        {/* Fun Facts */}
                        {message.funFacts && message.funFacts.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-4 mb-4"
                          >
                            <h4 className="text-yellow-300 font-bold mb-3 flex items-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              {isVeryYoung ? "Cool Facts!" : "Did You Know?"}
                            </h4>
                            <div className="space-y-2">
                              {message.funFacts.map((fact, index) => (
                                <motion.div 
                                  key={index} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  className="flex items-start gap-3"
                                >
                                  <span className="text-yellow-400 text-lg">✨</span>
                                  <p className="text-white/90">{fact}</p>
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
                          >
                            <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
                              <ArrowRight className="h-4 w-4" />
                              {isVeryYoung ? "Ask me more:" : "What else would you like to know?"}
                            </h4>
                            <div className="grid gap-2">
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
                                    className="w-full text-left justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 h-auto py-3 px-4 rounded-xl transition-all duration-200"
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

        {/* Loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-6"
          >
            <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl animate-spin">🔮</div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-white/80">
                  {isVeryYoung ? "Creating magic..." : "Discovering answers..."}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isVeryYoung ? "What magical thing do you want to learn? 🌟" : "What would you like to discover today?"}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-cyan-400 h-14 text-lg rounded-xl"
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={() => handleSubmit(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="bg-cyan-500 hover:bg-cyan-400 h-14 px-6 rounded-xl transition-all duration-200"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Quick action hints */}
          {messages.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center mt-3"
            >
              <p className="text-white/60 text-sm">
                {isVeryYoung ? "Try asking about animals, colors, or space! 🚀" : "Ask about science, history, nature, or anything else! 🔬"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced mock answer generator
const generateEnhancedAnswer = (question: string, isVeryYoung: boolean) => {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('cat') || lowerQ.includes('purr')) {
    return {
      content: isVeryYoung 
        ? "Cats purr when they're happy! 🐱 It's like their way of smiling with sound! They make this rumbly noise in their throat that sounds like a tiny motor. It makes them feel good and calm, and it can make you feel calm too! It's like magic!" 
        : "Cats purr through rapid muscle contractions in their larynx and diaphragm, creating vibrations at 20-50 Hz. Interestingly, this frequency has been shown to have healing properties - it can help heal bones, reduce pain, and even lower blood pressure in both cats and humans!",
      funFacts: isVeryYoung ? [
        "Baby cats can't purr until they're 2 weeks old! 🍼",
        "Some big cats like tigers can't purr, but they can roar! 🐅",
        "Cats also purr when they're scared - it helps them feel better! 😰"
      ] : [
        "Purring frequencies (20-50 Hz) are used in medical therapy for bone healing",
        "Cats can purr continuously for hours without getting tired",
        "Some cats have different purrs for different emotions - like a 'food purr'!"
      ],
      relatedQuestions: isVeryYoung ? [
        "🐱 Why do cats have whiskers?",
        "🌙 How do cats see in the dark?",
        "🌳 Why do cats climb trees?",
        "🐾 Why do cats always land on their feet?"
      ] : [
        "🔬 How do cats navigate in complete darkness?",
        "🧬 What makes cats such effective predators?",
        "🗣️ How do cats communicate with each other?",
        "🧠 Why are cats so independent compared to dogs?"
      ]
    };
  }

  if (lowerQ.includes('rainbow') || lowerQ.includes('color')) {
    return {
      content: isVeryYoung
        ? "Rainbows are made when sunlight and rain meet! 🌈 The sun's white light is actually made of all the colors mixed together. When sunlight goes through water drops in the air, it splits apart into all the beautiful colors we can see - red, orange, yellow, green, blue, indigo, and violet!"
        : "Rainbows form through the process of refraction, reflection, and dispersion of light. When white light enters a water droplet, it slows down and bends (refracts), reflects off the back of the droplet, and exits while bending again. This process separates white light into its component wavelengths, creating the spectrum we see.",
      funFacts: isVeryYoung ? [
        "You can make your own rainbow with a garden hose on a sunny day! 💦",
        "Every rainbow is actually a full circle, but we usually only see half! ⭕",
        "No two people see exactly the same rainbow! 👀"
      ] : [
        "Double rainbows occur when light reflects twice inside water droplets",
        "Red appears on the outside because it has the longest wavelength",
        "Rainbows are actually full circles - we only see arcs due to the ground blocking our view"
      ],
      relatedQuestions: isVeryYoung ? [
        "☀️ Why is the sky blue?",
        "🌅 Why do sunsets look orange and red?",
        "❄️ Why are clouds white?",
        "✨ What makes things sparkle?"
      ] : [
        "🔬 How does light behave as both a wave and a particle?",
        "🌌 Why do distant stars appear to twinkle?",
        "💎 How do prisms work to split light?",
        "🌈 What are the physics behind iridescence in soap bubbles?"
      ]
    };
  }

  // Default enhanced response
  return {
    content: isVeryYoung
      ? "That's such an amazing question! 🌟 You're really curious, and that's the best way to learn! Let me think about the most exciting way to explain this to you... Every question you ask helps your brain grow stronger and smarter!"
      : "What a fantastic question! Curiosity like yours is what drives all great discoveries. This touches on some really fascinating concepts that scientists have been exploring for years. Let me break this down in a way that shows just how incredible our world really is...",
    funFacts: isVeryYoung ? [
      "Asking questions is how we learn amazing things! 🧠",
      "Your brain grows every time you discover something new! 📈",
      "Scientists are just grown-ups who never stopped asking 'why?' 🔬"
    ] : [
      "The best scientific discoveries often start with simple questions",
      "Curiosity activates the same brain regions as hunger - we literally 'hunger' for knowledge",
      "Many breakthrough inventions came from people wondering 'what if?'"
    ],
    relatedQuestions: isVeryYoung ? [
      "🐦 How do birds fly?",
      "💧 Why is water wet?",
      "🌙 Why does the moon follow us?",
      "🦋 How do butterflies know where to go?"
    ] : [
      "🧠 How does the human brain process information?",
      "🌟 What role does wonder play in learning?",
      "🔬 How do scientific breakthroughs happen?",
      "🤔 Why do some questions lead to more questions?"
    ]
  };
};

export default SimplifiedDashboard;