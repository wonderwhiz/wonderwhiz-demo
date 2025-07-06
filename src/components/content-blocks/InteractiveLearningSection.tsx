import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Brain, CheckCircle, RotateCcw, Zap } from 'lucide-react';
import FlashcardBlock from './FlashcardBlock';
import EnhancedQuizBlock from './EnhancedQuizBlock';

interface InteractiveLearningQuestion {
  id: string;
  type: 'quiz' | 'flashcard';
  question: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  front?: string;
  back?: string;
}

interface InteractiveLearningProps {
  topicTitle: string;
  sectionTitle: string;
  childAge: number;
  onComplete: (score: number) => void;
}

const InteractiveLearningSection: React.FC<InteractiveLearningProps> = ({
  topicTitle,
  sectionTitle,
  childAge,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  
  const isYoungChild = childAge <= 8;

  // Generate interactive questions based on topic and section
  const questions = generateInteractiveQuestions(topicTitle, sectionTitle, childAge);
  
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const allCompleted = completedQuestions.size === questions.length;

  function generateInteractiveQuestions(topic: string, section: string, age: number): InteractiveLearningQuestion[] {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('superintelligence') || topicLower.includes('ai')) {
      return age <= 8 ? [
        {
          id: '1',
          type: 'flashcard',
          question: 'What is Artificial Intelligence?',
          front: 'What is AI? 🤖',
          back: 'AI is like a super smart computer brain that can think, learn, and help people solve problems!'
        },
        {
          id: '2',
          type: 'quiz',
          question: 'Which of these uses AI to help you?',
          options: ['Your smartphone 📱', 'A wooden chair 🪑', 'A paper book 📖', 'A rock 🪨'],
          correctIndex: 0,
          explanation: 'Great job! Your smartphone uses AI for voice recognition, camera features, and suggesting apps!'
        },
        {
          id: '3',
          type: 'flashcard',
          question: 'How does AI learn?',
          front: 'How does AI get smarter? 🧠',
          back: 'AI learns by looking at lots and lots of examples, just like how you learn by practicing!'
        },
        {
          id: '4',
          type: 'quiz',
          question: 'What makes superintelligence special?',
          options: ['It\'s red colored 🔴', 'It\'s super smart - smarter than humans! 🚀', 'It\'s very heavy ⚖️', 'It makes loud noises 📢'],
          correctIndex: 1,
          explanation: 'Exactly right! Superintelligence means being much, much smarter than the smartest humans!'
        }
      ] : [
        {
          id: '1',
          type: 'flashcard',
          question: 'Superintelligence Definition',
          front: 'What defines superintelligence?',
          back: 'An intelligence that greatly exceeds human cognitive performance in all domains, including creativity, general wisdom, and problem-solving.'
        },
        {
          id: '2',
          type: 'quiz',
          question: 'What is the key characteristic of superintelligent systems?',
          options: ['High processing speed', 'Recursive self-improvement capability', 'Large memory capacity', 'Advanced sensors'],
          correctIndex: 1,
          explanation: 'Correct! The ability to improve their own intelligence recursively could lead to an intelligence explosion.'
        },
        {
          id: '3',
          type: 'flashcard',
          question: 'Intelligence Explosion',
          front: 'What is an intelligence explosion?',
          back: 'A hypothetical scenario where AI systems rapidly and recursively improve themselves, leading to superintelligence far beyond human comprehension.'
        },
        {
          id: '4',
          type: 'quiz',
          question: 'According to experts, what is a major concern about superintelligence?',
          options: ['Energy consumption', 'Alignment with human values', 'Storage requirements', 'Processing costs'],
          correctIndex: 1,
          explanation: 'Exactly! Ensuring superintelligent systems remain aligned with human values and goals is considered the primary challenge.'
        }
      ];
    }
    
    // Generic questions for any topic
    return [
      {
        id: '1',
        type: 'flashcard',
        question: `Key Concept: ${section}`,
        front: `What is ${section}?`,
        back: `${section} is an important concept in ${topic} that helps us understand the world better!`
      },
      {
        id: '2',
        type: 'quiz',
        question: `What did you learn about ${section}?`,
        options: ['It\'s complex but interesting', 'It\'s simple and boring', 'It doesn\'t matter', 'It\'s impossible to understand'],
        correctIndex: 0,
        explanation: `Great! ${section} can be complex, but that\'s what makes it fascinating to explore!`
      }
    ];
  }

  const handleQuestionComplete = (isCorrect?: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setCompletedQuestions(prev => new Set([...prev, currentIndex]));
    
    if (isLastQuestion) {
      setTimeout(() => {
        setShowResults(true);
      }, 1000);
    } else {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1500);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompletedQuestions(new Set());
    setShowResults(false);
  };

  const handleFinish = () => {
    onComplete(score);
  };

  const progressPercentage = (completedQuestions.size / questions.length) * 100;

  if (showResults) {
    const scorePercentage = (score / questions.length) * 100;
    const isExcellent = scorePercentage >= 80;
    const isGood = scorePercentage >= 60;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <Card className="bg-gradient-to-br from-white via-green-50 to-emerald-50 border-2 border-green-200 p-8 max-w-md mx-auto">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
          >
            <Trophy className="h-10 w-10 text-white" />
          </motion.div>
          
          <h3 className={`font-bold text-gray-900 mb-4 ${isYoungChild ? 'text-2xl' : 'text-xl'}`}>
            {isYoungChild ? "🎉 Amazing Job!" : "🏆 Challenge Complete!"}
          </h3>
          
          <div className="mb-6">
            <div className={`text-4xl font-bold mb-2 ${isExcellent ? 'text-green-600' : isGood ? 'text-blue-600' : 'text-orange-600'}`}>
              {score}/{questions.length}
            </div>
            <p className="text-gray-700">
              {isExcellent 
                ? (isYoungChild ? "🌟 You're a superstar!" : "Excellent mastery!")
                : isGood 
                ? (isYoungChild ? "👍 Great work!" : "Good understanding!")
                : (isYoungChild ? "💪 Keep learning!" : "Keep exploring!")
              }
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleRestart}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={handleFinish}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isYoungChild ? "I'm Done!" : "Complete"}
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple rounded-full flex items-center justify-center"
          >
            <Brain className="h-4 w-4 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white">
            {isYoungChild ? "🧠 Learning Challenge!" : "🎯 Knowledge Check"}
          </h3>
        </div>
        
        <p className="text-white/70 mb-4">
          {isYoungChild 
            ? "Let's see what you learned! Have fun with these questions!"
            : "Test and reinforce your understanding with interactive questions"
          }
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion.type === 'flashcard' ? (
            <FlashcardBlock
              content={{
                front: currentQuestion.front!,
                back: currentQuestion.back!
              }}
              specialistId="nova"
              childAge={childAge}
              updateHeight={() => {}}
            />
          ) : (
            <EnhancedQuizBlock
              id={currentQuestion.id}
              question={currentQuestion.question}
              options={currentQuestion.options!}
              correctIndex={currentQuestion.correctIndex!}
              explanation={currentQuestion.explanation}
              specialistId="nova"
              childAge={childAge}
              onQuizCorrect={() => handleQuestionComplete(true)}
              updateHeight={() => {}}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => handleQuestionComplete()}
          className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-purple/90 text-white px-8"
        >
          {currentQuestion.type === 'flashcard' ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              {isYoungChild ? "Got it!" : "Understood"}
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              {isLastQuestion ? "Finish" : "Next Question"}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default InteractiveLearningSection;