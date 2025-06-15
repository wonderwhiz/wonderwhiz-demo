
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
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

  const handleSectionFinished = () => {
    if (!completedSections.includes(currentSectionIndex)) {
      setCompletedSections(prev => [...prev, currentSectionIndex]);
    }
    
    // Auto-advance to next section or return to TOC
    if (currentSectionIndex < topic.table_of_contents.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      setCurrentView('toc');
    }
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
      {/* Simplified Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBackToTopics}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isYoungChild ? "Back to Topics" : "Back to Dashboard"}
          </Button>
          
          <div className="flex items-center gap-2 text-white/80">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm">
              {completedSections.length}/{topic.table_of_contents.length} complete
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-white">{topic.title}</h1>
            <span className="text-white/70 text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-wonderwhiz-bright-pink to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
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
            onSectionComplete={handleSectionFinished}
            onBackToTOC={() => setCurrentView('toc')}
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
