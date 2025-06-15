import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, BookOpen, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';
import SimplifiedTableOfContents from './SimplifiedTableOfContents';
import SimplifiedSectionViewer from './SimplifiedSectionViewer';
import QuizSystem from './QuizSystem';
import CertificateGenerator from './CertificateGenerator';

interface EncyclopediaViewProps {
  topic: LearningTopic;
  childAge: number;
  childProfile: any;
  onBackToTopics: () => void;
}

const EncyclopediaView: React.FC<EncyclopediaViewProps> = ({
  topic,
  childAge,
  childProfile,
  onBackToTopics
}) => {
  const [currentView, setCurrentView] = useState<'toc' | 'section' | 'quiz' | 'certificate'>('toc');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const allSectionsCompleted = completedSections.length === topic.table_of_contents.length;
  const progress = (completedSections.length / topic.table_of_contents.length) * 100;
  const isYoungChild = childAge <= 8;

  const handleMarkSectionComplete = (index: number) => {
    if (!completedSections.includes(index)) {
      setCompletedSections(prev => [...prev, index]);
    }
  };

  const handleNextSection = () => {
    handleMarkSectionComplete(currentSectionIndex);
    if (currentSectionIndex < topic.table_of_contents.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleFinishTopic = () => {
    handleMarkSectionComplete(currentSectionIndex);
    setCurrentView('toc');
  };

  const handleStartSection = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentView('section');
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setCurrentView('certificate');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBackToTopics}
            className="text-white/80 hover:text-white hover:bg-white/10 font-semibold text-lg px-6 py-3 rounded-2xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {isYoungChild ? "Back to Topics" : "Back to Dashboard"}
          </Button>
          
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-2xl border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-bold">
              {completedSections.length}/{topic.table_of_contents.length} sections complete
            </span>
          </div>
        </div>

        {/* Beautiful Progress Card */}
        <Card className="bg-white shadow-lg border border-gray-200 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{topic.title}</h1>
                  <p className="text-white/90 font-medium">
                    {isYoungChild ? "Your learning adventure!" : "Encyclopedia journey"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{Math.round(progress)}%</div>
                <div className="text-sm text-white/90 font-medium">Complete</div>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 shadow-inner">
              <motion.div
                className="bg-white h-4 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === 'toc' && (
          <SimplifiedTableOfContents
            key="toc"
            topic={topic}
            completedSections={completedSections}
            allSectionsCompleted={allSectionsCompleted}
            quizCompleted={quizCompleted}
            onStartSection={handleStartSection}
            onStartQuiz={() => setCurrentView('quiz')}
            childAge={childAge}
          />
        )}

        {currentView === 'section' && (
          <SimplifiedSectionViewer
            key="section"
            topic={topic}
            sectionIndex={currentSectionIndex}
            childAge={childAge}
            childProfile={childProfile}
            onBackToTOC={() => setCurrentView('toc')}
            onNextSection={handleNextSection}
            onPreviousSection={handlePreviousSection}
            onFinishTopic={handleFinishTopic}
            isFirstSection={currentSectionIndex === 0}
            isLastSection={currentSectionIndex === topic.table_of_contents.length - 1}
          />
        )}

        {currentView === 'quiz' && (
          <QuizSystem
            key="quiz"
            topic={topic}
            childAge={childAge}
            childProfile={childProfile}
            onQuizComplete={handleQuizComplete}
            onBackToTOC={() => setCurrentView('toc')}
          />
        )}

        {currentView === 'certificate' && (
          <CertificateGenerator
            key="certificate"
            topic={topic}
            childProfile={childProfile}
            onCertificateGenerated={onBackToTopics}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EncyclopediaView;
