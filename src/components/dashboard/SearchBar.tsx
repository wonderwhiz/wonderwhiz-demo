
import React, { KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Lightbulb } from 'lucide-react';
import MagicalBorder from '@/components/MagicalBorder';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, handleSubmitQuery, isGenerating }) => {
  const isMobile = useIsMobile();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      handleSubmitQuery();
    }
  };

  return (
    <div className="my-2 sm:my-4 md:my-6 relative">
      <MagicalBorder active={true} type="rainbow" className="rounded-2xl overflow-hidden shadow-lg">
        <div className="relative">
          <Input 
            placeholder={isMobile ? "Ask me anything!" : "What do you want to explore today? Ask me anything!"} 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            onKeyDown={handleKeyDown}
            disabled={isGenerating} 
            className="py-3 sm:py-4 md:py-6 bg-white/10 border-white/20 text-white text-base sm:text-lg placeholder:text-white/60 placeholder:text-center focus:ring-2 focus:ring-wonderwhiz-gold/50 focus:border-wonderwhiz-gold px-[40px] my-0" 
          />
          
          <Button 
            type="button" 
            size="icon" 
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 bg-wonderwhiz-gold text-wonderwhiz-dark hover:bg-wonderwhiz-gold/80 rounded-full shadow-glow-gold" 
            disabled={!query.trim() || isGenerating}
            onClick={handleSubmitQuery}
            aria-label="Submit question"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
            <motion.div 
              animate={{ rotate: [0, 15, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-wonderwhiz-gold" />
            </motion.div>
          </div>
        </div>
      </MagicalBorder>
    </div>
  );
};

export default SearchBar;
