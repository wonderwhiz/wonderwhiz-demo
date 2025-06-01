
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';

interface QuizSystemProps {
  topic: LearningTopic;
  childAge: number;
  childProfile: any;
  onQuizComplete: () => void;
  onBackToTOC: () => void;
}

const QuizSystem: React.FC<QuizSystemProps> = ({
  topic,
  childAge,
  childProfile,
  onQuizComplete,
  onBackToTOC
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Mock quiz data - in real implementation, this would be generated
  const quizQuestions = [
    {
      question: `What did you learn about ${topic.title}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0
    },
    {
      question: "Which fact amazed you the most?",
      options: ["Fact 1", "Fact 2", "Fact 3", "Fact 4"],
      correct: 1
    },
    {
      question: "How would you explain this to a friend?",
      options: ["Way 1", "Way 2", "Way 3", "Way 4"],
      correct: 2
    },
    {
      question: "What's the most important thing to remember?",
      options: ["Thing 1", "Thing 2", "Thing 3", "Thing 4"],
      correct: 0
    },
    {
      question: "How does this connect to what you already know?",
      options: ["Connection 1", "Connection 2", "Connection 3", "Connection 4"],
      correct: 1
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleComplete = () => {
    onQuizComplete();
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {childAge <= 8 ? "Amazing Job!" : "Quiz Complete!"}
          </h2>
          <p className="text-white/80 mb-6">
            You scored {score} out of {quizQuestions.length}!
          </p>
          <Button
            onClick={handleComplete}
            className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
          >
            Continue to Certificate! 🏆
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onBackToTOC}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contents
        </Button>
        
        <div className="text-white/70 text-sm">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </div>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {quizQuestions[currentQuestion].question}
        </h2>

        <div className="space-y-3 mb-8">
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full p-4 text-left rounded-lg border transition-all ${
                selectedAnswer === index
                  ? 'bg-wonderwhiz-bright-pink/20 border-wonderwhiz-bright-pink text-white'
                  : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="w-full bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
        >
          {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </Card>
    </motion.div>
  );
};

export default QuizSystem;
