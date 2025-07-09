import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Star, Home, Camera } from 'lucide-react';

interface MagicalDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
  onImageUpload?: (file: File) => void;
}

interface ChatMessage {
  id: string;
  type: 'question' | 'answer';
  content: string;
  funFacts?: string[];
  relatedQuestions?: string[];
  timestamp: Date;
}

const MagicalDashboard: React.FC<MagicalDashboardProps> = ({
  childProfile,
  onSearch,
  onImageUpload
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const age = childProfile?.age || 10;
  const isVeryYoung = age <= 8;

  // Welcome message on first load
  React.useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'answer',
        content: isVeryYoung 
          ? `Hi ${childProfile?.name}! I'm your learning buddy! 🌟 What do you want to discover today?`
          : `Hey ${childProfile?.name}! Ready to explore something amazing? Ask me anything!`,
        relatedQuestions: isVeryYoung ? [
          "Why do cats purr?",
          "How do flowers grow?",
          "What makes rainbows?"
        ] : [
          "How do airplanes fly?",
          "Why do we dream?",
          "How do computers work?"
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
      // Call the search function from parent
      onSearch(question.trim());
      
      // Mock immediate response for now
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

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink">
      {/* Simple Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧙‍♂️</div>
            <div>
              <h1 className="text-white font-bold text-xl">
                {isVeryYoung ? `${childProfile?.name}'s Magic Learning` : `${childProfile?.name}'s Learning Space`}
              </h1>
            </div>
          </div>
          
          {childProfile?.sparks_balance > 0 && (
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Star className="h-5 w-5 text-wonderwhiz-vibrant-yellow fill-current" />
              <span className="text-white font-bold">{childProfile?.sparks_balance}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 pb-32">
        <div className="max-w-4xl mx-auto space-y-6">
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
                  // User Question
                  <div className="flex justify-end">
                    <Card className="bg-wonderwhiz-cyan/20 border-wonderwhiz-cyan/30 p-4 max-w-md">
                      <p className="text-white font-medium">{message.content}</p>
                    </Card>
                  </div>
                ) : (
                  // AI Answer
                  <div className="flex justify-start">
                    <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-6 max-w-3xl">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">🧙‍♂️</div>
                        <div className="flex-1">
                          <p className="text-white text-lg leading-relaxed mb-4">
                            {message.content}
                          </p>
                          
                          {/* Fun Facts */}
                          {message.funFacts && message.funFacts.length > 0 && (
                            <div className="bg-wonderwhiz-vibrant-yellow/10 border border-wonderwhiz-vibrant-yellow/20 rounded-xl p-4 mb-4">
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
                        </div>
                      </div>
                    </Card>
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
              className="flex justify-start"
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🧙‍♂️</div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <span className="text-white/80 text-sm">
                    {isVeryYoung ? "Thinking..." : "Creating magic..."}
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
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isVeryYoung ? "What do you want to know? 🤔" : "Ask me anything..."}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-wonderwhiz-cyan h-14 text-lg"
                disabled={isLoading}
              />
            </div>
            
            {onImageUpload && (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageUpload(file);
                  }}
                  className="hidden"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-14 w-14 border-white/20 text-white hover:bg-white/10"
                  disabled={isLoading}
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </label>
            )}
            
            <Button
              onClick={() => handleSubmit(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="bg-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/80 h-14 px-6"
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
  
  if (lowerQ.includes('cat') || lowerQ.includes('purr')) {
    return {
      content: isVeryYoung 
        ? "Cats purr when they're happy! It's like their way of smiling with sound! They make this rumbly noise in their throat that sounds like a tiny motor. It makes them feel good and calm! 🐱💕"
        : "Cats purr through rapid muscle contractions in their larynx and diaphragm. This creates vibrations at 20-50 Hz, which has been shown to have healing properties for both cats and humans!",
      funFacts: isVeryYoung ? [
        "Baby cats can't purr until they're 2 weeks old!",
        "Some big cats like tigers can't purr, but they can roar!",
        "Cats also purr when they're scared or hurt!"
      ] : [
        "Purring can help heal bones and reduce pain",
        "Some cats purr at different frequencies for different reasons",
        "The purr frequency is similar to that used in medical therapy"
      ],
      relatedQuestions: isVeryYoung ? [
        "Why do cats have whiskers?",
        "How do cats see in the dark?",
        "Why do cats climb trees?"
      ] : [
        "How do cats navigate in complete darkness?",
        "What makes cats such effective predators?",
        "How do cats communicate with each other?"
      ]
    };
  }

  // Default response
  return {
    content: isVeryYoung
      ? "That's such a cool question! Let me think about the best way to explain this... 🤔✨"
      : "Great question! This touches on some really interesting concepts. Let me break this down...",
    funFacts: isVeryYoung ? [
      "Asking questions is how we learn amazing things!",
      "Your brain grows every time you discover something new!"
    ] : [
      "Curiosity is what drives all scientific discovery",
      "The best questions often lead to unexpected answers"
    ],
    relatedQuestions: isVeryYoung ? [
      "How do birds fly?",
      "Why is water wet?",
      "What makes the sky blue?"
    ] : [
      "How does the human brain process information?",
      "What role does wonder play in learning?",
      "How do scientific breakthroughs happen?"
    ]
  };
};

export default MagicalDashboard;