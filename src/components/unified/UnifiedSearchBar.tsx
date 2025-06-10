
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, BookOpen, Mic, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UnifiedSearchBarProps {
  onSearch: (query: string, mode?: 'explore' | 'encyclopedia') => void;
  isLoading?: boolean;
  childAge: number;
  placeholder?: string;
}

const UnifiedSearchBar: React.FC<UnifiedSearchBarProps> = ({
  onSearch,
  isLoading = false,
  childAge,
  placeholder = "What do you want to learn about?"
}) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'explore' | 'encyclopedia'>('explore');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), mode);
      setQuery('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6"
      >
        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant={mode === 'explore' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('explore')}
            className={mode === 'explore' 
              ? "bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90" 
              : "text-white/70 hover:text-white hover:bg-white/10"
            }
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Quick Explore
          </Button>
          <Button
            variant={mode === 'encyclopedia' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('encyclopedia')}
            className={mode === 'encyclopedia' 
              ? "bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90" 
              : "text-white/70 hover:text-white hover:bg-white/10"
            }
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Deep Dive
          </Button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="pl-14 pr-32 py-6 text-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl focus:border-wonderwhiz-bright-pink"
              disabled={isLoading}
            />
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <Camera className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 text-white rounded-xl px-6 h-10"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    {mode === 'explore' ? <Sparkles className="h-4 w-4 mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                    {mode === 'explore' ? 'Explore!' : 'Learn!'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Mode Description */}
        <div className="mt-3 text-center">
          <p className="text-white/60 text-sm">
            {mode === 'explore' 
              ? "Quick exploration with interactive content blocks"
              : "Deep encyclopedia with structured learning sections"
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UnifiedSearchBar;
