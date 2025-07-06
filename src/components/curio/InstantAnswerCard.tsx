import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, Sparkles, ArrowRight, Brain, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface InstantAnswerCardProps {
  question: string;
  childAge: number;
  onExploreMore: () => void;
}

const InstantAnswerCard: React.FC<InstantAnswerCardProps> = ({
  question,
  childAge,
  onExploreMore
}) => {
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [keyFacts, setKeyFacts] = useState<string[]>([]);
  
  const isYoungChild = childAge <= 8;

  useEffect(() => {
    generateInstantAnswer();
  }, [question, childAge]);

  const generateInstantAnswer = () => {
    setIsLoading(true);
    
    // Simulate API call with immediate fallback for demo
    setTimeout(() => {
      const quickAnswer = generateSmartAnswer(question, childAge);
      setAnswer(quickAnswer.answer);
      setKeyFacts(quickAnswer.facts);
      setIsLoading(false);
    }, 800);
  };

  const generateSmartAnswer = (question: string, age: number) => {
    const topic = question.toLowerCase();
    
    if (topic.includes('superintelligence') || topic.includes('ai') || topic.includes('artificial intelligence')) {
      return {
        answer: age <= 8 
          ? "🤖 Superintelligence is like having a super-smart computer brain that's much smarter than any human! It can think, learn, and solve problems incredibly fast. Think of it like having the smartest friend ever who knows everything!"
          : "Superintelligence refers to artificial intelligence that surpasses human intelligence across all domains. It would be capable of recursive self-improvement, potentially leading to an intelligence explosion where AI systems rapidly become far more capable than humans.",
        facts: age <= 8
          ? ["🧠 It's like a super smart robot brain!", "⚡ It can think faster than any person", "🎓 It knows more than all the smartest people combined", "🔮 It might help solve big problems in the world"]
          : ["Could solve complex global challenges", "Might emerge through recursive self-improvement", "Represents a potential turning point for humanity", "Requires careful safety considerations"]
      };
    }
    
    // Fallback for any topic
    return {
      answer: age <= 8
        ? `🌟 ${question} is super interesting and there's so much cool stuff to learn about it! Let's explore together and discover amazing facts!`
        : `${question} is a fascinating topic with many layers of complexity. Let's dive deep into the key concepts and discover what makes this subject so intriguing.`,
      facts: [
        "There's so much to discover!",
        "Every expert started as a beginner",
        "Learning is an adventure",
        "Questions lead to amazing discoveries"
      ]
    };
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      toast.info(isYoungChild ? "⏸️ Stopped reading!" : "Audio paused");
    } else {
      setIsPlaying(true);
      toast.success(isYoungChild ? "🔊 Reading out loud!" : "Playing audio...");
      
      // Simulate audio duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 8000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-br from-wonderwhiz-bright-pink/20 via-wonderwhiz-purple/20 to-wonderwhiz-deep-purple/20 backdrop-blur-sm border-white/20 overflow-hidden shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
            >
              <Brain className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {isYoungChild ? "🚀 Quick Smart Answer!" : "💡 Instant Insight"}
              </h3>
              <p className="text-white/70 text-sm">
                {isYoungChild ? "Here's what you need to know!" : "Get the key information first"}
              </p>
            </div>
          </div>

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-8"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-6 h-6 bg-wonderwhiz-bright-pink rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-6 h-6 bg-wonderwhiz-purple rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-6 h-6 bg-wonderwhiz-deep-purple rounded-full"
                  />
                </div>
                <span className="ml-4 text-white/80 font-medium">
                  {isYoungChild ? "Getting your answer ready..." : "Generating instant answer..."}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Answer */}
                <div className="bg-white/10 rounded-2xl p-5 mb-4">
                  <p className={`text-white/90 leading-relaxed ${isYoungChild ? 'text-lg' : 'text-base'} font-medium`}>
                    {answer}
                  </p>
                </div>

                {/* Key Facts */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    <span className="text-white/80 font-semibold text-sm">
                      {isYoungChild ? "Super Cool Facts:" : "Key Points:"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {keyFacts.map((fact, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <Sparkles className="h-3 w-3 text-yellow-400 mt-1 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{fact}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleToggleAudio}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
                  >
                    {isPlaying ? (
                      <>
                        <PauseCircle className="h-4 w-4 mr-2" />
                        {isYoungChild ? "Pause" : "Stop"}
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        {isYoungChild ? "Read to me!" : "Listen"}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={onExploreMore}
                    className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-purple/90 text-white font-bold"
                  >
                    {isYoungChild ? "🚀 Let's Explore More!" : "Deep Dive"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default InstantAnswerCard;