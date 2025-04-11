
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const generateSuggestions = async () => {
    setLoading(true);
    try {
      // Fetch the child's profile for age-appropriate suggestions
      let childProfile;
      if (profileId) {
        const { data } = await supabase
          .from('child_profiles')
          .select('age, interests')
          .eq('id', profileId)
          .single();
        
        childProfile = data;
      }
      
      const defaultSuggestions = [
        `What are some fun facts about ${curioTitle}?`,
        `How does ${curioTitle} work?`,
        `Who discovered ${curioTitle}?`,
        `Why is ${curioTitle} important?`,
        `What are the different types of ${curioTitle}?`
      ];
      
      // Dynamically generate more relevant suggestions based on the topic
      if (specialistIds.includes('nova')) {
        defaultSuggestions.push(`How is ${curioTitle} related to space exploration?`);
      }
      
      if (specialistIds.includes('prism')) {
        defaultSuggestions.push(`What scientific experiments involve ${curioTitle}?`);
      }
      
      if (specialistIds.includes('atlas')) {
        defaultSuggestions.push(`What is the history of ${curioTitle}?`);
      }
      
      if (specialistIds.includes('lotus')) {
        defaultSuggestions.push(`How does ${curioTitle} impact the environment?`);
      }
      
      if (specialistIds.includes('pixel')) {
        defaultSuggestions.push(`What technology uses ${curioTitle}?`);
      }
      
      if (specialistIds.includes('spark')) {
        defaultSuggestions.push(`How can I create art inspired by ${curioTitle}?`);
      }
      
      setSuggestions(shuffleArray(defaultSuggestions).slice(0, 5));
      
    } catch (error) {
      console.error("Error generating rabbit hole suggestions:", error);
      setSuggestions([
        `What are some fun facts about ${curioTitle}?`,
        `How does ${curioTitle} work?`,
        `Who discovered ${curioTitle}?`
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  useEffect(() => {
    generateSuggestions();
  }, [curioTitle, profileId]);
  
  return (
    <Card className="p-5 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-wonderwhiz-vibrant-yellow" />
          More to explore
        </h3>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={generateSuggestions}
          disabled={loading}
          className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <p className="text-white/70 text-sm mb-4">
        Want to dive deeper? These questions will take you on new learning adventures:
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 text-left text-white/90 hover:text-white text-sm transition-all duration-200"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </Card>
  );
};

export default RabbitHoleSuggestions;
