
import React from 'react';
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

  return (
    <div className="my-4 sm:my-6 relative">
      <MagicalBorder active={true} type="rainbow" className="rounded-2xl overflow-hidden shadow-lg">
        <form onSubmit={e => {
          e.preventDefault();
          if (query.trim()) {
            handleSubmitQuery();
          }
        }} className="relative">
          <Input 
            placeholder={isMobile ? "Ask me anything!" : "What do you want to explore today? Ask me anything!"} 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            disabled={false} 
            className="py-6 bg-white/10 border-white/20 text-white text-base sm:text-lg placeholder:text-white/60 placeholder:text-center focus:ring-2 focus:ring-wonderwhiz-gold/50 focus:border-wonderwhiz-gold px-[40px] my-0 sm:py-[40px]" 
          />
          
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 bg-wonderwhiz-gold text-wonderwhiz-dark hover:bg-wonderwhiz-gold/80 rounded-full shadow-glow-gold" 
            disabled={!query.trim() || isGenerating}
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <motion.div 
              animate={{ rotate: [0, 15, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-wonderwhiz-gold" />
            </motion.div>
          </div>
        </form>
      </MagicalBorder>
    </div>
  );
};

export default SearchBar;
