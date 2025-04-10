
import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CurioSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  placeholder?: string;
  variant?: 'default' | 'large' | 'minimal';
}

const CurioSearchBar: React.FC<CurioSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  placeholder = "Ask a question or search for a topic...",
  variant = 'default'
}) => {
  // Define styles based on variant
  const getStyles = () => {
    switch(variant) {
      case 'large':
        return {
          container: "mb-6",
          input: "py-6 text-lg",
          button: "text-base px-6",
          icon: "h-5 w-5"
        };
      case 'minimal':
        return {
          container: "mb-3",
          input: "py-2 text-sm",
          button: "text-xs",
          icon: "h-3.5 w-3.5" 
        };
      default:
        return {
          container: "mb-4",
          input: "py-3",
          button: "text-sm",
          icon: "h-4 w-4"
        };
    }
  };
  
  const styles = getStyles();

  return (
    <motion.form
      onSubmit={handleSearch}
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.icon} text-white/40`} />
        <Input
          type="text"
          placeholder={placeholder}
          className={`pl-9 pr-12 ${styles.input} rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40 font-inter transition-all duration-300 focus:bg-white/15`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            type="button" 
            className="absolute right-16 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
            onClick={() => setSearchQuery('')}
          >
            <X className={styles.icon} />
          </button>
        )}
        <Button 
          type="submit" 
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-wonderwhiz-deep-purple"
          size="sm"
        >
          Search
        </Button>
      </div>
    </motion.form>
  );
};

export default CurioSearchBar;
