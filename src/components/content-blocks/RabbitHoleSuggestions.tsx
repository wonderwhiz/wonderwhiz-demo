
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lightbulb, Sparkles, Map, Compass, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface Suggestion {
  title: string;
  description: string;
  icon: 'lightbulb' | 'sparkles' | 'map' | 'compass' | 'book';
  difficulty?: 'easy' | 'medium' | 'advanced';
}

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
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Generate suggestions based on curio title and specialists involved
  useEffect(() => {
    if (!curioTitle) return;
    
    setLoading(true);
    
    // Generate contextually relevant suggestions based on the curio title
    const generateSuggestions = () => {
      // Extract key topics from title
      const topics = curioTitle.toLowerCase().split(' ')
        .filter(word => word.length > 3)
        .filter(word => !['what', 'when', 'where', 'why', 'how', 'does', 'and', 'the', 'for', 'with'].includes(word));
      
      // Map specialists to subject areas
      const subjectAreas = specialistIds.map(id => {
        switch(id) {
          case 'nova': return 'space exploration';
          case 'spark': return 'creative thinking';
          case 'prism': return 'scientific inquiry';
          case 'pixel': return 'technology concepts';
          case 'atlas': return 'historical events';
          case 'lotus': return 'natural world';
          default: return 'interesting topics';
        }
      });
      
      // Create contextually relevant suggestions
      const newSuggestions: Suggestion[] = [
        {
          title: `The secrets of ${topics[0] || 'this topic'}`,
          description: `Uncover deeper mysteries and fascinating details`,
          icon: 'lightbulb',
          difficulty: 'easy'
        },
        {
          title: `Why is ${topics[0] || 'this'} important to understand?`,
          description: `Discover the real-world significance and impact`,
          icon: 'compass',
          difficulty: 'medium'
        },
        {
          title: `How ${topics[0] || 'this topic'} connects to ${subjectAreas[0] || 'other subjects'}`,
          description: `Explore fascinating connections across different fields`,
          icon: 'map',
          difficulty: 'advanced'
        },
        {
          title: `Fun experiments with ${topics[0] || 'this concept'}`,
          description: `Hands-on activities to deepen your understanding`,
          icon: 'sparkles',
          difficulty: 'medium'
        },
        {
          title: `Future of ${topics[0] || 'this field'} and new discoveries`,
          description: `What exciting developments might happen next?`,
          icon: 'book',
          difficulty: 'advanced'
        }
      ];
      
      setSuggestions(newSuggestions);
      setLoading(false);
    };
    
    generateSuggestions();
  }, [curioTitle, specialistIds]);
  
  const handleSuggestionClick = async (suggestion: Suggestion) => {
    if (profileId) {
      try {
        toast.loading("Creating new exploration path...", {
          id: "create-curio",
          duration: 3000
        });
        
        // Create a new curio based on the suggestion
        const { data: newCurio, error } = await supabase
          .from('curios')
          .insert({
            child_id: profileId,
            title: suggestion.title,
            query: suggestion.title,
          })
          .select('id')
          .single();
          
        if (error) {
          console.error('Error creating curio from suggestion:', error);
          toast.error("Could not create new exploration", {
            id: "create-curio"
          });
          // Fallback to just setting the query
          onSuggestionClick(suggestion.title);
          return;
        }
        
        if (newCurio && newCurio.id) {
          // Celebrate discovery with confetti
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
            disableForReducedMotion: true
          });
          
          toast.success("New exploration path created!", {
            id: "create-curio"
          });
          
          try {
            // Award sparks for curiosity
            await supabase.functions.invoke('increment-sparks-balance', {
              body: JSON.stringify({
                profileId: profileId,
                amount: 3
              })
            });
            
            await supabase.from('sparks_transactions').insert({
              child_id: profileId,
              amount: 3,
              reason: 'Exploring a rabbit hole'
            });
            
            toast.success('You earned 3 sparks for following your curiosity!', {
              icon: '✨',
              position: 'bottom-right',
              duration: 3000
            });
          } catch (err) {
            console.error('Error awarding sparks:', err);
          }
          
          // Navigate to the new curio
          navigate(`/curio/${profileId}/${newCurio.id}`);
        } else {
          console.error('No curio ID returned after creation');
          toast.error("Could not create new exploration", {
            id: "create-curio"
          });
          onSuggestionClick(suggestion.title);
        }
      } catch (error) {
        console.error('Error creating curio from suggestion:', error);
        toast.error("Could not create new exploration", {
          id: "create-curio"
        });
        // Fallback to just setting the query
        onSuggestionClick(suggestion.title);
      }
    } else {
      // Without profileId, just call the original handler
      onSuggestionClick(suggestion.title);
    }
  };
  
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'lightbulb': return <Lightbulb className="w-5 h-5" />;
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'map': return <Map className="w-5 h-5" />;
      case 'compass': return <Compass className="w-5 h-5" />;
      case 'book': return <BookOpen className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };
  
  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty) {
      case 'easy': return 'from-emerald-400 to-green-500';
      case 'medium': return 'from-blue-400 to-indigo-500';
      case 'advanced': return 'from-purple-400 to-pink-500';
      default: return 'from-indigo-400 to-blue-500';
    }
  };
  
  if (suggestions.length === 0 && !loading) return null;
  
  return (
    <div className="mt-8 mb-4">
      <div className="mb-4 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-white font-nunito">Rabbit Holes to Explore</h3>
        <p className="text-white/70 text-sm mt-1">
          Follow your curiosity and discover more fascinating wonders
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={`suggestion-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden cursor-pointer bg-gradient-to-br bg-opacity-10 
                          bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4
                          hover:border-white/20 transition-all duration-300 shadow-sm`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-gradient-to-br opacity-20 blur-xl"
                   style={{ background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)` }} />
                   
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${getDifficultyColor(suggestion.difficulty)} 
                                 flex items-center justify-center text-white shadow-sm`}>
                  {getIconComponent(suggestion.icon)}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1 pr-5 line-clamp-2">{suggestion.title}</h4>
                  <p className="text-white/60 text-xs line-clamp-2">{suggestion.description}</p>
                  
                  <div className="flex items-center mt-2 text-xs text-white/40">
                    <span className="flex items-center">
                      <ArrowRight className="w-3 h-3 mr-1" />
                      <span>Explore this wonder</span>
                    </span>
                    
                    {suggestion.difficulty && (
                      <span className="ml-auto capitalize">
                        {suggestion.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RabbitHoleSuggestions;
