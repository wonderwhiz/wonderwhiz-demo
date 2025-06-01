
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Trophy, Star, Target, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AgeCapture from './AgeCapture';
import TopicInput from './TopicInput';
import EncyclopediaView from './EncyclopediaView';
import { LearningTopic } from '@/types/wonderwhiz';

interface WonderWhizDashboardProps {
  childProfile: any;
  onTopicCreate: (topic: LearningTopic) => void;
}

const WonderWhizDashboard: React.FC<WonderWhizDashboardProps> = ({
  childProfile,
  onTopicCreate
}) => {
  const [currentStep, setCurrentStep] = useState<'age' | 'topic' | 'encyclopedia'>('age');
  const [childAge, setChildAge] = useState<number>(childProfile?.age || 10);
  const [currentTopic, setCurrentTopic] = useState<LearningTopic | null>(null);

  const handleAgeConfirm = (age: number) => {
    setChildAge(age);
    setCurrentStep('topic');
  };

  const handleTopicCreated = (topic: LearningTopic) => {
    setCurrentTopic(topic);
    setCurrentStep('encyclopedia');
    onTopicCreate(topic);
  };

  const handleBackToTopics = () => {
    setCurrentTopic(null);
    setCurrentStep('topic');
  };

  const totalPoints = childProfile?.sparks_balance || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-deep-purple/90 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="h-8 w-8 text-wonderwhiz-bright-pink" />
            <h1 className="text-4xl font-bold text-white">Wonder Whiz Encyclopedia</h1>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            🌟 Discover amazing topics through interactive learning adventures! 
            Created by leading educators and child psychologists to make learning fun and engaging.
          </p>
        </motion.div>

        {/* Points Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-6"
        >
          <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30 px-6 py-3">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <span className="text-white font-bold text-lg">
                {totalPoints} Wonder Points ✨
              </span>
              <Award className="h-6 w-6 text-yellow-400" />
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          {currentStep === 'age' && (
            <AgeCapture
              initialAge={childAge}
              onAgeConfirm={handleAgeConfirm}
            />
          )}

          {currentStep === 'topic' && (
            <TopicInput
              childAge={childAge}
              childId={childProfile?.id}
              onTopicCreated={handleTopicCreated}
            />
          )}

          {currentStep === 'encyclopedia' && currentTopic && (
            <EncyclopediaView
              topic={currentTopic}
              childAge={childAge}
              childProfile={childProfile}
              onBackToTopics={handleBackToTopics}
            />
          )}
        </div>

        {/* Fun Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 py-6"
        >
          <p className="text-white/60 text-sm">
            🎓 Award-winning educational platform • 🏆 Trusted by international schools worldwide
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WonderWhizDashboard;
