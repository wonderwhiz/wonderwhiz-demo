
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
    
    // Add narrative position context
    const positionBasedPrompt = narrativePosition === 'beginning' 
      ? "What else would you like to discover about this topic?" 
      : narrativePosition === 'end'
      ? "What new directions could this knowledge take you?"
      : "How does this connect to what you already know?";
    
    // Combine prompts and limit to 3
    setWonderPrompts([...generatedPrompts, positionBasedPrompt].slice(0, 3));
  }, [specialistId, blockType, blockContent, narrativePosition]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
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
          className="text-xs text-white/70 hover:text-white p-0 h-auto"
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
