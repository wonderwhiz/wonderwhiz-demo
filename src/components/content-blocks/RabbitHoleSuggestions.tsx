
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lightbulb, Sparkles, Map, Compass, BookOpen, Brain, Rocket, Leaf, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface Suggestion {
  title: string;
  description: string;
  icon: 'lightbulb' | 'sparkles' | 'map' | 'compass' | 'book' | 'brain' | 'rocket' | 'leaf' | 'history';
  difficulty?: 'easy' | 'medium' | 'advanced';
  category?: 'science' | 'creativity' | 'history' | 'nature' | 'technology' | 'space';
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
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
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
      
      // Create contextually relevant suggestions based on detected topic
      const mainTopic = topics[0] || 'this topic';
      
      // If the topic is about dinosaurs, create dinosaur-specific suggestions
      if (mainTopic.includes('dinosaur')) {
        const newSuggestions: Suggestion[] = [
          {
            title: `How did dinosaurs become extinct?`,
            description: `Explore the theories about the dinosaur extinction event`,
            icon: 'rocket',
            difficulty: 'medium',
            category: 'science'
          },
          {
            title: `Dinosaur fossils and how paleontologists study them`,
            description: `Discover how scientists learn about dinosaurs from ancient remains`,
            icon: 'map',
            difficulty: 'easy',
            category: 'science'
          },
          {
            title: `The evolution of birds from dinosaurs`,
            description: `Learn about the fascinating connection between modern birds and dinosaurs`,
            icon: 'leaf',
            difficulty: 'medium',
            category: 'nature'
          },
          {
            title: `Dinosaurs in popular culture and movies`,
            description: `How have dinosaurs been portrayed in films and entertainment?`,
            icon: 'sparkles',
            difficulty: 'easy',
            category: 'creativity'
          },
          {
            title: `The biggest and smallest dinosaurs that ever lived`,
            description: `Compare the incredible size range of different dinosaur species`,
            icon: 'book',
            difficulty: 'easy',
            category: 'science'
          },
          {
            title: `New dinosaur discoveries in the 21st century`,
            description: `Recent finds that have changed our understanding of dinosaurs`,
            icon: 'brain',
            difficulty: 'advanced',
            category: 'science'
          },
          {
            title: `What did dinosaurs eat?`,
            description: `Exploring herbivore, carnivore, and omnivore dinosaurs`,
            icon: 'leaf',
            difficulty: 'easy',
            category: 'nature'
          },
          {
            title: `How did dinosaurs care for their young?`,
            description: `Discover parenting behaviors of different dinosaur species`,
            icon: 'history',
            difficulty: 'medium',
            category: 'history'
          }
        ];
        
        setSuggestions(newSuggestions);
      } 
      // Add more topic-specific suggestions for other common topics
      else {
        // Generic suggestions for any topic
        const newSuggestions: Suggestion[] = [
          {
            title: `The secrets of ${mainTopic}`,
            description: `Uncover deeper mysteries and fascinating details`,
            icon: 'lightbulb',
            difficulty: 'easy',
            category: 'science'
          },
          {
            title: `Why is ${mainTopic} important to understand?`,
            description: `Discover the real-world significance and impact`,
            icon: 'compass',
            difficulty: 'medium',
            category: 'history'
          },
          {
            title: `How ${mainTopic} connects to ${subjectAreas[0] || 'other subjects'}`,
            description: `Explore fascinating connections across different fields`,
            icon: 'map',
            difficulty: 'advanced',
            category: 'science'
          },
          {
            title: `Fun experiments with ${mainTopic}`,
            description: `Hands-on activities to deepen your understanding`,
            icon: 'sparkles',
            difficulty: 'medium',
            category: 'creativity'
          },
          {
            title: `Future of ${mainTopic} and new discoveries`,
            description: `What exciting developments might happen next?`,
            icon: 'rocket',
            difficulty: 'advanced',
            category: 'technology'
          },
          {
            title: `${mainTopic} in the natural world`,
            description: `How does this relate to plants, animals, and ecosystems?`,
            icon: 'leaf',
            difficulty: 'medium',
            category: 'nature'
          },
          {
            title: `The history of ${mainTopic} through time`,
            description: `How has our understanding evolved over centuries?`,
            icon: 'history',
            difficulty: 'medium',
            category: 'history'
          },
          {
            title: `${mainTopic} and technology advancements`,
            description: `How has technology changed our understanding?`,
            icon: 'brain',
            difficulty: 'advanced',
            category: 'technology'
          }
        ];
        
        setSuggestions(newSuggestions);
      }
      
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
      case 'brain': return <Brain className="w-5 h-5" />;
      case 'rocket': return <Rocket className="w-5 h-5" />;
      case 'leaf': return <Leaf className="w-5 h-5" />;
      case 'history': return <History className="w-5 h-5" />;
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
  
  const getCategoryColor = (category?: string) => {
    switch(category) {
      case 'science': return 'bg-blue-500/30 text-blue-200';
      case 'creativity': return 'bg-pink-500/30 text-pink-200';
      case 'history': return 'bg-amber-500/30 text-amber-200';
      case 'nature': return 'bg-emerald-500/30 text-emerald-200';
      case 'technology': return 'bg-purple-500/30 text-purple-200';
      case 'space': return 'bg-indigo-500/30 text-indigo-200';
      default: return 'bg-gray-500/30 text-gray-200';
    }
  };
  
  const filteredSuggestions = activeCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === activeCategory);
  
  if (suggestions.length === 0 && !loading) return null;
  
  return (
    <div className="mt-10 mb-4">
      <div className="mb-6 text-center">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl font-bold text-white font-nunito bg-clip-text text-transparent bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink"
        >
          Rabbit Holes to Explore
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/70 text-sm mt-2"
        >
          Follow your curiosity and discover more fascinating wonders
        </motion.p>
        
        {/* Category filter buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mt-4"
        >
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'}`}
          >
            All Topics
          </button>
          {Array.from(new Set(suggestions.map(s => s.category))).map(category => (
            <button 
              key={category}
              onClick={() => setActiveCategory(category || 'all')}
              className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${activeCategory === category ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'}`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence initial={false} mode="popLayout">
          {filteredSuggestions.map((suggestion, index) => (
            <motion.div
              key={`suggestion-${suggestion.title}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              layout
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
                  
                  <div className="flex items-center mt-3 text-xs">
                    <span className="flex items-center text-white/40">
                      <ArrowRight className="w-3 h-3 mr-1" />
                      <span>Explore this wonder</span>
                    </span>
                    
                    {suggestion.category && (
                      <span className={`ml-auto py-0.5 px-2 rounded-full text-[10px] uppercase font-medium ${getCategoryColor(suggestion.category)}`}>
                        {suggestion.category}
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
