
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopicSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  childAge: number;
}

const TopicSearch: React.FC<TopicSearchProps> = ({ onSearch, isLoading, childAge }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const suggestions = [
    'Dinosaurs', 'Space exploration', 'Ocean animals', 'How computers work',
    'Ancient Egypt', 'Volcanoes', 'Butterflies', 'Solar system'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What would you like to learn about today?"
            className="pl-12 pr-24 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 text-white rounded-xl"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-white/70 text-sm mb-3">Quick suggestions:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => onSearch(suggestion)}
              disabled={isLoading}
              className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicSearch;
