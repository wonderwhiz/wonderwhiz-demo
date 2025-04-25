
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Zap, Link, PencilRuler, BookOpen } from 'lucide-react';
import { LearningStage } from '@/hooks/use-progressive-learning';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getSpecialistInfo } from '@/utils/specialists';

interface ProgressiveLearningBlockProps {
  stage: LearningStage;
  childAge?: number;
  onQuestionClick?: (question: string) => void;
  questions: string[];
}

const ProgressiveLearningBlock: React.FC<ProgressiveLearningBlockProps> = ({
  stage,
  childAge = 10,
  onQuestionClick,
  questions = []
}) => {
  // Get stage-specific content
  const getStageInfo = () => {
    switch (stage) {
      case 'foundational':
        return {
          title: childAge <= 8 ? 'Building Blocks' : 'Foundation',
          description: 'These are the key facts that help you understand the basics.',
          icon: <BookOpen className="h-5 w-5" />,
          color: 'from-blue-600/20 to-blue-500/5',
          borderColor: 'border-blue-500/30',
          specialist: 'nova'
        };
      case 'expansion':
        return {
          title: childAge <= 8 ? 'Discover More' : 'Expansion',
          description: 'Let\'s dig deeper and learn more interesting details.',
          icon: <Lightbulb className="h-5 w-5" />,
          color: 'from-amber-600/20 to-amber-500/5',
          borderColor: 'border-amber-500/30',
          specialist: 'atlas'
        };
      case 'connection':
        return {
          title: childAge <= 8 ? 'Making Connections' : 'Connections',
          description: 'See how this topic connects to other things you know.',
          icon: <Link className="h-5 w-5" />,
          color: 'from-violet-600/20 to-violet-500/5',
          borderColor: 'border-violet-500/30',
          specialist: 'prism'
        };
      case 'application':
        return {
          title: childAge <= 8 ? 'Try It Out' : 'Application',
          description: 'Put what you\'ve learned into practice with these activities.',
          icon: <PencilRuler className="h-5 w-5" />,
          color: 'from-emerald-600/20 to-emerald-500/5',
          borderColor: 'border-emerald-500/30',
          specialist: 'lotus'
        };
      case 'deeper_dive':
        return {
          title: childAge <= 8 ? 'Expert Level' : 'Deeper Dive',
          description: 'Challenge yourself with advanced concepts and questions.',
          icon: <Zap className="h-5 w-5" />,
          color: 'from-fuchsia-600/20 to-fuchsia-500/5',
          borderColor: 'border-fuchsia-500/30',
          specialist: 'spark'
        };
    }
  };

  const { title, description, icon, color, borderColor, specialist } = getStageInfo();
  const specialistInfo = getSpecialistInfo(specialist);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl overflow-hidden backdrop-blur-sm bg-gradient-to-b ${color} border ${borderColor} p-5`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg bg-white/10`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-white font-medium ${childAge <= 8 ? 'text-lg' : 'text-base'}`}>
            {title}
          </h3>
          <p className="text-white/70 text-sm">
            {description}
          </p>
        </div>
      </div>

      <Separator className="my-3 bg-white/10" />

      <div className="space-y-3 mt-4">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onQuestionClick?.(question)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-left transition-all"
            >
              <span className={childAge <= 8 ? "text-base" : "text-sm"}>{question}</span>
              <ArrowRight className="h-4 w-4 text-white/60 ml-2 flex-shrink-0" />
            </motion.button>
          ))
        ) : (
          <div className="text-center p-4 text-white/60">
            No questions available for this stage yet.
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <img 
            src={specialistInfo.avatar} 
            alt={specialistInfo.name} 
            className="w-5 h-5 rounded-full"
          />
          <span>{specialistInfo.name}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressiveLearningBlock;
