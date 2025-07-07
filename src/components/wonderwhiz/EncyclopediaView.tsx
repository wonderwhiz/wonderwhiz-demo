
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, BookOpen, Trophy, Volume2, Sparkles, Star } from 'lucide-react';
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
import { useSwipe } from '@/hooks/use-swipe';
import { useHaptic } from '@/hooks/use-haptic';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';

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
  const [isReading, setIsReading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { triggerHaptic } = useHaptic();
  const { playText, stopPlaying, isPlaying } = useElevenLabsVoice();

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
      
      // Trigger haptic feedback and celebration
      triggerHaptic();
      setCelebrationType('section_complete');
      setShowCelebration(true);
      
      // Fun audio feedback for kids
      if (isYoungChild) {
        toast.success("🎉 Awesome! You finished this part!", {
          duration: 3000,
        });
      }
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

  const handleReadAloud = async () => {
    if (isReading) {
      stopPlaying();
      setIsReading(false);
      return;
    }

    const section = topic.table_of_contents[currentSectionIndex];
    if (section?.content) {
      setIsReading(true);
      await playText(section.content);
      setIsReading(false);
    }
  };

  // Swipe gestures for mobile navigation
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (currentView === 'section' && !isLastSection) {
        handleNextSection();
      }
    },
    onSwipeRight: () => {
      if (currentView === 'section' && !isFirstSection) {
        handlePreviousSection();
      }
    }
  });

  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === topic.table_of_contents.length - 1;

  return (
    <div ref={containerRef} {...swipeHandlers} className="max-w-6xl mx-auto relative">
      {/* Floating Stars Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-wonderwhiz-gold"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0 
            }}
            animate={{ 
              y: Math.random() * window.innerHeight,
              scale: [0, 1, 0.8, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2 
            }}
          >
            <Star className="h-4 w-4" />
          </motion.div>
        ))}
      </div>

      {/* Enhanced Header with Sparkles */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative"
      >
        <div className="flex items-center justify-between mb-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              onClick={() => {
                triggerHaptic();
                onBackToTopics();
              }}
              className="text-white/80 hover:text-white hover:bg-white/10 font-semibold text-lg px-6 py-3 rounded-2xl transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {isYoungChild ? "🏠 Back Home" : "Back to Topics"}
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-2xl border border-green-200"
            whileHover={{ scale: 1.02 }}
            animate={{ 
              boxShadow: completedSections.length > 0 ? "0 0 20px rgba(34, 197, 94, 0.3)" : "none"
            }}
          >
            <motion.div
              animate={{ rotate: completedSections.length > 0 ? [0, 360] : 0 }}
              transition={{ duration: 0.6 }}
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
            </motion.div>
            <span className="font-bold">
              {completedSections.length}/{topic.table_of_contents.length} 
              {isYoungChild ? " parts done! 🌟" : " sections complete"}
            </span>
            {currentView === 'section' && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReadAloud}
                  className={`ml-2 px-3 py-1 rounded-lg ${isReading || isPlaying ? 'bg-white/20 text-white' : 'text-green-700 hover:bg-white/20'}`}
                >
                  <Volume2 className={`h-4 w-4 ${isReading || isPlaying ? 'animate-pulse' : ''}`} />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Enhanced Topic Header with Animations */}
        <Card className="bg-white shadow-lg border border-gray-200 rounded-3xl overflow-hidden relative">
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-8 text-white relative overflow-hidden">
            {/* Floating sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/30"
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%',
                  scale: 0 
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2 
                }}
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
            ))}
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <motion.h1 
                    className="text-3xl font-bold mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {topic.title}
                  </motion.h1>
                  <motion.p 
                    className="text-white/90 font-medium text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {isYoungChild ? "Your awesome learning adventure! 🚀" : "Deep dive encyclopedia exploration"}
                  </motion.p>
                </div>
              </div>
              <motion.div 
                className="text-right"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <motion.div 
                  className="text-4xl font-bold"
                  animate={{ 
                    scale: progress > 0 ? [1, 1.1, 1] : 1,
                    color: progress === 100 ? "#FFD700" : "#FFFFFF"
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {Math.round(progress)}%
                </motion.div>
                <div className="text-sm text-white/90 font-medium">
                  {isYoungChild ? "Done!" : "Complete"}
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced Interactive Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-6 shadow-inner relative z-10">
              <motion.div
                className="bg-gradient-to-r from-white to-yellow-200 h-6 rounded-full shadow-sm flex items-center justify-end pr-2 relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                {progress > 15 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-purple-600 font-bold text-sm relative z-10"
                  >
                    {progress === 100 ? "🏆" : "🎯"}
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Interactive Engagement Stats */}
            <motion.div 
              className="flex items-center justify-between mt-4 text-white/80 text-sm relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.span 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                📚 <span className="font-medium">{completedSections.length}</span> 
                {isYoungChild ? "parts explored" : "sections explored"}
              </motion.span>
              <motion.span 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  color: progress > 75 ? "#FFD700" : "#FFFFFF"
                }}
              >
                🎯 <span className="font-medium">{Math.round((completedSections.length / topic.table_of_contents.length) * 100)}%</span> mastery
              </motion.span>
              <motion.span 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  scale: completedSections.length > 0 ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.6 }}
              >
                ⭐ <span className="font-medium">{completedSections.length * 10}</span> 
                {isYoungChild ? "awesome points" : "knowledge points"}
              </motion.span>
            </motion.div>
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
