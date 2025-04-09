
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LayoutGrid, ArrowRight, Sparkles, Brain } from 'lucide-react';
import { getSpecialistEmoji, getTopicSuggestions } from './utils/specialistUtils';

interface RabbitHoleSuggestionsProps {
  curioTitle: string;
  profileId?: string;
  onSuggestionClick: (suggestion: string) => void;
  specialistIds?: string[];
}

const RabbitHoleSuggestions: React.FC<RabbitHoleSuggestionsProps> = ({
  curioTitle,
  profileId,
  onSuggestionClick,
  specialistIds = []
}) => {
  const [animateOnce, setAnimateOnce] = useState(false);
  
  // Extract main topic from curio title
  const extractMainTopic = (title: string): string => {
    if (!title) return "this topic";
    
    // Clean up the title
    const cleanTitle = title.replace(/^what makes |^how |^why |^when |^where |^who |^is |^are |^does |^do /i, '');
    
    // Return a sensible topic
    if (cleanTitle.toLowerCase().includes('afghanistan')) {
      return "Afghanistan";
    }
    
    if (cleanTitle.toLowerCase().includes('jupiter') || cleanTitle.toLowerCase().includes('space')) {
      return "space exploration";
    }
    
    // Default extraction (first few words)
    return cleanTitle.split(' ').slice(0, 3).join(' ');
  };
  
  // Get topic-specific suggestions
  const generateTopicSpecificSuggestions = (topic: string): string[] => {
    // Use the utility function to get suggestions
    return getTopicSuggestions(topic);
  };
  
  // Prepare data for display
  const mainTopic = useMemo(() => extractMainTopic(curioTitle), [curioTitle]);
  const topicSuggestions = useMemo(() => generateTopicSpecificSuggestions(mainTopic), [mainTopic]);
  
  // Experts based on the topic
  const getRelevantExperts = (): { id: string, emoji: string, question: string }[] => {
    // Get a subset of specialists based on topic
    const isAfghanistanRelated = mainTopic.toLowerCase().includes('afghanistan');
    const isSpaceRelated = mainTopic.toLowerCase().includes('space') || mainTopic.toLowerCase().includes('jupiter');
    
    let relevantIds = specialistIds.slice(0, 3);
    
    // Ensure we have specialists relevant to the topic
    if (isAfghanistanRelated) {
      relevantIds = ['atlas', 'prism', 'pixel'].filter(id => specialistIds.includes(id));
      if (relevantIds.length === 0) relevantIds = ['atlas', 'prism', 'pixel'].slice(0, 3);
    } else if (isSpaceRelated) {
      relevantIds = ['nova', 'prism', 'pixel'].filter(id => specialistIds.includes(id));
      if (relevantIds.length === 0) relevantIds = ['nova', 'prism', 'pixel'].slice(0, 3);
    }
    
    // Generate suggestions for each expert
    return relevantIds.map(id => {
      let question = "";
      
      if (isAfghanistanRelated) {
        switch(id) {
          case 'atlas':
            question = `How has the history of ${mainTopic} shaped its current challenges?`;
            break;
          case 'prism':
            question = `What scientific approaches could help address dangers in ${mainTopic}?`;
            break;
          case 'pixel':
            question = `How can technology make ${mainTopic} safer to explore?`;
            break;
          case 'nova':
            question = `How do satellite images help us understand ${mainTopic}?`;
            break;
          case 'spark':
            question = `How have artists portrayed the beauty and complexity of ${mainTopic}?`;
            break;
          case 'lotus':
            question = `How does the natural environment in ${mainTopic} affect daily life?`;
            break;
          default:
            question = `What else is fascinating about ${mainTopic}?`;
        }
      } else if (isSpaceRelated) {
        switch(id) {
          case 'nova':
            question = `What's the latest discovery about ${mainTopic}?`;
            break;
          case 'prism':
            question = `How do scientists study ${mainTopic} without going there?`;
            break;
          case 'pixel':
            question = `What technology helps us explore ${mainTopic}?`;
            break;
          case 'atlas':
            question = `How has our understanding of ${mainTopic} changed through history?`;
            break;
          case 'spark':
            question = `How has ${mainTopic} inspired art and creativity?`;
            break;
          case 'lotus':
            question = `What can ${mainTopic} teach us about our place in the universe?`;
            break;
          default:
            question = `What else is fascinating about ${mainTopic}?`;
        }
      } else {
        // Generic questions for any topic
        switch(id) {
          case 'nova':
            question = `What's the biggest mystery about ${mainTopic}?`;
            break;
          case 'prism':
            question = `How do scientists study ${mainTopic}?`;
            break;
          case 'pixel':
            question = `How has technology changed our understanding of ${mainTopic}?`;
            break;
          case 'atlas':
            question = `How has ${mainTopic} changed throughout history?`;
            break;
          case 'spark':
            question = `What creative projects are inspired by ${mainTopic}?`;
            break;
          case 'lotus':
            question = `How does ${mainTopic} connect to the natural world?`;
            break;
          default:
            question = `What else is fascinating about ${mainTopic}?`;
        }
      }
      
      return {
        id,
        emoji: getSpecialistEmoji(id),
        question
      };
    });
  };
  
  const experts = useMemo(() => getRelevantExperts(), [mainTopic, specialistIds]);
  
  const handleAnimationComplete = () => {
    if (!animateOnce) {
      setAnimateOnce(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      onAnimationComplete={handleAnimationComplete}
      className="mt-12 mb-16"
    >
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-wonderwhiz-gold/20 flex items-center justify-center mr-3">
              <Brain className="h-5 w-5 text-wonderwhiz-gold" />
            </div>
            <div>
              <h3 className="text-white text-lg font-medium">Continue Your Wonder Journey</h3>
              <p className="text-white/60 text-sm">
                {mainTopic.toLowerCase().includes('afghanistan') 
                  ? "Discover more about Afghanistan and its complex story"
                  : mainTopic.toLowerCase().includes('space') || mainTopic.toLowerCase().includes('jupiter')
                    ? "Discover more amazing facts about space exploration"
                    : `Explore more wonders about ${mainTopic}`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center">
            <LayoutGrid className="h-4 w-4 mr-2 text-wonderwhiz-gold/70" />
            All Topics
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {topicSuggestions.map((suggestion, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="bg-white/5 hover:bg-white/10 rounded-md p-3 cursor-pointer transition-colors"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <div className="flex items-start">
                  <div className="bg-wonderwhiz-deep-purple/60 text-wonderwhiz-vibrant-yellow rounded-md h-6 w-6 flex items-center justify-center flex-shrink-0 mr-3">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-grow">
                    <h5 className="text-white text-sm font-medium">{suggestion}</h5>
                    <p className="text-white/60 text-xs mt-1">
                      {index === 0 
                        ? "Uncover deeper mysteries and fascinating details through scientific inquiry" 
                        : index === 1 
                        ? "Discover the real-world significance and impact on our daily lives"
                        : index === 2
                        ? "Explore fascinating interdisciplinary connections across different fields of knowledge"
                        : "Examine how this concept manifests and influences our understanding"}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSuggestionClick(suggestion);
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-gold/70" />
              Specialist Insights
            </h4>
            
            <div className="space-y-3">
              {experts.map((expert, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-left w-full bg-white/5 hover:bg-white/10 rounded-md p-3 transition-colors"
                  onClick={() => onSuggestionClick(expert.question)}
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-lg">{expert.emoji}</div>
                    <span className="text-white text-sm">{expert.question}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RabbitHoleSuggestions;
