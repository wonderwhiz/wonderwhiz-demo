
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createWonderQuestions } from './utils/specialistUtils';

interface WonderPromptProps {
  specialistId: string;
  blockType: string;
  blockContent: any;
  onRabbitHoleClick: (question: string) => void;
  narrativePosition: 'beginning' | 'middle' | 'end';
}

const WonderPrompt: React.FC<WonderPromptProps> = ({
  specialistId,
  blockType,
  blockContent,
  onRabbitHoleClick,
  narrativePosition
}) => {
  const [wonderPrompts, setWonderPrompts] = useState<string[]>([]);
  
  useEffect(() => {
    // Generate better wonder prompts using the new utility function
    const generatedPrompts = createWonderQuestions(blockContent, blockType, specialistId);
    
    // Add narrative position context for a better storytelling arc
    let positionBasedPrompts: string[] = [];
    
    if (narrativePosition === 'beginning') {
      positionBasedPrompts = [
        "What might be the first thing you'd want to know about this topic?",
        "What makes you most curious about this right now?",
        "How does this connect to things you already know?"
      ];
    } else if (narrativePosition === 'middle') {
      positionBasedPrompts = [
        "How does this information change what you thought before?",
        "What's the most surprising thing you've learned so far?",
        "What question would help deepen your understanding?"
      ];
    } else { // end
      positionBasedPrompts = [
        "What new directions could this knowledge take you?",
        "How might you apply what you've learned in your own life?",
        "What's still a mystery about this topic that you'd like to explore?"
      ];
    }
    
    // Combine all prompts, prioritize generated prompts, and limit to 3
    const allPrompts = [...generatedPrompts, ...positionBasedPrompts];
    // Remove duplicates or very similar questions
    const uniquePrompts = allPrompts.filter((prompt, index, self) => 
      index === self.findIndex(p => 
        p.toLowerCase().includes(prompt.toLowerCase().substring(0, 15)) || 
        prompt.toLowerCase().includes(p.toLowerCase().substring(0, 15))
      )
    );
    
    setWonderPrompts(uniquePrompts.slice(0, 3));
  }, [specialistId, blockType, blockContent, narrativePosition]);

  // More engaging animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-4 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="mt-1 w-6 h-6 rounded-full bg-wonderwhiz-gold/30 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-gold" />
        </div>
        <h4 className="text-white font-medium text-sm">I wonder...</h4>
      </div>
      
      <div className="space-y-2 pl-9">
        {wonderPrompts.map((prompt, idx) => (
          <motion.button
            key={idx}
            className="text-left text-white/90 text-sm hover:text-white group flex items-start"
            whileHover={{ x: 5 }}
            onClick={() => onRabbitHoleClick(prompt)}
            variants={itemVariants}
          >
            <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-wonderwhiz-gold/70 group-hover:text-wonderwhiz-gold" />
            <span>{prompt}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="pl-9 mt-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-white/70 hover:text-white p-0 h-auto group"
          onClick={() => onRabbitHoleClick(wonderPrompts[0] || "Tell me more about this topic")}
        >
          <span>Explore more wonders</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

export default WonderPrompt;
