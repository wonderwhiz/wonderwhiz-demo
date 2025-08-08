import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';
import { ArrowLeft, ArrowRight, List, Trophy, Volume2, Bookmark, Heart, Star, Sparkles, BookOpen, Image, Zap } from 'lucide-react';
import ContentTypography from '../content-blocks/ContentTypography';
import FunFactBlock from '../content-blocks/FunFactBlock';
import ReadAloudButton from './ReadAloudButton';
import WhatsNextGuidance from './WhatsNextGuidance';

interface EnhancedSectionViewerProps {
  topic: LearningTopic;
  sectionIndex: number;
  childAge: number;
  childProfile: any;
  onBackToTOC: () => void;
  onNextSection: () => void;
  onPreviousSection: () => void;
  onFinishTopic: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
}

const EnhancedSectionViewer: React.FC<EnhancedSectionViewerProps> = ({
  topic,
  sectionIndex,
  childAge,
  childProfile,
  onBackToTOC,
  onNextSection,
  onPreviousSection,
  onFinishTopic,
  isFirstSection,
  isLastSection,
}) => {
  const section = topic.table_of_contents[sectionIndex];
  const isYoungChild = childAge <= 8;
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback images for broken image URLs
  const fallbackImages = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1000&auto=format&fit=crop"
  ];

  const sectionImage = imageError ? 
    fallbackImages[sectionIndex % fallbackImages.length] : 
    section.image_url;

  useEffect(() => {
    // Reset image error state when section changes
    setImageError(false);
  }, [sectionIndex]);

  const handleLike = () => {
    setLiked(!liked);
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1000);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6 relative"
    >
      {/* Floating sparkles when liked */}
      <AnimatePresence>
        {showSparkles && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-wonderwhiz-vibrant-yellow rounded-full"
                initial={{ 
                  x: window.innerWidth / 2, 
                  y: window.innerHeight / 2,
                  scale: 0,
                  opacity: 1
                }}
                animate={{ 
                  x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
                  y: window.innerHeight / 2 + (Math.random() - 0.5) * 400,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Enhanced Content Card */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-white/20 p-6 sm:p-8 rounded-3xl overflow-hidden relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-bright-pink/5 via-transparent to-wonderwhiz-purple/5 animate-pulse" />
        
        <div className="relative z-10">
          <motion.div variants={itemVariants} className="mb-6">
            {/* Section Header with fun elements */}
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-bold text-gray-900 flex items-center gap-3 ${isYoungChild ? 'text-2xl' : 'text-3xl'}`}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple rounded-2xl flex items-center justify-center"
                >
                  <BookOpen className="h-5 w-5 text-white" />
                </motion.div>
                {isYoungChild ? `📚 ${section.title}` : section.title}
              </h2>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  type="button"
                  aria-pressed={liked}
                  aria-label={liked ? 'Unlike section' : 'Like section'}
                  className={`p-2 rounded-full transition-colors ${
                    liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setBookmarked(!bookmarked)}
                  type="button"
                  aria-pressed={bookmarked}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark section'}
                  className={`p-2 rounded-full transition-colors ${
                    bookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                </motion.button>
                <ReadAloudButton 
                  text={`${section.title}. ${section.content || ''}`}
                  childAge={childAge}
                  variant="ghost"
                />
              </div>
            </div>

            {/* Enhanced Image with loading state */}
            {sectionImage && (
              <motion.div
                variants={itemVariants}
                className="relative mb-6 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <img
                  src={sectionImage}
                  alt={section.title}
                  onError={handleImageError}
                  className="relative w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02]"
                  loading="lazy"
                />
                {imageError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Image className="h-12 w-12 mx-auto mb-2 opacity-60" />
                      <p className="text-sm font-medium">Learning image</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Content Display */}
          <motion.div variants={itemVariants} className="mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <ContentTypography content={section.content || ''} childAge={childAge} />
            </div>
          </motion.div>

          {/* Enhanced Fun Facts */}
          {section.facts && section.facts.length > 0 && (
            <motion.div variants={itemVariants} className="mt-6">
              <FunFactBlock facts={section.facts} childAge={childAge} specialistId="whizzy" />
            </motion.div>
          )}

          {/* Progress indicator */}
          <motion.div 
            variants={itemVariants}
            className="mt-6 flex items-center justify-center"
            aria-label={`Progress: Section ${sectionIndex + 1} of ${topic.table_of_contents.length}`}
          >
            <div className="flex items-center gap-2">
              {topic.table_of_contents.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === sectionIndex 
                      ? 'bg-wonderwhiz-bright-pink shadow-lg' 
                      : index < sectionIndex 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </Card>

      {/* Enhanced Navigation */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200"
      >
        <Button
          variant="ghost"
          onClick={onBackToTOC}
          aria-label="Back to table of contents"
          className={`text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl ${
            isYoungChild ? 'text-lg' : ''
          }`}
        >
          <List className="h-5 w-5 mr-2" />
          {isYoungChild ? "🏠 See all parts" : "Table of Contents"}
        </Button>

        <div className="flex items-center gap-3">
          <Button
            onClick={onPreviousSection}
            disabled={isFirstSection}
            variant="outline"
            aria-label="Previous section"
            className="font-bold px-6 py-3 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {isYoungChild ? "Back" : "Previous"}
          </Button>

          {!isLastSection ? (
            <Button
              onClick={onNextSection}
              aria-label="Next section"
              className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-purple/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all"
            >
              {isYoungChild ? "Next! ⭐" : "Next Section"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onFinishTopic}
              aria-label="Finish topic"
              className="bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink hover:from-wonderwhiz-vibrant-yellow/90 hover:to-wonderwhiz-bright-pink/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all"
            >
              {isYoungChild ? "Finish! 🏆" : "Finish Topic!"}
              <Trophy className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* What's Next Guidance */}
      <WhatsNextGuidance
        topic={topic}
        currentSectionIndex={sectionIndex}
        completedSections={[]} // This should come from parent
        childAge={childAge}
        onNextSection={onNextSection}
        onStartQuiz={() => {}} // This should come from parent
        onBackToTopics={onBackToTOC}
      />
    </motion.div>
  );
};

export default EnhancedSectionViewer;