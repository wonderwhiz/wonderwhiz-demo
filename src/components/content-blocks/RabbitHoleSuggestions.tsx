
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkle, ArrowRight, Sparkles, Brain, Zap, Compass, Lightbulb, BookOpen, Telescope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RabbitHoleSuggestionsProps {
  curioTitle: string;
  profileId?: string;
  onSuggestionClick: (question: string) => void;
  specialistIds?: string[];
}

// Sample icons for different suggestion types
const suggestionIcons = [
  <Sparkles className="h-5 w-5 text-pink-400" />,
  <Brain className="h-5 w-5 text-indigo-400" />,
  <Zap className="h-5 w-5 text-yellow-400" />,
  <Compass className="h-5 w-5 text-cyan-400" />,
  <Lightbulb className="h-5 w-5 text-amber-400" />,
  <BookOpen className="h-5 w-5 text-blue-400" />,
  <Telescope className="h-5 w-5 text-violet-400" />
];

const RabbitHoleSuggestions: React.FC<RabbitHoleSuggestionsProps> = ({
  curioTitle,
  profileId,
  onSuggestionClick,
  specialistIds = []
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<{ question: string; description: string }[]>([]);
  const [specialistSuggestions, setSpecialistSuggestions] = useState<{ question: string; description: string; specialist: string }[]>([]);

  useEffect(() => {
    // Only generate if we have a title and profile ID
    if (!curioTitle || !profileId) return;
    
    const generateSuggestions = async () => {
      setIsLoading(true);
      
      try {
        // Call Groq API via Supabase function to generate suggestions
        const { data, error } = await supabase.functions.invoke('generate-curio-suggestions', {
          body: { 
            topic: curioTitle,
            specialistIds
          }
        });
        
        if (error) throw error;
        
        if (data && data.suggestions) {
          // Format the suggestions
          setSuggestions(data.suggestions.map((s: any) => ({
            question: s.question,
            description: s.description
          })));
          
          // Format specialist insights if available
          if (data.specialistInsights) {
            setSpecialistSuggestions(data.specialistInsights.map((s: any) => ({
              question: s.question,
              description: s.description,
              specialist: s.specialist
            })));
          }
        } else {
          // If no suggestions or API call failed, use fallback suggestions
          generateFallbackSuggestions();
        }
      } catch (err) {
        console.error('Error generating suggestions:', err);
        generateFallbackSuggestions();
      } finally {
        setIsLoading(false);
      }
    };
    
    generateSuggestions();
  }, [curioTitle, profileId, specialistIds]);
  
  const generateFallbackSuggestions = () => {
    // Create related questions based on the topic using templates
    const topic = curioTitle.toLowerCase();
    const baseSuggestions = [
      {
        question: `What's the most surprising fact about ${topic}?`,
        description: "Uncover deeper mysteries and fascinating details through scientific inquiry"
      },
      {
        question: `Why is ${topic} important to understand?`,
        description: "Discover the real-world significance and impact on our daily lives"
      },
      {
        question: `How ${topic} connects to creativity`,
        description: "Explore fascinating interdisciplinary connections across different fields of knowledge"
      },
      {
        question: `${topic} in the natural world`,
        description: "Examine how this concept manifests and influences our understanding"
      }
    ];
    
    setSuggestions(baseSuggestions);
    
    // Generate fallback specialist insights based on available specialists
    const specialistMap: {[key: string]: {title: string, icon: string}} = {
      'nova': { title: 'Space Expert', icon: '🌌' },
      'spark': { title: 'Creativity Guide', icon: '✨' },
      'prism': { title: 'Science Specialist', icon: '🔬' },
      'pixel': { title: 'Tech Guru', icon: '💻' },
      'atlas': { title: 'History Explorer', icon: '🗺️' },
      'lotus': { title: 'Nature Observer', icon: '🌿' }
    };
    
    const fallbackSpecialistSuggestions = specialistIds.map(id => {
      const specialist = specialistMap[id] || { title: 'Expert', icon: '🧠' };
      
      return {
        question: `What creative projects are inspired by ${topic}?`,
        description: `Explore how ${topic} influences creative thinking and innovative solutions`,
        specialist: id
      };
    });
    
    setSpecialistSuggestions(fallbackSpecialistSuggestions);
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/50 backdrop-blur-sm border border-white/10 my-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Sparkle className="h-5 w-5 mr-2 text-yellow-400" />
          Continue Your Wonder Journey
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-white/10 rounded-lg w-full"></div>
          <div className="h-12 bg-white/10 rounded-lg w-full"></div>
          <div className="h-12 bg-white/10 rounded-lg w-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-xl bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/50 backdrop-blur-sm border border-white/10 my-8"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Sparkle className="h-5 w-5 mr-2 text-yellow-400" />
        Continue Your Wonder Journey
      </h3>
      <p className="text-white/70 mb-6">
        Explore more wonders about {curioTitle}
      </p>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-white/60 flex items-center">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/10 mr-2">
            <Compass className="h-4 w-4 text-white/80" />
          </div>
          All Topics
        </h4>
        
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={`suggestion-${index}`}
            whileHover={{ x: 5 }}
            onClick={() => onSuggestionClick(suggestion.question)}
            className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group"
          >
            <div className="flex-1">
              <div className="flex items-center">
                {suggestionIcons[index % suggestionIcons.length]}
                <span className="ml-2 font-medium text-white">{suggestion.question}</span>
              </div>
              <p className="text-white/60 text-sm mt-1">{suggestion.description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white/80 transition-colors group-hover:translate-x-1 transition-transform" />
          </motion.button>
        ))}
        
        {specialistSuggestions.length > 0 && (
          <>
            <h4 className="text-sm font-medium text-white/60 flex items-center mt-6">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/10 mr-2">
                <Sparkles className="h-4 w-4 text-white/80" />
              </div>
              Specialist Insights
            </h4>
            
            {specialistSuggestions.map((suggestion, index) => {
              const specialistIcon = (() => {
                switch(suggestion.specialist) {
                  case 'nova': return <div className="w-8 h-8 rounded-full bg-indigo-600/40 flex items-center justify-center"><Telescope className="h-4 w-4 text-white" /></div>;
                  case 'spark': return <div className="w-8 h-8 rounded-full bg-pink-600/40 flex items-center justify-center"><Lightbulb className="h-4 w-4 text-white" /></div>;
                  case 'prism': return <div className="w-8 h-8 rounded-full bg-cyan-600/40 flex items-center justify-center"><Zap className="h-4 w-4 text-white" /></div>;
                  case 'pixel': return <div className="w-8 h-8 rounded-full bg-blue-600/40 flex items-center justify-center"><Brain className="h-4 w-4 text-white" /></div>;
                  case 'atlas': return <div className="w-8 h-8 rounded-full bg-green-600/40 flex items-center justify-center"><BookOpen className="h-4 w-4 text-white" /></div>;
                  case 'lotus': return <div className="w-8 h-8 rounded-full bg-amber-600/40 flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></div>;
                  default: return <div className="w-8 h-8 rounded-full bg-purple-600/40 flex items-center justify-center"><Sparkles className="h-4 w-4 text-white" /></div>;
                }
              })();
              
              return (
                <motion.button
                  key={`specialist-${index}`}
                  whileHover={{ x: 5 }}
                  onClick={() => onSuggestionClick(suggestion.question)}
                  className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-start">
                    {specialistIcon}
                    <div className="ml-3 flex-1">
                      <span className="font-medium text-white">{suggestion.question}</span>
                      <p className="text-white/60 text-sm mt-1">{suggestion.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-white/80 transition-colors group-hover:translate-x-1 transition-transform ml-2 flex-shrink-0" />
                </motion.button>
              );
            })}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default RabbitHoleSuggestions;
