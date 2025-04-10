
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgeAdaptiveBlockProps {
  content: React.ReactNode;
  title?: string;
  type: string;
  ageGroup: '5-7' | '8-11' | '12-16';
  specialist?: string;
  onInteract?: () => void;
  interactionLabel?: string;
  className?: string;
}

// Get appropriate styling based on age group
const getAgeAdaptiveStyling = (
  ageGroup: '5-7' | '8-11' | '12-16',
  type: string
) => {
  // Base styles common across age groups
  const baseStyles = {
    container: 'mb-8 relative',
    content: 'text-white/90',
    title: 'font-bold mb-2',
    specialist: 'text-white/60 text-xs uppercase tracking-wide',
    interactive: 'mt-3 flex items-center gap-2',
  };
  
  // Young children - highly visual, large text, rounded edges, bright colors
  if (ageGroup === '5-7') {
    return {
      container: `${baseStyles.container} p-5 rounded-3xl border-2 ${getTypeBorderColor(type)}`,
      content: `${baseStyles.content} text-lg leading-relaxed`,
      title: `${baseStyles.title} text-2xl ${getTypeTitleColor(type)}`,
      specialist: `${baseStyles.specialist} flex items-center`,
      interactive: `${baseStyles.interactive} justify-center`,
      button: 'rounded-full py-3 px-6 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none shadow-lg',
      specialistIcon: 'w-6 h-6 mr-2 text-yellow-400',
      innerContent: 'rounded-xl bg-white/10 p-4',
      decoration: true,
    };
  }
  
  // Middle age - balanced approach, medium text, subtle rounded edges, moderate colors
  if (ageGroup === '8-11') {
    return {
      container: `${baseStyles.container} p-4 rounded-xl ${getTypeBackgroundColor(type)}`,
      content: `${baseStyles.content} text-base leading-relaxed`,
      title: `${baseStyles.title} text-xl ${getTypeTitleColor(type)}`,
      specialist: `${baseStyles.specialist}`,
      interactive: `${baseStyles.interactive} justify-start`,
      button: 'rounded-lg py-2 px-4 text-base font-medium bg-white/10 hover:bg-white/20 text-white',
      specialistIcon: 'w-4 h-4 mr-1.5 text-white/70',
      innerContent: 'rounded-lg bg-transparent',
      decoration: true,
    };
  }
  
  // Older children - sophisticated, smaller text, minimal styling, subtle colors
  return {
    container: `${baseStyles.container} p-3 ${getTypeLineStyle(type)}`,
    content: `${baseStyles.content} text-sm leading-relaxed`,
    title: `${baseStyles.title} text-lg ${getTypeTitleColor(type)}`,
    specialist: `${baseStyles.specialist} opacity-70`,
    interactive: `${baseStyles.interactive} justify-end`,
    button: 'text-sm font-medium text-white/70 hover:text-white bg-transparent hover:bg-transparent p-0 underline-offset-2 hover:underline',
    specialistIcon: 'w-3 h-3 mr-1 text-white/50',
    innerContent: 'rounded-none bg-transparent',
    decoration: false,
  };
};

// Helper functions for styling
const getTypeBorderColor = (type: string) => {
  switch (type) {
    case 'fact': return 'border-blue-500/50';
    case 'quiz': return 'border-green-500/50';
    case 'funFact': return 'border-purple-500/50';
    case 'creative': return 'border-orange-500/50';
    case 'activity': return 'border-yellow-500/50';
    case 'mindfulness': return 'border-teal-500/50';
    default: return 'border-white/10';
  }
};

const getTypeBackgroundColor = (type: string) => {
  switch (type) {
    case 'fact': return 'bg-blue-500/10';
    case 'quiz': return 'bg-green-500/10';
    case 'funFact': return 'bg-purple-500/10';
    case 'creative': return 'bg-orange-500/10';
    case 'activity': return 'bg-yellow-500/10';
    case 'mindfulness': return 'bg-teal-500/10';
    default: return 'bg-white/5';
  }
};

const getTypeLineStyle = (type: string) => {
  switch (type) {
    case 'fact': return 'border-l-2 border-blue-500/30 pl-4';
    case 'quiz': return 'border-l-2 border-green-500/30 pl-4';
    case 'funFact': return 'border-l-2 border-purple-500/30 pl-4';
    case 'creative': return 'border-l-2 border-orange-500/30 pl-4';
    case 'activity': return 'border-l-2 border-yellow-500/30 pl-4';
    case 'mindfulness': return 'border-l-2 border-teal-500/30 pl-4';
    default: return 'border-l-2 border-white/10 pl-4';
  }
};

const getTypeTitleColor = (type: string) => {
  switch (type) {
    case 'fact': return 'text-blue-300';
    case 'quiz': return 'text-green-300';
    case 'funFact': return 'text-purple-300';
    case 'creative': return 'text-orange-300';
    case 'activity': return 'text-yellow-300';
    case 'mindfulness': return 'text-teal-300';
    default: return 'text-white';
  }
};

const getSpecialistName = (specialist?: string) => {
  switch (specialist) {
    case 'nova': return 'Nova the Space Expert';
    case 'spark': return 'Spark the Creative Genius';
    case 'prism': return 'Prism the Science Whiz';
    case 'pixel': return 'Pixel the Tech Guru';
    case 'atlas': return 'Atlas the History Buff';
    case 'lotus': return 'Lotus the Nature Guide';
    default: return 'Wonder Guide';
  }
};

const AgeAdaptiveBlock: React.FC<AgeAdaptiveBlockProps> = ({
  content,
  title,
  type,
  ageGroup,
  specialist,
  onInteract,
  interactionLabel = 'Continue',
  className = '',
}) => {
  const styles = getAgeAdaptiveStyling(ageGroup, type);
  
  const renderDecorations = () => {
    if (!styles.decoration) return null;
    
    if (ageGroup === '5-7') {
      return (
        <>
          <motion.div 
            className="absolute -top-4 -right-2 text-yellow-400"
            animate={{ rotate: [0, 15, 0, -15, 0], scale: [1, 1.2, 1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-3 -left-1 text-purple-400"
            animate={{ rotate: [0, -10, 0, 10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          >
            <Star className="w-6 h-6" />
          </motion.div>
        </>
      );
    }
    
    if (ageGroup === '8-11') {
      return (
        <motion.div 
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle, ${
              type === 'fact' ? 'rgba(59, 130, 246, 0.3)' :
              type === 'quiz' ? 'rgba(16, 185, 129, 0.3)' :
              type === 'funFact' ? 'rgba(139, 92, 246, 0.3)' :
              type === 'creative' ? 'rgba(249, 115, 22, 0.3)' :
              type === 'activity' ? 'rgba(234, 179, 8, 0.3)' :
              type === 'mindfulness' ? 'rgba(20, 184, 166, 0.3)' :
              'rgba(255, 255, 255, 0.1)'
            } 5%, transparent 70%)`,
          }}
        />
      );
    }
    
    return null;
  };
  
  return (
    <motion.div 
      className={`${styles.container} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {renderDecorations()}
      
      {specialist && (
        <div className={styles.specialist}>
          {ageGroup === '5-7' && <Star className={styles.specialistIcon} />}
          {getSpecialistName(specialist)}
        </div>
      )}
      
      {title && <h3 className={styles.title}>{title}</h3>}
      
      <div className={styles.innerContent}>
        <div className={styles.content}>{content}</div>
      </div>
      
      {onInteract && (
        <div className={styles.interactive}>
          <Button
            variant="ghost"
            onClick={onInteract}
            className={styles.button}
          >
            {ageGroup === '5-7' && <MessageCircle className="w-5 h-5 mr-1.5" />}
            {interactionLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default AgeAdaptiveBlock;
