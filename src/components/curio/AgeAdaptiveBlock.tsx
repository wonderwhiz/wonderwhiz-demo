
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Brain, Puzzle, Lightbulb, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AgeAdaptiveBlockProps {
  title: string;
  content: ReactNode;
  type: string;
  ageGroup: '5-7' | '8-11' | '12-16';
  specialist?: string;
  onInteract?: () => void;
  interactionLabel?: string;
  className?: string;
  children?: ReactNode;
}

// Different background gradients based on block type
const getBackgroundGradient = (type: string) => {
  switch (type) {
    case 'fact':
      return 'from-blue-600/20 to-indigo-600/20';
    case 'funFact':
      return 'from-purple-600/20 to-pink-600/20';
    case 'quiz':
      return 'from-green-600/20 to-emerald-600/20';
    case 'creative':
      return 'from-yellow-500/20 to-amber-500/20';
    case 'activity':
      return 'from-orange-500/20 to-red-500/20';
    case 'mindfulness':
      return 'from-teal-500/20 to-cyan-500/20';
    case 'flashcard':
      return 'from-sky-500/20 to-blue-500/20';
    case 'news':
      return 'from-gray-500/20 to-slate-500/20';
    default:
      return 'from-indigo-500/20 to-purple-500/20';
  }
};

// Get icon based on block type
const getBlockIcon = (type: string) => {
  switch (type) {
    case 'fact':
      return <Brain className="h-6 w-6" />;
    case 'funFact':
      return <Sparkles className="h-6 w-6" />;
    case 'quiz':
      return <Puzzle className="h-6 w-6" />;
    case 'creative':
      return <Lightbulb className="h-6 w-6" />;
    case 'activity':
      return <Rocket className="h-6 w-6" />;
    default:
      return <Star className="h-6 w-6" />;
  }
};

// Get style variations based on age group
const getAgeGroupStyles = (ageGroup: '5-7' | '8-11' | '12-16') => {
  switch (ageGroup) {
    case '5-7':
      return {
        borderWidth: 'border-4',
        titleSize: 'text-xl md:text-2xl',
        contentSize: 'text-lg',
        padding: 'p-5',
        cornerDecoration: true,
        animation: true
      };
    case '8-11':
      return {
        borderWidth: 'border-2',
        titleSize: 'text-lg md:text-xl',
        contentSize: 'text-base',
        padding: 'p-4',
        cornerDecoration: false,
        animation: true
      };
    case '12-16':
      return {
        borderWidth: 'border',
        titleSize: 'text-base md:text-lg',
        contentSize: 'text-sm',
        padding: 'p-4',
        cornerDecoration: false,
        animation: false
      };
  }
};

const AgeAdaptiveBlock: React.FC<AgeAdaptiveBlockProps> = ({
  title,
  content,
  type,
  ageGroup,
  specialist,
  onInteract,
  interactionLabel = 'Interact',
  className = '',
  children
}) => {
  const styles = getAgeGroupStyles(ageGroup);
  const backgroundGradient = getBackgroundGradient(type);
  const icon = getBlockIcon(type);
  
  return (
    <motion.div
      initial={styles.animation ? { opacity: 0, y: 20 } : false}
      animate={styles.animation ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-tr ${backgroundGradient} backdrop-blur-sm rounded-xl ${styles.borderWidth} border-white/10 ${styles.padding} relative ${className}`}
    >
      {/* Corner decoration for younger kids */}
      {styles.cornerDecoration && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full p-2 shadow-lg">
          {icon}
        </div>
      )}
      
      {/* Title with appropriate styling for age group */}
      <h3 className={`${styles.titleSize} font-bold mb-2 ${styles.cornerDecoration ? 'pr-8' : ''}`}>
        {title}
      </h3>
      
      {/* Specialist badge for older kids */}
      {ageGroup !== '5-7' && specialist && (
        <div className="absolute top-3 right-3">
          <div className="bg-white/10 rounded-full px-2 py-1 text-xs text-white/70">
            {specialist}
          </div>
        </div>
      )}
      
      {/* Content section */}
      <div className={`${styles.contentSize} mt-3`}>
        {content}
      </div>
      
      {/* Interaction button with age-appropriate styling */}
      {onInteract && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={onInteract}
            size={ageGroup === '5-7' ? 'lg' : ageGroup === '8-11' ? 'default' : 'sm'}
            className={
              ageGroup === '5-7'
                ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-full px-6 py-3'
                : ageGroup === '8-11'
                ? 'bg-white/10 hover:bg-white/20 text-white rounded-lg'
                : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded'
            }
          >
            {ageGroup === '5-7' && <Sparkles className="w-5 h-5 mr-2" />}
            {interactionLabel}
          </Button>
        </div>
      )}
      
      {/* Child components (like interaction elements) */}
      {children}
    </motion.div>
  );
};

export default AgeAdaptiveBlock;
