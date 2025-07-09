import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Volume2, Sparkles, Home, RotateCcw } from 'lucide-react';
import { useUnifiedDashboard } from '@/hooks/useUnifiedDashboard';

interface InstantWonderWhizProps {
  childId: string;
}

interface ChatMessage {
  id: string;
  type: 'question' | 'answer';
  content: string;
  funFacts?: string[];
  relatedQuestions?: string[];
  timestamp: Date;
}

const InstantWonderWhiz: React.FC<InstantWonderWhizProps> = ({ childId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    childProfile,
    isLoadingProfile,
    handleUnifiedSearch
  } = useUnifiedDashboard();

  const isVeryYoung = (childProfile?.age || 10) <= 8;

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
    
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'answer',
        content: isVeryYoung 
          ? "Hi there! I'm Whizzy! 🌟 Ask me anything you're curious about!"
          : "Welcome to Wonder Whiz! Ask me any question and I'll give you an instant answer with fun facts!",
        funFacts: isVeryYoung ? [
          "I know about animals, space, science, and so much more!",
          "Every question you ask helps you learn something amazing!"
        ] : [
          "I can explain complex topics in simple ways",
          "Every answer comes with related questions to explore further",
          "Learning is most effective when driven by curiosity"
        ],
        relatedQuestions: isVeryYoung ? [
          "Why is the sky blue?",
          "How do birds fly?",
          "What are clouds made of?"
        ] : [
          "How does gravity work?",
          "Why do we dream?",
          "How do computers think?"
        ],
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isVeryYoung, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      // Simulate AI response - in real app, this would call the AI service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    } catch (error) {
      console.error('Error getting answer:', error);
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

  const clearChat = () => {
    setMessages([]);
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: 'welcome-new',
        type: 'answer',
        content: isVeryYoung 
          ? "Ready for more questions! What do you want to know? 🚀"
          : "Fresh start! What would you like to explore next?",
        relatedQuestions: isVeryYoung ? [
          "Tell me about dinosaurs!",
          "How big is the ocean?",
          "Why do cats purr?"
        ] : [
          "Explain quantum physics simply",
          "How does artificial intelligence work?",
          "What causes earthquakes?"
        ],
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-purple flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔮</div>
          <div className="text-white text-xl">Getting ready...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-purple">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🧙‍♂️</div>
            <div>
              <h1 className="text-white font-bold text-lg">
                {isVeryYoung ? "Ask Whizzy!" : "Wonder Whiz"}
              </h1>
              <p className="text-white/70 text-sm">
                {isVeryYoung ? "Your magical learning friend" : "Instant answers to your curious questions"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={clearChat}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 pb-32">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {message.type === 'question' ? (
                  <div className="flex justify-end">
                    <Card className="bg-wonderwhiz-cyan/20 border-wonderwhiz-cyan/30 p-4 max-w-md">
                      <p className="text-white">{message.content}</p>
                    </Card>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-6 max-w-2xl">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="text-3xl">🧙‍♂️</div>
                        <div className="flex-1">
                          <p className="text-white/90 text-lg leading-relaxed mb-4">
                            {message.content}
                          </p>
                          
                          {/* Fun Facts */}
                          {message.funFacts && message.funFacts.length > 0 && (
                            <div className="bg-wonderwhiz-vibrant-yellow/10 border border-wonderwhiz-vibrant-yellow/20 rounded-lg p-4 mb-4">
                              <h4 className="text-wonderwhiz-vibrant-yellow font-bold mb-2 flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                {isVeryYoung ? "Cool Facts!" : "Did You Know?"}
                              </h4>
                              <div className="space-y-2">
                                {message.funFacts.map((fact, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <span className="text-wonderwhiz-vibrant-yellow text-lg">✨</span>
                                    <p className="text-white/80 text-sm">{fact}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Related Questions */}
                          {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                            <div>
                              <h4 className="text-white/80 font-medium mb-3">
                                {isVeryYoung ? "Ask me more:" : "You might also wonder:"}
                              </h4>
                              <div className="space-y-2">
                                {message.relatedQuestions.map((question, index) => (
                                  <Button
                                    key={index}
                                    onClick={() => handleQuickQuestion(question)}
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-left justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 h-auto py-3 px-4"
                                  >
                                    <span className="text-wonderwhiz-cyan mr-2">💫</span>
                                    {question}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Read Aloud Button */}
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                              <Volume2 className="h-4 w-4 mr-2" />
                              Read aloud
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🧙‍♂️</div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <span className="text-white/80 text-sm">
                    {isVeryYoung ? "Thinking..." : "Finding the perfect answer..."}
                  </span>
                </div>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isVeryYoung ? "What do you want to know? 🤔" : "Ask me anything..."}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-wonderwhiz-cyan h-12 text-lg"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={() => handleSubmit(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="bg-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/80 h-12 px-6"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock answer generator - replace with real AI integration
const generateMockAnswer = (question: string, isVeryYoung: boolean) => {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('bird') || lowerQ.includes('fly')) {
    return {
      content: isVeryYoung 
        ? "Birds can fly because they have special wings and hollow bones that make them super light! Their wings push air down, which lifts them up into the sky. It's like magic, but it's really science! 🐦✨"
        : "Birds fly through a combination of wing design, lightweight bone structure, and aerodynamic principles. Their wings create lift by forcing air to move faster over the top surface than the bottom, creating lower pressure above the wing.",
      funFacts: isVeryYoung ? [
        "Some birds can sleep while flying!",
        "Hummingbirds can fly backwards!",
        "The biggest bird is the ostrich, but it can't fly!"
      ] : [
        "Some birds can sleep while flying by shutting down half their brain",
        "Arctic terns migrate 44,000 miles annually - the longest migration",
        "Peregrine falcons can dive at speeds over 240 mph"
      ],
      relatedQuestions: isVeryYoung ? [
        "Why can't penguins fly?",
        "How fast can birds go?",
        "Do all birds lay eggs?"
      ] : [
        "How do migratory birds navigate thousands of miles?",
        "What's the difference between bird flight and airplane flight?",
        "How did birds evolve from dinosaurs?"
      ]
    };
  }

  // Default response
  return {
    content: isVeryYoung
      ? "That's a great question! I love how curious you are! Let me think about the best way to explain this... 🤔✨"
      : "Great question! This touches on some fascinating concepts. Let me break this down in a way that's easy to understand...",
    funFacts: isVeryYoung ? [
      "Asking questions is the best way to learn!",
      "Your brain grows stronger every time you learn something new!"
    ] : [
      "Curiosity is the engine of all human achievement",
      "The more questions you ask, the more connections your brain makes"
    ],
    relatedQuestions: isVeryYoung ? [
      "Tell me something about space!",
      "How do plants grow?",
      "Why is water wet?"
    ] : [
      "What makes humans uniquely curious?",
      "How does learning change our brain structure?",
      "What role does wonder play in scientific discovery?"
    ]
  };
};

export default InstantWonderWhiz;