
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Trophy, Star, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';

interface WhatsNextGuidanceProps {
  topic: LearningTopic;
  currentSectionIndex: number;
  completedSections: number[];
  childAge?: number;
  onNextSection: () => void;
  onStartQuiz: () => void;
  onBackToTopics: () => void;
}

const WhatsNextGuidance: React.FC<WhatsNextGuidanceProps> = ({
  topic,
  currentSectionIndex,
  completedSections,
  childAge = 10,
  onNextSection,
  onStartQuiz,
  onBackToTopics
}) => {
  const isLastSection = currentSectionIndex === topic.table_of_contents.length - 1;
  const allSectionsCompleted = completedSections.length === topic.table_of_contents.length;
  const nextSectionTitle = !isLastSection ? topic.table_of_contents[currentSectionIndex + 1]?.title : null;
  const isYoung = childAge <= 8;

  const getGuidanceContent = () => {
    if (allSectionsCompleted) {
      return {
        icon: <Trophy className="h-8 w-8 text-wonderwhiz-vibrant-yellow" />,
        title: isYoung ? "🎉 You finished everything!" : "🏆 Topic Complete!",
        description: isYoung 
          ? "Wow! You learned so much! Want to try a fun quiz or explore something new?" 
          : "Congratulations! You've mastered this topic. Ready for a quiz or explore more topics?",
        actions: [
          {
            label: isYoung ? "🧩 Fun Quiz!" : "Take Quiz",
            onClick: onStartQuiz,
            primary: true,
            icon: <Target className="h-4 w-4" />
          },
          {
            label: isYoung ? "🌟 More Adventures!" : "Explore More",
            onClick: onBackToTopics,
            primary: false,
            icon: <BookOpen className="h-4 w-4" />
          }
        ]
      };
    }

    if (isLastSection) {
      return {
        icon: <Star className="h-8 w-8 text-wonderwhiz-bright-pink" />,
        title: isYoung ? "🌟 Almost done!" : "⭐ Final Section!",
        description: isYoung 
          ? "This is the last part! After this, you can take a fun quiz!" 
          : "You're on the final section! Complete it to unlock the quiz.",
        actions: [
          {
            label: isYoung ? "🎯 Finish Up!" : "Complete Topic",
            onClick: onNextSection,
            primary: true,
            icon: <ArrowRight className="h-4 w-4" />
          }
        ]
      };
    }

    return {
      icon: <BookOpen className="h-8 w-8 text-wonderwhiz-purple" />,
      title: isYoung ? "🚀 What's next?" : "📚 Continue Learning",
      description: isYoung 
        ? `Ready for the next adventure? Let's learn about "${nextSectionTitle}"!` 
        : `Continue with the next section: "${nextSectionTitle}"`,
      actions: [
        {
          label: isYoung ? "🎈 Next Adventure!" : "Next Section",
          onClick: onNextSection,
          primary: true,
          icon: <ArrowRight className="h-4 w-4" />
        }
      ]
    };
  };

  const guidance = getGuidanceContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-8"
    >
      <Card className={`
        ${isYoung ? 'bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-vibrant-yellow/20 border-2 border-wonderwhiz-bright-pink/30' : 'bg-white/10 border-white/20'}
        backdrop-blur-sm p-6 rounded-2xl
      `}>
        <div className="flex items-start gap-4">
          {/* Animated icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`
              ${isYoung ? 'bg-white/20' : 'bg-white/10'}
              p-3 rounded-2xl flex-shrink-0
            `}
          >
            {guidance.icon}
          </motion.div>

          <div className="flex-1">
            <h3 className={`
              font-bold text-white mb-2
              ${isYoung ? 'text-xl' : 'text-lg'}
            `}>
              {guidance.title}
            </h3>
            
            <p className={`
              text-white/80 mb-4
              ${isYoung ? 'text-base' : 'text-sm'}
            `}>
              {guidance.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {guidance.actions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={action.onClick}
                    className={`
                      ${action.primary 
                        ? 'bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-purple/90' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                      }
                      font-semibold rounded-xl px-6 py-3
                      ${isYoung ? 'text-base' : 'text-sm'}
                      transition-all duration-200
                    `}
                  >
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress indicator for younger kids */}
        {isYoung && !allSectionsCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 pt-4 border-t border-white/20"
          >
            <div className="flex items-center justify-between text-sm text-white/70 mb-2">
              <span>Your progress:</span>
              <span>{completedSections.length + 1}/{topic.table_of_contents.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((completedSections.length + 1) / topic.table_of_contents.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default WhatsNextGuidance;
