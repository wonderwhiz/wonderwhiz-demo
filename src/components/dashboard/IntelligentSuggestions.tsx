
import React from 'react';
import { motion } from 'framer-motion';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { Compass, Sparkles, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface IntelligentSuggestionsProps {
  childId: string;
  childProfile: any;
  onSuggestionClick: (suggestion: string) => void;
  pastCurios?: any[];
}

const IntelligentSuggestions: React.FC<IntelligentSuggestionsProps> = ({
  childId,
  childProfile,
  onSuggestionClick,
  pastCurios = []
}) => {
  const { getPersonalizedSuggestions } = useChildLearningHistory(childId);
  
  // Get unique suggestions based on learning history and interests
  const suggestions = React.useMemo(() => {
    const personalizedSuggestions = getPersonalizedSuggestions();
    const pastQueries = new Set(pastCurios.map(c => c.query));
    
    // Filter out duplicate suggestions and past queries
    return personalizedSuggestions.filter(suggestion => !pastQueries.has(suggestion));
  }, [getPersonalizedSuggestions, pastCurios]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-wonderwhiz-bright-pink/20">
          <Compass className="h-5 w-5 text-wonderwhiz-bright-pink" />
        </div>
        <h3 className="text-lg font-semibold text-white">Wonder Journeys</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.slice(0, 4).map((suggestion, index) => (
          <motion.div
            key={suggestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/20",
                "border border-white/10 hover:border-white/20 transition-all cursor-pointer",
                "group overflow-hidden"
              )}
              onClick={() => onSuggestionClick(suggestion)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Lightbulb className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white group-hover:text-white/90 font-medium">{suggestion}</p>
                    <div className="flex items-center mt-2 text-xs text-white/60">
                      <Sparkles className="h-3 w-3 mr-1" />
                      <span>New wonder awaits</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IntelligentSuggestions;
