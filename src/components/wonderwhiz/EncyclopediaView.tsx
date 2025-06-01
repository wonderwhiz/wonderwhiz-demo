
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';
import TableOfContents from './TableOfContents';
import SectionViewer from './SectionViewer';
import QuizSystem from './QuizSystem';
import CertificateGenerator from './CertificateGenerator';
import PrintableActivities from './PrintableActivities';
import RelatedTopics from './RelatedTopics';

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
  const [currentView, setCurrentView] = useState<'toc' | 'section' | 'quiz' | 'certificate' | 'activities' | 'related'>('toc');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const allSectionsCompleted = completedSections.length === topic.table_of_contents.length;

  const handleSectionComplete = (sectionIndex: number) => {
    if (!completedSections.includes(sectionIndex)) {
      setCompletedSections(prev => [...prev, sectionIndex]);
    }
  };

  const handleStartSection = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentView('section');
  };

  const handleSectionFinished = () => {
    handleSectionComplete(currentSectionIndex);
    
    if (currentSectionIndex < topic.table_of_contents.length - 1) {
      // Move to next section
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      // All sections completed, return to TOC
      setCurrentView('toc');
    }
  };

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setCurrentView('certificate');
  };

  const handleCertificateGenerated = () => {
    setCurrentView('activities');
  };

  const handleActivitiesComplete = () => {
    setCurrentView('related');
  };

  const progress = (completedSections.length / topic.table_of_contents.length) * 100;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={onBackToTopics}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Button>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-white/80">
              {completedSections.length} of {topic.table_of_contents.length} sections complete
            </span>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
          <h1 className="text-2xl font-bold text-white mb-3">{topic.title}</h1>
          <div className="w-full bg-white/10 rounded-full h-2 mb-3">
            <motion.div
              className="bg-wonderwhiz-bright-pink h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-white/70 text-sm">
            🎯 Progress: {Math.round(progress)}% • Age-customized for {childAge} years old
          </p>
        </Card>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === 'toc' && (
          <TableOfContents
            key="toc"
            topic={topic}
            completedSections={completedSections}
            allSectionsCompleted={allSectionsCompleted}
            quizCompleted={quizCompleted}
            onStartSection={handleStartSection}
            onStartQuiz={handleStartQuiz}
            childAge={childAge}
          />
        )}

        {currentView === 'section' && (
          <SectionViewer
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
            onCertificateGenerated={handleCertificateGenerated}
          />
        )}

        {currentView === 'activities' && (
          <PrintableActivities
            key="activities"
            topic={topic}
            childAge={childAge}
            onActivitiesComplete={handleActivitiesComplete}
          />
        )}

        {currentView === 'related' && (
          <RelatedTopics
            key="related"
            currentTopic={topic}
            childAge={childAge}
            childProfile={childProfile}
            onNewTopicSelected={onBackToTopics}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EncyclopediaView;
