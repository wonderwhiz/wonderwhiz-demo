
import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Lock, Star, Trophy, BookOpen } from 'lucide-react';
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
      {/* Modern Welcome Header */}
      <div className="bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-3xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {topic.title}
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              {isYoungChild 
                ? "Let's learn together! Pick any section to start your adventure." 
                : "Explore each section to build your understanding step by step."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Sections List */}
      <div className="space-y-4">
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
              <Card className={`p-6 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg border-2 ${
                isCompleted
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
                  : isAvailable
                  ? 'bg-white hover:bg-gray-50 border-gray-200 hover:border-purple-300'
                  : 'bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed'
              }`}>
                <div className="flex items-center gap-5">
                  {/* Enhanced Section Number/Status Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                      : isAvailable
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-7 w-7" />
                    ) : isAvailable ? (
                      <span className="text-xl font-bold">{index + 1}</span>
                    ) : (
                      <Lock className="h-6 w-6" />
                    )}
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-700 font-medium">
                      {section.description}
                    </p>
                    {isCompleted && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 text-sm font-semibold">Completed!</span>
                      </div>
                    )}
                  </div>

                  {/* Modern Action Button */}
                  {isAvailable && (
                    <Button
                      onClick={() => onStartSection(index)}
                      size="lg"
                      className={`px-8 py-3 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 ${
                        isCompleted 
                          ? "bg-green-100 hover:bg-green-150 text-green-800 border-2 border-green-200 hover:border-green-300"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:shadow-xl"
                      }`}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {isCompleted ? "Review" : "Start"}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Quiz Section */}
      {allSectionsCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-200 p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isYoungChild ? "🏆 Final Challenge!" : "Knowledge Test"}
                  </h3>
                  <p className="text-gray-700 text-lg font-medium">
                    {quizCompleted 
                      ? "🌟 Congratulations! You've mastered this topic!"
                      : isYoungChild
                      ? "Answer 5 questions to become an expert!"
                      : "Test your understanding with our comprehensive quiz"
                    }
                  </p>
                </div>
              </div>
              
              <Button
                onClick={onStartQuiz}
                disabled={quizCompleted}
                size="lg"
                className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 ${
                  quizCompleted 
                    ? "bg-green-100 hover:bg-green-100 text-green-800 border-2 border-green-200" 
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white hover:shadow-xl"
                }`}
              >
                {quizCompleted ? (
                  <>
                    <CheckCircle className="h-6 w-6 mr-2" />
                    Completed!
                  </>
                ) : (
                  <>
                    <Star className="h-6 w-6 mr-2" />
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
