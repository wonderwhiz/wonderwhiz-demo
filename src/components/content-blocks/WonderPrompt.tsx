
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    // Generate wonder prompts based on content and specialist
    const generateWonderPrompts = () => {
      const basePrompts: string[] = [];
      
      // Extract topic from content
      const topic = extractMainTopic(blockContent);
      
      // Create specialist-specific prompts
      switch (specialistId) {
        case 'nova':
          basePrompts.push(
            `What if ${topic} existed in outer space?`,
            `How might ${topic} change in the future?`
          );
          break;
        case 'prism':
          basePrompts.push(
            `What scientific discoveries led to ${topic}?`,
            `How could we experiment with ${topic} at home?`
          );
          break;
        case 'atlas':
          basePrompts.push(
            `How did ${topic} change history?`,
            `What ancient civilizations might have known about ${topic}?`
          );
          break;
        case 'spark':
          basePrompts.push(
            `What art could we create inspired by ${topic}?`,
            `How could ${topic} inspire new inventions?`
          );
          break;
        case 'pixel':
          basePrompts.push(
            `How could technology improve ${topic}?`,
            `What digital tools help us understand ${topic}?`
          );
          break;
        case 'lotus':
          basePrompts.push(
            `How does ${topic} connect to nature?`,
            `What mindful observations can we make about ${topic}?`
          );
          break;
        default:
          basePrompts.push(
            `What else is interesting about ${topic}?`,
            `What would you like to learn about ${topic}?`
          );
      }
      
      // Add narrative-specific prompts
      if (narrativePosition === 'beginning') {
        basePrompts.push(`What's the origin story of ${topic}?`);
      } else if (narrativePosition === 'middle') {
        basePrompts.push(`How does ${topic} connect to things you already know?`);
      } else {
        basePrompts.push(`Where could learning about ${topic} take you next?`);
      }
      
      // Limit to 2-3 prompts
      setWonderPrompts(basePrompts.slice(0, Math.min(3, basePrompts.length)));
    };
    
    generateWonderPrompts();
  }, [specialistId, blockType, blockContent, narrativePosition]);
  
  // Extract main topic from content (simplified version)
  const extractMainTopic = (content: any): string => {
    if (!content) return "this topic";
    
    if (blockType === 'fact' || blockType === 'funFact') {
      // Add null check before calling split
      if (content.fact && typeof content.fact === 'string') {
        return content.fact.split(' ').slice(0, 2).join(' ') || "this topic";
      }
    }
    
    if (content.title) return content.title;
    if (content.topic) return content.topic;
    
    return "this topic";
  };

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
          onClick={() => onRabbitHoleClick(wonderPrompts[0] || "What else is interesting about this topic?")}
        >
          <span>Explore more wonders</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

export default WonderPrompt;
