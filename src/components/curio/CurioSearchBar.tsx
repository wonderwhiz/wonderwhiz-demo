
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
  variant?: 'default' | 'minimal';
}

const CurioSearchBar: React.FC<CurioSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  placeholder = "What are you curious about?",
  variant = 'default'
}) => {
  // Define styles based on variant
  const getStyles = () => {
    switch(variant) {
      case 'minimal':
        return {
          container: "mb-3",
          input: "py-1.5 text-xs",
          button: "text-xs px-2.5 py-1",
          icon: "h-3.5 w-3.5" 
        };
      default:
        return {
          container: "mb-4",
          input: "py-2",
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
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${styles.icon} text-white/40`} />
        <Input
          type="text"
          placeholder={placeholder}
          className={`pl-8 pr-10 ${styles.input} rounded-full bg-white/10 border-white/10 text-white placeholder:text-white/40 font-inter transition-all duration-300 focus:bg-white/15`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            type="button" 
            className="absolute right-12 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
            onClick={() => setSearchQuery('')}
          >
            <X className={styles.icon} />
          </button>
        )}
        <Button 
          type="submit" 
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-wonderwhiz-bright-pink/90 hover:bg-wonderwhiz-bright-pink text-white h-7 px-3"
          size="sm"
        >
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.form>
  );
};

export default CurioSearchBar;
