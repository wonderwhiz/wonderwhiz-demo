
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { useGroqGeneration } from '@/hooks/useGroqGeneration';
import { Compass, Sparkles, Lightbulb, BookOpen, Rocket, Brain, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface IntelligentSuggestionsProps {
  childId: string;
  childProfile: any;
  onSuggestionClick: (suggestion: string) => void;
  pastCurios?: any[];
}

const categoryIcons = {
  science: <Brain className="h-4 w-4 text-emerald-400" />,
  space: <Rocket className="h-4 w-4 text-indigo-400" />,
  animals: <Star className="h-4 w-4 text-amber-400" />,
  history: <BookOpen className="h-4 w-4 text-orange-400" />,
  nature: <Lightbulb className="h-4 w-4 text-green-400" />,
  general: <Compass className="h-4 w-4 text-wonderwhiz-cyan" />
};

const cardVariants = [
  "from-indigo-500/20 to-purple-600/30 border-indigo-500/30 hover:border-indigo-400/50",
  "from-emerald-500/20 to-teal-600/30 border-emerald-500/30 hover:border-emerald-400/50",
  "from-pink-500/20 to-rose-600/30 border-pink-500/30 hover:border-pink-400/50",
  "from-amber-500/20 to-orange-600/30 border-amber-500/30 hover:border-amber-400/50",
  "from-blue-500/20 to-cyan-600/30 border-blue-500/30 hover:border-blue-400/50",
  "from-violet-500/20 to-purple-600/30 border-violet-500/30 hover:border-violet-400/50"
];

// High-quality starter questions
const FALLBACK_QUESTIONS = [
  "How do volcanoes work?",
  "What makes rainbows appear in the sky?",
  "Why do seasons change throughout the year?",
  "How do animals communicate with each other?",
  "What are black holes and how do they form?",
  "How do plants make their own food?",
];

// BANNED_TOPICS list to prevent inappropriate suggestions
const BANNED_TOPICS = [
  'chicken',
  'butter',
  'food',
  'recipe',
  'test',
  'temporary',
  'standalone',
  'curio'
];

const IntelligentSuggestions: React.FC<IntelligentSuggestionsProps> = ({
  childId,
  childProfile,
  onSuggestionClick,
  pastCurios = []
}) => {
  const { getPersonalizedSuggestions } = useChildLearningHistory(childId);
  const { generateQuickAnswer } = useGroqGeneration();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  
  // Use a ref to track if we need to fetch new suggestions
  const shouldFetchRef = useRef<boolean>(true);
  
  // Move the categorization logic outside of the useEffect
  const categorize = useCallback((suggestion: string): string => {
    const lowercased = suggestion.toLowerCase();
    if (lowercased.includes('space') || lowercased.includes('star') || lowercased.includes('planet') || lowercased.includes('universe')) {
      return 'space';
    } else if (lowercased.includes('animal') || lowercased.includes('dinosaur') || lowercased.includes('creature')) {
      return 'animals';
    } else if (lowercased.includes('history') || lowercased.includes('ancient') || lowercased.includes('past')) {
      return 'history';
    } else if (lowercased.includes('science') || lowercased.includes('experiment') || lowercased.includes('chemical')) {
      return 'science';
    } else if (lowercased.includes('nature') || lowercased.includes('plant') || lowercased.includes('environment')) {
      return 'nature';
    } else {
      return 'general';
    }
  }, []);

  // Function to validate a suggestion's quality
  const isValidSuggestion = useCallback((suggestion: string): boolean => {
    if (!suggestion) return false;
    
    const lowercased = suggestion.toLowerCase();
    
    // Check against banned topics
    for (const banned of BANNED_TOPICS) {
      if (lowercased.includes(banned)) {
        return false;
      }
    }
    
    // Ensure it's likely a question or topic
    if (suggestion.length < 10) return false;
    
    // Check if it has educational value
    const educationalTerms = [
      'how', 'why', 'what', 'when', 'where', 'who', 'which',
      'learn', 'discover', 'explore', 'understand', 'science', 
      'history', 'animal', 'space', 'earth', 'work', 'function'
    ];
    
    const hasEducationalTerm = educationalTerms.some(term => 
      lowercased.includes(term)
    );
    
    return hasEducationalTerm;
  }, []);
  
  // Get unique suggestions based on learning history, interests, and Groq generation
  useEffect(() => {
    // Skip if we shouldn't fetch new suggestions yet
    if (!shouldFetchRef.current) return;
    
    const fetchSuggestions = async () => {
      // Once we start fetching, set the ref to false to prevent additional fetches
      shouldFetchRef.current = false;
      setIsLoading(true);
      
      try {
        // Get personalized suggestions from learning history
        const historyBasedSuggestions = getPersonalizedSuggestions()
          .filter(isValidSuggestion); 
        
        // Filter out duplicate suggestions and past queries
        const pastQueries = new Set(pastCurios.map(c => c.query?.toLowerCase()));
        const uniqueSuggestions = historyBasedSuggestions.filter(
          suggestion => !pastQueries.has(suggestion.toLowerCase())
        );
        
        // Generate AI-enhanced suggestions using Groq if we have child age
        let aiSuggestions: string[] = [];
        const childAge = childProfile?.age || 10;
        
        try {
          // Only generate if we need more suggestions
          if (uniqueSuggestions.length < 6) {
            // Create a prompt based on child's age and interests
            const interests = childProfile?.interests?.join(', ') || 'science, space, animals';
            const prompt = `Create ${6 - uniqueSuggestions.length} engaging, educational questions that would fascinate a ${childAge}-year-old child interested in ${interests}. Each question should spark curiosity and be suitable for their age level. Format as a numbered list without descriptions. Make questions specific and diverse - no generic questions.`;
            
            const result = await generateQuickAnswer(prompt, childAge);
            
            // Parse the result to extract questions
            aiSuggestions = result
              .split(/\d+\.\s+/)
              .filter(Boolean)
              .map(q => q.trim())
              .filter(q => q.length > 10 && q.includes('?'))
              .filter(isValidSuggestion);
          }
        } catch (error) {
          console.error('Error generating AI suggestions:', error);
          // Use fallback questions if AI generation fails
          aiSuggestions = FALLBACK_QUESTIONS.filter(q => 
            !pastQueries.has(q.toLowerCase())
          ).slice(0, 6 - uniqueSuggestions.length);
        }
        
        // Combine and deduplicate all suggestions
        const allSuggestions = [...uniqueSuggestions, ...aiSuggestions];
        
        // Remove duplicates using Set, ensuring suggestions are unique
        const lowerCaseSeen = new Set<string>();
        const finalSuggestions = allSuggestions
          .filter(suggestion => {
            const lowerCase = suggestion.toLowerCase();
            if (lowerCaseSeen.has(lowerCase)) return false;
            lowerCaseSeen.add(lowerCase);
            return !pastQueries.has(lowerCase);
          })
          .slice(0, 6);
        
        // If we still don't have enough suggestions, add fallback questions
        if (finalSuggestions.length < 4) {
          const additionalNeeded = 6 - finalSuggestions.length;
          const fallbacksToAdd = FALLBACK_QUESTIONS
            .filter(q => !lowerCaseSeen.has(q.toLowerCase()) && !pastQueries.has(q.toLowerCase()))
            .slice(0, additionalNeeded);
          
          finalSuggestions.push(...fallbacksToAdd);
        }
        
        // Categorize each suggestion
        const categoryMap: Record<string, string> = {};
        finalSuggestions.forEach(suggestion => {
          categoryMap[suggestion] = categorize(suggestion);
        });
        
        // Set state only once at the end
        setCategories(categoryMap);
        setSuggestions(finalSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        // Use fallback questions if everything else fails
        setSuggestions(FALLBACK_QUESTIONS.slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [
    childId, 
    childProfile, 
    getPersonalizedSuggestions, 
    pastCurios, 
    generateQuickAnswer, 
    categorize, 
    fetchTrigger, 
    isValidSuggestion
  ]);

  // Reset the fetch trigger when certain dependencies change
  useEffect(() => {
    shouldFetchRef.current = true;
  }, [childId, pastCurios.length, fetchTrigger]);

  // Function to manually refresh suggestions
  const refreshSuggestions = () => {
    shouldFetchRef.current = true;
    setFetchTrigger(prev => prev + 1);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-light-purple/20 border border-wonderwhiz-bright-pink/20">
            <Compass className="h-5 w-5 text-wonderwhiz-bright-pink" />
          </div>
          <h3 className="text-lg font-semibold text-white font-nunito">Wonder Journeys</h3>
        </div>
        
        <Badge 
          className="bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink border-wonderwhiz-bright-pink/20 hover:bg-wonderwhiz-bright-pink/30 cursor-pointer"
          onClick={refreshSuggestions}
        >
          {isLoading ? 'Generating wonders...' : `${suggestions.length} new wonders`}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading ? (
          // Loading placeholders
          Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={`loading-${index}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Card className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/20 border border-white/10 h-24 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-wonderwhiz-vibrant-yellow animate-pulse" />
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          suggestions.map((suggestion, index) => (
            <motion.div
              key={`suggestion-${index}-${suggestion.substring(0, 10)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 } 
              }}
            >
              <Card
                className={cn(
                  "bg-gradient-to-br border backdrop-blur-sm shadow-lg",
                  "hover:shadow-xl transition-all cursor-pointer group overflow-hidden",
                  cardVariants[index % cardVariants.length]
                )}
                onClick={() => onSuggestionClick(suggestion)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                      {categoryIcons[categories[suggestion] as keyof typeof categoryIcons] || 
                       categoryIcons.general}
                    </div>
                    <div className="flex-1">
                      <p className="text-white group-hover:text-white font-medium line-clamp-2">{suggestion}</p>
                      <div className="flex items-center mt-2 text-xs text-white/70">
                        <Sparkles className="h-3 w-3 mr-1 text-wonderwhiz-vibrant-yellow" />
                        <span>New wonder awaits</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default IntelligentSuggestions;
