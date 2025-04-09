
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
      
      // Is this related to Afghanistan?
      const isAfghanistanRelated = topic.toLowerCase().includes('afghanistan');
      
      // Create specialist-specific prompts
      switch (specialistId) {
        case 'nova':
          basePrompts.push(
            isAfghanistanRelated ? 
              `How has satellite technology helped map dangerous areas in ${topic}?` :
              `What if ${topic} existed in outer space?`,
            isAfghanistanRelated ?
              `How might space technology help make ${topic} safer in the future?` :
              `How might ${topic} change in the future?`
          );
          break;
        case 'prism':
          basePrompts.push(
            isAfghanistanRelated ?
              `What scientific approaches could make ${topic} safer?` :
              `What scientific discoveries led to ${topic}?`,
            isAfghanistanRelated ?
              `How do scientists study the dangers in ${topic}?` :
              `How could we experiment with ${topic} at home?`
          );
          break;
        case 'atlas':
          basePrompts.push(
            isAfghanistanRelated ?
              `How has ${topic} been affected by historical conflicts?` :
              `How did ${topic} change history?`,
            isAfghanistanRelated ?
              `What were Afghanistan's safest periods in history?` :
              `What ancient civilizations might have known about ${topic}?`
          );
          break;
        case 'spark':
          basePrompts.push(
            isAfghanistanRelated ?
              `How could art help people understand the dangers in ${topic}?` :
              `What art could we create inspired by ${topic}?`,
            isAfghanistanRelated ?
              `How could creative solutions make ${topic} safer to visit?` :
              `How could ${topic} inspire new inventions?`
          );
          break;
        case 'pixel':
          basePrompts.push(
            isAfghanistanRelated ?
              `What technologies help keep people safe in ${topic}?` :
              `How could technology improve ${topic}?`,
            isAfghanistanRelated ?
              `How are digital maps helping to identify dangerous areas in ${topic}?` :
              `What digital tools help us understand ${topic}?`
          );
          break;
        case 'lotus':
          basePrompts.push(
            isAfghanistanRelated ?
              `How does the natural landscape contribute to dangers in ${topic}?` :
              `How does ${topic} connect to nature?`,
            isAfghanistanRelated ?
              `How do local communities stay safe in dangerous regions of ${topic}?` :
              `What mindful observations can we make about ${topic}?`
          );
          break;
        default:
          basePrompts.push(
            isAfghanistanRelated ?
              `What makes ${topic} unique despite its dangers?` :
              `What else is interesting about ${topic}?`,
            isAfghanistanRelated ?
              `How might ${topic} become safer in the future?` :
              `What would you like to learn about ${topic}?`
          );
      }
      
      // Add narrative-specific prompts
      if (narrativePosition === 'beginning') {
        basePrompts.push(isAfghanistanRelated ? 
          `What historical events led to the current situation in ${topic}?` :
          `What's the origin story of ${topic}?`);
      } else if (narrativePosition === 'middle') {
        basePrompts.push(isAfghanistanRelated ?
          `How do the dangers in ${topic} compare to other regions you've learned about?` :
          `How does ${topic} connect to things you already know?`);
      } else {
        basePrompts.push(isAfghanistanRelated ?
          `What could we learn about peaceful solutions by studying ${topic}?` :
          `Where could learning about ${topic} take you next?`);
      }
      
      // Limit to 2-3 prompts
      setWonderPrompts(basePrompts.slice(0, Math.min(3, basePrompts.length)));
    };
    
    generateWonderPrompts();
  }, [specialistId, blockType, blockContent, narrativePosition]);
  
  // Extract main topic from content (improved version)
  const extractMainTopic = (content: any): string => {
    if (!content) return "this topic";
    
    // Handle different block types
    if (blockType === 'fact' || blockType === 'funFact') {
      // Add null check before calling split
      if (content.fact && typeof content.fact === 'string') {
        // Look for Afghanistan mentions
        if (content.fact.toLowerCase().includes('afghanistan')) {
          return "Afghanistan";
        }
        return content.fact.split(' ').slice(0, 2).join(' ') || "this topic";
      }
    }
    
    // Try to extract from content
    if (content.title) return content.title;
    if (content.topic) return content.topic;
    if (content.question && typeof content.question === 'string') {
      if (content.question.toLowerCase().includes('afghanistan')) {
        return "Afghanistan";
      }
      const words = content.question.split(' ').filter((w: string) => w.length > 3);
      if (words.length > 0) return words[0];
    }
    
    // If the block is about Afghanistan specifically
    if (JSON.stringify(content).toLowerCase().includes('afghanistan')) {
      return "Afghanistan";
    }
    
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
