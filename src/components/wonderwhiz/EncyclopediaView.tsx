
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
import KidFriendlyLoadingState from './KidFriendlyLoadingState';
import KidCelebrationSystem from './KidCelebrationSystem';
import KidFriendlyErrorState from './KidFriendlyErrorState';
import RelatedTopicsGrid from '../curio/RelatedTopicsGrid';
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

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleRelatedTopicSelect = (topicTitle: string) => {
    // In a real app, this would navigate to the new topic
    console.log('Selected related topic:', topicTitle);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Streamlined Header */}
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

        {/* Integrated Topic Header with Progress */}
        <Card className="bg-white shadow-lg border border-gray-200 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
                  <p className="text-white/90 font-medium text-lg">
                    {isYoungChild ? "Your awesome learning adventure! 🚀" : "Deep dive encyclopedia exploration"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{Math.round(progress)}%</div>
                <div className="text-sm text-white/90 font-medium">
                  {isYoungChild ? "Done!" : "Complete"}
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-5 shadow-inner">
              <motion.div
                className="bg-white h-5 rounded-full shadow-sm flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {progress > 10 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-purple-600 font-bold text-sm"
                  >
                    🎯
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Engagement Stats */}
            <div className="flex items-center justify-between mt-4 text-white/80 text-sm">
              <span>📚 {completedSections.length} sections explored</span>
              <span>🎯 {Math.round((completedSections.length / topic.table_of_contents.length) * 100)}% mastery</span>
              <span>⭐ {completedSections.length * 10} knowledge points</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content - Simplified Flow */}
      <AnimatePresence mode="wait">
        {currentView === 'toc' && (
          <motion.div
            key="toc-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SimplifiedTableOfContents
              topic={topic}
              completedSections={completedSections}
              allSectionsCompleted={allSectionsCompleted}
              quizCompleted={quizCompleted}
              onStartSection={handleStartSection}
              onStartQuiz={handleStartQuiz}
              childAge={childAge}
            />
            
            {/* Related Topics - Integrated */}
            {allSectionsCompleted && (
              <RelatedTopicsGrid
                currentTopic={topic.title}
                childAge={childAge}
                onTopicSelect={handleRelatedTopicSelect}
              />
            )}
          </motion.div>
        )}

        {currentView === 'section' && (
          <motion.div
            key="section-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {isSectionLoading ? (
              <KidFriendlyLoadingState
                type="section"
                childAge={childAge}
                message={isYoungChild ? "🎨 Making your lesson super awesome..." : undefined}
              />
            ) : loadingError ? (
              <KidFriendlyErrorState
                error={loadingError}
                type="content"
                childAge={childAge}
                onRetry={handleRetryLoading}
                onGoHome={() => setCurrentView('toc')}
              />
            ) : (
              <SimplifiedSectionViewer
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
          </motion.div>
        )}

        {currentView === 'quiz' && (
          <motion.div
            key="quiz-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <QuizSystem
              topic={topic}
              childAge={childAge}
              childProfile={childProfile}
              onQuizComplete={handleQuizComplete}
              onBackToTOC={() => setCurrentView('toc')}
            />
          </motion.div>
        )}

        {currentView === 'certificate' && (
          <motion.div
            key="certificate-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CertificateGenerator
              topic={topic}
              childProfile={childProfile}
              onCertificateGenerated={onBackToTopics}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Celebration System */}
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
