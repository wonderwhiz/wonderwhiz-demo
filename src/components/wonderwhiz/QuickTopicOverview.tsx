import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LearningTopic } from '@/types/wonderwhiz';
import { Clock, BookOpen, Star, Play, ArrowRight } from 'lucide-react';

interface QuickTopicOverviewProps {
  topic: LearningTopic;
  childAge: number;
  onStart: () => void;
  onGoBack: () => void;
}

const QuickTopicOverview: React.FC<QuickTopicOverviewProps> = ({
  topic,
  childAge,
  onStart,
  onGoBack
}) => {
  const [isReady, setIsReady] = useState(false);
  const isVeryYoung = childAge <= 8;
  const sections = topic.table_of_contents || [];
  const estimatedTime = Math.max(sections.length * 2, 5); // 2 min per section, min 5 min

  useEffect(() => {
    // Small delay to make it feel more interactive
    setTimeout(() => setIsReady(true), 500);
  }, []);

  const getDifficultyColor = () => {
    if (childAge <= 8) return 'bg-green-500';
    if (childAge <= 11) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getDifficultyText = () => {
    if (childAge <= 8) return 'Perfect for you!';
    if (childAge <= 11) return 'Just right!';
    return 'Good challenge';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-purple p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={onGoBack}
          variant="ghost"
          className="text-white hover:bg-white/10 mb-6"
        >
          ← Back to search
        </Button>

        <AnimatePresence>
          {isReady && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Topic Header */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm overflow-hidden">
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-8xl mb-4"
                  >
                    📚
                  </motion.div>
                  
                  <h1 className="text-3xl font-bold text-white mb-4">
                    {topic.title}
                  </h1>
                  
                  {topic.description && (
                    <p className="text-white/80 text-lg mb-6 leading-relaxed">
                      {topic.description}
                    </p>
                  )}

                  {/* Quick Stats */}
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                      <Clock className="h-4 w-4 text-wonderwhiz-cyan" />
                      <span className="text-white text-sm">
                        ~{estimatedTime} min
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                      <BookOpen className="h-4 w-4 text-wonderwhiz-bright-pink" />
                      <span className="text-white text-sm">
                        {sections.length} parts
                      </span>
                    </div>
                    
                    <Badge className={`${getDifficultyColor()} text-white border-0`}>
                      {getDifficultyText()}
                    </Badge>
                  </div>

                  {/* Start Button */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={onStart}
                      className="bg-gradient-to-r from-wonderwhiz-cyan to-wonderwhiz-bright-pink hover:from-wonderwhiz-cyan/80 hover:to-wonderwhiz-bright-pink/80 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
                    >
                      <Play className="h-6 w-6 mr-3" />
                      {isVeryYoung ? "Let's Start!" : "Begin Learning"}
                    </Button>
                  </motion.div>
                </div>
              </Card>

              {/* What You'll Learn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
                      {isVeryYoung ? "What we'll discover:" : "What you'll learn:"}
                    </h2>
                    
                    <div className="space-y-3">
                      {sections.slice(0, isVeryYoung ? 3 : 4).map((section, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-wonderwhiz-cyan/20 rounded-full flex items-center justify-center">
                            <span className="text-wonderwhiz-cyan font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium">
                              {section.title}
                            </h3>
                            {section.content && (
                              <p className="text-white/70 text-sm mt-1 line-clamp-2">
                                {section.content.slice(0, 100)}...
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      
                      {sections.length > (isVeryYoung ? 3 : 4) && (
                        <div className="text-center text-white/60 text-sm">
                          + {sections.length - (isVeryYoung ? 3 : 4)} more exciting parts!
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Fun Encouragement */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center"
              >
                <p className="text-white/60 text-lg">
                  {isVeryYoung 
                    ? "🌟 Ready for an amazing adventure? 🌟"
                    : "Ready to expand your knowledge? Let's dive in!"
                  }
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuickTopicOverview;