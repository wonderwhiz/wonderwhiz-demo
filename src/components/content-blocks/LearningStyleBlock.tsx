
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Ear, HandMetal, Brain, Users, MessageSquare } from 'lucide-react';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

interface LearningStyleBlockProps {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'social' | 'verbal';
  content: React.ReactNode;
  childAge?: number;
}

const LearningStyleBlock: React.FC<LearningStyleBlockProps> = ({
  learningStyle,
  content,
  childAge = 10
}) => {
  const { textSize } = useAgeAdaptation(childAge);
  
  // Get style-specific information
  const getLearningStyleInfo = () => {
    switch (learningStyle) {
      case 'visual':
        return {
          title: childAge <= 8 ? 'See It!' : 'Visual Learning',
          description: 'Learn through images, diagrams, and watching.',
          icon: <Eye className="h-5 w-5" />,
          color: 'bg-blue-600/20',
          textColor: 'text-blue-300',
          borderColor: 'border-blue-600/30'
        };
      case 'auditory':
        return {
          title: childAge <= 8 ? 'Hear It!' : 'Auditory Learning',
          description: 'Learn through listening, sounds, and music.',
          icon: <Ear className="h-5 w-5" />,
          color: 'bg-purple-600/20',
          textColor: 'text-purple-300',
          borderColor: 'border-purple-600/30'
        };
      case 'kinesthetic':
        return {
          title: childAge <= 8 ? 'Do It!' : 'Hands-on Learning',
          description: 'Learn through movement, touch, and doing.',
          icon: <HandMetal className="h-5 w-5" />,
          color: 'bg-emerald-600/20',
          textColor: 'text-emerald-300',
          borderColor: 'border-emerald-600/30'
        };
      case 'reading':
        return {
          title: childAge <= 8 ? 'Read It!' : 'Reading/Writing',
          description: 'Learn through reading and writing text.',
          icon: <Brain className="h-5 w-5" />,
          color: 'bg-amber-600/20',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-600/30'
        };
      case 'social':
        return {
          title: childAge <= 8 ? 'Share It!' : 'Social Learning',
          description: 'Learn through interaction with others.',
          icon: <Users className="h-5 w-5" />,
          color: 'bg-pink-600/20',
          textColor: 'text-pink-300',
          borderColor: 'border-pink-600/30'
        };
      case 'verbal':
        return {
          title: childAge <= 8 ? 'Talk About It!' : 'Verbal Learning',
          description: 'Learn through speech and discussion.',
          icon: <MessageSquare className="h-5 w-5" />,
          color: 'bg-cyan-600/20',
          textColor: 'text-cyan-300',
          borderColor: 'border-cyan-600/30'
        };
    }
  };

  const { title, description, icon, color, textColor, borderColor } = getLearningStyleInfo();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl overflow-hidden backdrop-blur-sm border ${borderColor} p-0.5`}
    >
      <div className="bg-black/30 rounded-[calc(0.75rem-2px)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <h3 className={`${textColor} font-medium ${childAge <= 8 ? 'text-lg' : 'text-base'}`}>
              {title}
            </h3>
            <p className="text-white/70 text-xs">
              {description}
            </p>
          </div>
        </div>
        
        <div className={`${textSize} text-white/90`}>
          {content}
        </div>
      </div>
    </motion.div>
  );
};

export default LearningStyleBlock;
