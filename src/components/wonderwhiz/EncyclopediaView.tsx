
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, BookOpen, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';
import SimplifiedTableOfContents from './SimplifiedTableOfContents';
import EnhancedSectionViewer from './EnhancedSectionViewer';
import QuizSystem from './QuizSystem';
import CertificateGenerator from './CertificateGenerator';
import KidFriendlyLoadingState from './KidFriendlyLoadingState';
import KidCelebrationSystem from './KidCelebrationSystem';
import KidFriendlyErrorState from './KidFriendlyErrorState';
import InstantAnswerCard from '../curio/InstantAnswerCard';
import RelatedTopicsGrid from '../curio/RelatedTopicsGrid';
import InteractiveLearningSection from '../content-blocks/InteractiveLearningSection';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EncyclopediaViewProps {
  topic: LearningTopic;
  childAge: number;
  childProfile: any;
  onBackToTopics: () => void;
  onTopicUpdate: (topic: LearningTopic) => void;
}

const EncyclopediaView: React.FC<EncyclopediaViewProps> = ({
  topic,
  childAge,
  childProfile,
  onBackToTopics,
  onTopicUpdate,
}) => {
  const [currentView, setCurrentView] = useState<'toc' | 'section' | 'quiz' | 'certificate'>('toc');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSectionLoading, setIsSectionLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'section_complete' | 'topic_complete' | 'quiz_complete'>('section_complete');
  const [showInstantAnswer, setShowInstantAnswer] = useState(true);
  const [showInteractiveLearning, setShowInteractiveLearning] = useState(false);

  const allSectionsCompleted = completedSections.length === topic.table_of_contents.length;
  const progress = (completedSections.length / topic.table_of_contents.length) * 100;
  const isYoungChild = childAge <= 8;

  const loadSectionContent = async (index: number) => {
    if (isSectionLoading) return;

    const section = topic.table_of_contents[index];
    if (section.content && section.facts) {
      return; // Content already exists
    }

    setIsSectionLoading(true);
    setLoadingError(null);
    
    try {
      const { data: generatedSection, error } = await supabase.functions.invoke('generate-section-content', {
        body: {
          topicId: topic.id,
          sectionTitle: section.title,
          sectionNumber: index + 1,
          childAge: childAge,
          topicTitle: topic.title,
        },
      });

      if (error) {
        console.error('Section generation error:', error);
        setLoadingError(error.message || 'Failed to load content');
        toast.error(isYoungChild ? "Oops! Having trouble getting your lesson ready!" : `Failed to load section: ${error.message}`);
        return;
      }

      if (generatedSection) {
        const updatedToc = [...topic.table_of_contents];
        updatedToc[index] = {
          ...updatedToc[index],
          content: generatedSection.content,
          facts: generatedSection.facts,
          image_url: generatedSection.image_url,
        };

        const updatedTopic: LearningTopic = {
          ...topic,
          table_of_contents: updatedToc,
        };
        onTopicUpdate(updatedTopic);
        
        // Show success feedback for younger kids
        if (isYoungChild) {
          toast.success("🎉 Your lesson is ready!");
        }
      }
    } catch (e) {
      console.error("Error loading section content:", e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setLoadingError(errorMessage);
      setCurrentView('toc'); // Go back to TOC on error
    } finally {
      setIsSectionLoading(false);
    }
  };

  const handleMarkSectionComplete = (index: number) => {
    if (!completedSections.includes(index)) {
      setCompletedSections(prev => [...prev, index]);
      
      // Trigger celebration for section completion
      setCelebrationType('section_complete');
      setShowCelebration(true);
    }
  };

  const handleNextSection = async () => {
    handleMarkSectionComplete(currentSectionIndex);
    if (currentSectionIndex < topic.table_of_contents.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      await loadSectionContent(nextIndex);
      setCurrentSectionIndex(nextIndex);
    }
  };

  const handlePreviousSection = async () => {
    if (currentSectionIndex > 0) {
      const prevIndex = currentSectionIndex - 1;
      await loadSectionContent(prevIndex);
      setCurrentSectionIndex(prevIndex);
    }
  };

  const handleFinishTopic = () => {
    handleMarkSectionComplete(currentSectionIndex);
    
    // Trigger celebration for topic completion
    setCelebrationType('topic_complete');
    setShowCelebration(true);
    
    setTimeout(() => {
      setCurrentView('toc');
    }, 3000); // Show celebration for 3 seconds
  };

  const handleStartSection = async (sectionIndex: number) => {
    setLoadingError(null);
    await loadSectionContent(sectionIndex);
    setCurrentSectionIndex(sectionIndex);
    setCurrentView('section');
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setCelebrationType('quiz_complete');
    setShowCelebration(true);
    
    setTimeout(() => {
      setCurrentView('certificate');
    }, 3000);
  };

  const handleRetryLoading = () => {
    setLoadingError(null);
    if (currentView === 'section') {
      loadSectionContent(currentSectionIndex);
    }
  };

  const handleStartJourney = () => {
    setShowInstantAnswer(false);
    // Small delay for smooth transition
    setTimeout(() => {
      setCurrentView('toc');
    }, 300);
  };

  const handleInteractiveLearningComplete = (score: number) => {
    setShowInteractiveLearning(false);
    // Trigger celebration based on score
    if (score > 0) {
      setCelebrationType('quiz_complete');
      setShowCelebration(true);
    }
    // Return to table of contents
    setTimeout(() => {
      setCurrentView('toc');
    }, 2000);
  };

  const handleRelatedTopicSelect = (topicTitle: string) => {
    // In a real app, this would navigate to the new topic
    console.log('Selected related topic:', topicTitle);
    // For demo, show instant answer for new topic
    setShowInstantAnswer(true);
    setCurrentView('toc');
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
            {isYoungChild ? "🏠 Back Home" : "Back to Topics"}
          </Button>
          
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-2xl border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-bold">
              {completedSections.length}/{topic.table_of_contents.length} 
              {isYoungChild ? " parts done! 🌟" : " sections complete"}
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
                    {isYoungChild ? "Your awesome learning adventure! 🚀" : "Encyclopedia journey"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{Math.round(progress)}%</div>
                <div className="text-sm text-white/90 font-medium">
                  {isYoungChild ? "Done!" : "Complete"}
                </div>
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

      {/* Instant Answer - Shows First */}
      <AnimatePresence>
        {showInstantAnswer && (
          <InstantAnswerCard
            key="instant-answer"
            question={topic.title}
            childAge={childAge}
            onExploreMore={handleStartJourney}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === 'toc' && !showInstantAnswer && (
          <SimplifiedTableOfContents
            key="toc"
            topic={topic}
            completedSections={completedSections}
            allSectionsCompleted={allSectionsCompleted}
            quizCompleted={quizCompleted}
            onStartSection={handleStartSection}
            onStartQuiz={() => setShowInteractiveLearning(true)}
            childAge={childAge}
          />
        )}

        {currentView === 'section' && (
          <>
            {isSectionLoading ? (
              <KidFriendlyLoadingState
                key="section-loading"
                type="section"
                childAge={childAge}
                message={isYoungChild ? "🎨 Making your lesson super awesome..." : undefined}
              />
            ) : loadingError ? (
              <KidFriendlyErrorState
                key="section-error"
                error={loadingError}
                type="content"
                childAge={childAge}
                onRetry={handleRetryLoading}
                onGoHome={() => setCurrentView('toc')}
              />
            ) : (
              <EnhancedSectionViewer
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
          </>
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

        {showInteractiveLearning && (
          <InteractiveLearningSection
            key="interactive-learning"
            topicTitle={topic.title}
            sectionTitle="Interactive Review"
            childAge={childAge}
            onComplete={handleInteractiveLearningComplete}
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

      {/* Related Topics - Show after completing sections */}
      {allSectionsCompleted && currentView === 'toc' && !showInstantAnswer && !showInteractiveLearning && (
        <RelatedTopicsGrid
          currentTopic={topic.title}
          childAge={childAge}
          onTopicSelect={handleRelatedTopicSelect}
        />
      )}

      {/* Celebration System */}
      <KidCelebrationSystem
        trigger={showCelebration}
        type={celebrationType}
        childAge={childAge}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
};

export default EncyclopediaView;
