import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, BookOpen, Play, Pause, Volume2, VolumeX, CheckCircle2, Star, Sparkles, Trophy, Target, Clock, Users, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LearningTopic } from '@/types/wonderwhiz';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';

interface ElevatedEncyclopediaViewProps {
  topic: LearningTopic;
  childAge: number;
  childProfile: any;
  onBackToTopics: () => void;
  onTopicUpdate: (topic: LearningTopic) => void;
}

const ElevatedEncyclopediaView: React.FC<ElevatedEncyclopediaViewProps> = ({
  topic,
  childAge,
  childProfile,
  onBackToTopics,
  onTopicUpdate,
}) => {
  const [currentView, setCurrentView] = useState<'overview' | 'section' | 'completed'>('overview');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const { playText, stopPlaying, isPlaying } = useElevenLabsVoice();

  const progress = (completedSections.length / topic.table_of_contents.length) * 100;
  const isYoungChild = childAge <= 8;
  const allSectionsCompleted = completedSections.length === topic.table_of_contents.length;

  const loadSectionContent = async (index: number) => {
    const section = topic.table_of_contents[index];
    if (section.content && section.facts) return;

    setIsLoading(true);
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

      if (error) throw error;

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
      }
    } catch (error) {
      console.error("Error loading section content:", error);
      toast.error("Failed to load section content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionComplete = (index: number) => {
    if (!completedSections.includes(index)) {
      setCompletedSections(prev => [...prev, index]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleStartSection = async (index: number) => {
    await loadSectionContent(index);
    setCurrentSectionIndex(index);
    setCurrentView('section');
  };

  const handleReadAloud = async () => {
    if (isPlaying) {
      stopPlaying();
      return;
    }

    const section = topic.table_of_contents[currentSectionIndex];
    if (section?.content) {
      await playText(section.content);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Dynamic Parallax Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-primary opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{ 
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Elevated Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-glass border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <Button
                  variant="ghost"
                  onClick={onBackToTopics}
                  className="text-white/80 hover:text-white hover:bg-white/10 border border-white/20 rounded-xl px-4 py-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {isYoungChild ? "🏠 Home" : "Back"}
                </Button>
                
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-glow"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <BookOpen className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{topic.title}</h1>
                    <p className="text-white/70 text-sm">
                      {isYoungChild ? "Your learning adventure! 🚀" : "Deep dive exploration"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Smart Progress Indicator */}
              <motion.div 
                className="flex items-center gap-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-right">
                  <motion.div 
                    className="text-2xl font-bold text-white"
                    animate={{ 
                      scale: progress > 0 ? [1, 1.1, 1] : 1,
                      color: progress === 100 ? "#FFD700" : "#FFFFFF"
                    }}
                  >
                    {Math.round(progress)}%
                  </motion.div>
                  <div className="text-xs text-white/60">Complete</div>
                </div>
                
                <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent-glow rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                {currentView === 'section' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReadAloud}
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2"
                  >
                    {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            {currentView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Hero Section */}
                <Card className="bg-glass border-white/10 p-8 rounded-3xl overflow-hidden relative">
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div 
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-glow"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        <BookOpen className="h-8 w-8 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{topic.title}</h2>
                        <p className="text-white/80 text-lg">
                          {topic.description || "An exciting exploration designed for curious minds!"}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      {[
                        { icon: Target, label: "Sections", value: topic.table_of_contents.length, color: "from-blue-400 to-blue-600" },
                        { icon: Clock, label: "Est. Time", value: `${topic.table_of_contents.length * 5}min`, color: "from-green-400 to-green-600" },
                        { icon: Users, label: "Age", value: `${childAge}+`, color: "from-purple-400 to-purple-600" },
                        { icon: Star, label: "Points", value: completedSections.length * 10, color: "from-yellow-400 to-yellow-600" }
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center"
                        >
                          <motion.div 
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                            whileHover={{ scale: 1.1 }}
                          >
                            <stat.icon className="h-6 w-6 text-white" />
                          </motion.div>
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-white/60 text-sm">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Progress Visualization */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Your Progress</h3>
                        <div className="text-white/80">{completedSections.length}/{topic.table_of_contents.length} completed</div>
                      </div>
                      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-accent via-accent-glow to-accent rounded-full relative"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-full h-full" />
                    </motion.div>
                  </div>
                </Card>

                {/* Interactive Section Grid */}
                <div className="grid gap-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Lightbulb className="h-6 w-6 text-accent" />
                    Learning Sections
                  </h3>
                  
                  <div className="grid gap-4">
                    {topic.table_of_contents.map((section, index) => {
                      const isCompleted = completedSections.includes(index);
                      const isNext = !isCompleted && index === completedSections.length;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="relative"
                        >
                          <Card className={`
                            p-6 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden
                            ${isCompleted 
                              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30' 
                              : isNext 
                                ? 'bg-glass border-accent/50 shadow-glow' 
                                : 'bg-glass border-white/10 hover:border-white/20'
                            }
                          `}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <motion.div 
                                  className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                                    ${isCompleted 
                                      ? 'bg-green-500 text-white' 
                                      : isNext 
                                        ? 'bg-gradient-to-br from-accent to-accent-glow text-white' 
                                        : 'bg-white/10 text-white/60'
                                    }
                                  `}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-6 w-6" />
                                  ) : (
                                    index + 1
                                  )}
                                </motion.div>
                                
                                <div>
                                  <h4 className="text-lg font-semibold text-white mb-1">
                                    {section.title}
                                  </h4>
                                  <p className="text-white/70 text-sm">
                                    {section.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                                    <span>📖 {section.estimated_reading_time} min read</span>
                                    {isCompleted && <span>✅ Completed</span>}
                                    {isNext && <span>🎯 Ready to start</span>}
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                onClick={() => handleStartSection(index)}
                                disabled={isLoading}
                                className={`
                                  rounded-xl px-6 py-2 font-medium
                                  ${isCompleted 
                                    ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
                                    : isNext 
                                      ? 'bg-accent hover:bg-accent-glow text-white shadow-lg' 
                                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                                  }
                                `}
                              >
                                {isCompleted ? 'Review' : isNext ? 'Start' : 'Preview'}
                              </Button>
                            </div>
                            
                            {/* Progress indicator for current section */}
                            {isNext && (
                              <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-glow"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                style={{ transformOrigin: "left" }}
                              />
                            )}
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'section' && (
              <motion.div
                key="section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <SectionViewer
                  section={topic.table_of_contents[currentSectionIndex]}
                  sectionIndex={currentSectionIndex}
                  totalSections={topic.table_of_contents.length}
                  isLoading={isLoading}
                  childAge={childAge}
                  onComplete={() => handleSectionComplete(currentSectionIndex)}
                  onNext={() => {
                    handleSectionComplete(currentSectionIndex);
                    if (currentSectionIndex < topic.table_of_contents.length - 1) {
                      handleStartSection(currentSectionIndex + 1);
                    } else {
                      setCurrentView('overview');
                    }
                  }}
                  onPrevious={() => {
                    if (currentSectionIndex > 0) {
                      handleStartSection(currentSectionIndex - 1);
                    }
                  }}
                  onBackToOverview={() => setCurrentView('overview')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="bg-gradient-to-br from-accent to-accent-glow p-8 rounded-3xl text-center shadow-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
              >
                <Trophy className="h-16 w-16 text-white mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {isYoungChild ? "🎉 Amazing Work!" : "Section Complete!"}
              </h3>
              <p className="text-white/80">
                {isYoungChild ? "You're doing awesome! Keep going! 🌟" : "Great progress on your learning journey!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Section Viewer Component
const SectionViewer: React.FC<{
  section: any;
  sectionIndex: number;
  totalSections: number;
  isLoading: boolean;
  childAge: number;
  onComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onBackToOverview: () => void;
}> = ({ section, sectionIndex, totalSections, isLoading, childAge, onComplete, onNext, onPrevious, onBackToOverview }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-accent/30 border-t-accent"
        />
      </div>
    );
  }

  return (
    <Card className="bg-glass border-white/10 rounded-3xl overflow-hidden">
      <div className="p-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-white font-bold text-sm">
                {sectionIndex + 1}
              </div>
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            </div>
            <p className="text-white/70">{section.description}</p>
          </div>
          
          <Button
            variant="ghost"
            onClick={onBackToOverview}
            className="text-white/60 hover:text-white"
          >
            Overview
          </Button>
        </div>

        {/* Content */}
        {section.content && (
          <div className="prose prose-invert max-w-none mb-8">
            <div className="text-white/90 leading-relaxed text-lg space-y-4">
              {section.content.split('\n').map((paragraph: string, index: number) => (
                paragraph.trim() && (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {paragraph}
                  </motion.p>
                )
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onPrevious}
            disabled={sectionIndex === 0}
            className="text-white/60 hover:text-white"
          >
            Previous
          </Button>
          
          <Button
            onClick={sectionIndex === totalSections - 1 ? onComplete : onNext}
            className="bg-accent hover:bg-accent-glow text-white px-8 py-2 rounded-xl font-medium"
          >
            {sectionIndex === totalSections - 1 ? 'Complete Topic' : 'Next Section'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ElevatedEncyclopediaView;