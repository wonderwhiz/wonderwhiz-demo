
import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Lock, Star, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';

interface SimplifiedTableOfContentsProps {
  topic: LearningTopic;
  completedSections: number[];
  allSectionsCompleted: boolean;
  quizCompleted: boolean;
  onStartSection: (index: number) => void;
  onStartQuiz: () => void;
  childAge: number;
}

const SimplifiedTableOfContents: React.FC<SimplifiedTableOfContentsProps> = ({
  topic,
  completedSections,
  allSectionsCompleted,
  quizCompleted,
  onStartSection,
  onStartQuiz,
  childAge
}) => {
  const isYoungChild = childAge <= 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-wonderwhiz-bright-pink/30 to-purple-500/30 border-wonderwhiz-bright-pink/40 p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            {isYoungChild ? `Let's Explore ${topic.title}! 🌟` : `Your ${topic.title} Encyclopedia`}
          </h2>
          <p className="text-white/90 text-lg font-medium">
            {isYoungChild 
              ? "Click on any section below to start your adventure!"
              : "Ready to dive deep into this fascinating topic?"}
          </p>
        </div>
      </Card>

      {/* Sections Grid */}
      <div className="grid gap-4">
        {topic.table_of_contents.map((section, index) => {
          const isCompleted = completedSections.includes(index);
          const isAvailable = index === 0 || completedSections.includes(index - 1);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 transition-all cursor-pointer shadow-md ${
                isCompleted
                  ? 'bg-green-500/30 border-green-400/50 hover:bg-green-500/40'
                  : isAvailable
                  ? 'bg-white/10 border-white/30 hover:bg-white/15 hover:border-wonderwhiz-bright-pink/50'
                  : 'bg-gray-500/20 border-gray-500/30 opacity-60'
              }`}>
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isAvailable
                      ? 'bg-wonderwhiz-bright-pink text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : isAvailable ? (
                      index + 1
                    ) : (
                      <Lock className="h-6 w-6" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {section.title}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">
                      {section.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  {isAvailable && (
                    <Button
                      onClick={() => onStartSection(index)}
                      size="lg"
                      className={isCompleted 
                        ? "bg-green-500/30 border border-green-400/50 text-green-200 hover:bg-green-500/40 font-semibold"
                        : "bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white font-semibold shadow-lg"
                      }
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isCompleted ? "Review" : "Start"}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quiz Card */}
      {allSectionsCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border-yellow-400/50 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isYoungChild ? "Quiz Time! 🏆" : "Final Knowledge Test"}
                  </h3>
                  <p className="text-white/90 font-medium">
                    {quizCompleted 
                      ? "Amazing work! You've mastered this topic! ⭐"
                      : isYoungChild
                      ? "Answer 5 fun questions to become an expert!"
                      : "Test your understanding with our comprehensive quiz"
                    }
                  </p>
                </div>
              </div>
              
              <Button
                onClick={onStartQuiz}
                disabled={quizCompleted}
                size="lg"
                className={quizCompleted 
                  ? "bg-green-500 hover:bg-green-500 text-white font-semibold" 
                  : "bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-lg"
                }
              >
                {quizCompleted ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Completed!
                  </>
                ) : (
                  <>
                    <Star className="h-5 w-5 mr-2" />
                    {isYoungChild ? "Take Quiz!" : "Start Quiz"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SimplifiedTableOfContents;
