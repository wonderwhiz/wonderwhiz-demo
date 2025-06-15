
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';
import { ArrowLeft, ArrowRight, List, Trophy, Sparkles, BookOpen } from 'lucide-react';
import ContentTypography from '../content-blocks/ContentTypography';
import FunFactBlock from '../content-blocks/FunFactBlock';

interface SimplifiedSectionViewerProps {
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

const SimplifiedSectionViewer: React.FC<SimplifiedSectionViewerProps> = ({
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-8"
    >
      <Card className="bg-white shadow-xl border-2 border-gray-200 p-8 rounded-3xl overflow-hidden">
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-purple-500" />
            {section.title}
          </h2>
          {section.image_url && (
            <img
              src={section.image_url}
              alt={section.title}
              className="w-full rounded-2xl shadow-md mb-4"
            />
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <ContentTypography content={section.content || ''} childAge={childAge} />
        </motion.div>

        {section.facts && section.facts.length > 0 && (
          <motion.div variants={itemVariants} className="mt-8">
            <FunFactBlock facts={section.facts} childAge={childAge} specialistId="whizzy" />
          </motion.div>
        )}
      </Card>

      <motion.div
        className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Button
          variant="ghost"
          onClick={onBackToTOC}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl"
        >
          <List className="h-5 w-5 mr-2" />
          {isYoungChild ? "See all parts" : "Table of Contents"}
        </Button>

        <div className="flex items-center gap-4">
          <Button
            onClick={onPreviousSection}
            disabled={isFirstSection}
            className="bg-white/80 hover:bg-white text-gray-800 font-bold px-6 py-3 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>

          {!isLastSection ? (
            <Button
              onClick={onNextSection}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all"
            >
              Next Section
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onFinishTopic}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all"
            >
              Finish Topic!
              <Trophy className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SimplifiedSectionViewer;
