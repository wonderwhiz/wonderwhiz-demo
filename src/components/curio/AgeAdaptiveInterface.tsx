
import React, { ReactNode } from 'react';
import { Sparkles, Brain, Star, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AgeAdaptiveInterfaceProps {
  childAge: number;
  title: string;
  content: ReactNode;
  onPrimaryAction?: () => void;
  primaryActionText?: string;
  onSecondaryAction?: () => void;
  secondaryActionText?: string;
  type?: 'fact' | 'question' | 'creative' | 'quiz';
  className?: string;
  children?: ReactNode;
}

const AgeAdaptiveInterface: React.FC<AgeAdaptiveInterfaceProps> = ({
  childAge,
  title,
  content,
  onPrimaryAction,
  primaryActionText = "Learn More",
  onSecondaryAction,
  secondaryActionText = "Next",
  type = 'fact',
  className = "",
  children
}) => {
  // Get the appropriate styles and content for the child's age
  const getAgeAppropriateStyles = () => {
    if (childAge < 8) {
      // Young children (5-7): Bigger, brighter, more fun
      return {
        container: "border-3 border-white/20 rounded-xl p-5 bg-gradient-to-br from-wonderwhiz-purple/40 to-wonderwhiz-bright-pink/20",
        title: "text-xl font-bold mb-4",
        content: "text-lg leading-relaxed",
        buttons: "text-base rounded-full py-3 px-6",
        showEmojis: true,
        icon: <Sparkles className="h-7 w-7 text-wonderwhiz-gold animate-pulse" />
      };
    } else if (childAge < 12) {
      // Middle age (8-11): Still fun but more structured
      return {
        container: "border-2 border-white/15 rounded-lg p-4 bg-gradient-to-r from-wonderwhiz-deep-purple/40 to-wonderwhiz-purple/30",
        title: "text-lg font-semibold mb-3",
        content: "text-base leading-relaxed",
        buttons: "text-sm",
        showEmojis: false,
        icon: <Star className="h-6 w-6 text-wonderwhiz-bright-pink" />
      };
    } else {
      // Older children (12+): More sophisticated
      return {
        container: "border border-white/10 rounded-lg p-4 bg-wonderwhiz-deep-purple/30",
        title: "text-base font-medium mb-2",
        content: "text-sm leading-normal",
        buttons: "text-xs",
        showEmojis: false,
        icon: <Brain className="h-5 w-5 text-wonderwhiz-cyan" />
      };
    }
  };
  
  // Get icon based on content type
  const getTypeIcon = () => {
    switch(type) {
      case 'question':
        return <Lightbulb className="h-5 w-5 text-wonderwhiz-gold" />;
      case 'creative':
        return <Sparkles className="h-5 w-5 text-wonderwhiz-bright-pink" />;
      case 'quiz':
        return <Brain className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />;
      default:
        return <Star className="h-5 w-5 text-wonderwhiz-cyan" />;
    }
  };
  
  const styles = getAgeAppropriateStyles();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${styles.container} ${className}`}
    >
      <div className="flex items-center mb-3">
        <div className="mr-3 w-10 h-10 rounded-full bg-wonderwhiz-deep-purple/60 flex items-center justify-center">
          {childAge < 10 ? styles.icon : getTypeIcon()}
        </div>
        <h3 className={`text-white ${styles.title}`}>{title}</h3>
      </div>
      
      <div className={`text-white/90 ${styles.content}`}>
        {content}
      </div>
      
      {styles.showEmojis && (
        <div className="flex mt-4 mb-2 justify-center">
          {["✨", "🌟", "🚀", "🔍", "🧠"].map((emoji, idx) => (
            <span key={idx} className="mx-1 text-xl">{emoji}</span>
          ))}
        </div>
      )}
      
      {(onPrimaryAction || onSecondaryAction) && (
        <div className={`flex ${childAge < 10 ? 'flex-col space-y-2' : 'flex-row space-x-2'} mt-4`}>
          {onPrimaryAction && (
            <Button
              onClick={onPrimaryAction}
              size={childAge < 10 ? "lg" : "default"}
              className={childAge < 8 ? "bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 text-white w-full" : ""}
            >
              {childAge < 8 && <Sparkles className="mr-2 h-5 w-5" />}
              {primaryActionText}
            </Button>
          )}
          
          {onSecondaryAction && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              size={childAge < 10 ? "lg" : "default"}
              className={childAge < 10 ? "w-full" : ""}
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
      
      {children}
    </motion.div>
  );
};

export default AgeAdaptiveInterface;
