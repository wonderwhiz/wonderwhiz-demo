
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
      
      // Extract topic from content with improved extraction
      const topic = extractMainTopic(blockContent);
      
      // Identify the topic category
      const isAboutBollywood = topic.toLowerCase().includes('bollywood');
      const isAboutAfghanistan = topic.toLowerCase().includes('afghanistan');
      const isAboutSpace = topic.toLowerCase().includes('space') || topic.toLowerCase().includes('planet');
      const isAboutTechnology = topic.toLowerCase().includes('robot') || topic.toLowerCase().includes('tech');
      const isAboutAnimals = topic.toLowerCase().includes('animal') || topic.toLowerCase().includes('wildlife');
      
      // Create specialist-specific prompts
      switch (specialistId) {
        case 'nova':
          if (isAboutSpace) {
            basePrompts.push(
              `What makes ${topic} different from other celestial bodies?`,
              `How might humans explore ${topic} in the future?`
            );
          } else if (isAboutBollywood) {
            basePrompts.push(
              `How has technology changed ${topic} over the decades?`,
              `What if we made ${topic}-style movies in space?`
            );
          } else if (isAboutAfghanistan) {
            basePrompts.push(
              `How has satellite technology helped map ${topic}?`,
              `How might space technology help monitor safety in ${topic}?`
            );
          } else {
            basePrompts.push(
              `What if ${topic} existed in outer space?`,
              `How might ${topic} change in the future?`
            );
          }
          break;
          
        case 'prism':
          if (isAboutSpace) {
            basePrompts.push(
              `What scientific instruments help us study ${topic}?`,
              `What chemical elements make up ${topic}?`
            );
          } else if (isAboutBollywood) {
            basePrompts.push(
              `What scientific principles are behind ${topic} dance choreography?`,
              `How does the science of sound make ${topic} music unique?`
            );
          } else if (isAboutAfghanistan) {
            basePrompts.push(
              `What scientific approaches could make ${topic} safer?`,
              `How do scientists study the geography of ${topic}?`
            );
          } else {
            basePrompts.push(
              `What scientific discoveries led to ${topic}?`,
              `How could we experiment with ${topic} at home?`
            );
          }
          break;
          
        case 'atlas':
          if (isAboutBollywood) {
            basePrompts.push(
              `How has ${topic} influenced global culture?`,
              `What historical events shaped ${topic} as we know it today?`
            );
          } else if (isAboutAfghanistan) {
            basePrompts.push(
              `How has ${topic} been affected by historical conflicts?`,
              `What were ${topic}'s most peaceful periods in history?`
            );
          } else {
            basePrompts.push(
              `How did ${topic} change history?`,
              `What ancient civilizations might have known about ${topic}?`
            );
          }
          break;
          
        case 'spark':
          if (isAboutBollywood) {
            basePrompts.push(
              `What makes ${topic} costumes so colorful and unique?`,
              `How could you create your own ${topic}-inspired dance or story?`
            );
          } else if (isAboutAfghanistan) {
            basePrompts.push(
              `How could art help people understand ${topic} better?`,
              `What creative expressions have come from ${topic}?`
            );
          } else {
            basePrompts.push(
              `What art could we create inspired by ${topic}?`,
              `How could ${topic} inspire new inventions?`
            );
          }
          break;
          
        case 'pixel':
          if (isAboutBollywood) {
            basePrompts.push(
              `How has digital technology changed ${topic} filmmaking?`,
              `What apps could help people learn ${topic} dance moves?`
            );
          } else if (isAboutAfghanistan) {
            basePrompts.push(
              `What technologies help keep people safe in ${topic}?`,
              `How are digital maps helping to navigate ${topic}?`
            );
          } else if (isAboutTechnology) {
            basePrompts.push(
              `How might ${topic} evolve with AI advancements?`,
              `What coding projects could help us understand ${topic} better?`
            );
          } else {
            basePrompts.push(
              `How could technology improve ${topic}?`,
              `What digital tools help us understand ${topic}?`
            );
          }
          break;
          
        case 'lotus':
          if (isAboutBollywood) {
            basePrompts.push(
              `How does ${topic} connect people to their cultural roots?`,
              `What mindful observations can we make about ${topic} dances?`
            );
          } else if (isAboutAfghanistan) {
            basePrompts.push(
              `How does the natural landscape of ${topic} affect its people?`,
              `What mindfulness practices exist in ${topic}'s culture?`
            );
          } else if (isAboutAnimals) {
            basePrompts.push(
              `How do ${topic} connect to their environments?`,
              `What can we learn about mindfulness from observing ${topic}?`
            );
          } else {
            basePrompts.push(
              `How does ${topic} connect to nature?`,
              `What mindful observations can we make about ${topic}?`
            );
          }
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
  
  // Extract main topic from content (improved version with better null checking)
  const extractMainTopic = (content: any): string => {
    if (!content) return "this topic";
    
    // Handle different block types
    if (blockType === 'fact' || blockType === 'funFact') {
      if (content.fact && typeof content.fact === 'string') {
        const factText = content.fact;
        
        // Look for known topics
        if (factText.toLowerCase().includes('bollywood')) return "Bollywood";
        if (factText.toLowerCase().includes('afghanistan')) return "Afghanistan";
        if (factText.toLowerCase().includes('robot')) return "robots";
        if (factText.toLowerCase().includes('planet')) return "planets";
        if (factText.toLowerCase().includes('space')) return "space exploration";
        if (factText.toLowerCase().includes('animal')) return "animals";
        
        // Default extraction from first sentence
        const firstSentence = factText.split('.')[0];
        if (firstSentence && firstSentence.length > 5) {
          return firstSentence;
        }
      }
    }
    
    // Try to extract from content properties
    if (content.title) return content.title;
    if (content.topic) return content.topic;
    if (content.question && typeof content.question === 'string') {
      const question = content.question;
      
      if (question.toLowerCase().includes('bollywood')) return "Bollywood";
      if (question.toLowerCase().includes('afghanistan')) return "Afghanistan";
      
      // Extract main subject from question if possible
      const matches = question.match(/about\s+([^?\.]+)/i) || 
                     question.match(/what\s+(?:is|are|makes)\s+([^?\.]+)/i);
      
      if (matches && matches[1]) {
        return matches[1].trim();
      }
      
      const words = question.split(' ').filter((w: string) => w.length > 3);
      if (words.length > 0) return words.slice(0, 2).join(' ');
    }
    
    // Check the entire content object as string
    const contentString = JSON.stringify(content).toLowerCase();
    if (contentString.includes('bollywood')) return "Bollywood";
    if (contentString.includes('afghanistan')) return "Afghanistan";
    if (contentString.includes('robot')) return "robots"; 
    if (contentString.includes('planet')) return "planets";
    if (contentString.includes('space')) return "space exploration";
    if (contentString.includes('animal')) return "animals";
    
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
