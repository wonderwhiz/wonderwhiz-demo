
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Star, Trophy, Play, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';

interface TableOfContentsProps {
  topic: LearningTopic;
  completedSections: number[];
  allSectionsCompleted: boolean;
  quizCompleted: boolean;
  onStartSection: (index: number) => void;
  onStartQuiz: () => void;
  childAge: number;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  topic,
  completedSections,
  allSectionsCompleted,
  quizCompleted,
  onStartSection,
  onStartQuiz,
  childAge
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      {/* Introduction */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-purple-500/20 border-wonderwhiz-bright-pink/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-6 w-6 text-wonderwhiz-bright-pink" />
            <h2 className="text-xl font-bold text-white">Your Learning Journey</h2>
            <Star className="h-6 w-6 text-yellow-400" />
          </div>
          <p className="text-white/80 mb-4">
            {childAge <= 8 
              ? "Let's explore this amazing topic together! Each section is like a fun story with cool pictures! 🌟"
              : "Welcome to your personalized encyclopedia! Each section contains detailed explanations, fascinating facts, and engaging content designed just for you! 📚✨"
            }
          </p>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/90 text-sm">
              📖 <strong>What you'll learn:</strong> {topic.description}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Table of Contents */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/5 backdrop-blur-sm border-white/20 p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            📚 Table of Contents
            <span className="text-sm font-normal text-white/70">
              ({completedSections.length}/{topic.table_of_contents.length} completed)
            </span>
          </h3>

          <ul role="list" aria-label="Table of contents" className="space-y-3">
            {topic.table_of_contents.map((section, index) => {
              const isCompleted = completedSections.includes(index);
              const isAvailable = index === 0 || completedSections.includes(index - 1);

              return (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  whileHover={isAvailable ? { scale: 1.02 } : {}}
                  className={`p-4 rounded-lg border transition-all ${
                    isCompleted
                      ? 'bg-green-500/20 border-green-500/40'
                      : isAvailable
                      ? 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-wonderwhiz-bright-pink/40'
                      : 'bg-gray-500/10 border-gray-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isAvailable
                          ? 'bg-wonderwhiz-bright-pink text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : isAvailable ? (
                          index + 1
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          isAvailable ? 'text-white' : 'text-white/50'
                        }`}>
                          {section.title}
                        </h4>
                        <p className={`text-sm ${
                          isAvailable ? 'text-white/70' : 'text-white/40'
                        }`}>
                          {section.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-white/50" />
                          <span className="text-xs text-white/50">
                            ~{section.estimated_reading_time} min read
                          </span>
                        </div>
                      </div>
                    </div>

                    {isAvailable && !isCompleted && (
                      <Button
                        onClick={() => onStartSection(index)}
                        size="sm"
                        aria-label={`Start section ${index + 1}: ${section.title}`}
                        className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}

                    {isCompleted && (
                      <Button
                        onClick={() => onStartSection(index)}
                        variant="outline"
                        size="sm"
                        aria-label={`Review section ${index + 1}: ${section.title}`}
                        className="border-green-500/40 text-green-400 hover:bg-green-500/20"
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </Card>
      </motion.div>

      {/* Quiz Section */}
      {allSectionsCompleted && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/40 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Knowledge Quiz</h3>
                  <p className="text-white/80 text-sm">
                    {quizCompleted 
                      ? "🎉 Quiz completed! Well done!" 
                      : "Test your knowledge with 5 fun questions!"
                    }
                  </p>
                </div>
              </div>
              
              <Button
                onClick={onStartQuiz}
                disabled={quizCompleted}
                aria-label={quizCompleted ? 'Quiz completed' : 'Start quiz'}
                className={quizCompleted 
                  ? "bg-green-500 hover:bg-green-500" 
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
                }
              >
                {quizCompleted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Start Quiz
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

export default TableOfContents;
